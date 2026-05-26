import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const userController = {
    getProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const user = await userService.getProfile(userId);
            return ApiResponse.success(res, 'Lấy thông tin thành công', { user });
        } catch (error: unknown) {
            next(error);
        }
    },

    updateProfile: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const { name, phone, address } = req.body;
            const result = await userService.updateProfile(userId, { name, phone, address });
            return ApiResponse.success(res, result.message, result.user);
        } catch (error: unknown) {
            next(error);
        }
    },

    requestChangePasswordOtp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const result = await userService.requestChangePasswordOtp(userId);
            return ApiResponse.success(res, result.message, { targetIdentifier: result.targetIdentifier });
        } catch (error: unknown) {
            next(error);
        }
    },

    changePassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const { oldPassword, newPassword, otp } = req.body;
            const result = await userService.changePassword(userId, oldPassword, newPassword, otp);
            return ApiResponse.success(res, result.message);
        } catch (error: unknown) {
            next(error);
        }
    },

    requestDeleteAccountOtp: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const { password } = req.body;
            if (!password) {
                return ApiResponse.error(res, 'Vui lòng nhập mật khẩu xác nhận', 400);
            }
            const result = await userService.requestDeleteAccountOtp(userId, password);
            return ApiResponse.success(res, result.message, { targetIdentifier: result.targetIdentifier });
        } catch (error: unknown) {
            next(error);
        }
    },

    deleteAccount: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const { otp } = req.body; 
            if (!otp) {
                return ApiResponse.error(res, 'Vui lòng nhập mã OTP xác nhận', 400);
            }
            const result = await userService.deleteAccount(userId, otp);
            return ApiResponse.success(res, result.message);
        } catch (error: unknown) {
            next(error);
        }
    }
};
