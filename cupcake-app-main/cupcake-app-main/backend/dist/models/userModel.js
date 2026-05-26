import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
export const userModel = {
    // Tìm user theo email (dùng khi login / register check)
    findByEmail: async (email) => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
        const users = rows;
        return users.length > 0 ? users[0] : null;
    },
    // Tìm user theo số điện thoại (dùng khi login bằng SĐT)
    findByPhone: async (phone) => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE phone = ?', [phone]);
        const users = rows;
        return users.length > 0 ? users[0] : null;
    },
    // Tìm user theo email hoặc SĐT (dùng khi login)
    findByEmailOrPhone: async (identifier) => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE email = ? OR phone = ? LIMIT 1', [identifier, identifier]);
        const users = rows;
        return users.length > 0 ? users[0] : null;
    },
    // Tìm user theo ID
    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
        const users = rows;
        return users.length > 0 ? users[0] : null;
    },
    // Tạo user mới (Mặc định is_active = 0, is_verified = 0)
    create: async (data) => {
        const { name, email, phone, password, address } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.execute('INSERT INTO Users (name, email, phone, password, address, is_active, is_verified) VALUES (?, ?, ?, ?, ?, 0, 0)', [name, email, phone ?? null, hashedPassword, address ?? null]);
        return result.insertId;
    },
    // Cập nhật thông tin profile
    updateProfile: async (id, data) => {
        const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(data), id];
        await pool.execute(`UPDATE Users SET ${fields} WHERE id = ?`, values);
    },
    // Kích hoạt tài khoản khi xác minh thành công
    activateAccount: async (id) => {
        await pool.execute('UPDATE Users SET is_verified = 1, is_active = 1 WHERE id = ?', [id]);
    },
    // So sánh mật khẩu
    comparePassword: async (plain, hashed) => {
        return bcrypt.compare(plain, hashed);
    },
    // Đổi mật khẩu
    updatePassword: async (id, newPassword) => {
        const hashed = await bcrypt.hash(newPassword, 10);
        await pool.execute('UPDATE Users SET password = ? WHERE id = ?', [hashed, id]);
    },
    // Xóa cứng tài khoản
    delete: async (id) => {
        await pool.execute('DELETE FROM Users WHERE id = ?', [id]);
    },
};
//# sourceMappingURL=userModel.js.map