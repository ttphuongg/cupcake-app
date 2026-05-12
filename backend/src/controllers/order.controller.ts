import { Request, Response } from 'express';
import { orderService } from '../services/order.service.js';
import { Order } from '../models/index.js';

export const orderController = {
    getOrderHistory: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { status } = req.query;

            const data = await orderService.getOrderHistory(userId, status as Order['status'] | undefined);
            res.status(200).json({ success: true, message: 'Lấy lịch sử đơn hàng thành công', data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    getOrderDetails: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const orderId = Number(req.params.id);

            if (!orderId) throw new Error('ID đơn hàng không hợp lệ');

            const data = await orderService.getOrderDetails(userId, orderId);
            res.status(200).json({ success: true, message: 'Lấy chi tiết đơn hàng thành công', data });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    cancelOrder: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const orderId = Number(req.params.id);
            const { reason = '' } = req.body; // reason là tùy chọn

            if (!orderId) throw new Error('ID đơn hàng không hợp lệ');

            const result = await orderService.cancelOrder(userId, orderId, reason);
            res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    reorder: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const orderId = Number(req.params.id);

            if (!orderId) throw new Error('ID đơn hàng không hợp lệ');

            const result = await orderService.reorder(userId, orderId);
            res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    checkoutOrder: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { address, phone, paymentMethod, note } = req.body;

            if (!address || !phone || !paymentMethod) {
                throw new Error('Vui lòng nhập đầy đủ địa chỉ, số điện thoại và phương thức thanh toán');
            }

            const result = await orderService.checkoutOrder(userId, { address, phone, paymentMethod, note });
            res.status(200).json({ success: true, message: result.message, data: { orderId: result.orderId, total_price: result.total_price } });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};
