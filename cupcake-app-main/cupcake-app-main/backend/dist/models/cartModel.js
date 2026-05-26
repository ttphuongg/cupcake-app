import pool from '../config/db.js';
export const cartModel = {
    // Tìm giỏ hàng theo user_id
    findByUserId: async (userId) => {
        const [rows] = await pool.query('SELECT * FROM Carts WHERE user_id = ?', [userId]);
        const carts = rows;
        return carts.length > 0 ? carts[0] : null;
    },
    // Tạo giỏ hàng mới cho user
    create: async (userId) => {
        const [result] = await pool.execute('INSERT INTO Carts (user_id) VALUES (?)', [userId]);
        return result.insertId;
    }
};
//# sourceMappingURL=cartModel.js.map