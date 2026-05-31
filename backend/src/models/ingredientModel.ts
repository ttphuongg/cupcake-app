import pool from '../config/db.js';

// 1. Định nghĩa Interface dựa trên cấu trúc bảng MySQL mới
export interface Ingredient {
    id?: number;
    name: string;
    type: 'SIZE' | 'SUGAR' | 'BASE' | 'FILLING' | 'FROSTING' | 'TOPPING';
    price: number; 
    image_url?: string | null;
    is_active: boolean; 
    priority: number;  
}

// 2. Định nghĩa các hàm thao tác dữ liệu
export const ingredientModel = {

    // Lấy tất cả nguyên liệu 
    findAll: async (): Promise<Ingredient[]> => {
        const [rows] = await pool.query('SELECT * FROM Ingredients ORDER BY type ASC, priority DESC');
        return rows as Ingredient[];
    },

    // Lấy tất cả nguyên liệu đang kinh doanh (Sắp xếp theo độ ưu tiên priority cao lên trước)
    findAllActive: async (): Promise<Ingredient[]> => {
        const [rows] = await pool.query(
            'SELECT * FROM Ingredients WHERE is_active = TRUE ORDER BY type ASC, priority DESC'
        );
        return rows as Ingredient[];
    },

    // Lấy nguyên liệu theo loại và ưu tiên hiển thị theo priority
    findByType: async (type: Ingredient['type']): Promise<Ingredient[]> => {
        const [rows] = await pool.query(
            'SELECT * FROM Ingredients WHERE type = ? AND is_active = TRUE ORDER BY priority DESC',
            [type]
        );
        return rows as Ingredient[];
    },

    // Tìm nguyên liệu theo ID
    findById: async (id: number): Promise<Ingredient | null> => {
        const [rows] = await pool.query(
            'SELECT * FROM Ingredients WHERE id = ?',
            [id]
        );
        const ingredients = rows as Ingredient[];
        return ingredients.length > 0 ? ingredients[0] : null;
    },

    // Thêm nguyên liệu mới 
    create: async (data: Omit<Ingredient, 'id'>): Promise<number> => {
        const { name, type, price, image_url, is_active, priority } = data;
        const [result] = await pool.execute(
            'INSERT INTO Ingredients (name, type, price, image_url, is_active, priority) VALUES (?, ?, ?, ?, ?, ?)',
            [name, type, price, image_url ?? null, is_active ?? true, priority ?? 10]
        );
        return (result as any).insertId;
    }
};
