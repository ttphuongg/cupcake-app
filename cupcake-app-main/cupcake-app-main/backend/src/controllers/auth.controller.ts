import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, phone, password, name } = req.body;
            if (!email || !password || !name) {
                return ApiResponse.error(res, 'Email, mật khẩu và họ tên là bắt buộc', 400);
            }
            const result = await authService.register(email, phone ?? null, password, name);
            return ApiResponse.success(res, result.message, { userId: result.userId }, 201);
        } catch (error: unknown) {
            next(error);
        }
    },

    verifyRegister: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, phone, targetIdentifier, otp } = req.body;
            const identifier = targetIdentifier ?? email ?? phone;
            if (!identifier || !otp) {
                return ApiResponse.error(res, 'Thông tin xác thực và mã OTP là bắt buộc', 400);
            }
            const result = await authService.verifyRegister(identifier, otp);
            return ApiResponse.success(res, result.message);
        } catch (error: unknown) {
            next(error);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, phone, password, identifier } = req.body;
            const loginIdentifier = identifier ?? email ?? phone;
            if (!loginIdentifier || !password) {
                return ApiResponse.error(res, 'Vui lòng nhập thông tin đăng nhập và mật khẩu', 400);
            }
            const result = await authService.login(loginIdentifier, password);
            return ApiResponse.success(res, 'Đăng nhập thành công', result);
        } catch (error: unknown) {
            next(error);
        }
    },

    forgotPassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;
            if (!email) {
                return ApiResponse.error(res, 'Email là bắt buộc', 400);
            }
            const result = await authService.forgotPassword(email);
            return ApiResponse.success(res, result.message);
        } catch (error: unknown) {
            next(error);
        }
    },

    verifyResetToken: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.body.token || req.query.token;
            if (!token) {
                return ApiResponse.error(res, 'Mã Token xác nhận là bắt buộc', 400);
            }
            const result = await authService.verifyResetToken(token as string);
            return ApiResponse.success(res, result.message, { email: result.email });
        } catch (error: unknown) {
            next(error);
        }
    },

    resetPassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return ApiResponse.error(res, 'Mã Token và mật khẩu mới là bắt buộc', 400);
            }
            const result = await authService.resetPassword(token, newPassword);
            return ApiResponse.success(res, result.message);
        } catch (error: unknown) {
            next(error);
        }
    },

    logout: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await authService.logout();
            return ApiResponse.success(res, result.message);
        } catch (error: unknown) {
            next(error);
        }
    }
};
