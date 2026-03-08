const express = require('express');
const router = express.Router();
const db = require('../config/database');
const jwt = require('jwt-simple');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const CREDITS_PER_SIGN = 10;
const CREDITS_PER_READING = 20;

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: '请先登录'
            });
        }
        
        const token = authHeader.substring(7);
        const decoded = jwt.decode(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: '登录已过期，请重新登录'
        });
    }
};

/**
 * @swagger
 * /api/credits/sign:
 *   post:
 *     summary: 每日签到
 *     description: 用户每日签到获得10积分，每天只能签到一次
 *     tags: [积分]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 签到成功
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
 *                         creditsEarned:
 *                           type: integer
 *                           example: 10
 *                         currentCredits:
 *                           type: integer
 *                           example: 60
 *                         totalCredits:
 *                           type: integer
 *                           example: 60
 *       400:
 *         description: 今日已签到
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 未登录
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/sign', authenticate, async (req, res) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: '请先登录'
            });
        }

        const today = new Date().toISOString().split('T')[0];

        const existingSign = await db.getOne(
            'SELECT * FROM sign_records WHERE user_id = ? AND sign_date = ?',
            [userId, today]
        );

        if (existingSign) {
            return res.status(400).json({
                success: false,
                message: '今日已签到'
            });
        }

        const user = await db.getOne('SELECT * FROM users WHERE id = ?', [userId]);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        await db.insert('sign_records', {
            user_id: userId,
            sign_date: today,
            credits_earned: CREDITS_PER_SIGN
        });

        const newCredits = user.credits + CREDITS_PER_SIGN;
        const newTotalCredits = user.total_credits + CREDITS_PER_SIGN;

        await db.update(
            'users',
            { 
                credits: newCredits,
                total_credits: newTotalCredits
            },
            'id = ?',
            [userId]
        );

        const transactionId = uuidv4();
        await db.insert('credit_transactions', {
            id: transactionId,
            user_id: userId,
            type: 'sign',
            amount: CREDITS_PER_SIGN,
            balance_after: newCredits,
            description: '每日签到',
            related_id: null
        });

        res.json({
            success: true,
            message: '签到成功',
            data: {
                creditsEarned: CREDITS_PER_SIGN,
                currentCredits: newCredits,
                totalCredits: newTotalCredits
            }
        });

    } catch (error) {
        console.error('签到失败:', error);
        res.status(500).json({
            success: false,
            message: '签到失败，请稍后重试'
        });
    }
});

/**
 * @swagger
 * /api/credits/status:
 *   get:
 *     summary: 获取积分状态
 *     description: 获取用户当前积分、累计积分、签到状态等信息
 *     tags: [积分]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
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
 *                         hasSignedToday:
 *                           type: boolean
 *                           example: false
 *                         currentCredits:
 *                           type: integer
 *                           example: 50
 *                         totalCredits:
 *                           type: integer
 *                           example: 50
 *                         creditsPerSign:
 *                           type: integer
 *                           example: 10
 *                         creditsPerReading:
 *                           type: integer
 *                           example: 20
 *       401:
 *         description: 未登录
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/status', authenticate, async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.json({
                success: true,
                data: {
                    hasSignedToday: false,
                    currentCredits: 0,
                    totalCredits: 0,
                    creditsPerSign: CREDITS_PER_SIGN,
                    creditsPerReading: CREDITS_PER_READING
                }
            });
        }

        const user = await db.getOne(
            'SELECT credits, total_credits FROM users WHERE id = ?',
            [userId]
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        const today = new Date().toISOString().split('T')[0];
        const todaySign = await db.getOne(
            'SELECT id FROM sign_records WHERE user_id = ? AND sign_date = ?',
            [userId, today]
        );

        res.json({
            success: true,
            data: {
                hasSignedToday: !!todaySign,
                currentCredits: user.credits,
                totalCredits: user.total_credits,
                creditsPerSign: CREDITS_PER_SIGN,
                creditsPerReading: CREDITS_PER_READING
            }
        });

    } catch (error) {
        console.error('获取积分状态失败:', error);
        res.status(500).json({
            success: false,
            message: '获取积分状态失败'
        });
    }
});

/**
 * @swagger
 * /api/credits/history:
 *   get:
 *     summary: 获取积分流水
 *     description: 获取用户积分变动历史记录
 *     tags: [积分]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 获取成功
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
 *                         transactions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/CreditTransaction'
 *                         pagination:
 *                           type: object
 *                           properties:
 *                             page:
 *                               type: integer
 *                             limit:
 *                               type: integer
 *                             total:
 *                               type: integer
 *                             totalPages:
 *                               type: integer
 *       401:
 *         description: 未登录
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/history', authenticate, async (req, res) => {
    try {
        const userId = req.user?.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: '请先登录'
            });
        }

        const transactions = await db.query(
            `SELECT * FROM credit_transactions 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
            [userId]
        );

        const totalResult = await db.getOne(
            'SELECT COUNT(*) as total FROM credit_transactions WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            data: {
                transactions,
                pagination: {
                    page,
                    limit,
                    total: totalResult.total,
                    totalPages: Math.ceil(totalResult.total / limit)
                }
            }
        });

    } catch (error) {
        console.error('获取积分历史失败:', error);
        res.status(500).json({
            success: false,
            message: '获取积分历史失败'
        });
    }
});

/**
 * @swagger
 * /api/credits/exchange:
 *   post:
 *     summary: 积分兑换占卜
 *     description: 使用20积分兑换1次占卜机会
 *     tags: [积分]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 兑换成功
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
 *                         creditsUsed:
 *                           type: integer
 *                           example: 20
 *                         currentCredits:
 *                           type: integer
 *                           example: 30
 *                         readingCount:
 *                           type: integer
 *                           example: 1
 *       400:
 *         description: 积分不足
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: 未登录
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/exchange', authenticate, async (req, res) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: '请先登录'
            });
        }

        const user = await db.getOne('SELECT * FROM users WHERE id = ?', [userId]);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: '用户不存在'
            });
        }

        if (user.credits < CREDITS_PER_READING) {
            return res.status(400).json({
                success: false,
                message: `积分不足，需要${CREDITS_PER_READING}积分，当前${user.credits}积分`
            });
        }

        const newCredits = user.credits - CREDITS_PER_READING;
        const newReadingCount = (user.reading_count || 0) + 1;

        await db.update(
            'users',
            { credits: newCredits, reading_count: newReadingCount },
            'id = ?',
            [userId]
        );

        const transactionId = uuidv4();
        await db.insert('credit_transactions', {
            id: transactionId,
            user_id: userId,
            type: 'exchange',
            amount: -CREDITS_PER_READING,
            balance_after: newCredits,
            description: '兑换占卜机会',
            related_id: null
        });

        res.json({
            success: true,
            message: '兑换成功',
            data: {
                creditsUsed: CREDITS_PER_READING,
                currentCredits: newCredits,
                readingCount: newReadingCount
            }
        });

    } catch (error) {
        console.error('兑换失败:', error);
        res.status(500).json({
            success: false,
            message: '兑换失败，请稍后重试'
        });
    }
});

/**
 * @swagger
 * /api/credits/check:
 *   get:
 *     summary: 检查占卜权限
 *     description: 检查用户是否有足够积分进行占卜
 *     tags: [积分]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 检查成功
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
 *                         canRead:
 *                           type: boolean
 *                           example: true
 *                         needCredits:
 *                           type: boolean
 *                           example: false
 *                         currentCredits:
 *                           type: integer
 *                           example: 50
 *                         requiredCredits:
 *                           type: integer
 *                           example: 20
 */
router.get('/check', authenticate, async (req, res) => {
    try {
        const userId = req.user?.userId;
        
        if (!userId) {
            return res.json({
                success: true,
                data: {
                    canRead: true,
                    needCredits: false,
                    currentCredits: 0
                }
            });
        }

        const user = await db.getOne('SELECT credits FROM users WHERE id = ?', [userId]);

        res.json({
            success: true,
            data: {
                canRead: user.credits >= CREDITS_PER_READING,
                needCredits: user.credits < CREDITS_PER_READING,
                currentCredits: user.credits,
                requiredCredits: CREDITS_PER_READING
            }
        });

    } catch (error) {
        console.error('检查积分失败:', error);
        res.status(500).json({
            success: false,
            message: '检查积分失败'
        });
    }
});

module.exports = router;
