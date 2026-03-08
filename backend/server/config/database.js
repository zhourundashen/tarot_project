const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tarot_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function connect() {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL连接池创建成功');
        connection.release();
        return true;
    } catch (error) {
        throw error;
    }
}

async function query(sql, params) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

async function getOne(sql, params) {
    const rows = await query(sql, params);
    return rows[0] || null;
}

async function insert(table, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = await query(sql, values);
    return result.insertId;
}

async function update(table, data, where, whereParams) {
    const sets = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), ...whereParams];
    const sql = `UPDATE ${table} SET ${sets} WHERE ${where}`;
    const result = await query(sql, values);
    return result.affectedRows;
}

module.exports = {
    pool,
    connect,
    query,
    getOne,
    insert,
    update
};
