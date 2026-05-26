import pool from '../config/db.js';
// 2. Định nghĩa các hàm thao tác dữ liệu
export const ingredientModel = {
    // Lấy tất cả nguyên liệu 
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM Ingredients ORDER BY type ASC, priority DESC');
        return rows;
    },
    // Lấy tất cả nguyên liệu đang kinh doanh (Sắp xếp theo độ ưu tiên priority cao lên trước)
    findAllActive: async () => {
        const [rows] = await pool.query('SELECT * FROM Ingredients WHERE is_active = TRUE ORDER BY type ASC, priority DESC');
        return rows;
    },
    // Lấy nguyên liệu theo loại và ưu tiên hiển thị theo priority
    findByType: async (type) => {
        const [rows] = await pool.query('SELECT * FROM Ingredients WHERE type = ? AND is_active = TRUE ORDER BY priority DESC', [type]);
        return rows;
    },
    // Tìm nguyên liệu theo ID
    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM Ingredients WHERE id = ?', [id]);
        const ingredients = rows;
        return ingredients.length > 0 ? ingredients[0] : null;
    },
    // Thêm nguyên liệu mới 
    create: async (data) => {
        const { name, type, price, image_url, is_active, priority } = data;
        const [result] = await pool.execute('INSERT INTO Ingredients (name, type, price, image_url, is_active, priority) VALUES (?, ?, ?, ?, ?, ?)', [name, type, price, image_url ?? null, is_active ?? true, priority ?? 10]);
        return result.insertId;
    }
};
//# sourceMappingURL=ingredientModel.js.map