import { userService } from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
export const userController = {
    getProfile: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw new Error('Không xác định được người dùng');
            const user = await userService.getProfile(userId);
            return ApiResponse.success(res, 'Lấy thông tin thành công', { user });
        }
        catch (error) {
            next(error);
        }
    },
    updateProfile: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw new Error('Không xác định được người dùng');
            const { name, email, phone, address, avatar_url } = req.body;
            const result = await userService.updateProfile(userId, { name, email, phone, address, avatar_url });
            return ApiResponse.success(res, result.message, result.user);
        }
        catch (error) {
            next(error);
        }
    },
    requestChangePasswordLink: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw new Error('Không xác định được người dùng');
            const result = await userService.requestChangePasswordLink(userId);
            return ApiResponse.success(res, result.message, { targetIdentifier: result.targetIdentifier });
        }
        catch (error) {
            next(error);
        }
    },
    confirmChangePassword: async (req, res, next) => {
        try {
            const { token, newPassword } = req.body;
            if (!token || !newPassword) {
                return ApiResponse.error(res, 'Vui lòng cung cấp token và mật khẩu mới', 400);
            }
            const result = await userService.confirmChangePassword(token, newPassword);
            return ApiResponse.success(res, result.message);
        }
        catch (error) {
            next(error);
        }
    },
    requestDeleteAccountLink: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId)
                throw new Error('Không xác định được người dùng');
            const { password } = req.body;
            if (!password) {
                return ApiResponse.error(res, 'Vui lòng nhập mật khẩu xác nhận', 400);
            }
            const result = await userService.requestDeleteAccountLink(userId, password);
            return ApiResponse.success(res, result.message, { targetIdentifier: result.targetIdentifier });
        }
        catch (error) {
            next(error);
        }
    },
    confirmDeleteAccount: async (req, res, next) => {
        try {
            const { token } = req.body;
            if (!token) {
                return ApiResponse.error(res, 'Vui lòng cung cấp token xác nhận', 400);
            }
            const result = await userService.confirmDeleteAccount(token);
            return ApiResponse.success(res, result.message);
        }
        catch (error) {
            next(error);
        }
    }
};
//# sourceMappingURL=user.controller.js.map