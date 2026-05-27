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
    },

    changePasswordRedirect: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.query;
            const expoLink = `exp://192.124.15.101:8081/--/change-password-confirm?token=${token}`;
            const html = `
                <!DOCTYPE html>
                <html lang="vi">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Đang mở ứng dụng...</title>
                        <script>setTimeout(function() { window.location.href = "${expoLink}"; }, 500);</script>
                        <style>
                            body { font-family: sans-serif; text-align: center; padding: 40px 20px; background-color: #f9fafb; }
                            .container { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; margin: 0 auto; }
                            h2 { color: #db2777; margin-bottom: 10px; }
                            p { color: #4b5563; margin-bottom: 20px; line-height: 1.5; }
                            a.btn { display: inline-block; background-color: #db2777; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Đang chuyển hướng...</h2>
                            <p>Điện thoại của bạn đang mở ứng dụng để Đổi Mật Khẩu.</p>
                            <p>Nếu ứng dụng không tự mở sau vài giây, vui lòng bấm nút bên dưới.</p>
                            <a href="${expoLink}" class="btn">Mở Ứng dụng</a>
                        </div>
                    </body>
                </html>
            `;
            res.send(html);
        } catch (error: unknown) {
            next(error);
        }
    },

    deleteAccountRedirect: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.query;
            const expoLink = `exp://192.124.15.101:8081/--/delete-account-confirm?token=${token}`;
            const html = `
                <!DOCTYPE html>
                <html lang="vi">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Đang mở ứng dụng...</title>
                        <script>setTimeout(function() { window.location.href = "${expoLink}"; }, 500);</script>
                        <style>
                            body { font-family: sans-serif; text-align: center; padding: 40px 20px; background-color: #f9fafb; }
                            .container { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; margin: 0 auto; }
                            h2 { color: #ef4444; margin-bottom: 10px; }
                            p { color: #4b5563; margin-bottom: 20px; line-height: 1.5; }
                            a.btn { display: inline-block; background-color: #ef4444; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Đang chuyển hướng...</h2>
                            <p>Điện thoại của bạn đang mở ứng dụng để Xác Nhận Xóa Tài Khoản.</p>
                            <p>Nếu ứng dụng không tự mở sau vài giây, vui lòng bấm nút bên dưới.</p>
                            <a href="${expoLink}" class="btn">Mở Ứng dụng</a>
                        </div>
                    </body>
                </html>
            `;
            res.send(html);
        } catch (error: unknown) {
            next(error);
        }
    }
};
