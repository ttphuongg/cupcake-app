import pool from '../config/db.js';

export type OtpType =
    | 'register'
    | 'login'
    | 'update-profile'
    | 'change-password'
    | 'delete-account'
    | 'forgot-password';

export interface Otp {
    id?: number;
    user_id?: number | null;
    identifier: string; // email hoặc phone
    code: string;
    type: OtpType;
    expires_at: Date;
    used?: number; // TINYINT(1): 0 | 1
}

export const otpModel = {
    // Tạo mã OTP mới
    create: async (data: Omit<Otp, 'id' | 'used'>): Promise<number> => {
        const { user_id, identifier, code, type, expires_at } = data;
        const [result] = await pool.execute(
            'INSERT INTO otps (user_id, identifier, code, type, expires_at) VALUES (?, ?, ?, ?, ?)',
            [user_id ?? null, identifier, code, type, expires_at]
        );
        return (result as any).insertId;
    },

    // Tìm OTP hợp lệ (chưa dùng, chưa hết hạn)
    findValid: async (identifier: string, code: string, type: OtpType): Promise<Otp | null> => {
        const [rows] = await pool.query(
            `SELECT * FROM otps
             WHERE identifier = ? AND code = ? AND type = ? AND used = 0 AND expires_at > NOW()
             ORDER BY id DESC LIMIT 1`,
            [identifier, code, type]
        );
        const otps = rows as Otp[];
        return otps.length > 0 ? otps[0] : null;
    },

    // Đánh dấu OTP đã sử dụng
    markUsed: async (id: number) => {
        await pool.execute('UPDATE otps SET used = 1 WHERE id = ?', [id]);
    },

    // Xóa các OTP cũ của cùng identifier + type (dọn dẹp trước khi tạo mới)
    deleteOldCodes: async (identifier: string, type: OtpType) => {
        await pool.execute(
            'DELETE FROM otps WHERE identifier = ? AND type = ?',
            [identifier, type]
        );
    },
};
