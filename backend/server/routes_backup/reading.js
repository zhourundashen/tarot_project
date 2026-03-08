const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../config/database');

const CREDITS_PER_READING = 20;

router.post('/create', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'] || 'guest';
        const { spreadId, question, cards } = req.body;

        if (!spreadId || !cards || cards.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: '缺少必要参数' 
            });
        }

        if (userId !== 'guest') {
            const user = await db.getOne('SELECT credits, reading_count FROM users WHERE id = ?', [userId]);
            
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: '用户不存在' 
                });
            }

            const readingCount = user.reading_count || 0;
            
            if (readingCount < 1) {
                return res.status(400).json({ 
                    success: false, 
                    message: '占卜次数不足，请先兑换',
                    needExchange: true,
                    currentCredits: user.credits,
                    readingCount: readingCount
                });
            }

            const newReadingCount = readingCount - 1;
            await db.update('users', { reading_count: newReadingCount }, 'id = ?', [userId]);

            const transactionId = uuidv4();
            await db.insert('credit_transactions', {
                id: transactionId,
                user_id: userId,
                type: 'consume',
                amount: 0,
                balance_after: user.credits,
                description: '占卜消费（消耗1次）',
                related_id: null
            });
        }

        const recordId = uuidv4();

        await db.insert('reading_records', {
            id: recordId,
            user_id: userId,
            spread_id: spreadId,
            question: question || '',
            cards: JSON.stringify(cards),
            created_at: new Date()
        });

        const updatedUser = userId !== 'guest' ? 
            await db.getOne('SELECT credits, reading_count FROM users WHERE id = ?', [userId]) : null;

        res.json({
            success: true,
            data: { 
                recordId,
                creditsUsed: 0,
                currentCredits: updatedUser?.credits || 0,
                readingCount: updatedUser?.reading_count || 0
            }
        });
    } catch (error) {
        console.error('创建占卜记录错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '创建记录失败' 
        });
    }
});

router.get('/list', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: '未登录' 
            });
        }

        const records = await db.query(
            `SELECT id, spread_id, question, cards, created_at 
             FROM reading_records 
             WHERE user_id = ? 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [userId, limit, offset]
        );

        const total = await db.getOne(
            'SELECT COUNT(*) as count FROM reading_records WHERE user_id = ?',
            [userId]
        );

        res.json({
            success: true,
            data: {
                records: records.map(r => ({
                    ...r,
                    cards: JSON.parse(r.cards)
                })),
                total: total.count,
                page,
                limit
            }
        });
    } catch (error) {
        console.error('获取占卜记录错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '获取记录失败' 
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.headers['x-user-id'];

        const record = await db.getOne(
            'SELECT * FROM reading_records WHERE id = ?',
            [id]
        );

        if (!record) {
            return res.status(404).json({ 
                success: false, 
                message: '记录不存在' 
            });
        }

        if (record.user_id !== userId && userId !== 'guest') {
            return res.status(403).json({ 
                success: false, 
                message: '无权访问' 
            });
        }

        res.json({
            success: true,
            data: {
                ...record,
                cards: JSON.parse(record.cards)
            }
        });
    } catch (error) {
        console.error('获取占卜详情错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '获取详情失败' 
        });
    }
});

module.exports = router;
