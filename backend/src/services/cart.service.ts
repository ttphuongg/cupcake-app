import { cartModel, cartItemModel, productModel, CartItem } from '../models/index.js';

// Hàm so sánh 2 chuỗi cấu hình JSON xem có giống nhau hoàn toàn hay không
const compareDesign = (designA: any, designB: any): boolean => {
    if (!designA && !designB) return true;
    if (!designA || !designB) return false;
    
    // Convert về chuỗi JSON để so sánh nhanh (cần sort key nếu key có thể lộn xộn, 
    // tuy nhiên JSON.stringify thông thường đủ dùng nếu data từ FE gửi lên theo format cố định)
    return JSON.stringify(designA) === JSON.stringify(designB);
};

export const cartService = {
    getCart: async (userId: number) => {
        let cart = await cartModel.findByUserId(userId);
        if (!cart) {
            const newCartId = await cartModel.create(userId);
            cart = { id: newCartId, user_id: userId };
        }

        const items = await cartItemModel.findByCartId(cart.id!);
        
        let total_price = 0;
        const detailedItems = [];

        for (const item of items) {
            const product = await productModel.findById(item.product_id);
            if (!product) continue;

            // Xử lý giá: Nếu là bánh có sẵn thì lấy giá sản phẩm, nếu là bánh tự thiết kế thì có thể lưu tổng giá vào custom_data 
            // hoặc tính toán lại ở đây. Giả sử custom_data.totalPrice đã được CakeDesign service tính và lưu.
            let itemPrice = product.price;
            
            let customDataObj = null;
            if (item.custom_data) {
                customDataObj = typeof item.custom_data === 'string' ? JSON.parse(item.custom_data) : item.custom_data;
                if (customDataObj && customDataObj.totalPrice) {
                    itemPrice = customDataObj.totalPrice;
                }
            }

            const itemTotalPrice = itemPrice * item.quantity;
            total_price += itemTotalPrice;

            detailedItems.push({
                ...item,
                custom_data: customDataObj,
                product: {
                    id: product.id,
                    name: product.name,
                    price: itemPrice,
                    image: product.image
                },
                itemTotalPrice
            });
        }

        return {
            cart_id: cart.id,
            user_id: userId,
            items: detailedItems,
            total_price
        };
    },

    addToCart: async (userId: number, itemData: { product_id: number; quantity: number; custom_data?: any }) => {
        // Kiểm tra tồn kho
        const product = await productModel.findById(itemData.product_id);
        if (!product) {
            throw new Error('Sản phẩm không tồn tại');
        }

        // Nếu là bánh có sẵn (không phải custom) thì kiểm tra tồn kho
        if (!product.is_custom) {
            if (!product.stock || product.stock < itemData.quantity) {
                throw new Error(`Sản phẩm đã vượt quá số lượng tồn kho (Còn lại: ${product.stock || 0})`);
            }
        }

        let cart = await cartModel.findByUserId(userId);
        if (!cart) {
            const newCartId = await cartModel.create(userId);
            cart = { id: newCartId, user_id: userId };
        }

        const existingItems = await cartItemModel.findByCartId(cart.id!);

        // Logic gộp hàng (Merge)
        // Tìm xem có sản phẩm nào giống hệt trong giỏ hàng không
        const duplicateItem = existingItems.find(i => {
            const isSameProduct = i.product_id === itemData.product_id;
            
            // Parse custom_data từ DB (thường lưu dạng string)
            const dbCustomData = typeof i.custom_data === 'string' ? JSON.parse(i.custom_data) : i.custom_data;
            const newCustomData = typeof itemData.custom_data === 'string' ? JSON.parse(itemData.custom_data) : itemData.custom_data;

            const isSameDesign = compareDesign(dbCustomData, newCustomData);
            
            return isSameProduct && isSameDesign;
        });

        if (duplicateItem && duplicateItem.id) {
            // Cộng dồn số lượng
            const newQuantity = duplicateItem.quantity + itemData.quantity;
            
            // Check tồn kho lại nếu là bánh có sẵn
            if (!product.is_custom && product.stock && product.stock < newQuantity) {
                throw new Error(`Tổng số lượng vượt quá số lượng tồn kho (Còn lại: ${product.stock})`);
            }

            await cartItemModel.updateQuantity(duplicateItem.id, newQuantity);
            return { message: 'Đã cập nhật số lượng sản phẩm trong giỏ hàng', cartItemId: duplicateItem.id };
        } else {
            // Tạo mới
            const newItemId = await cartItemModel.addItem({
                cart_id: cart.id!,
                product_id: itemData.product_id,
                quantity: itemData.quantity,
                custom_data: itemData.custom_data
            });
            return { message: 'Đã thêm sản phẩm vào giỏ hàng', cartItemId: newItemId };
        }
    },

    updateQuantity: async (userId: number, cartItemId: number, quantity: number) => {
        if (quantity <= 0) {
            throw new Error('Số lượng phải lớn hơn 0');
        }

        let cart = await cartModel.findByUserId(userId);
        if (!cart) throw new Error('Giỏ hàng không tồn tại');

        const items = await cartItemModel.findByCartId(cart.id!);
        const itemToUpdate = items.find(i => i.id === cartItemId);

        if (!itemToUpdate) {
            throw new Error('Sản phẩm không có trong giỏ hàng');
        }

        const product = await productModel.findById(itemToUpdate.product_id);
        if (product && !product.is_custom && product.stock !== undefined) {
            if (quantity > product.stock) {
                throw new Error(`Sản phẩm đã vượt quá số lượng tồn kho (Còn lại: ${product.stock})`);
            }
        }

        await cartItemModel.updateQuantity(cartItemId, quantity);
        return { message: 'Cập nhật số lượng thành công' };
    },

    removeFromCart: async (userId: number, cartItemId: number) => {
        let cart = await cartModel.findByUserId(userId);
        if (!cart) throw new Error('Giỏ hàng không tồn tại');

        // Phân quyền: chỉ xóa nếu item thuộc giỏ hàng của user này
        const items = await cartItemModel.findByCartId(cart.id!);
        const itemExists = items.some(i => i.id === cartItemId);
        
        if (!itemExists) {
            throw new Error('Sản phẩm không thuộc giỏ hàng của bạn');
        }

        await cartItemModel.removeItem(cartItemId);
        return { message: 'Xóa sản phẩm khỏi giỏ hàng thành công' };
    }
};
