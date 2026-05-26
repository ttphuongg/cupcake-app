import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,
});

// Thêm sự kiện bắt lỗi để server không bị crash khi database ngắt kết nối
(pool as any).on('error', (err: any) => {
  console.error('❌ MySQL Pool Error:', err);
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.error('⚠️ Database connection was closed.');
  } else if (err.code === 'ER_CON_COUNT_ERROR') {
    console.error('⚠️ Database has too many connections.');
  } else if (err.code === 'ECONNREFUSED') {
    console.error('⚠️ Database connection was refused.');
  }
});

export const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ MySQL connected → ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    connection.release();
  } catch (error) {
    console.error('❌ Database Connection Failed:', error);
    process.exit(1);
  }
};

export default pool;