import { authService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const authController = {
    register: async (req, res, next) => {
        try {
            const { email, phone, password, name, otpMethod } = req.body;
            if (!email || !password || !name) {
                return ApiResponse.error(res, 'Email, mật khẩu và họ tên là bắt buộc', 400);
            }
            const result = await authService.register(email, phone ?? null, password, name, otpMethod);
            return ApiResponse.success(res, result.message, { userId: result.userId, targetIdentifier: result.targetIdentifier }, 201);
        }
        catch (error) {
            next(error);
        }
    },
    verifyRegister: async (req, res, next) => {
        try {
            const { email, phone, targetIdentifier, otp } = req.body;
            const identifier = targetIdentifier ?? email ?? phone;
            if (!identifier || !otp) {
                return ApiResponse.error(res, 'Thông tin xác thực và mã OTP là bắt buộc', 400);
            }
            const result = await authService.verifyRegister(identifier, otp);
            return ApiResponse.success(res, result.message);
        }
        catch (error) {
            next(error);
        }
    },
    login: async (req, res, next) => {
        try {
            const { email, phone, password, identifier } = req.body;
            const loginIdentifier = identifier ?? email ?? phone;
            if (!loginIdentifier || !password) {
                return ApiResponse.error(res, 'Vui lòng nhập thông tin đăng nhập và mật khẩu', 400);
            }
            const result = await authService.login(loginIdentifier, password);
            return ApiResponse.success(res, 'Đăng nhập thành công', result);
        }
        catch (error) {
            next(error);
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            const { email } = req.body;
            const result = await authService.forgotPassword(email);
            return ApiResponse.success(res, result.message);
        }
        catch (error) {
            next(error);
        }
    },
    resetPassword: async (req, res, next) => {
        try {
            const { email, otp, newPassword } = req.body;
            const result = await authService.resetPassword(email, otp, newPassword);
            return ApiResponse.success(res, result.message);
        }
        catch (error) {
            next(error);
        }
    },
    logout: async (req, res, next) => {
        try {
            const result = await authService.logout();
            return ApiResponse.success(res, result.message);
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=auth.controller.js.map