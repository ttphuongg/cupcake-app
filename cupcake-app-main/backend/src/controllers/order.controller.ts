import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service.js';
import { Order } from '../models/index.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const orderController = {
    getOrderHistory: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const { status } = req.query;

            const data = await orderService.getOrderHistory(userId, status as Order['status'] | undefined);
            return ApiResponse.success(res, 'Lấy lịch sử đơn hàng thành công', data);
        } catch (error: unknown) {
            next(error);
        }
    },

    getOrderDetails: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const orderId = Number(req.params.id);
            if (!orderId) {
                return ApiResponse.error(res, 'ID đơn hàng không hợp lệ', 400);
            }

            const data = await orderService.getOrderDetails(userId, orderId);
            return ApiResponse.success(res, 'Lấy chi tiết đơn hàng thành công', data);
        } catch (error: unknown) {
            next(error);
        }
    },

    cancelOrder: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const orderId = Number(req.params.id);
            const { reason = '' } = req.body; 

            if (!orderId) {
                return ApiResponse.error(res, 'ID đơn hàng không hợp lệ', 400);
            }

            const result = await orderService.cancelOrder(userId, orderId, reason);
            return ApiResponse.success(res, result.message);
        } catch (error: unknown) {
            next(error);
        }
    },

    reorder: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const orderId = Number(req.params.id);
            if (!orderId) {
                return ApiResponse.error(res, 'ID đơn hàng không hợp lệ', 400);
            }

            const result = await orderService.reorder(userId, orderId);
            return ApiResponse.success(res, result.message);
        } catch (error: unknown) {
            next(error);
        }
    },

    checkoutOrder: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const { address, phone, paymentMethod, note } = req.body;

            if (!address || !phone || !paymentMethod) {
                return ApiResponse.error(res, 'Vui lòng nhập đầy đủ địa chỉ, số điện thoại và phương thức thanh toán', 400);
            }

            const result = await orderService.checkoutOrder(userId, { address, phone, paymentMethod, note });
            return ApiResponse.success(res, result.message, { orderId: result.orderId, total_price: result.total_price });
        } catch (error: unknown) {
            next(error);
        }
    }
};
