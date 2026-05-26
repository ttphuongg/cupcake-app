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

            const { name, email, phone, address, avatar_url } = req.body;
            const result = await userService.updateProfile(userId, { name, email, phone, address, avatar_url });
            return ApiResponse.success(res, result.message, result.user);
        } catch (error: unknown) {
            next(error);
        }
    },

    requestChangePasswordLink: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const result = await userService.requestChangePasswordLink(userId);
            return ApiResponse.success(res, result.message, { targetIdentifier: result.targetIdentifier });
        } catch (error: unknown) {
            next(error);
        }
    },

    confirmChangePassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return ApiResponse.error(res, 'Vui lòng cung cấp token và mật khẩu mới', 400);
            }
            const result = await userService.confirmChangePassword(token, newPassword);
            return ApiResponse.success(res, result.message);
        } catch (error: unknown) {
            next(error);
        }
    },

    requestDeleteAccountLink: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new Error('Không xác định được người dùng');

            const { password } = req.body;
            if (!password) {
                return ApiResponse.error(res, 'Vui lòng nhập mật khẩu xác nhận', 400);
            }
            const result = await userService.requestDeleteAccountLink(userId, password);
            return ApiResponse.success(res, result.message, { targetIdentifier: result.targetIdentifier });
        } catch (error: unknown) {
            next(error);
        }
    },

    confirmDeleteAccount: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.body; 
            if (!token) {
                return ApiResponse.error(res, 'Vui lòng cung cấp token xác nhận', 400);
            }
            const result = await userService.confirmDeleteAccount(token);
            return ApiResponse.success(res, result.message);
        } catch (error: unknown) {
            next(error);
        }
    }
};
