import pool from '../config/db.js';

export interface Category {
    id?: number;
    name: string;
    slug?: string | null;
    image?: string | null;
    is_active?: number; // TINYINT(1): 0 | 1
}

export const categoryModel = {
    // Lấy tất cả danh mục đang hoạt động
    findAllActive: async (): Promise<Category[]> => {
        const [rows] = await pool.query(
            'SELECT * FROM Categories WHERE is_active = 1'
        );
        return rows as Category[];
    },

    // Lấy tất cả danh mục (kể cả ẩn - dùng cho Admin)
    findAll: async (): Promise<Category[]> => {
        const [rows] = await pool.query('SELECT * FROM Categories');
        return rows as Category[];
    },

    // Tìm danh mục theo ID
    findById: async (id: number): Promise<Category | null> => {
        const [rows] = await pool.query('SELECT * FROM Categories WHERE id = ?', [id]);
        const categories = rows as Category[];
        return categories.length > 0 ? categories[0] : null;
    },

    // Tạo danh mục mới
    create: async (data: Omit<Category, 'id'>): Promise<number> => {
        const { name, slug, image, is_active } = data;
        const [result] = await pool.execute(
            'INSERT INTO Categories (name, slug, image, is_active) VALUES (?, ?, ?, ?)',
            [name, slug ?? null, image ?? null, is_active ?? 1]
        );
        return (result as any).insertId;
    },

    // Cập nhật danh mục
    update: async (id: number, data: Partial<Omit<Category, 'id'>>) => {
        const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(data), id];
        await pool.execute(`UPDATE Categories SET ${fields} WHERE id = ?`, values);
    },
};
