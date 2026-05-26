import pool from '../config/db.js';
export const cartItemModel = {
    // Lấy tất cả món trong giỏ hàng
    findByCartId: async (cartId) => {
        const [rows] = await pool.query('SELECT * FROM CartItems WHERE cart_id = ?', [cartId]);
        return rows;
    },
    // Tìm món tự thiết kế trùng khớp trong giỏ
    findByHashAndCart: async (cartId, hash) => {
        const [rows] = await pool.query('SELECT * FROM CartItems WHERE cart_id = ? AND custom_design_hash = ? AND product_id IS NULL LIMIT 1', [cartId, hash]);
        const items = rows;
        return items.length > 0 ? items[0] : null;
    },
    // Thêm món vào giỏ
    addItem: async (item) => {
        const { cart_id, product_id = null, custom_design_hash = null, quantity, custom_data } = item;
        const jsonData = custom_data ? JSON.stringify(custom_data) : null;
        const [result] = await pool.execute('INSERT INTO CartItems (cart_id, product_id, custom_design_hash, quantity, custom_data) VALUES (?, ?, ?, ?, ?)', [cart_id, product_id, custom_design_hash, quantity, jsonData]);
        return result.insertId;
    },
    // Thêm nguyên liệu cho bánh tự thiết kế
    addIngredients: async (cartItemId, ingredientIds) => {
        if (ingredientIds.length === 0)
            return;
        const values = ingredientIds.map(id => [cartItemId, id]);
        await pool.query('INSERT IGNORE INTO CartItemIngredients (cart_item_id, ingredient_id) VALUES ?', [values]);
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