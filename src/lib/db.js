import mysql from 'mysql2/promise';

let pool;

function getPool() {
  if (!pool) {
    pool = mysql.createPool(process.env.DATABASE_URL);
  }
  return pool;
}

export async function query(sql, params = []) {
  const conn = getPool();
  const [rows] = await conn.execute(sql, params);
  return rows;
}
