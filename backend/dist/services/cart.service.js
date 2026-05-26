import { cartModel, cartItemModel, productModel } from '../models/index.js';
import crypto from 'crypto';
// Hàm so sánh 2 chuỗi cấu hình JSON xem có giống nhau hoàn toàn hay không
const compareDesign = (designA, designB) => {
    if (!designA && !designB)
        return true;
    if (!designA || !designB)
        return false;
    return JSON.stringify(designA) === JSON.stringify(designB);
};
export const cartService = {
    getCart: async (userId) => {
        let cart = await cartModel.findByUserId(userId);
        if (!cart) {
            const newCartId = await cartModel.create(userId);
            cart = { id: newCartId, user_id: userId };
        }
        const items = await cartItemModel.findByCartId(cart.id);
        let total_price = 0;
        const detailedItems = [];
        for (const item of items) {
            let itemPrice = 0;
            let productName = 'Bánh tự thiết kế';
            let productImage = null;
            if (item.product_id) {
                const product = await productModel.findById(item.product_id);
                if (product) {
                    itemPrice = product.price;
                    productName = product.name;
                    productImage = product.image;
                }
            }
            let customDataObj = null;
            if (item.custom_data) {
                customDataObj = typeof item.custom_data === 'string' ? JSON.parse(item.custom_data) : item.custom_data;
                // 1. Ưu tiên lấy giá từ thiết kế
                if (customDataObj && customDataObj.totalPrice) {
                    itemPrice = Number(customDataObj.totalPrice);
                }
                // 2. Ưu tiên lấy tên từ thiết kế
                if (customDataObj && customDataObj.cakeName) {
                    productName = customDataObj.cakeName;
                }
                // 3. Ưu tiên lấy ẢNH PREVIEW từ thiết kế (quan trọng)
                if (customDataObj && customDataObj.previewImage) {
                    productImage = customDataObj.previewImage;
                }
            }
            const itemTotalPrice = itemPrice * item.quantity;
            total_price += itemTotalPrice;
            detailedItems.push({
                ...item,
                custom_data: customDataObj,
                product: {
                    id: item.product_id || 0,
                    name: productName,
                    price: itemPrice,
                    image: productImage
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
    addToCart: async (userId, itemData) => {
        let product = null;
        if (itemData.product_id) {
            product = await productModel.findById(itemData.product_id);
            if (!product) {
                throw new Error('Sản phẩm không tồn tại');
            }
            // Nếu là bánh có sẵn (không phải custom) thì kiểm tra tồn kho
            if (!product.is_custom) {
                if (!product.stock || product.stock < itemData.quantity) {
                    throw new Error(`Sản phẩm đã vượt quá số lượng tồn kho (Còn lại: ${product.stock || 0})`);
                }
            }
        }
        let cart = await cartModel.findByUserId(userId);
        if (!cart) {
            const newCartId = await cartModel.create(userId);
            cart = { id: newCartId, user_id: userId };
        }
        const existingItems = await cartItemModel.findByCartId(cart.id);
        // Logic gộp hàng (Merge)
        const duplicateItem = existingItems.find(i => {
            const isSameProduct = i.product_id === itemData.product_id;
            const dbCustomData = typeof i.custom_data === 'string' ? JSON.parse(i.custom_data) : i.custom_data;
            const newCustomData = typeof itemData.custom_data === 'string' ? JSON.parse(itemData.custom_data) : itemData.custom_data;
            return isSameProduct && compareDesign(dbCustomData, newCustomData);
        });
        if (duplicateItem && duplicateItem.id) {
            const newQuantity = duplicateItem.quantity + itemData.quantity;
            // Chỉ check tồn kho nếu là bánh có sẵn
            if (product && !product.is_custom && product.stock && product.stock < newQuantity) {
                throw new Error(`Tổng số lượng vượt quá số lượng tồn kho (Còn lại: ${product.stock})`);
            }
            await cartItemModel.updateQuantity(duplicateItem.id, newQuantity);
            return { message: 'Đã cập nhật số lượng sản phẩm trong giỏ hàng', cartItemId: duplicateItem.id };
        }
        else {
            // Tạo mới
            const newItemId = await cartItemModel.addItem({
                cart_id: cart.id,
                product_id: itemData.product_id,
                quantity: itemData.quantity,
                custom_data: itemData.custom_data
            });
            return { message: 'Đã thêm sản phẩm vào giỏ hàng', cartItemId: newItemId };
        }
    },
    addCustomToCart: async (userId, itemData) => {
        let cart = await cartModel.findByUserId(userId);
        if (!cart) {
            const newCartId = await cartModel.create(userId);
            cart = { id: newCartId, user_id: userId };
        }
        // Phân tích dữ liệu JSON
        const customDataObj = typeof itemData.custom_data === 'string'
            ? JSON.parse(itemData.custom_data)
            : itemData.custom_data;
        // Trích xuất các ID nguyên liệu
        const ingredientIds = [];
        if (customDataObj.size?.id)
            ingredientIds.push(customDataObj.size.id);
        if (customDataObj.base?.id)
            ingredientIds.push(customDataObj.base.id);
        if (customDataObj.filling?.id)
            ingredientIds.push(customDataObj.filling.id);
        if (customDataObj.frosting?.id)
            ingredientIds.push(customDataObj.frosting.id);
        if (customDataObj.sugar?.id)
            ingredientIds.push(customDataObj.sugar.id);
        if (Array.isArray(customDataObj.toppings)) {
            customDataObj.toppings.forEach((t) => {
                if (t.id)
                    ingredientIds.push(t.id);
            });
        }
        // Sắp xếp ID và tạo hash
        ingredientIds.sort((a, b) => a - b);
        const hashStr = ingredientIds.join(',');
        const customDesignHash = crypto.createHash('sha256').update(hashStr).digest('hex');
        // Tìm món bánh thiết kế y hệt trong giỏ
        const existingItem = await cartItemModel.findByHashAndCart(cart.id, customDesignHash);
        if (existingItem && existingItem.id) {
            // Tăng số lượng
            const newQuantity = existingItem.quantity + itemData.quantity;
            await cartItemModel.updateQuantity(existingItem.id, newQuantity);
            return { message: 'Đã cập nhật số lượng bánh tự phối trong giỏ hàng', cartItemId: existingItem.id };
        }
        else {
            // Thêm mới
            const newItemId = await cartItemModel.addItem({
                cart_id: cart.id,
                product_id: null,
                custom_design_hash: customDesignHash,
                quantity: itemData.quantity,
                custom_data: itemData.custom_data
            });
            // Lưu nguyên liệu vào bảng CartItemIngredients
            await cartItemModel.addIngredients(newItemId, ingredientIds);
            return { message: 'Đã thêm bánh tự phối vào giỏ hàng', cartItemId: newItemId };
        }
    },
    updateQuantity: async (userId, cartItemId, quantity) => {
        if (quantity <= 0) {
            throw new Error('Số lượng phải lớn hơn 0');
        }
        let cart = await cartModel.findByUserId(userId);
        if (!cart)
            throw new Error('Giỏ hàng không tồn tại');
        const items = await cartItemModel.findByCartId(cart.id);
        const itemToUpdate = items.find(i => i.id === cartItemId);
        if (!itemToUpdate) {
            throw new Error('Sản phẩm không có trong giỏ hàng');
        }
        if (itemToUpdate.product_id) {
            const product = await productModel.findById(itemToUpdate.product_id);
            if (product && !product.is_custom && product.stock !== undefined) {
                if (quantity > product.stock) {
                    throw new Error(`Sản phẩm đã vượt quá số lượng tồn kho (Còn lại: ${product.stock})`);
                }
            }
        }
        await cartItemModel.updateQuantity(cartItemId, quantity);
        return { message: 'Cập nhật số lượng thành công' };
    },
    removeFromCart: async (userId, cartItemId) => {
        let cart = await cartModel.findByUserId(userId);
        if (!cart)
            throw new Error('Giỏ hàng không tồn tại');
        // Phân quyền: chỉ xóa nếu item thuộc giỏ hàng của user này
        const items = await cartItemModel.findByCartId(cart.id);
        const itemExists = items.some(i => i.id === cartItemId);
        if (!itemExists) {
            throw new Error('Sản phẩm không thuộc giỏ hàng của bạn');
        }
        await cartItemModel.removeItem(cartItemId);
        return { message: 'Xóa sản phẩm khỏi giỏ hàng thành công' };
    }
};
//# sourceMappingURL=cart.service.js.map