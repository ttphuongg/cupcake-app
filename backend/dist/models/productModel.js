import pool from '../config/db.js';
export const productModel = {
    // Lấy tất cả sản phẩm đang bán (kèm tên danh mục)
    findAllActive: async () => {
        const [rows] = await pool.query(`SELECT p.*, c.name AS category_name
             FROM Products p
             LEFT JOIN Categories c ON p.category_id = c.id
             WHERE p.is_active = 1
             ORDER BY p.created_at DESC`);
        return rows;
    },
    // Lấy sản phẩm theo danh mục
    findByCategoryId: async (categoryId) => {
        const [rows] = await pool.query('SELECT * FROM Products WHERE category_id = ? AND is_active = 1', [categoryId]);
        return rows;
    },
    // Tìm sản phẩm theo ID
    findById: async (id) => {
        const [rows] = await pool.query(`SELECT p.*, c.name AS category_name
             FROM Products p
             LEFT JOIN Categories c ON p.category_id = c.id
             WHERE p.id = ?`, [id]);
        const products = rows;
        return products.length > 0 ? products[0] : null;
    },
    // Tìm kiếm và lọc sản phẩm
    search: async (keyword, categoryId, minPrice, maxPrice) => {
        let query = `SELECT p.*, c.name AS category_name
             FROM Products p
             LEFT JOIN Categories c ON p.category_id = c.id
             WHERE p.is_active = 1`;
        const params = [];
        if (keyword) {
            query += ` AND p.name LIKE ?`;
            params.push(`%${keyword}%`);
        }
        if (categoryId) {
            query += ` AND p.category_id = ?`;
            params.push(categoryId);
        }
        if (minPrice !== undefined) {
            query += ` AND p.price >= ?`;
            params.push(minPrice);
        }
        if (maxPrice !== undefined) {
            query += ` AND p.price <= ?`;
            params.push(maxPrice);
        }
        query += ` ORDER BY p.created_at DESC`;
        const [rows] = await pool.query(query, params);
        return rows;
    },
    // Tạo sản phẩm mới
    create: async (data) => {
        const { name, price, description, stock, is_active, is_custom, category_id, image } = data;
        const [result] = await pool.execute(`INSERT INTO Products (name, price, description, stock, is_active, is_custom, category_id, image)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [name, price, description ?? null, stock ?? 0, is_active ?? 1, is_custom ?? 0, category_id ?? null, image ?? null]);
        return result.insertId;
    },
    // Cập nhật sản phẩm
    update: async (id, data) => {
        const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(data), id];
        await pool.execute(`UPDATE Products SET ${fields} WHERE id = ?`, values);
    },
};
//# sourceMappingURL=productModel.js.map