import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import pool from '../config/db.js';
import { userModel } from '../models/index.js';
import { mailService } from './mail.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const authService = {
    register: async (email: string, phone: string | null, password: string, name: string) => {
        // Kiểm tra email đã tồn tại
        const existingByEmail = await userModel.findByEmail(email);
        if (existingByEmail) throw new Error('Email này đã được sử dụng');

        // Kiểm tra SĐT đã tồn tại
        if (phone) {
            const existingByPhone = await userModel.findByPhone(phone);
            if (existingByPhone) throw new Error('Số điện thoại này đã được sử dụng');
        }

        try {
            // Tạo user với is_verified = 1
            const userId = await userModel.create({ name, email, phone, password, address: null });
            return { userId, message: 'Đăng ký thành công!', targetIdentifier: email };
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Tài khoản này đã tồn tại trong hệ thống (có thể đã bị xóa trước đó). Vui lòng dùng tính năng Quên mật khẩu hoặc liên hệ hỗ trợ.');
            }
            throw error;
        }
    },

    verifyRegister: async (email: string, _otp: string) => {
        // Hỗ trợ backwards compatibility
        return { message: 'Xác thực tài khoản thành công! Bạn có thể đăng nhập.' };
    },

    login: async (identifier: string, password: string) => {
        // Hỗ trợ đăng nhập bằng email hoặc số điện thoại
        const user = await userModel.findByEmailOrPhone(identifier);
        if (!user || !user.id) throw new Error('Tài khoản không tồn tại');

        const isMatch = await userModel.comparePassword(password, user.password);
        if (!isMatch) throw new Error('Mật khẩu không chính xác');

        // Tạo token phiên đăng nhập
        const token = jwt.sign(
            { id: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN as any }
        );

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                avatar_url: user.avatar_url,
            }
        };
    },

    forgotPassword: async (email: string) => {
        const user = await userModel.findByEmail(email);
        if (!user || !user.id) {
            throw new Error('Tài khoản không tồn tại');
        }

        // Quy tắc Giới hạn yêu cầu: Chỉ cho phép yêu cầu 1 lần trong 2 phút (Condition 3)
        const [rows]: any = await pool.query('SELECT last_reset_request_at FROM Users WHERE id = ?', [user.id]);
        if (rows && rows.length > 0 && rows[0].last_reset_request_at) {
            const lastRequest = new Date(rows[0].last_reset_request_at).getTime();
            const now = Date.now();
            if (now - lastRequest < 2 * 60 * 1000) {
                const waitSecs = Math.ceil((2 * 60 * 1000 - (now - lastRequest)) / 1000);
                throw new Error(`Bạn vừa yêu cầu gửi link khôi phục mật khẩu. Vui lòng đợi ${waitSecs} giây trước khi gửi yêu cầu mới.`);
            }
        }

        // Tạo Token ngẫu nhiên mới (Condition 3: ghi đè token cũ để hủy)
        const token = crypto.randomBytes(32).toString('hex');
        // Hạn dùng ngắn 15 phút (Condition 2)
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        // Lưu vào DB
        await pool.execute(
            'UPDATE Users SET reset_token = ?, reset_token_expires_at = ?, reset_token_type = ?, last_reset_request_at = NOW() WHERE id = ?',
            [token, expiresAt, 'forgot_password', user.id]
        );

        // Gửi email chứa liên kết khôi phục (Reset Link)
        const resetLink = `http://192.168.2.1:8081/reset-password?token=${token}`;
        await mailService.sendResetLinkEmail(email, resetLink);

        return { message: 'Đã gửi liên kết khôi phục mật khẩu vào Email của bạn. Vui lòng kiểm tra hộp thư.' };
    },

    verifyResetToken: async (token: string) => {
        const [rows]: any = await pool.query('SELECT * FROM Users WHERE reset_token = ? AND reset_token_type = ?', [token, 'forgot_password']);
        if (!rows || rows.length === 0) {
            throw new Error('Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng');
        }

        const user = rows[0];
        const expiresAt = new Date(user.reset_token_expires_at).getTime();
        if (expiresAt < Date.now()) {
            throw new Error('Đường dẫn đặt lại mật khẩu đã hết hạn (hiệu lực 15 phút)');
        }

        return { email: user.email, message: 'Đường dẫn hợp lệ' };
    },

    resetPassword: async (token: string, newPassword: string) => {
        const [rows]: any = await pool.query('SELECT * FROM Users WHERE reset_token = ? AND reset_token_type = ?', [token, 'forgot_password']);
        if (!rows || rows.length === 0) {
            throw new Error('Đường dẫn đặt lại mật khẩu không hợp lệ hoặc đã được sử dụng');
        }

        const user = rows[0];
        const expiresAt = new Date(user.reset_token_expires_at).getTime();
        if (expiresAt < Date.now()) {
            throw new Error('Đường dẫn đặt lại mật khẩu đã hết hạn (hiệu lực 15 phút)');
        }

        // Đổi mật khẩu
        await userModel.updatePassword(user.id, newPassword);

        // Dùng 1 lần: Xóa Token trong DB ngay sau khi đổi thành công (Condition 1)
        await pool.execute(
            'UPDATE Users SET reset_token = NULL, reset_token_expires_at = NULL, reset_token_type = NULL WHERE id = ?',
            [user.id]
        );

        return { message: 'Đặt lại mật khẩu thành công' };
    },

    logout: async () => {
        return { message: 'Đăng xuất thành công' };
    }
};
