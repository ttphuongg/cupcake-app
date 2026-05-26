import pool from '../config/db.js';
export const otpModel = {
    create: async (data) => {
        const { user_id, identifier, code, type, expires_at } = data;
        console.log(`[OTP] Creating ${type} OTP for ${identifier}: ${code}`);
        const [result] = await pool.execute('INSERT INTO otps (user_id, identifier, code, type, expires_at) VALUES (?, ?, ?, ?, ?)', [user_id ?? null, identifier, code, type, expires_at]);
        return result.insertId;
    },
    // Tìm OTP hợp lệ (chưa dùng, chưa hết hạn)
    findValid: async (identifier, code, type) => {
        const [rows] = await pool.query(`SELECT * FROM otps
             WHERE identifier = ? AND code = ? AND type = ? AND used = 0 AND expires_at > NOW()
             ORDER BY id DESC LIMIT 1`, [identifier, code, type]);
        const otps = rows;
        return otps.length > 0 ? otps[0] : null;
    },
    // Đánh dấu OTP đã sử dụng
    markUsed: async (id) => {
        await pool.execute('UPDATE otps SET used = 1 WHERE id = ?', [id]);
    },
    // Xóa các OTP cũ của cùng identifier + type (dọn dẹp trước khi tạo mới)
    deleteOldCodes: async (identifier, type) => {
        await pool.execute('DELETE FROM otps WHERE identifier = ? AND type = ?', [identifier, type]);
    },
};
//# sourceMappingURL=otpModel.js.map