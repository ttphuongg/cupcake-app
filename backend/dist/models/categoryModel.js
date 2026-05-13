import pool from '../config/db.js';
export const categoryModel = {
    // Lấy tất cả danh mục đang hoạt động
    findAllActive: async () => {
        const [rows] = await pool.query('SELECT * FROM Categories WHERE is_active = 1');
        return rows;
    },
    // Lấy tất cả danh mục (kể cả ẩn - dùng cho Admin)
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM Categories');
        return rows;
    },
    // Tìm danh mục theo ID
    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM Categories WHERE id = ?', [id]);
        const categories = rows;
        return categories.length > 0 ? categories[0] : null;
    },
    // Tạo danh mục mới
    create: async (data) => {
        const { name, slug, image, is_active } = data;
        const [result] = await pool.execute('INSERT INTO Categories (name, slug, image, is_active) VALUES (?, ?, ?, ?)', [name, slug ?? null, image ?? null, is_active ?? 1]);
        return result.insertId;
    },
    // Cập nhật danh mục
    update: async (id, data) => {
        const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(data), id];
        await pool.execute(`UPDATE Categories SET ${fields} WHERE id = ?`, values);
    },
};
//# sourceMappingURL=categoryModel.js.map