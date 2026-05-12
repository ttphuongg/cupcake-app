import pool from '../config/db.js';
import { orderModel, orderItemModel, Order, productModel } from '../models/index.js';
import { cartService } from './cart.service.js';

export const orderService = {
    getOrderHistory: async (userId: number, statusFilter?: Order['status']) => {
        let orders = await orderModel.findByUserId(userId);
        
        // Hỗ trợ lọc theo tab trạng thái
        if (statusFilter && (statusFilter as any) !== 'ALL') {
            orders = orders.filter(o => o.status === statusFilter);
        }
        
        return orders;
    },

    getOrderDetails: async (userId: number, orderId: number) => {
        const order = await orderModel.findById(orderId);
        if (!order || order.user_id !== userId) {
            throw new Error('Đơn hàng không tồn tại hoặc bạn không có quyền truy cập');
        }

        const items = await orderItemModel.findByOrderId(orderId);
        
        return {
            ...order,
            items
        };
    },

    cancelOrder: async (userId: number, orderId: number, reason: string) => {
        const order = await orderModel.findById(orderId);
        if (!order || order.user_id !== userId) {
            throw new Error('Đơn hàng không tồn tại');
        }

        if (order.status !== 'PENDING' && order.status !== 'CONFIRMED') {
            throw new Error('Chỉ có thể hủy đơn hàng khi đang ở trạng thái chờ xử lý');
        }

        // Bắt đầu Transaction để đảm bảo tính vẹn toàn khi hủy
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Hoàn lại tồn kho cho các sản phẩm có sẵn
            const items = await orderItemModel.findByOrderId(orderId);
            for (const item of items) {
                if (item.product_id) {
                    const product = await productModel.findById(item.product_id);
                    if (product && !product.is_custom) {
                        await connection.execute(
                            'UPDATE Products SET stock = stock + ? WHERE id = ?',
                            [item.quantity, item.product_id]
                        );
                    }
                }
            }

            // Cập nhật trạng thái và lưu lý do
            const cancelNote = order.note ? `${order.note} | Lý do hủy: ${reason}` : `Lý do hủy: ${reason}`;
            await connection.execute('UPDATE Orders SET status = ?, note = ? WHERE id = ?', ['CANCELLED', cancelNote, orderId]);

            await connection.commit();
            return { message: 'Đã hủy đơn hàng thành công' };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    reorder: async (userId: number, orderId: number) => {
        const order = await orderModel.findById(orderId);
        if (!order || order.user_id !== userId) {
            throw new Error('Đơn hàng không tồn tại');
        }

        const items = await orderItemModel.findByOrderId(orderId);
        const skippedItems = [];
        let addedCount = 0;

        for (const item of items) {
            if (item.product_id) {
                const product = await productModel.findById(item.product_id);
                // Bỏ qua món ngừng bán hoặc hết hàng
                if (!product || product.is_active === 0 || (!product.is_custom && (product.stock || 0) < item.quantity)) {
                    skippedItems.push(item.product_name);
                    continue;
                }
                
                await cartService.addToCart(userId, {
                    product_id: item.product_id,
                    quantity: item.quantity,
                    custom_data: item.custom_data ? (typeof item.custom_data === 'string' ? JSON.parse(item.custom_data) : item.custom_data) : null
                });
                addedCount++;
            }
        }

        let message = `Đã thêm ${addedCount} sản phẩm vào giỏ hàng.`;
        if (skippedItems.length > 0) {
            message += ` Đã bỏ qua: ${skippedItems.join(', ')} do hiện tại đã hết hàng hoặc ngừng kinh doanh.`;
        }

        return { message };
    },

    checkoutOrder: async (userId: number, addressInfo: { address: string, phone: string, paymentMethod: 'COD' | 'BANKING' | 'MOMO', note?: string }) => {
        const cartData = await cartService.getCart(userId);
        
        if (!cartData || cartData.items.length === 0) {
            throw new Error('Giỏ hàng trống');
        }

        // DATABASE TRANSACTION CỰC KỲ QUAN TRỌNG TẠI ĐÂY
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            let total_price = 0;
            const orderItemsData = [];

            for (const item of cartData.items) {
                const product = await productModel.findById(item.product_id);
                if (!product || product.is_active === 0) {
                    throw new Error(`Sản phẩm ${product?.name || item.product_id} đã ngừng kinh doanh`);
                }

                let finalItemPrice = 0;

                if (product.is_custom) {
                    // SNAPSHOT GIÁ (Bánh tự thiết kế): Truy vấn lại DB để lấy giá nguyên liệu hiện tại,
                    // Không tin tưởng giá custom_data.totalPrice từ Frontend truyền lên.
                    let customPrice = 0;
                    if (item.custom_data && item.custom_data.ingredients) {
                        for (const ingId of item.custom_data.ingredients) {
                            const [ingRows] = await connection.execute('SELECT price, is_active, name FROM Ingredients WHERE id = ?', [ingId]);
                            const ing = (ingRows as any[])[0];
                            if (!ing || ing.is_active === 0) {
                                throw new Error(`Nguyên liệu ${ing?.name || ingId} đang tạm hết hàng, không thể đặt`);
                            }
                            customPrice += Number(ing.price);
                        }
                    }
                    finalItemPrice = customPrice || product.price;
                    
                    // Cập nhật lại giá snapshot chính xác để lưu vào log lịch sử
                    if (item.custom_data) item.custom_data.totalPrice = finalItemPrice;

                } else {
                    // Sản phẩm có sẵn: Kiểm tra và trừ tồn kho trực tiếp trong Transaction
                    if ((product.stock || 0) < item.quantity) {
                        throw new Error(`Sản phẩm ${product.name} không đủ số lượng tồn kho (Còn lại: ${product.stock})`);
                    }
                    finalItemPrice = Number(product.price);

                    const [updateStockResult] = await connection.execute(
                        'UPDATE Products SET stock = stock - ? WHERE id = ? AND stock >= ?',
                        [item.quantity, product.id!, item.quantity]
                    );

                    // Tránh Race condition: Cùng lúc có người khác mua mất
                    if ((updateStockResult as any).affectedRows === 0) {
                        throw new Error(`Sản phẩm ${product.name} vừa bị người khác mua hết`);
                    }
                }

                total_price += finalItemPrice * item.quantity;
                
                orderItemsData.push([
                    null, // order_id sẽ được gán sau khi tạo Order
                    product.id,
                    product.name,
                    item.quantity,
                    finalItemPrice,
                    item.custom_data ? JSON.stringify(item.custom_data) : null
                ]);
            }

            // Tính toán phụ phí
            const discount = 0;
            const subtotal = total_price;
            const shippingFee = 30000; // Mock: 30k ship
            const finalTotal = subtotal - discount + shippingFee;

            // 1. Tạo đơn hàng (Bảng Orders)
            const [orderResult] = await connection.execute(
                `INSERT INTO Orders (user_id, subtotal, discount, total_price, status, payment_method, payment_status, address, phone, note) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [userId, subtotal, discount, finalTotal, 'PENDING', addressInfo.paymentMethod, 'UNPAID', addressInfo.address, addressInfo.phone, addressInfo.note ?? null]
            );
            const orderId = (orderResult as any).insertId;

            // 2. Chèn chi tiết (Bảng OrderItems)
            const values = orderItemsData.map(item => {
                item[0] = orderId;
                return item;
            });

            await connection.query(
                `INSERT INTO OrderItems (order_id, product_id, product_name, quantity, price, custom_data) VALUES ?`,
                [values]
            );

            // 3. Xóa dữ liệu cũ (Dọn dẹp Giỏ hàng)
            await connection.execute('DELETE FROM CartItems WHERE cart_id = ?', [cartData.cart_id!]);

            // THÀNH CÔNG: Chốt giao dịch
            await connection.commit();
            return { orderId, total_price: finalTotal, message: 'Đặt hàng thành công' };

        } catch (error) {
            // LỖI: Hoàn tác toàn bộ việc Trừ tồn kho và Lưu đơn hàng
            await connection.rollback();
            throw error;
        } finally {
            // Trả lại kết nối vào Pool
            connection.release();
        }
    }
};
