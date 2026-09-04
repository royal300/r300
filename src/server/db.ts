import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST || '93.127.206.52',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'mypass',
  database: process.env.DB_NAME || 'royal300_portfolio',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
