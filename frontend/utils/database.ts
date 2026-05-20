import * as SQLite from 'expo-sqlite';
import { Ingredient } from '../types/ingredient';

const DB_NAME = 'cupcake.db';

// Mở kết nối đồng bộ
let db: SQLite.SQLiteDatabase | null = null;

export const initDB = () => {
  try {
    if (!db) {
      db = SQLite.openDatabaseSync(DB_NAME);
    }

    // Tạo bảng cake_design với 1 row duy nhất (id=1)
    db.execSync(`
      CREATE TABLE IF NOT EXISTS cake_design (
        id INTEGER PRIMARY KEY,
        selected_size TEXT,
        selected_base TEXT,
        selected_filling TEXT,
        selected_frosting TEXT,
        selected_sugar TEXT,
        selected_toppings TEXT,
        quantity INTEGER,
        total_price REAL
      );
    `);

    // Đảm bảo luôn có 1 row draft (id=1)
    const result = db.getFirstSync('SELECT count(*) as count FROM cake_design WHERE id = 1');
    if ((result as any).count === 0) {
      db.runSync(`
        INSERT INTO cake_design (id, quantity, total_price, selected_toppings)
        VALUES (1, 1, 0, '[]')
      `);
    }

    console.log('SQLite DB initialized');
  } catch (error) {
    console.error('Lỗi khởi tạo SQLite:', error);
  }
};

export const getDB = () => {
  if (!db) initDB();
  return db!;
};

// Các hàm Helper thao tác với Design Draft
export const loadDesignDraft = () => {
  try {
    const database = getDB();
    const row = database.getFirstSync<{
      selected_size: string | null;
      selected_base: string | null;
      selected_filling: string | null;
      selected_frosting: string | null;
      selected_sugar: string | null;
      selected_toppings: string | null;
      quantity: number;
      total_price: number;
    }>('SELECT * FROM cake_design WHERE id = 1');

    if (!row) return null;

    return {
      selectedSize: row.selected_size ? JSON.parse(row.selected_size) : null,
      selectedBase: row.selected_base ? JSON.parse(row.selected_base) : null,
      selectedFilling: row.selected_filling ? JSON.parse(row.selected_filling) : null,
      selectedFrosting: row.selected_frosting ? JSON.parse(row.selected_frosting) : null,
      selectedSugar: row.selected_sugar ? JSON.parse(row.selected_sugar) : null,
      selectedToppings: row.selected_toppings ? JSON.parse(row.selected_toppings) : [],
      quantity: row.quantity || 1,
      totalPrice: row.total_price || 0,
    };
  } catch (error) {
    console.error('Lỗi đọc draft từ SQLite:', error);
    return null;
  }
};

// Hàm cập nhật 1 cột bất kỳ
export const saveDesignColumn = (column: string, value: any) => {
  try {
    const database = getDB();

    // Nếu value là object/array thì stringify, nếu là số thì để nguyên
    let finalValue = value;
    if (value !== null && typeof value === 'object') {
      finalValue = JSON.stringify(value);
    }

    const query = `UPDATE cake_design SET ${column} = ? WHERE id = 1`;
    database.runSync(query, [finalValue]);
  } catch (error) {
    console.error(`Lỗi lưu cột ${column} vào SQLite:`, error);
  }
};

// Reset toàn bộ draft về mặc định
export const clearDesignDraft = () => {
  try {
    const database = getDB();
    database.runSync(`
      UPDATE cake_design 
      SET selected_size = NULL,
          selected_base = NULL,
          selected_filling = NULL,
          selected_frosting = NULL,
          selected_sugar = NULL,
          selected_toppings = '[]',
          quantity = 1,
          total_price = 0
      WHERE id = 1
    `);
  } catch (error) {
    console.error('Lỗi reset draft SQLite:', error);
  }
};
