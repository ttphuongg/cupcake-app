import { userModel } from '../models/index.js';
import { otpService } from './otp.service.js';
import { mailService } from './mail.service.js';
export const userService = {
    getProfile: async (userId) => {
        const user = await userModel.findById(userId);
        if (!user)
            throw new Error('Tài khoản không tồn tại');
        // Loại bỏ trường nhạy cảm trước khi trả về
        const { password: _pw, ...safeUser } = user;
        return safeUser;
    },
    updateProfile: async (userId, updateData) => {
        const user = await userModel.findById(userId);
        if (!user)
            throw new Error('Tài khoản không tồn tại');
        await userModel.updateProfile(userId, updateData);
        const updatedUser = await userModel.findById(userId);
        const { password: _pw, ...safeUser } = (updatedUser ?? user);
        return { message: 'Cập nhật thông tin thành công', user: safeUser };
    },
    changePassword: async (userId, oldPass, newPass, otp) => {
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
    requestChangePasswordOtp: async (userId) => {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('Tài khoản không tồn tại');
        }
        const otp = await otpService.createOTP(user.email, 'change-password', user.id);
        await mailService.sendOTPEmail(user.email, otp, 'change-password');
        return { message: 'Mã xác nhận đã được gửi vào email của bạn', targetIdentifier: user.email };
    },
    deleteAccount: async (userId, otp) => {
        const user = await userModel.findById(userId);
        if (!user)
            throw new Error('Tài khoản không tồn tại');
        // Xác thực OTP (password đã được kiểm tra ở bước requestDeleteAccountOtp)
        const verification = await otpService.verifyOTP(user.email, otp, 'delete-account');
        if (!verification.valid)
            throw new Error(verification.message);
        // Hard delete: Xóa vĩnh viễn tài khoản khỏi DB
        await userModel.delete(userId);
        return { message: 'Tài khoản của bạn đã được xóa thành công' };
    },
    requestDeleteAccountOtp: async (userId, password) => {
        const user = await userModel.findById(userId);
        if (!user)
            throw new Error('Tài khoản không tồn tại');
        // Xác minh mật khẩu trước khi gửi OTP
        const isMatch = await userModel.comparePassword(password, user.password);
        if (!isMatch)
            throw new Error('Mật khẩu hiện tại không chính xác');
        const otp = await otpService.createOTP(user.email, 'delete-account', user.id);
        await mailService.sendOTPEmail(user.email, otp, 'delete-account');
        return { message: 'Mã xác nhận đã được gửi vào email của bạn', targetIdentifier: user.email };
    }
};
//# sourceMappingURL=user.service.js.map