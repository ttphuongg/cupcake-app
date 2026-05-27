import pool from '../config/db.js';

export interface Review {
    id?: number;
    user_id: number;
    product_id: number;
    order_id?: number;
    rating: number; // 1 - 5
    comment?: string | null;
    image?: string | null;
    created_at?: Date;
}

export const reviewModel = {
    // Lấy tất cả đánh giá của một sản phẩm (kèm tên user)
    findByProductId: async (productId: number): Promise<Review[]> => {
        const [rows] = await pool.query(
            `SELECT r.*, u.name AS user_name, u.avatar_url AS user_avatar
             FROM Reviews r
             JOIN Users u ON r.user_id = u.id
             WHERE r.product_id = ?
             ORDER BY r.created_at DESC`,
            [productId]
        );
        return rows as Review[];
    },

    // Lấy đánh giá của một user cho một sản phẩm trong một đơn hàng
    findByOrderAndProduct: async (orderId: number, productId: number): Promise<Review | null> => {
        const [rows] = await pool.query(
            'SELECT * FROM Reviews WHERE order_id = ? AND product_id = ?',
            [orderId, productId]
        );
        const reviews = rows as Review[];
        return reviews.length > 0 ? reviews[0] : null;
    },

    // Tạo đánh giá mới
    create: async (data: Omit<Review, 'id' | 'created_at'>): Promise<number> => {
        const { user_id, product_id, order_id, rating, comment, image } = data;
        const [result] = await pool.execute(
            'INSERT INTO Reviews (user_id, product_id, order_id, rating, comment, image) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, product_id, order_id ?? null, rating, comment ?? null, image ?? null]
        );
        return (result as any).insertId;
    },

    // Tìm đánh giá theo ID
    findById: async (id: number): Promise<Review | null> => {
        const [rows] = await pool.query('SELECT * FROM Reviews WHERE id = ?', [id]);
        const reviews = rows as Review[];
        return reviews.length > 0 ? reviews[0] : null;
    },

    // Cập nhật đánh giá
    update: async (id: number, data: Partial<Pick<Review, 'rating' | 'comment' | 'image'>>) => {
        const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(data), id];
        if (fields.length > 0) {
            await pool.execute(`UPDATE Reviews SET ${fields} WHERE id = ?`, values);
        }
    },

    // Xóa đánh giá
    delete: async (id: number) => {
        await pool.execute('DELETE FROM Reviews WHERE id = ?', [id]);
    }
};
