const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 用户注册
 *     description: 注册新用户账号，成功后自动获得50积分
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 description: 手机号（11位）
 *                 example: "13800138000"
 *               password:
 *                 type: string
 *                 description: 密码（6-20位）
 *                 example: "password123"
 *               nickname:
 *                 type: string
 *                 description: 昵称（选填）
 *                 example: "塔罗爱好者"
 *     responses:
 *       200:
 *         description: 注册成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           description: JWT认证token
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       400:
 *         description: 参数错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', async (req, res) => {
    try {
        const { phone, password, nickname } = req.body;
        
        if (!phone || !password) {
            return res.status(400).json({ 
                success: false, 
                message: '手机号和密码不能为空' 
            });
        }

        const existingUser = await db.getOne(
            'SELECT id FROM users WHERE phone = ?',
            [phone]
        );

        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: '该手机号已注册' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = uuidv4();

        await db.insert('users', {
            id: userId,
            phone,
            password: hashedPassword,
            nickname: nickname || `用户${phone.slice(-4)}`,
            credits: 50,
            total_credits: 50,
            created_at: new Date()
        });

        const token = jwt.encode({ userId, phone }, JWT_SECRET);

        res.json({
            success: true,
            message: '注册成功',
            data: {
                token,
                user: {
                    id: userId,
                    phone,
                    nickname: nickname || `用户${phone.slice(-4)}`,
                    credits: 50
                }
            }
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '注册失败，请稍后重试' 
        });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 用户登录
 *     description: 使用手机号和密码登录账号
 *     tags: [认证]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *                 description: 手机号
 *                 example: "13800138000"
 *               password:
 *                 type: string
 *                 description: 密码
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           description: JWT认证token
 *                         user:
 *                           $ref: '#/components/schemas/User'
 *       400:
 *         description: 参数错误或密码错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        if (!phone || !password) {
            return res.status(400).json({ 
                success: false, 
                message: '手机号和密码不能为空' 
            });
        }

        const user = await db.getOne(
            'SELECT * FROM users WHERE phone = ?',
            [phone]
        );

        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: '用户不存在' 
            });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return res.status(400).json({ 
                success: false, 
                message: '密码错误' 
            });
        }

        const token = jwt.encode({ userId: user.id, phone }, JWT_SECRET);

        res.json({
            success: true,
            message: '登录成功',
            data: {
                token,
                user: {
                    id: user.id,
                    phone: user.phone,
                    nickname: user.nickname,
                    avatar: user.avatar,
                    vipLevel: user.vip_level,
                    credits: user.credits,
                    readingCount: user.reading_count || 0
                }
            }
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '登录失败，请稍后重试' 
        });
    }
});

/**
 * @swagger
 * /api/auth/guest:
 *   post:
 *     summary: 游客登录
 *     description: 无需注册，以游客身份体验系统功能
 *     tags: [认证]
 *     responses:
 *       200:
 *         description: 游客登录成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Success'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         token:
 *                           type: string
 *                           description: 游客token
 *                         isGuest:
 *                           type: boolean
 *                           example: true
 *       500:
 *         description: 服务器错误
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/guest', async (req, res) => {
    try {
        const guestId = `guest_${uuidv4().replace(/-/g, '')}`;
        const token = jwt.encode({ guestId }, JWT_SECRET);

        res.json({
            success: true,
            data: {
                token,
                isGuest: true
            }
        });
    } catch (error) {
        console.error('游客登录错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '游客登录失败' 
        });
    }
});

module.exports = router;
