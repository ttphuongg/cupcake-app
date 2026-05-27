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
    await connection.execute('ALTER TABLE Reviews MODIFY COLUMN image LONGTEXT');
    console.log('Successfully altered Reviews table: image column is now LONGTEXT');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    await connection.end();
  }
}

fix();
