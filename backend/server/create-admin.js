const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || 'tarot_db'
    });

    const adminData = {
        id: uuidv4(),
        phone: '18129858819',
        password: await bcrypt.hash('LYXlyx664486628~', 10),
        nickname: '周润大神',
        vip_level: 2,
        credits: 9999
    };

    try {
        const [existing] = await connection.execute(
            'SELECT id FROM users WHERE phone = ?',
            [adminData.phone]
        );

        if (existing.length > 0) {
            await connection.execute(
                `UPDATE users SET nickname = ?, vip_level = ?, credits = ?, password = ? WHERE phone = ?`,
                [adminData.nickname, adminData.vip_level, adminData.credits, adminData.password, adminData.phone]
            );
            console.log('管理员账号已更新:', adminData.phone);
        } else {
            await connection.execute(
                `INSERT INTO users (id, phone, password, nickname, vip_level, credits) VALUES (?, ?, ?, ?, ?, ?)`,
                [adminData.id, adminData.phone, adminData.password, adminData.nickname, adminData.vip_level, adminData.credits]
            );
            console.log('管理员账号已创建:', adminData.phone);
        }

        console.log('昵称:', adminData.nickname);
        console.log('VIP等级:', adminData.vip_level === 2 ? '年卡会员' : '普通');
        console.log('积分:', adminData.credits);
    } catch (error) {
        console.error('错误:', error.message);
    } finally {
        await connection.end();
    }
}

createAdmin();
