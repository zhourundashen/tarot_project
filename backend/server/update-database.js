require('dotenv').config();
const db = require('./config/database');

async function updateDatabase() {
    try {
        console.log('正在连接数据库...');
        await db.connect();
        console.log('数据库连接成功');

        console.log('更新users表...');
        
        try {
            await db.query(`
                ALTER TABLE users 
                ADD COLUMN total_credits INT DEFAULT 50 COMMENT '累计获得积分'
            `);
            console.log('添加total_credits字段成功');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('total_credits字段已存在');
            } else {
                throw err;
            }
        }
        
        try {
            await db.query(`
                ALTER TABLE users 
                MODIFY COLUMN credits INT DEFAULT 50 COMMENT '当前积分'
            `);
        } catch (err) {
            console.log('修改credits字段失败（可忽略）:', err.message);
        }

        console.log('创建sign_records表...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS sign_records (
                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                user_id VARCHAR(64) NOT NULL,
                sign_date DATE NOT NULL COMMENT '签到日期',
                credits_earned INT DEFAULT 10 COMMENT '获得积分',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY uk_user_date (user_id, sign_date),
                INDEX idx_user_id (user_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log('创建credit_transactions表...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS credit_transactions (
                id VARCHAR(64) PRIMARY KEY,
                user_id VARCHAR(64) NOT NULL,
                type VARCHAR(20) NOT NULL COMMENT 'sign/consume/gift/exchange',
                amount INT NOT NULL COMMENT '正数增加，负数减少',
                balance_after INT NOT NULL COMMENT '操作后余额',
                description VARCHAR(255),
                related_id VARCHAR(64) COMMENT '关联ID',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user_id (user_id),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        `);

        console.log('更新reading_records表...');
        try {
            await db.query(`
                ALTER TABLE reading_records 
                ADD COLUMN credits_used INT DEFAULT 20 COMMENT '消耗积分'
            `);
        } catch (err) {
            if (err.code !== 'ER_DUP_FIELDNAME') {
                throw err;
            }
            console.log('credits_used字段已存在');
        }

        console.log('✅ 数据库更新成功！');
        
        const tables = await db.query('SHOW TABLES');
        console.log('当前数据表:', tables);
        
        process.exit(0);
    } catch (error) {
        console.error('数据库更新失败:', error);
        process.exit(1);
    }
}

updateDatabase();
