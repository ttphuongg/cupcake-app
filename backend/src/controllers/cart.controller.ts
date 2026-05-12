import { Request, Response } from 'express';
import { cartService } from '../services/cart.service.js';

export const cartController = {
    getCart: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const data = await cartService.getCart(userId);
            res.status(200).json({ success: true, message: 'Lấy giỏ hàng thành công', data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    addToCart: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { product_id, quantity, custom_data } = req.body;

            if (!product_id || !quantity) {
                throw new Error('Dữ liệu không hợp lệ (cần product_id và quantity)');
            }

            const result = await cartService.addToCart(userId, { product_id, quantity, custom_data });
            res.status(200).json({ success: true, message: result.message, data: { cartItemId: result.cartItemId } });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    updateQuantity: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const cartItemId = Number(req.params.id);
            const { quantity } = req.body;

            if (!cartItemId || quantity === undefined) {
                throw new Error('Dữ liệu không hợp lệ');
            }

            const result = await cartService.updateQuantity(userId, cartItemId, quantity);
            res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    removeFromCart: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const cartItemId = Number(req.params.id);

            if (!cartItemId) throw new Error('ID không hợp lệ');

            const result = await cartService.removeFromCart(userId, cartItemId);
            res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};
