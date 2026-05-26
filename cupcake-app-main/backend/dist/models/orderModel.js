import pool from '../config/db.js';
export const orderModel = {
    // Tạo đơn hàng mới
    create: async (orderData) => {
        const { user_id, subtotal, discount, total_price, status, payment_method, payment_status, address, phone, note } = orderData;
        const [result] = await pool.execute(`INSERT INTO Orders (user_id, subtotal, discount, total_price, status, payment_method, payment_status, address, phone, note) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [user_id, subtotal, discount, total_price, status, payment_method, payment_status, address, phone, note ?? null]);
        return result.insertId;
    },
    // Lấy lịch sử đơn hàng của 1 User
    findByUserId: async (userId) => {
        const [rows] = await pool.query('SELECT * FROM Orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        return rows;
    },
    // Tìm đơn hàng theo ID
    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM Orders WHERE id = ?', [id]);
        const orders = rows;
        return orders.length > 0 ? orders[0] : null;
    },
    // Cập nhật trạng thái đơn hàng (Dùng khi thanh toán xong)
    updateStatus: async (orderId, status, paymentStatus) => {
        let query = 'UPDATE Orders SET status = ?';
        const params = [status];
        if (paymentStatus) {
            query += ', payment_status = ?';
            params.push(paymentStatus);
        }
        query += ' WHERE id = ?';
        params.push(orderId);
        await pool.execute(query, params);
    }
};
//# sourceMappingURL=orderModel.js.map