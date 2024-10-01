import mysql from "mysql2/promise";

export async function query(sql: string, params: any[]) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  try {
    const [results] = await connection.execute(sql, params);
    return results;
  } finally {
    connection.end();
  }
}
