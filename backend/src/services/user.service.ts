import { userModel } from '../models/index.js';
import { otpService } from './otp.service.js';
import { mailService } from './mail.service.js';

export const userService = {
    getProfile: async (userId: number) => {
        const user = await userModel.findById(userId);
        if (!user) throw new Error('Tài khoản không tồn tại');
        // Loại bỏ trường nhạy cảm trước khi trả về
        const { password: _pw, ...safeUser } = user as typeof user & { password: string };
        return safeUser;
    },

    updateProfile: async (userId: number, updateData: { name?: string, phone?: string, address?: string }) => {
        const user = await userModel.findById(userId);
        if (!user) throw new Error('Tài khoản không tồn tại');

        await userModel.updateProfile(userId, updateData);
        const updatedUser = await userModel.findById(userId);
        const { password: _pw, ...safeUser } = (updatedUser ?? user) as typeof user & { password: string };
        return { message: 'Cập nhật thông tin thành công', user: safeUser };
    },

    changePassword: async (userId: number, oldPass: string, newPass: string, otp: string) => {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('Tài khoản không tồn tại');
        }

        const isMatch = await userModel.comparePassword(oldPass, user.password);
        if (!isMatch) {
            throw new Error('Mật khẩu cũ không đúng');
        }

        const verification = await otpService.verifyOTP(user.email, otp, 'change-password');
        if (!verification.valid) {
            throw new Error(verification.message);
        }

        await userModel.updatePassword(userId, newPass);

        return { message: 'Đổi mật khẩu thành công' };
    },

    requestChangePasswordOtp: async (userId: number) => {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('Tài khoản không tồn tại');
        }

        const otp = await otpService.createOTP(user.email, 'change-password', user.id);
        await mailService.sendOTPEmail(user.email, otp, 'change-password');

        return { message: 'Mã xác nhận đã được gửi vào email của bạn', targetIdentifier: user.email };
    },

    deleteAccount: async (userId: number, otp: string) => {
        const user = await userModel.findById(userId);
        if (!user) throw new Error('Tài khoản không tồn tại');

        // Xác thực OTP (password đã được kiểm tra ở bước requestDeleteAccountOtp)
        const verification = await otpService.verifyOTP(user.email, otp, 'delete-account');
        if (!verification.valid) throw new Error(verification.message);

        // Soft delete: đặt is_active = 0 thay vì xóa cứng
        const pool = (await import('../config/db.js')).default;
        await pool.execute('UPDATE Users SET is_active = 0 WHERE id = ?', [userId]);

        return { message: 'Tài khoản của bạn đã được xóa thành công' };
    },
    
    requestDeleteAccountOtp: async (userId: number, password: string) => {
        const user = await userModel.findById(userId);
        if (!user) throw new Error('Tài khoản không tồn tại');

        // Xác minh mật khẩu trước khi gửi OTP
        const isMatch = await userModel.comparePassword(password, user.password);
        if (!isMatch) throw new Error('Mật khẩu hiện tại không chính xác');

        const otp = await otpService.createOTP(user.email, 'delete-account', user.id);
        await mailService.sendOTPEmail(user.email, otp, 'delete-account');

        return { message: 'Mã xác nhận đã được gửi vào email của bạn', targetIdentifier: user.email };
    }
};
