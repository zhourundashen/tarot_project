require('dotenv').config();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('./config/database');

async function createTestUser() {
    try {
        console.log('正在连接数据库...');
        await db.connect();
        console.log('数据库连接成功');

        const phone = '18025362889';
        const password = 'LYXlyx664486628~';
        const nickname = '测试用户';

        const existingUser = await db.getOne(
            'SELECT id FROM users WHERE phone = ?',
            [phone]
        );

        if (existingUser) {
            console.log('该手机号已存在，用户ID:', existingUser.id);
            
            await db.update(
                'users',
                { 
                    credits: 50,
                    total_credits: 50
                },
                'id = ?',
                [existingUser.id]
            );
            
            console.log('已为用户重置积分为50');
            
            const user = await db.getOne(
                'SELECT id, phone, nickname, credits, total_credits FROM users WHERE id = ?',
                [existingUser.id]
            );
            
            console.log('用户信息:', user);
            process.exit(0);
        }

        console.log('创建新用户...');
        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        await db.insert('users', {
            id: userId,
            phone,
            password: hashedPassword,
            nickname,
            credits: 50,
            total_credits: 50,
            created_at: new Date()
        });

        console.log('✅ 用户创建成功！');
        console.log('----------------------------');
        console.log('手机号:', phone);
        console.log('密码:', password);
        console.log('昵称:', nickname);
        console.log('初始积分: 50');
        console.log('用户ID:', userId);
        console.log('----------------------------');

        process.exit(0);
    } catch (error) {
        console.error('创建用户失败:', error);
        process.exit(1);
    }
}

createTestUser();
