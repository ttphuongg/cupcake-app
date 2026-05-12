import { Request, Response } from 'express';
import { paymentService } from '../services/payment.service.js';

export const paymentController = {
    processPayment: async (req: Request, res: Response) => {
        try {
            const orderId = Number(req.params.orderId);
            const { method } = req.body; // 'MOMO' | 'BANKING'

            if (!orderId || !method) {
                throw new Error('Dữ liệu thanh toán không hợp lệ');
            }

            const data = await paymentService.processPayment(orderId, method);
            res.status(200).json({ success: true, message: data.message, data: { payUrl: data.payUrl } });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    verifyPayment: async (req: Request, res: Response) => {
        try {
            const orderId = Number(req.params.orderId);
            // Giả sử callback data được gửi qua query từ cổng thanh toán redirect về
            const callbackData = req.query;

            if (!orderId) throw new Error('ID đơn hàng không hợp lệ');

            const result = await paymentService.verifyPayment(orderId, callbackData);
            
            if (result.success) {
                res.status(200).json({ success: true, message: result.message });
            } else {
                res.status(400).json({ success: false, message: result.message });
            }
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    handleWebhook: async (req: Request, res: Response) => {
        try {
            const webhookData = req.body;
            
            // Webhook do server của bên thứ 3 tự gọi, nên chỉ cần trả về JSON status
            const result = await paymentService.handleWebhook(webhookData);
            
            if (result.status === 'success') {
                res.status(200).json(result);
            } else {
                res.status(400).json(result);
            }
        } catch (error: any) {
            // Webhook lỗi thì thường trả về 500 để bên thứ 3 gọi lại sau
            res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }
};
