const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function fix() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'cupcake_shop',
  });

  console.log('Connected to DB');
  
  try {
    await connection.execute('ALTER TABLE Reviews ADD COLUMN order_id INT NULL');
    console.log('Successfully altered Reviews table: added order_id column');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column order_id already exists.');
    } else {
      console.error('Error altering table:', err);
    }
  } finally {
    await connection.end();
  }
}

fix();
