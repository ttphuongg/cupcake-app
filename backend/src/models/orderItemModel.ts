import pool from '../config/db.js';

export interface OrderItem {
    id?: number;
    order_id: number;
    product_id?: number | null;
    product_name: string;
    quantity: number;
    price: number;
    custom_data?: any; // Lưu JSON cấu hình bánh khách đã mix
}

export const orderItemModel = {
    // Thêm nhiều món vào đơn hàng cùng lúc (Bulk Insert)
    createMany: async (items: OrderItem[]) => {
        const values = items.map(item => [
            item.order_id,
            item.product_id || null,
            item.product_name,
            item.quantity,
            item.price,
            item.custom_data ? JSON.stringify(item.custom_data) : null
        ]);

        const query = `INSERT INTO OrderItems (order_id, product_id, product_name, quantity, price, custom_data) VALUES ?`;

        // Lưu ý: mysql2 dùng [values] (mảng lồng mảng) cho lệnh INSERT nhiều dòng
        await pool.query(query, [values]);
    },

    findByOrderId: async (orderId: number): Promise<any[]> => {
        const [rows] = await pool.query(`
            SELECT oi.*, p.image as product_image
            FROM OrderItems oi
            LEFT JOIN Products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [orderId]);
        return rows as any[];
    }
};