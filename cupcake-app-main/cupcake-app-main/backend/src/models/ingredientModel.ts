import pool from '../config/db.js';

// 1. Định nghĩa Interface dựa trên cấu trúc bảng MySQL
export interface Ingredient {
    id?: number;
    name: string;
    type: 'SIZE' | 'SUGAR' | 'BASE' | 'FILLING' | 'FROSTING' | 'TOPPING';
    price: number;
    image_url?: string | null;
    is_active: number; // Trong MySQL TINYINT(1) trả về 0 hoặc 1
    priority?: number | null;
}

// 2. Định nghĩa các hàm thao tác dữ liệu
export const ingredientModel = {

    // Lấy tất cả nguyên liệu (để lấy được cả món đã hết hàng/ngừng kinh doanh)
    findAll: async (): Promise<Ingredient[]> => {
        const [rows] = await pool.query('SELECT * FROM Ingredients ORDER BY type ASC');
        return rows as Ingredient[];
    },

    // Lấy tất cả nguyên liệu đang kinh doanh (is_active = 1)
    findAllActive: async (): Promise<Ingredient[]> => {
        const [rows] = await pool.query(
            'SELECT * FROM Ingredients WHERE is_active = 1 ORDER BY type ASC'
        );
        return rows as Ingredient[];
    },

    // Lấy nguyên liệu theo loại (ví dụ: chỉ lấy các loại BASE hoặc TOPPING)
    findByType: async (type: Ingredient['type']): Promise<Ingredient[]> => {
        const [rows] = await pool.query(
            'SELECT * FROM Ingredients WHERE type = ? AND is_active = 1',
            [type]
        );
        return rows as Ingredient[];
    },

    // Tìm nguyên liệu theo ID (Dùng khi tính tổng tiền hoặc kiểm tra thông tin)
    findById: async (id: number): Promise<Ingredient | null> => {
        const [rows] = await pool.query(
            'SELECT * FROM Ingredients WHERE id = ?',
            [id]
        );
        const ingredients = rows as Ingredient[];
        return ingredients.length > 0 ? ingredients[0] : null;
    },

    // Thêm nguyên liệu mới (Dùng cho trang quản trị Admin)
    create: async (data: Omit<Ingredient, 'id'>): Promise<number> => {
        const { name, type, price, image_url, is_active } = data;
        const [result] = await pool.execute(
            'INSERT INTO Ingredients (name, type, price, image_url, is_active) VALUES (?, ?, ?, ?, ?)',
            [name, type, price, image_url ?? null, is_active]
        );
        return (result as any).insertId;
    }
};