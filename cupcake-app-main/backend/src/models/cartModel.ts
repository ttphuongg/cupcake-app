import pool from '../config/db.js';

export interface Cart {
    id?: number;
    user_id: number;
}

export const cartModel = {
    // Tìm giỏ hàng theo user_id
    findByUserId: async (userId: number): Promise<Cart | null> => {
        const [rows] = await pool.query('SELECT * FROM Carts WHERE user_id = ?', [userId]);
        const carts = rows as Cart[];
        return carts.length > 0 ? carts[0] : null;
    },

    // Tạo giỏ hàng mới cho user
    create: async (userId: number): Promise<number> => {
        const [result] = await pool.execute('INSERT INTO Carts (user_id) VALUES (?)', [userId]);
        return (result as any).insertId;
    }
};