import pool from '../config/db.js';

export interface CartItem {
    id?: number;
    cart_id: number;
    product_id?: number | null;
    custom_design_hash?: string | null;
    quantity: number;
    custom_data?: any; // JSON — lưu nguyên liệu bánh đã chọn
}

export const cartItemModel = {
    // Lấy tất cả món trong giỏ hàng
    findByCartId: async (cartId: number): Promise<CartItem[]> => {
        const [rows] = await pool.query('SELECT * FROM CartItems WHERE cart_id = ?', [cartId]);
        return rows as CartItem[];
    },

    // Tìm món tự thiết kế trùng khớp trong giỏ
    findByHashAndCart: async (cartId: number, hash: string): Promise<CartItem | null> => {
        const [rows] = await pool.query(
            'SELECT * FROM CartItems WHERE cart_id = ? AND custom_design_hash = ? AND product_id IS NULL LIMIT 1',
            [cartId, hash]
        );
        const items = rows as CartItem[];
        return items.length > 0 ? items[0] : null;
    },

    // Thêm món vào giỏ
    addItem: async (item: Omit<CartItem, 'id'>): Promise<number> => {
        const { cart_id, product_id = null, custom_design_hash = null, quantity, custom_data } = item;
        const jsonData = custom_data ? JSON.stringify(custom_data) : null;
        const [result] = await pool.execute(
            'INSERT INTO CartItems (cart_id, product_id, custom_design_hash, quantity, custom_data) VALUES (?, ?, ?, ?, ?)',
            [cart_id, product_id, custom_design_hash, quantity, jsonData]
        );
        return (result as any).insertId;
    },

    // Thêm nguyên liệu cho bánh tự thiết kế
    addIngredients: async (cartItemId: number, ingredientIds: number[]) => {
        if (ingredientIds.length === 0) return;
        const values = ingredientIds.map(id => [cartItemId, id]);
        await pool.query(
            'INSERT IGNORE INTO CartItemIngredients (cart_item_id, ingredient_id) VALUES ?',
            [values]
        );
    },

    // Xóa một món khỏi giỏ
    removeItem: async (id: number) => {
        await pool.execute('DELETE FROM CartItems WHERE id = ?', [id]);
    },

    // Cập nhật số lượng (nhấn +/- trên App)
    updateQuantity: async (id: number, quantity: number) => {
        await pool.execute('UPDATE CartItems SET quantity = ? WHERE id = ?', [quantity, id]);
    },

    // Xóa toàn bộ giỏ hàng sau khi đặt hàng
    clearCart: async (cartId: number) => {
        await pool.execute('DELETE FROM CartItems WHERE cart_id = ?', [cartId]);
    },
};

