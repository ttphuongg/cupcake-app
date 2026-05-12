import pool from '../config/db.js';

export interface Order {
    id?: number;
    user_id: number;
    subtotal: number;
    discount: number;
    total_price: number;
    status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';
    payment_method: 'COD' | 'BANKING' | 'MOMO';
    payment_status: 'UNPAID' | 'PAID' | 'REFUNDED';
    address: string;
    phone: string;
    note?: string;
    created_at?: Date;
    updated_at?: Date;
}

export const orderModel = {
    // Tạo đơn hàng mới
    create: async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<number> => {
        const {
            user_id, subtotal, discount, total_price, status,
            payment_method, payment_status, address, phone, note
        } = orderData;

        const [result] = await pool.execute(
            `INSERT INTO Orders (user_id, subtotal, discount, total_price, status, payment_method, payment_status, address, phone, note) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, subtotal, discount, total_price, status, payment_method, payment_status, address, phone, note ?? null]
        );
        return (result as any).insertId;
    },

    // Lấy lịch sử đơn hàng của 1 User
    findByUserId: async (userId: number): Promise<Order[]> => {
        const [rows] = await pool.query(
            'SELECT * FROM Orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        return rows as Order[];
    },

    // Tìm đơn hàng theo ID
    findById: async (id: number): Promise<Order | null> => {
        const [rows] = await pool.query('SELECT * FROM Orders WHERE id = ?', [id]);
        const orders = rows as Order[];
        return orders.length > 0 ? orders[0] : null;
    },

    // Cập nhật trạng thái đơn hàng (Dùng khi thanh toán xong)
    updateStatus: async (orderId: number, status: Order['status'], paymentStatus?: Order['payment_status']) => {
        let query = 'UPDATE Orders SET status = ?';
        const params: any[] = [status];

        if (paymentStatus) {
            query += ', payment_status = ?';
            params.push(paymentStatus);
        }

        query += ' WHERE id = ?';
        params.push(orderId);

        await pool.execute(query, params);
    }
};