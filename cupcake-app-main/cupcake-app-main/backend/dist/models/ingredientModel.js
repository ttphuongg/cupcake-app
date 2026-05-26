import pool from '../config/db.js';
// 2. Định nghĩa các hàm thao tác dữ liệu
export const ingredientModel = {
    // Lấy tất cả nguyên liệu (để lấy được cả món đã hết hàng/ngừng kinh doanh)
    findAll: async () => {
        const [rows] = await pool.query('SELECT * FROM Ingredients ORDER BY type ASC');
        return rows;
    },
    // Lấy tất cả nguyên liệu đang kinh doanh (is_active = 1)
    findAllActive: async () => {
        const [rows] = await pool.query('SELECT * FROM Ingredients WHERE is_active = 1 ORDER BY type ASC');
        return rows;
    },
    // Lấy nguyên liệu theo loại (ví dụ: chỉ lấy các loại BASE hoặc TOPPING)
    findByType: async (type) => {
        const [rows] = await pool.query('SELECT * FROM Ingredients WHERE type = ? AND is_active = 1', [type]);
        return rows;
    },
    // Tìm nguyên liệu theo ID (Dùng khi tính tổng tiền hoặc kiểm tra thông tin)
    findById: async (id) => {
        const [rows] = await pool.query('SELECT * FROM Ingredients WHERE id = ?', [id]);
        const ingredients = rows;
        return ingredients.length > 0 ? ingredients[0] : null;
    },
    // Thêm nguyên liệu mới (Dùng cho trang quản trị Admin)
    create: async (data) => {
        const { name, type, price, image_url, is_active } = data;
        const [result] = await pool.execute('INSERT INTO Ingredients (name, type, price, image_url, is_active) VALUES (?, ?, ?, ?, ?)', [name, type, price, image_url ?? null, is_active]);
        return result.insertId;
    }
};
//# sourceMappingURL=ingredientModel.js.map