import pool from '../config/db.js';
export const reviewModel = {
    // Lấy tất cả đánh giá của một sản phẩm (kèm tên user)
    findByProductId: async (productId) => {
        const [rows] = await pool.query(`SELECT r.*, u.name AS user_name
             FROM Reviews r
             JOIN Users u ON r.user_id = u.id
             WHERE r.product_id = ?
             ORDER BY r.created_at DESC`, [productId]);
        return rows;
    },
    // Lấy đánh giá của một user cho một sản phẩm (kiểm tra đã review chưa)
    findByUserAndProduct: async (userId, productId) => {
        const [rows] = await pool.query('SELECT * FROM Reviews WHERE user_id = ? AND product_id = ?', [userId, productId]);
        const reviews = rows;
        return reviews.length > 0 ? reviews[0] : null;
    },
    // Tạo đánh giá mới
    create: async (data) => {
        const { user_id, product_id, rating, comment, image } = data;
        const [result] = await pool.execute('INSERT INTO Reviews (user_id, product_id, rating, comment, image) VALUES (?, ?, ?, ?, ?)', [user_id, product_id, rating, comment ?? null, image ?? null]);
        return result.insertId;
    },
    // Tìm đánh giá theo ID
    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM Reviews WHERE id = ?', [id]);
        const reviews = rows;
        return reviews.length > 0 ? reviews[0] : null;
    },
    // Cập nhật đánh giá
    update: async (id, data) => {
        const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(data), id];
        if (fields.length > 0) {
            await pool.execute(`UPDATE Reviews SET ${fields} WHERE id = ?`, values);
        }
    },
    // Xóa đánh giá
    delete: async (id) => {
        await pool.execute('DELETE FROM Reviews WHERE id = ?', [id]);
    }
};
//# sourceMappingURL=reviewModel.js.map