import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export interface User {
    id?: number;
    name: string;
    email: string;
    phone?: string | null;
    password: string;
    address?: string | null;
    is_verified?: number;   // TINYINT(1): 0 | 1
    is_active?: number;     // TINYINT(1): 0 | 1
    avatar_url?: string | null;
    created_at?: Date;
    updated_at?: Date;
    reset_token?: string | null;
    reset_token_expires?: Date | null;
    last_reset_request_at?: Date | null;
}

export const userModel = {
    // Tìm user theo email (dùng khi login / register check)
    findByEmail: async (email: string): Promise<User | null> => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        const users = rows as User[];
        return users.length > 0 ? users[0] : null;
    },

    // Tìm user theo số điện thoại (dùng khi login bằng SĐT)
    findByPhone: async (phone: string): Promise<User | null> => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE phone = ?', [phone]);
        const users = rows as User[];
        return users.length > 0 ? users[0] : null;
    },

    // Tìm user theo email hoặc SĐT (dùng khi login)
    findByEmailOrPhone: async (identifier: string): Promise<User | null> => {
        const [rows] = await pool.query(
            'SELECT * FROM Users WHERE email = ? OR phone = ? LIMIT 1',
            [identifier, identifier]
        );
        const users = rows as User[];
        return users.length > 0 ? users[0] : null;
    },

    // Tìm user theo ID
    findById: async (id: number): Promise<User | null> => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
        const users = rows as User[];
        return users.length > 0 ? users[0] : null;
    },

    // Tạo user mới (Mặc định is_active = 1, is_verified = 1 để tự động kích hoạt không cần OTP)
    create: async (data: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> => {
        const { name, email, phone, password, address } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.execute(
            'INSERT INTO Users (name, email, phone, password, address, is_active, is_verified) VALUES (?, ?, ?, ?, ?, 1, 1)',
            [name, email, phone ?? null, hashedPassword, address ?? null]
        );
        return (result as any).insertId;
    },

    // Cập nhật thông tin profile
    updateProfile: async (id: number, data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'address' | 'avatar_url'>>) => {
        // Lọc bỏ các thuộc tính có giá trị undefined để tránh lỗi tham số SQL bind
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        );
        
        if (Object.keys(cleanData).length === 0) return;

        const fields = Object.keys(cleanData).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(cleanData), id];
        await pool.execute(`UPDATE Users SET ${fields} WHERE id = ?`, values);
    },

    // Kích hoạt tài khoản khi xác minh thành công
    activateAccount: async (id: number) => {
        await pool.execute('UPDATE Users SET is_verified = 1, is_active = 1 WHERE id = ?', [id]);
    },

    // So sánh mật khẩu
    comparePassword: async (plain: string, hashed: string): Promise<boolean> => {
        return bcrypt.compare(plain, hashed);
    },

    // Đổi mật khẩu và xóa token reset
    updatePassword: async (id: number, newPassword: string) => {
        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.execute(
            'UPDATE Users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
            [hashed, id]
        );
    },

    // Cập nhật Token khôi phục mật khẩu
    updateResetToken: async (id: number, token: string | null, expires: Date | null, lastRequestAt?: Date | null) => {
        if (lastRequestAt) {
            await pool.execute(
                'UPDATE Users SET reset_token = ?, reset_token_expires = ?, last_reset_request_at = ? WHERE id = ?',
                [token, expires, lastRequestAt, id]
            );
        } else {
            await pool.execute(
                'UPDATE Users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
                [token, expires, id]
            );
        }
    },

    // Tìm user theo Token reset
    findByResetToken: async (token: string): Promise<User | null> => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE reset_token = ?', [token]);
        const users = rows as User[];
        return users.length > 0 ? users[0] : null;
    },

    // Xóa cứng tài khoản (Xóa hoàn toàn data)
    delete: async (id: number) => {
        await pool.execute('DELETE FROM Users WHERE id = ?', [id]);
    },
};
