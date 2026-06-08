import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import validateEmail from 'deep-email-validator';

export const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, phone, password, name } = req.body;
            if (!email || !password || !name) {
                return ApiResponse.error(res, 'Email, mật khẩu và họ tên là bắt buộc', 400);
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return ApiResponse.error(res, 'Email không hợp lệ', 400);
            }

            if (phone) {
                const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b$/;
                if (!phoneRegex.test(phone)) {
                    return ApiResponse.error(res, 'Số điện thoại không hợp lệ (ví dụ: 0912345678)', 400);
                }
            }

            if (password.length < 6) {
                return ApiResponse.error(res, 'Mật khẩu phải có ít nhất 6 ký tự', 400);
            }

            // Kiểm tra email tồn tại thật sự
            const emailValidation = await validateEmail({
                email: email,
                validateRegex: true,
                validateMx: true,
                validateTypo: false, // Bỏ qua bắt lỗi chính tả (hay gây lỗi cho email thật)
                validateDisposable: false, // Bỏ qua check email rác tạm thời
                validateSMTP: false, // Bỏ qua SMTP vì hay bị block ở localhost
            });

            if (!emailValidation.valid) {
                console.warn(`[Cảnh báo Email] ${email} không hợp lệ. Lý do: ${emailValidation.reason}`, emailValidation);
                // Nếu lỗi do MX (DNS) thì có thể do mạng cục bộ bị lỗi, ta vẫn cho phép đăng ký để không block người dùng thật
                if (emailValidation.reason !== 'mx') {
                    return ApiResponse.error(res, `Email không hợp lệ (Lỗi: ${emailValidation.reason})`, 400);
                }
            }
            const result = await authService.register(email, phone ?? null, password, name);
            return ApiResponse.success(res, result.message, { userId: result.userId, targetIdentifier: result.targetIdentifier }, 201);
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
            const { token } = req.body;
            if (!token) {
                return ApiResponse.error(res, 'Mã token là bắt buộc', 400);
            }
            const result = await authService.verifyResetToken(token);
            return ApiResponse.success(res, result.message, { email: result.email });
        } catch (error: unknown) {
            next(error);
        }
    },

    resetPassword: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return ApiResponse.error(res, 'Mã token và mật khẩu mới là bắt buộc', 400);
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
    },

    resetPasswordRedirect: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { token } = req.query;
            // Generate HTML to redirect to Expo Go
            const expoLink = `exp://172.20.10.13:8081/--/reset-password?token=${token}`;
            const html = `
                <!DOCTYPE html>
                <html lang="vi">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <title>Đang mở ứng dụng...</title>
                        <script>
                            setTimeout(function() {
                                window.location.href = "${expoLink}";
                            }, 500);
                        </script>
                        <style>
                            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 40px 20px; background-color: #f9fafb; }
                            .container { background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; margin: 0 auto; }
                            h2 { color: #db2777; margin-bottom: 10px; }
                            p { color: #4b5563; margin-bottom: 20px; line-height: 1.5; }
                            a.btn { display: inline-block; background-color: #db2777; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Đang chuyển hướng...</h2>
                            <p>Điện thoại của bạn đang tự động mở ứng dụng Cupcake để đổi mật khẩu.</p>
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
