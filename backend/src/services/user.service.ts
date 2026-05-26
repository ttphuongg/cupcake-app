import { userModel } from '../models/index.js';
import { mailService } from './mail.service.js';
import crypto from 'crypto';

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

        if (updateData.email && updateData.email !== user.email) {
            const existing = await userModel.findByEmail(updateData.email);
            if (existing && existing.id !== userId) {
                throw new Error('Email này đã được sử dụng bởi tài khoản khác');
            }
        }

        await userModel.updateProfile(userId, updateData);
        const updatedUser = await userModel.findById(userId);
        const { password: _pw, ...safeUser } = (updatedUser ?? user) as typeof user & { password: string };
        return { message: 'Cập nhật thông tin thành công', user: safeUser };
    },

    requestChangePasswordLink: async (userId: number) => {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error('Tài khoản không tồn tại');
        }

        // Rate limit: 2 minutes
        const pool = (await import('../config/db.js')).default;
        const [rows]: any = await pool.query('SELECT last_reset_request_at FROM Users WHERE id = ?', [user.id]);
        if (rows && rows.length > 0 && rows[0].last_reset_request_at) {
            const lastRequest = new Date(rows[0].last_reset_request_at).getTime();
            const now = Date.now();
            if (now - lastRequest < 2 * 60 * 1000) {
                const waitSecs = Math.ceil((2 * 60 * 1000 - (now - lastRequest)) / 1000);
                throw new Error(`Bạn vừa yêu cầu gửi link xác nhận. Vui lòng đợi ${waitSecs} giây trước khi gửi yêu cầu mới.`);
            }
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await pool.execute(
            'UPDATE Users SET reset_token = ?, reset_token_expires_at = ?, reset_token_type = ?, last_reset_request_at = NOW() WHERE id = ?',
            [token, expiresAt, 'change_password', user.id]
        );

        const resetLink = `http://192.168.2.1:8081/change-password-confirm?token=${token}`;
        await mailService.sendChangePasswordLinkEmail(user.email, resetLink);

        return { message: 'Đã gửi liên kết xác nhận vào Email của bạn.', targetIdentifier: user.email };
    },

    confirmChangePassword: async (token: string, newPass: string) => {
        const pool = (await import('../config/db.js')).default;
        const [rows]: any = await pool.query('SELECT * FROM Users WHERE reset_token = ? AND reset_token_type = ?', [token, 'change_password']);
        if (!rows || rows.length === 0) {
            throw new Error('Đường dẫn không hợp lệ hoặc đã được sử dụng');
        }

        const user = rows[0];
        const expiresAt = new Date(user.reset_token_expires_at).getTime();
        if (expiresAt < Date.now()) {
            throw new Error('Đường dẫn đã hết hạn (hiệu lực 15 phút)');
        }

        await userModel.updatePassword(user.id, newPass);

        await pool.execute(
            'UPDATE Users SET reset_token = NULL, reset_token_expires_at = NULL, reset_token_type = NULL WHERE id = ?',
            [user.id]
        );

        return { message: 'Đổi mật khẩu thành công' };
    },

    requestDeleteAccountLink: async (userId: number, password: string) => {
        const user = await userModel.findById(userId);
        if (!user) throw new Error('Tài khoản không tồn tại');

        const isMatch = await userModel.comparePassword(password, user.password);
        if (!isMatch) throw new Error('Mật khẩu hiện tại không chính xác');

        const pool = (await import('../config/db.js')).default;
        const [rows]: any = await pool.query('SELECT last_reset_request_at FROM Users WHERE id = ?', [user.id]);
        if (rows && rows.length > 0 && rows[0].last_reset_request_at) {
            const lastRequest = new Date(rows[0].last_reset_request_at).getTime();
            const now = Date.now();
            if (now - lastRequest < 2 * 60 * 1000) {
                const waitSecs = Math.ceil((2 * 60 * 1000 - (now - lastRequest)) / 1000);
                throw new Error(`Bạn vừa yêu cầu gửi link xác nhận. Vui lòng đợi ${waitSecs} giây trước khi gửi yêu cầu mới.`);
            }
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await pool.execute(
            'UPDATE Users SET reset_token = ?, reset_token_expires_at = ?, reset_token_type = ?, last_reset_request_at = NOW() WHERE id = ?',
            [token, expiresAt, 'delete_account', user.id]
        );

        const resetLink = `http://192.168.2.1:8081/delete-account-confirm?token=${token}`;
        await mailService.sendDeleteAccountLinkEmail(user.email, resetLink);

        return { message: 'Đã gửi liên kết xác nhận xóa tài khoản vào Email của bạn.', targetIdentifier: user.email };
    },

    confirmDeleteAccount: async (token: string) => {
        const pool = (await import('../config/db.js')).default;
        const [rows]: any = await pool.query('SELECT * FROM Users WHERE reset_token = ? AND reset_token_type = ?', [token, 'delete_account']);
        if (!rows || rows.length === 0) {
            throw new Error('Đường dẫn không hợp lệ hoặc đã được sử dụng');
        }

        const user = rows[0];
        const expiresAt = new Date(user.reset_token_expires_at).getTime();
        if (expiresAt < Date.now()) {
            throw new Error('Đường dẫn đã hết hạn (hiệu lực 15 phút)');
        }

        // Xóa cứng dữ liệu liên quan (nếu không có ON DELETE CASCADE)
        try { await pool.execute('DELETE FROM CartItems WHERE user_id = ?', [user.id]); } catch (e) {}
        try { await pool.execute('DELETE FROM Reviews WHERE user_id = ?', [user.id]); } catch (e) {}
        try { await pool.execute('DELETE FROM OrderItems WHERE order_id IN (SELECT id FROM Orders WHERE user_id = ?)', [user.id]); } catch (e) {}
        try { await pool.execute('DELETE FROM Orders WHERE user_id = ?', [user.id]); } catch (e) {}
        try { await pool.execute('DELETE FROM OTPs WHERE email = ?', [user.email]); } catch (e) {}

        // Cuối cùng xóa bản ghi User (xóa cứng khỏi DB)
        await pool.execute('DELETE FROM Users WHERE id = ?', [user.id]);

        return { message: 'Tài khoản của bạn và toàn bộ dữ liệu đã được xóa vĩnh viễn thành công' };
    }
};
