import pool from '../config/db.js';

export interface Product {
    id?: number;
    name: string;
    price: number;
    description?: string | null;
    stock?: number;
    is_active?: number; // TINYINT(1): 0 | 1
    is_custom?: number; // TINYINT(1): 0 = sản phẩm thường, 1 = bánh thiết kế
    category_id?: number | null;
    image?: string | null;
    created_at?: Date;
    updated_at?: Date;
}

export const productModel = {
    // Lấy tất cả sản phẩm đang bán (kèm tên danh mục và đánh giá trung bình)
    findAllActive: async (): Promise<Product[]> => {
        const [rows] = await pool.query(
            `SELECT p.*, c.name AS category_name,
                    (SELECT AVG(rating) FROM Reviews r WHERE r.product_id = p.id) AS average_rating
             FROM Products p
             LEFT JOIN Categories c ON p.category_id = c.id
             WHERE p.is_active = 1
             ORDER BY p.created_at DESC`
        );
        return rows as Product[];
    },

    // Lấy sản phẩm theo danh mục
    findByCategoryId: async (categoryId: number): Promise<Product[]> => {
        const [rows] = await pool.query(
            'SELECT * FROM Products WHERE category_id = ? AND is_active = 1',
            [categoryId]
        );
        return rows as Product[];
    },

    // Tìm sản phẩm theo ID
    findById: async (id: number): Promise<Product | null> => {
        const [rows] = await pool.query(
            `SELECT p.*, c.name AS category_name,
                    (SELECT AVG(rating) FROM Reviews r WHERE r.product_id = p.id) AS average_rating
             FROM Products p
             LEFT JOIN Categories c ON p.category_id = c.id
             WHERE p.id = ?`,
            [id]
        );
        const products = rows as Product[];
        return products.length > 0 ? products[0] : null;
    },

    // Tìm kiếm và lọc sản phẩm (kèm đánh giá trung bình)
    search: async (keyword?: string, categoryId?: number, minPrice?: number, maxPrice?: number): Promise<Product[]> => {
        let query = `SELECT p.*, c.name AS category_name,
                            (SELECT AVG(rating) FROM Reviews r WHERE r.product_id = p.id) AS average_rating
             FROM Products p
             LEFT JOIN Categories c ON p.category_id = c.id
             WHERE p.is_active = 1`;
        const params: any[] = [];
        
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
        return rows as Product[];
    },

    // Tạo sản phẩm mới
    create: async (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<number> => {
        const { name, price, description, stock, is_active, is_custom, category_id, image } = data;
        const [result] = await pool.execute(
            `INSERT INTO Products (name, price, description, stock, is_active, is_custom, category_id, image)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, price, description ?? null, stock ?? 0, is_active ?? 1, is_custom ?? 0, category_id ?? null, image ?? null]
        );
        return (result as any).insertId;
    },

    // Cập nhật sản phẩm
    update: async (id: number, data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>) => {
        const fields = Object.keys(data).map(k => `${k} = ?`).join(', ');
        const values = [...Object.values(data), id];
        await pool.execute(`UPDATE Products SET ${fields} WHERE id = ?`, values);
    },
};
