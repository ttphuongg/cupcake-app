import { Request, Response } from 'express';
import { userService } from '../services/user.service.js';

export const userController = {
    getProfile: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const user = await userService.getProfile(userId);
            res.status(200).json({ success: true, data: { user } });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    updateProfile: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { name, phone, address } = req.body;
            const result = await userService.updateProfile(userId, { name, phone, address });
            res.status(200).json({ success: true, message: result.message, data: result.user });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    requestChangePasswordOtp: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const result = await userService.requestChangePasswordOtp(userId);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { targetIdentifier: result.targetIdentifier }
            });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    changePassword: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { oldPassword, newPassword, otp } = req.body;
            const result = await userService.changePassword(userId, oldPassword, newPassword, otp);
            res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    requestDeleteAccountOtp: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { password } = req.body;
            if (!password) {
                res.status(400).json({ success: false, message: 'Vui lòng nhập mật khẩu xác nhận' });
                return;
            }
            const result = await userService.requestDeleteAccountOtp(userId, password);
            res.status(200).json({ success: true, message: result.message, data: { targetIdentifier: result.targetIdentifier } });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    deleteAccount: async (req: Request, res: Response) => {
        try {
            const userId = (req as any).user.id;
            const { otp } = req.body; // Password đã xác minh ở bước requestDeleteAccountOtp
            if (!otp) {
                res.status(400).json({ success: false, message: 'Vui lòng nhập mã OTP xác nhận' });
                return;
            }
            const result = await userService.deleteAccount(userId, otp);
            res.status(200).json({ success: true, message: result.message });
        } catch (error: any) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};
