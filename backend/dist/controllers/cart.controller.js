import { cartService } from '../services/cart.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const cartController = {
    getCart: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw new Error('Không xác định được người dùng');
            const data = await cartService.getCart(userId);
            return ApiResponse.success(res, 'Lấy giỏ hàng thành công', data);
        }
        catch (error) {
            next(error);
        }
    },
    addToCart: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw new Error('Không xác định được người dùng');
            const { product_id, quantity, custom_data } = req.body;
            if (!product_id || !quantity) {
                return ApiResponse.error(res, 'Dữ liệu không hợp lệ (cần product_id và quantity)', 400);
            }
            const result = await cartService.addToCart(userId, { product_id, quantity, custom_data });
            return ApiResponse.success(res, result.message, { cartItemId: result.cartItemId });
        }
        catch (error) {
            next(error);
        }
    },
    addCustomToCart: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw new Error('Không xác định được người dùng');
            const { quantity, custom_data } = req.body;
            if (!quantity || !custom_data) {
                return ApiResponse.error(res, 'Dữ liệu không hợp lệ (cần quantity và custom_data)', 400);
            }
            const result = await cartService.addCustomToCart(userId, { quantity, custom_data });
            return ApiResponse.success(res, result.message, { cartItemId: result.cartItemId });
        }
        catch (error) {
            next(error);
        }
    },
    updateQuantity: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw new Error('Không xác định được người dùng');
            const cartItemId = Number(req.params.id);
            const { quantity } = req.body;
            if (!cartItemId || quantity === undefined) {
                return ApiResponse.error(res, 'Dữ liệu không hợp lệ', 400);
            }
            const result = await cartService.updateQuantity(userId, cartItemId, quantity);
            return ApiResponse.success(res, result.message);
        }
        catch (error) {
            next(error);
        }
    },
    removeFromCart: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw new Error('Không xác định được người dùng');
            const cartItemId = Number(req.params.id);
            if (!cartItemId) {
                return ApiResponse.error(res, 'ID không hợp lệ', 400);
            }
            const result = await cartService.removeFromCart(userId, cartItemId);
            return ApiResponse.success(res, result.message);
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=cart.controller.js.map