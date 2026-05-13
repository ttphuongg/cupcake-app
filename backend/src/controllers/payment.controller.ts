import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/payment.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const paymentController = {
    processPayment: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderId = Number(req.params.orderId);
            const { method } = req.body; 

            if (!orderId || !method) {
                return ApiResponse.error(res, 'Dữ liệu thanh toán không hợp lệ', 400);
            }

            const data = await paymentService.processPayment(orderId, method);
            return ApiResponse.success(res, data.message, { payUrl: data.payUrl });
        } catch (error: unknown) {
            next(error);
        }
    },

    verifyPayment: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const orderId = Number(req.params.orderId);
            const callbackData = req.query;

            if (!orderId) {
                return ApiResponse.error(res, 'ID đơn hàng không hợp lệ', 400);
            }

            const result = await paymentService.verifyPayment(orderId, callbackData);
            
            if (result.success) {
                return ApiResponse.success(res, result.message);
            } else {
                return ApiResponse.error(res, result.message, 400);
            }
        } catch (error: unknown) {
            next(error);
        }
    },

    handleWebhook: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const webhookData = req.body;
            const result = await paymentService.handleWebhook(webhookData);
            
            if (result.status === 'success') {
                return res.status(200).json(result);
            } else {
                return res.status(400).json(result);
            }
        } catch (error: unknown) {
            // Webhook lỗi thì thường trả về 500 để bên thứ 3 gọi lại sau
            return res.status(500).json({ status: 'error', message: 'Internal Server Error' });
        }
    }
};
