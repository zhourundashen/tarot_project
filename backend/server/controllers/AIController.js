/**
 * AI控制器
 * @description 处理AI相关业务逻辑
 */

const ResponseUtil = require('../utils/response');
const logger = require('../utils/logger');

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
const ZHIPU_API_URL = process.env.ZHIPU_API_URL || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const ZHIPU_MODEL = process.env.ZHIPU_MODEL || 'glm-4-flash';

class AIController {
    static async chat(req, res) {
        try {
            const { messages, stream = false } = req.body;
            
            if (!messages || !Array.isArray(messages)) {
                return res.status(400).json(
                    ResponseUtil.error('消息格式错误', 400)
                );
            }

            if (!ZHIPU_API_KEY) {
                logger.warn('AI API密钥未配置');
                return res.json(ResponseUtil.success({
                    content: '【测试模式】AI功能未配置。请在.env文件中设置ZHIPU_API_KEY。'
                }));
            }

            if (stream) {
                return await AIController.chatStream(req, res, messages);
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
                    max_tokens: 1200,
                    temperature: 0.7,
                    top_p: 0.9
                })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                logger.error('AI API调用失败:', error);
                
                // API失败时返回测试响应
                const testResponse = generateTestResponse(messages);
                return res.json(ResponseUtil.success({
                    content: testResponse
                }));
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || 
                           data.choices?.[0]?.message?.reasoning_content || 
                           '';
            
            logger.info('AI聊天成功');
            res.json(ResponseUtil.success({ content }));

        } catch (error) {
            logger.error('AI聊天错误:', error);
            res.status(500).json(
                ResponseUtil.error('AI服务异常', 500)
            );
        }
    }

    static async chatStream(req, res, messages) {
        try {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');

            const response = await fetch(ZHIPU_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ZHIPU_API_KEY}`
                },
                body: JSON.stringify({
                    model: ZHIPU_MODEL,
                    messages: messages,
                    max_tokens: 1200,
                    temperature: 0.7,
                    top_p: 0.9,
                    stream: true
                })
            });

            if (!response.ok) {
                const error = await response.json();
                logger.error('AI流式API调用失败:', error);
                res.write(`data: ${JSON.stringify({ error: 'AI服务暂时不可用' })}\n\n`);
                res.end();
                return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        
                        if (data === '[DONE]') {
                            res.write('data: [DONE]\n\n');
                            break;
                        }

                        try {
                            const json = JSON.parse(data);
                            const content = json.choices?.[0]?.delta?.content || '';
                            
                            if (content) {
                                res.write(`data: ${JSON.stringify({ content })}\n\n`);
                            }
                        } catch (e) {
                            // 忽略解析错误
                        }
                    }
                }
            }

            res.end();
            logger.info('AI流式聊天完成');

        } catch (error) {
            logger.error('AI流式聊天失败:', error);
            res.write(`data: ${JSON.stringify({ error: 'AI服务暂时不可用' })}\n\n`);
            res.end();
        }
    }

    static async recommendSpread(req, res) {
        try {
            const { question } = req.body;
            
            if (!ZHIPU_API_KEY) {
                return res.json(ResponseUtil.success({
                    spreadId: 'three-card',
                    reason: '三牌阵适合了解事情的时间线和发展趋势。'
                }));
            }

            const systemPrompt = {
                role: 'system',
                content: `你是温和、简洁的塔罗占卜师。

【人设要求】
- 语气温暖友善，像知心朋友
- 回答简洁明了，不啰嗦
- 直接给建议，不绕弯子
- 用短句，易读易懂
- 快速响应，抓住重点

可选的牌阵有（共22种）：

【基础牌阵】
1. single - 单牌指引(1张)：适合简单的是非问题或快速日常指引
2. three-card - 三牌阵(3张)：适合了解事情的时间线和发展趋势
3. three-card-choice - 抉择牌阵(3张)：适合在两个选项之间做决定
4. mind-body-spirit - 身心灵牌阵(3张)：适合探索身体、心理、精神状态

【问题解决牌阵】
5. cross - 十字牌阵(4张)：适合深入分析具体问题
6. four-elements - 四元素牌阵(4张)：适合分析生活各方面平衡
7. problem-solving - 问题解决牌阵(7张)：适合寻找问题解决方案
8. choice-detailed - 二选一详细版(5张)：适合重要决策的深入分析

【关系感情牌阵】
9. relationship - 关系牌阵(5张)：适合探索人际关系动态
10. love-pyramid - 爱情金字塔(5张)：适合深入分析双方感情
11. communication-bridge - 沟通桥梁牌阵(5张)：适合改善沟通问题

【事业财运牌阵】
12. career-development - 事业发展牌阵(7张)：适合职业发展规划
13. financial-fortune - 财运分析牌阵(9张)：适合财务状况分析

【时间运势牌阵】
14. weekly-forecast - 每周运势牌阵(7张)：适合预测一周运势
15. annual-fortune - 年度运势牌阵(12张)：适合预测一年运势

【灵性疗愈牌阵】
16. horseshoe - 马蹄牌阵(7张)：适合全面了解问题各层面
17. celtic-cross - 凯尔特十字(10张)：最全面经典牌阵，适合复杂问题
18. tree-of-life - 生命之树(10张)：适合探索精神层面和生命意义
19. chakra-energy - 脉轮能量牌阵(7张)：适合身心能量平衡
20. past-life - 过去世探索牌阵(6张)：适合探索前世今生

【月相牌阵】
21. new-moon - 新月愿望(6张)：适合设定新计划和愿望
22. full-moon - 满月启示(5张)：适合总结和反思

请根据用户问题选择最适合的牌阵。
返回JSON格式：
{"spreadId": "推荐牌阵id", "reason": "推荐理由（1-2句话，简洁明了）"}`
            };

            const userPrompt = {
                role: 'user',
                content: question || '用户没有提供具体问题，请推荐一个通用牌阵。'
            };

            const response = await fetch(ZHIPU_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${ZHIPU_API_KEY}`
                },
                body: JSON.stringify({
                    model: ZHIPU_MODEL,
                    messages: [systemPrompt, userPrompt],
                    max_tokens: 300,
                    temperature: 0.7,
                    top_p: 0.9
                })
            });

            if (!response.ok) {
                throw new Error('AI API调用失败');
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';

            let result;
            try {
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    result = JSON.parse(jsonMatch[0]);
                } else {
                    result = { spreadId: 'three-card', reason: '三牌阵适合了解事情的时间线和发展趋势。' };
                }
            } catch {
                result = { spreadId: 'three-card', reason: '推荐三牌阵' };
            }

            res.json(ResponseUtil.success(result));
        } catch (error) {
            console.error('推荐牌阵错误:', error);
            res.json(ResponseUtil.success({
                spreadId: 'three-card',
                reason: '推荐三牌阵'
            }));
        }
    }
}

// 生成测试响应（当API不可用时）
function generateTestResponse(messages) {
    const lastMessage = messages[messages.length - 1];
    const content = lastMessage?.content || '';
    
    if (content.includes('塔罗') || content.includes('占卜') || content.includes('解读')) {
        return `【测试模式】这是一个测试响应。

基于您抽取的塔罗牌，AI解读功能正在测试中。

当前API服务暂时不可用，请稍后重试或联系管理员配置AI服务。

您可以通过以下方式启用完整的AI解读功能：
1. 配置智谱AI的API Key
2. 或使用其他兼容的AI服务

感谢您的理解！`;
    }
    
    return `【测试模式】AI服务暂时不可用。

您的问题："${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"

请稍后重试或联系管理员。`;
}

module.exports = AIController;
