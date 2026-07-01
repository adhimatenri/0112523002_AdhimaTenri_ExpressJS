// backend/src/config/database.ts

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

console.log('📊 Database Config:');
console.log('  Host:', process.env.DB_HOST);
console.log('  Port:', process.env.DB_PORT);
console.log('  User:', process.env.DB_USER);
console.log('  Database:', process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'express_crud',
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test connection
pool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully!');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    console.log('💡 Pastikan:');
    console.log('  1. MySQL berjalan');
    console.log('  2. .env sudah benar');
    console.log('  3. Database sudah dibuat');
  });

export default pool;