import { Request, Response } from 'express';
import { authService } from '../services/auth.service.js';

export const authController = {
    register: async (req: Request, res: Response) => {
        try {
            const { email, phone, password, name } = req.body;
            if (!email || !password || !name) {
                res.status(400).json({ success: false, message: 'Email, mật khẩu và họ tên là bắt buộc' });
                return;
            }
            const result = await authService.register(email, phone ?? null, password, name);
            res.status(201).json({
                success: true,
                message: result.message,
                data: { userId: result.userId, targetIdentifier: result.targetIdentifier }
            });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || 'Đã xảy ra lỗi' });
        }
    },

    verifyRegister: async (req: Request, res: Response) => {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                res.status(400).json({ success: false, message: 'Email và mã OTP là bắt buộc' });
                return;
            }
            const result = await authService.verifyRegister(email, otp);
            res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || 'Đã xảy ra lỗi' });
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            // Hỗ trợ đăng nhập bằng email hoặc số điện thoại
            const { email, phone, password, identifier } = req.body;
            const loginIdentifier = identifier ?? email ?? phone;
            if (!loginIdentifier || !password) {
                res.status(400).json({ success: false, message: 'Vui lòng nhập thông tin đăng nhập và mật khẩu' });
                return;
            }
            const result = await authService.login(loginIdentifier, password);
            res.status(200).json({ success: true, message: 'Đăng nhập thành công', data: result });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || 'Đã xảy ra lỗi' });
        }
    },

    forgotPassword: async (req: Request, res: Response) => {
        try {
            const { email } = req.body;
            const result = await authService.forgotPassword(email);
            res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || 'Đã xảy ra lỗi' });
        }
    },

    resetPassword: async (req: Request, res: Response) => {
        try {
            const { email, otp, newPassword } = req.body;
            const result = await authService.resetPassword(email, otp, newPassword);
            res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message || 'Đã xảy ra lỗi' });
        }
    },

    logout: async (req: Request, res: Response) => {
        try {
            const result = await authService.logout();
            res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Lỗi server' });
        }
    }
};
