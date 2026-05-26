import pool from '../config/db.js';
export const cartItemModel = {
    // Lấy tất cả món trong giỏ hàng
    findByCartId: async (cartId) => {
        const [rows] = await pool.query('SELECT * FROM CartItems WHERE cart_id = ?', [cartId]);
        return rows;
    },
    // Thêm món vào giỏ
    addItem: async (item) => {
        const { cart_id, product_id = null, quantity, custom_data } = item;
        const jsonData = custom_data ? JSON.stringify(custom_data) : null;
        const [result] = await pool.execute('INSERT INTO CartItems (cart_id, product_id, quantity, custom_data) VALUES (?, ?, ?, ?)', [cart_id, product_id, quantity, jsonData]);
        return result.insertId;
    },
    // Xóa một món khỏi giỏ
    removeItem: async (id) => {
        await pool.execute('DELETE FROM CartItems WHERE id = ?', [id]);
    },
    // Cập nhật số lượng (nhấn +/- trên App)
    updateQuantity: async (id, quantity) => {
        await pool.execute('UPDATE CartItems SET quantity = ? WHERE id = ?', [quantity, id]);
    },
    // Xóa toàn bộ giỏ hàng sau khi đặt hàng
    clearCart: async (cartId) => {
        await pool.execute('DELETE FROM CartItems WHERE cart_id = ?', [cartId]);
    },
};
//# sourceMappingURL=cartItemModel.js.map