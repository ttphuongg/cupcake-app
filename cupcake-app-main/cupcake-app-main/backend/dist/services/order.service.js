import pool from '../config/db.js';
import { orderModel, orderItemModel, productModel } from '../models/index.js';
import { cartService } from './cart.service.js';
export const orderService = {
    getOrderHistory: async (userId, statusFilter) => {
        let orders = await orderModel.findByUserId(userId);
        if (statusFilter && statusFilter !== 'ALL') {
            orders = orders.filter(o => o.status === statusFilter);
        }
        // Fetch items for each order
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const items = await orderItemModel.findByOrderId(order.id);
            return { ...order, items };
        }));
        return ordersWithItems;
    },
    getOrderDetails: async (userId, orderId) => {
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
    cancelOrder: async (userId, orderId, reason) => {
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
                        await connection.execute('UPDATE Products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
                    }
                }
            }
            // Cập nhật trạng thái và lưu lý do
            const cancelNote = order.note ? `${order.note} | Lý do hủy: ${reason}` : `Lý do hủy: ${reason}`;
            await connection.execute('UPDATE Orders SET status = ?, note = ? WHERE id = ?', ['CANCELLED', cancelNote, orderId]);
            await connection.commit();
            return { message: 'Đã hủy đơn hàng thành công' };
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    },
    reorder: async (userId, orderId) => {
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
    checkoutOrder: async (userId, addressInfo) => {
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
                let finalItemPrice = 0;
                let productName = 'Bánh tự thiết kế';
                let productId = null;
                if (item.product_id) {
                    const product = await productModel.findById(item.product_id);
                    if (!product || product.is_active === 0) {
                        throw new Error(`Sản phẩm ${product?.name || item.product_id} đã ngừng kinh doanh`);
                    }
                    productId = product.id;
                    productName = product.name;
                    if (product.is_custom) {
                        // Tính toán lại giá dựa trên nguyên liệu (Snapshot)
                        let customPrice = 0;
                        if (item.custom_data && item.custom_data.ingredients) {
                            for (const ingId of item.custom_data.ingredients) {
                                const [ingRows] = await connection.execute('SELECT price, is_active, name FROM Ingredients WHERE id = ?', [ingId]);
                                const ing = ingRows[0];
                                if (!ing || ing.is_active === 0) {
                                    throw new Error(`Nguyên liệu ${ing?.name || ingId} đang tạm hết hàng, không thể đặt`);
                                }
                                customPrice += Number(ing.price);
                            }
                        }
                        finalItemPrice = customPrice || product.price;
                    }
                    else {
                        // Sản phẩm có sẵn: Trừ tồn kho
                        if ((product.stock || 0) < item.quantity) {
                            throw new Error(`Sản phẩm ${product.name} không đủ số lượng tồn kho (Còn lại: ${product.stock})`);
                        }
                        finalItemPrice = Number(product.price);
                        const [updateStockResult] = await connection.execute('UPDATE Products SET stock = stock - ? WHERE id = ? AND stock >= ?', [item.quantity, product.id, item.quantity]);
                        if (updateStockResult.affectedRows === 0) {
                            throw new Error(`Sản phẩm ${product.name} vừa bị người khác mua hết`);
                        }
                    }
                }
                else {
                    // TRƯỜNG HỢP: Bánh custom hoàn toàn (product_id = null)
                    // Lấy giá và tên từ custom_data (giá này nên được tính toán lại từ nguyên liệu để an toàn)
                    let customPrice = 0;
                    if (item.custom_data && item.custom_data.ingredients) {
                        for (const ingId of item.custom_data.ingredients) {
                            const [ingRows] = await connection.execute('SELECT price, is_active, name FROM Ingredients WHERE id = ?', [ingId]);
                            const ing = ingRows[0];
                            if (!ing || ing.is_active === 0) {
                                throw new Error(`Nguyên liệu ${ing?.name || ingId} đang tạm hết hàng, không thể đặt`);
                            }
                            customPrice += Number(ing.price);
                        }
                    }
                    finalItemPrice = customPrice || (item.custom_data?.totalPrice ? Number(item.custom_data.totalPrice) : 0);
                    productName = item.custom_data?.cakeName || 'Bánh tự thiết kế';
                }
                total_price += finalItemPrice * item.quantity;
                orderItemsData.push([
                    null, // order_id gán sau
                    productId,
                    productName,
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
            const [orderResult] = await connection.execute(`INSERT INTO Orders (user_id, subtotal, discount, total_price, status, payment_method, payment_status, address, phone, note) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userId, subtotal, discount, finalTotal, 'PENDING', addressInfo.paymentMethod, 'UNPAID', addressInfo.address, addressInfo.phone, addressInfo.note ?? null]);
            const orderId = orderResult.insertId;
            // 2. Chèn chi tiết (Bảng OrderItems)
            const values = orderItemsData.map(item => {
                item[0] = orderId;
                return item;
            });
            await connection.query(`INSERT INTO OrderItems (order_id, product_id, product_name, quantity, price, custom_data) VALUES ?`, [values]);
            // 3. Xóa dữ liệu cũ (Dọn dẹp Giỏ hàng)
            await connection.execute('DELETE FROM CartItems WHERE cart_id = ?', [cartData.cart_id]);
            // THÀNH CÔNG: Chốt giao dịch
            await connection.commit();
            return { orderId, total_price: finalTotal, message: 'Đặt hàng thành công' };
        }
        catch (error) {
            // LỖI: Hoàn tác toàn bộ việc Trừ tồn kho và Lưu đơn hàng
            await connection.rollback();
            throw error;
        }
        finally {
            // Trả lại kết nối vào Pool
            connection.release();
        }
    }
};
//# sourceMappingURL=order.service.js.map