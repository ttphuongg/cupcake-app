import { userModel } from '../models/index.js';
import { otpService } from './otp.service.js';
import { mailService } from './mail.service.js';
import jwt from 'jsonwebtoken';

export const userService = {
    getProfile: async (userId: number) => {
        const user = await userModel.findById(userId);
        if (!user) throw new Error('Tài khoản không tồn tại');
        // Loại bỏ trường nhạy cảm trước khi trả về
        const { password: _pw, ...safeUser } = user as typeof user & { password: string };
        return safeUser;
    },

    updateProfile: async (userId: number, updateData: { name?: string, email?: string, phone?: string, address?: string, avatar_url?: string }) => {
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

    deleteAccount: async (token: string) => {
        if (!token) throw new Error('Mã xác nhận không hợp lệ');

        try {
            const secret = process.env.JWT_SECRET || 'default_secret';
            const decoded = jwt.verify(token, secret) as { id: number, purpose: string };

            if (decoded.purpose !== 'delete-account') {
                throw new Error('Mã xác nhận không hợp lệ');
            }

            const user = await userModel.findById(decoded.id);
            if (!user) throw new Error('Tài khoản không tồn tại');

            // Hard delete: Xóa vĩnh viễn tài khoản khỏi DB
            await userModel.delete(decoded.id);

            return { message: 'Tài khoản của bạn đã được xóa thành công' };
        } catch (error) {
            throw new Error('Mã xác nhận không hợp lệ hoặc đã hết hạn');
        }
    },
    
    requestDeleteAccountLink: async (userId: number, password: string) => {
        const user = await userModel.findById(userId);
        if (!user) throw new Error('Tài khoản không tồn tại');

        // Xác minh mật khẩu trước khi gửi Link
        const isMatch = await userModel.comparePassword(password, user.password);
        if (!isMatch) throw new Error('Mật khẩu hiện tại không chính xác');

        const secret = process.env.JWT_SECRET || 'default_secret';
        const token = jwt.sign({ id: user.id, purpose: 'delete-account' }, secret, { expiresIn: '15m' });
        
        await mailService.sendDeleteAccountEmail(user.email, token);

        return { message: 'Vui lòng kiểm tra email của bạn để xác nhận xóa tài khoản.' };
    }
};
