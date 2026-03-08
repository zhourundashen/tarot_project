const express = require('express');
const router = express.Router();

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
const ZHIPU_API_URL = process.env.ZHIPU_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const ZHIPU_MODEL = process.env.ZHIPU_MODEL || 'glm-4';

router.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ 
                success: false, 
                message: '消息格式错误' 
            });
        }

        const response = await fetch(ZHIPU_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_API_KEY}`
            },
            body: JSON.stringify({
                model: ZHIPU_MODEL,
                messages: messages,
                max_tokens: 2000,
                temperature: 0.8
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('AI API错误:', error);
            return res.status(500).json({ 
                success: false, 
                message: 'AI服务暂时不可用' 
            });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        res.json({
            success: true,
            data: { content }
        });
    } catch (error) {
        console.error('AI聊天错误:', error);
        res.status(500).json({ 
            success: false, 
            message: 'AI服务调用失败' 
        });
    }
});

router.post('/recommend-spread', async (req, res) => {
    try {
        const { question } = req.body;

        const systemPrompt = {
            role: 'system',
            content: `你是专业的塔罗占卜师，根据用户问题推荐最合适的牌阵。
返回JSON格式：{"spreadId": "牌阵id", "reason": "推荐理由"}

可选牌阵：
- single: 单牌指引(1张)
- three-card: 三牌阵(3张)
- relationship: 关系牌阵(5张)
- celtic-cross: 凯尔特十字(10张)`
        };

        const response = await fetch(ZHIPU_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_API_KEY}`
            },
            body: JSON.stringify({
                model: ZHIPU_MODEL,
                messages: [
                    systemPrompt,
                    { role: 'user', content: question || '请推荐一个通用牌阵' }
                ],
                max_tokens: 500
            })
        });

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        let result;
        try {
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            result = jsonMatch ? JSON.parse(jsonMatch[0]) : { spreadId: 'three-card', reason: '推荐三牌阵' };
        } catch {
            result = { spreadId: 'three-card', reason: '推荐三牌阵' };
        }

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('推荐牌阵错误:', error);
        res.json({
            success: true,
            data: { spreadId: 'three-card', reason: '推荐三牌阵' }
        });
    }
});

module.exports = router;
