import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export interface User {
    id?: number;
    name: string;
    email: string;
    phone?: string | null;
    password: string;
    avatar_url?: string | null;
    address?: string | null;
    is_verified?: number; // TINYINT(1): 0 | 1
    is_active?: number; // TINYINT(1): 0 | 1
    created_at?: Date;
    updated_at?: Date;
}

export const userModel = {
    // Tìm user theo email (dùng khi login / register check)
    findByEmail: async (email: string): Promise<User | null> => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ? AND (is_active = 1 OR is_active IS NULL)', [email]);
        const users = rows as User[];
        return users.length > 0 ? users[0] : null;
    },

    // Tìm user theo số điện thoại (dùng khi login bằng SĐT)
    findByPhone: async (phone: string): Promise<User | null> => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE phone = ? AND (is_active = 1 OR is_active IS NULL)', [phone]);
        const users = rows as User[];
        return users.length > 0 ? users[0] : null;
    },

    // Tìm user theo email hoặc SĐT (dùng khi login)
    findByEmailOrPhone: async (identifier: string): Promise<User | null> => {
        const [rows] = await pool.query(
            'SELECT * FROM Users WHERE (email = ? OR phone = ?) AND (is_active = 1 OR is_active IS NULL) LIMIT 1',
            [identifier, identifier]
        );
        const users = rows as User[];
        return users.length > 0 ? users[0] : null;
    },

    // Tìm user theo ID
    findById: async (id: number): Promise<User | null> => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE id = ? AND (is_active = 1 OR is_active IS NULL)', [id]);
        const users = rows as User[];
        return users.length > 0 ? users[0] : null;
    },

    // Tạo user mới (password đã được hash trước khi gọi hàm này)
    create: async (data: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> => {
        const { name, email, phone, password, address } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO Users (name, email, phone, password, address, is_verified) VALUES (?, ?, ?, ?, ?, 1)',
            [name, email, phone ?? null, hashedPassword, address ?? null]
        );
        return (result as any).insertId;
    },

    // Cập nhật thông tin profile
    updateProfile: async (id: number, data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'address' | 'avatar_url'>>) => {
        const validData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
        if (Object.keys(validData).length === 0) return;
        
        const fields = Object.keys(validData).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(validData), id];
        await pool.execute(`UPDATE Users SET ${fields} WHERE id = ?`, values);
    },

    // Cập nhật trạng thái xác minh email
    setVerified: async (id: number) => {
        await pool.execute('UPDATE Users SET is_verified = 1 WHERE id = ?', [id]);
    },

    // So sánh mật khẩu
    comparePassword: async (plain: string, hashed: string): Promise<boolean> => {
        return bcrypt.compare(plain, hashed);
    },

    // Đổi mật khẩu
    updatePassword: async (id: number, newPassword: string) => {
        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.execute('UPDATE Users SET password = ? WHERE id = ?', [hashed, id]);
    },
};
