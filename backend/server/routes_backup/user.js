const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/profile', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: '未登录' 
            });
        }

        const user = await db.getOne(
            'SELECT id, phone, nickname, avatar, vip_level, credits, created_at FROM users WHERE id = ?',
            [userId]
        );

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: '用户不存在' 
            });
        }

        res.json({
            success: true,
            data: {
                id: user.id,
                phone: user.phone,
                nickname: user.nickname,
                avatar: user.avatar,
                vipLevel: user.vip_level,
                credits: user.credits,
                createdAt: user.created_at
            }
        });
    } catch (error) {
        console.error('获取用户信息错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '获取用户信息失败' 
        });
    }
});

router.put('/profile', async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { nickname, avatar } = req.body;

        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: '未登录' 
            });
        }

        const updateData = {};
        if (nickname) updateData.nickname = nickname;
        if (avatar) updateData.avatar = avatar;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: '没有要更新的内容' 
            });
        }

        await db.update('users', updateData, 'id = ?', [userId]);

        res.json({
            success: true,
            message: '更新成功'
        });
    } catch (error) {
        console.error('更新用户信息错误:', error);
        res.status(500).json({ 
            success: false, 
            message: '更新失败' 
        });
    }
});

module.exports = router;
