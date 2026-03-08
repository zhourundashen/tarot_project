const TarotAI = {
    spreadKeywords: {
        'single': {
            keywords: ['是吗', '对吗', '好吗', '可以吗', '应该', '要不要', '简单', '快速', '一句话', '今天', '现在'],
            description: '适合简单的是非问题或快速日常指引'
        },
        'three-card': {
            keywords: ['趋势', '发展', '未来', '时间', '过去', '现在', '过程', '变化', '情况', '状况'],
            description: '适合了解事情的时间线和发展趋势'
        },
        'three-card-choice': {
            keywords: ['选择', '抉择', '两个', '选项', '决定', '还是', 'A还是B', '对比', '比较'],
            description: '适合在两个选项之间做决定'
        },
        'cross': {
            keywords: ['问题', '困难', '障碍', '阻碍', '解决', '怎么办', '如何', '突破', '挑战'],
            description: '适合深入分析具体问题和寻找解决方案'
        },
        'relationship': {
            keywords: ['感情', '关系', '恋爱', '爱情', '他', '她', 'TA', '我们', '对方', '暧昧', '复合', '分手', '在一起', '喜欢'],
            description: '适合探索人际关系的动态和发展'
        },
        'horseshoe': {
            keywords: ['全面', '详细', '完整', '整体', '多方面', '综合', '全貌'],
            description: '适合全面了解问题的各个层面'
        },
        'celtic-cross': {
            keywords: ['深入', '复杂', '重大', '人生', '命运', '转折', '全面分析', '详细解读', '最重要'],
            description: '最全面的经典牌阵，适合复杂重要的问题'
        },
        'tree-of-life': {
            keywords: ['灵魂', '精神', '灵性', '成长', '意义', '使命', '生命', '卡巴拉'],
            description: '适合探索精神层面和生命意义'
        },
        'new-moon': {
            keywords: ['新月', '开始', '启动', '计划', '愿望', '设定', '新的', '起步'],
            description: '适合在新月时期设定意图和愿望'
        },
        'full-moon': {
            keywords: ['满月', '完成', '结束', '收获', '成果', '圆满', '总结'],
            description: '适合在满月时期反思和收获'
        },
        'mind-body-spirit': {
            keywords: ['身心', '身体', '心理', '精神', '健康', '状态', '平衡', '能量', '疗愈自己'],
            description: '适合探索身体、心理和精神三个层面的状态'
        },
        'four-elements': {
            keywords: ['元素', '平衡', '火水风土', '生活状态', '整体状况', '四元素', '全面分析自己'],
            description: '适合分析生活中四个基本元素的平衡状态'
        },
        'love-pyramid': {
            keywords: ['恋爱', '爱情发展', '感情走向', '暗恋', '表白', '双向', '彼此', '心意', '深入感情'],
            description: '适合深入分析双方情感关系现状和发展'
        },
        'choice-detailed': {
            keywords: ['重要选择', '艰难决定', '两个选项', '职业选择', '人生选择', '抉择困难', '二选一详细'],
            description: '适合在两个重要选项间做出明智决定'
        },
        'career-development': {
            keywords: ['事业', '工作', '职业', '晋升', '跳槽', '职场', '工作发展', '事业前景', '加薪', '老板', '同事'],
            description: '适合全面分析职业发展状况和前景'
        },
        'problem-solving': {
            keywords: ['解决', '方案', '办法', '出路', '困境', '难题', '困住', '如何解决', '找到答案'],
            description: '适合从多角度分析问题并寻找解决方案'
        },
        'weekly-forecast': {
            keywords: ['一周', '本周', '这周', '七天', '周运', '下周', '每周'],
            description: '适合预测一周七天的运势发展'
        },
        'chakra-energy': {
            keywords: ['脉轮', '能量', '疗愈', '身心健康', '气场', '能量中心', '身体能量', '七个脉轮'],
            description: '适合检查七个脉轮的能量状态，促进身心平衡'
        },
        'communication-bridge': {
            keywords: ['沟通', '交流', '说话', '表达', '误解', '吵架', '和好', '改善关系', '说服'],
            description: '适合改善与他人沟通，理解彼此的想法'
        },
        'financial-fortune': {
            keywords: ['财运', '钱', '财富', '投资', '理财', '收入', '金钱', '存款', '财务', '经济'],
            description: '适合全面分析财务状况和财运走向'
        },
        'annual-fortune': {
            keywords: ['一年', '年度', '整年', '十二个月', '年运', '明年', '今年', '年度规划'],
            description: '适合预测未来十二个月的运势走向'
        },
        'past-life': {
            keywords: ['前世', '轮回', '业力', '灵魂旅程', '前世今生', '灵魂', '宿命'],
            description: '适合探索前世今生，了解灵魂旅程'
        }
    },

    analyzeQuestionLocally(userQuestion) {
        if (!userQuestion || userQuestion.trim() === '') {
            return {
                spreadId: 'three-card',
                reason: '您没有提供具体问题，我为您推荐经典的三牌阵，可以帮助您了解当前情况的发展趋势。'
            };
        }

        const question = userQuestion.toLowerCase();
        let bestMatch = { spreadId: 'three-card', score: 0, reason: '' };

        for (const [spreadId, config] of Object.entries(this.spreadKeywords)) {
            let score = 0;
            for (const keyword of config.keywords) {
                if (question.includes(keyword.toLowerCase())) {
                    score += 1;
                }
            }
            if (score > bestMatch.score) {
                bestMatch = {
                    spreadId: spreadId,
                    score: score,
                    reason: config.description
                };
            }
        }

        if (bestMatch.score === 0) {
            return {
                spreadId: 'three-card',
                reason: '根据您的问题，我推荐使用经典的三牌阵，它可以帮助您从过去、现在、未来三个维度来理解当前的情况。'
            };
        }

        const spreadNames = {
            'single': '单牌指引',
            'three-card': '三牌阵',
            'three-card-choice': '抉择牌阵',
            'cross': '十字牌阵',
            'relationship': '关系牌阵',
            'horseshoe': '马蹄牌阵',
            'celtic-cross': '凯尔特十字',
            'tree-of-life': '生命之树',
            'new-moon': '新月愿望',
            'full-moon': '满月启示',
            'mind-body-spirit': '身心灵牌阵',
            'four-elements': '四元素牌阵',
            'love-pyramid': '爱情金字塔',
            'choice-detailed': '二选一详细版',
            'career-development': '事业发展牌阵',
            'problem-solving': '问题解决牌阵',
            'weekly-forecast': '每周运势牌阵',
            'chakra-energy': '脉轮能量牌阵',
            'communication-bridge': '沟通桥梁牌阵',
            'financial-fortune': '财运分析牌阵',
            'annual-fortune': '年度运势牌阵',
            'past-life': '过去世探索牌阵'
        };

        return {
            spreadId: bestMatch.spreadId,
            reason: `根据您的问题「${userQuestion}」，我推荐使用【${spreadNames[bestMatch.spreadId]}】。${bestMatch.reason}。`
        };
    },

    async recommendSpread(userQuestion) {
        const localResult = this.analyzeQuestionLocally(userQuestion);
        
        if (!CONFIG.apiKey || CONFIG.apiKey === 'YOUR_API_KEY_HERE') {
            return localResult;
        }

        try {
            const systemPrompt = {
                role: 'system',
                content: `你是专业的塔罗占卜师，擅长根据用户的问题推荐最合适的牌阵。

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

请根据用户问题的内容、复杂度和情感深度，选择最适合的牌阵。
返回JSON格式：
{"spreadId": "推荐牌阵id", "reason": "推荐理由（用第二人称，温暖专业的语气，2-3句话）"}`
            };

            const userPrompt = {
                role: 'user',
                content: userQuestion || '用户没有提供具体问题，请推荐一个通用牌阵。'
            };

            const response = await this.chat([systemPrompt, userPrompt]);
            
            try {
                const jsonMatch = response.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const result = JSON.parse(jsonMatch[0]);
                    if (result.spreadId && result.reason) {
                        return result;
                    }
                }
            } catch (e) {
                console.log('JSON解析失败，使用本地分析结果');
            }
            
            return localResult;
        } catch (error) {
            console.log('AI推荐失败，使用本地分析结果:', error);
            return localResult;
        }
    },

    async chat(messages) {
        console.log('=== TarotAI.chat 开始 ===');
        console.log('消息数量:', messages?.length);
        
        if (CONFIG.aiEnabled === false) {
            console.warn('AI已禁用，返回模拟数据');
            return this.getMockResponse(messages);
        }
        
        if (!messages || !Array.isArray(messages)) {
            throw new Error('消息格式错误：messages必须为数组');
        }
        
        if (CONFIG.useBackend) {
            console.log('使用后端代理模式');
            console.log('后端地址:', CONFIG.backendUrl);
            
            try {
                const url = `${CONFIG.backendUrl}/api/ai/chat`;
                console.log('请求URL:', url);
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ messages, stream: false })
                });
                
                console.log('HTTP状态码:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('后端错误响应:', errorText);
                    throw new Error(`后端API失败 (${response.status}): ${errorText.substring(0, 100)}`);
                }
                
                const data = await response.json();
                console.log('后端响应数据:', data);
                
                if (!data.success) {
                    throw new Error(data.message || 'AI调用失败');
                }
                
                const content = data.data?.content || '';
                console.log('=== TarotAI.chat 成功 (后端) ===');
                console.log('响应长度:', content.length);
                
                return content;
                
            } catch (error) {
                console.error('后端调用失败:', error);
                
                // 降级：直接调用智谱API
                if (CONFIG.apiKey && CONFIG.apiUrl) {
                    console.warn('尝试直接调用API（降级模式）');
                    return await this.chatDirect(messages);
                } else {
                    console.error('无法降级：API Key未配置');
                    throw error;
                }
            }
        }
        
        // 直接调用API
        console.log('直接调用API模式');
        
        let response;
        
        if (CONFIG.provider === 'zhipu') {
            response = await fetch(CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.apiKey}`
                },
                body: JSON.stringify({
                    model: CONFIG.model,
                    messages: messages,
                    max_tokens: 1200,
                    temperature: 0.7,
                    top_p: 0.9
                })
            });
        } else {
            response = await fetch(CONFIG.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${CONFIG.apiKey}`
                },
                body: JSON.stringify({
                    model: CONFIG.model,
                    input: { messages: messages },
                    parameters: { 
                        result_format: 'message',
                        max_tokens: 1200,
                        temperature: 0.7,
                        top_p: 0.9
                    }
                })
            });
        }

        const data = await response.json();
        
        if (data.error) {
            console.error('API错误:', data.error);
            throw new Error(data.error.message || 'API调用失败');
        }
        if (data.code) {
            console.error('API错误码:', data.code, data.message);
            throw new Error(data.message || 'API调用失败');
        }
        
        const content = data.choices?.[0]?.message?.content || data.output?.text || '';
        console.log('=== TarotAI.chat 成功 (直接API) ===');
        console.log('响应长度:', content.length);
        
        return content;
    },

    async buildInitialPrompt(userQuestion, spread, cards) {
        // 使用智能知识库系统
        if (typeof TarotKnowledge !== 'undefined' && TarotKnowledge.isLoaded()) {
            console.log('📚 使用智能知识库系统构建Prompt...');
            try {
                return await TarotKnowledge.buildSmartPrompt(userQuestion, spread, cards);
            } catch (error) {
                console.warn('智能知识库系统失败，使用基础Prompt:', error.message);
            }
        }
        
        // 降级：基础Prompt（无知识库）
        const cardList = cards.map((item, i) => {
            const pos = spread.positions[i];
            const status = item.reversed ? '逆位' : '正位';
            return `${i + 1}. 【${pos.name}】${item.card.name}（${status}）`;
        }).join('\n');

        const isLargeSpread = cards.length >= 7;
        const cardWordCount = isLargeSpread ? '40-60字' : '60-80字';

        return `用户问题：${userQuestion || '无具体问题'}

牌阵：${spread.name}

抽到的牌：
${cardList}

【要求】每张牌${cardWordCount}，简洁有力，直接说重点。

【格式】
${cards.map((item, i) => {
    const pos = spread.positions[i];
    return `${i + 1}. 【${pos.name}】${item.card.name}\n[解读]`;
}).join('\n\n')}

【最终指引】
📍 核心启示：一句话
🎯 明确建议：${userQuestion && (userQuestion.includes('该不该') || userQuestion.includes('要不要') || userQuestion.includes('应该') || userQuestion.includes('选择')) ? 
'直接回答，不模棱两可' : 
'告诉用户怎么做'}
💪 面对态度：简短建议

语调：温暖、直接、有力量。`;
    },

    buildFollowUpPrompt(question, cards) {
        return `用户追问：${question}

之前的牌：
${cards.map((item, i) => `${i + 1}. ${item.card.name}（${item.reversed ? '逆位' : '正位'}）`).join('\n')}

【回答要求】
- 直接回答问题，不绕弯子
- 简洁明了，50-100字
- 如有行动建议，列出具体步骤
- 语气温暖友善`;
    },

    buildSummaryPrompt(userQuestion, spread, cards, conversationHistory) {
        const cardList = cards.map((item, i) => {
            const pos = spread.positions[i];
            const status = item.reversed ? '逆位' : '正位';
            return `${i + 1}. 【${pos.name}】${item.card.name}（${status}）`;
        }).join('\n');

        const historyText = conversationHistory && conversationHistory.length > 0 
            ? conversationHistory.slice(-10).map(m => 
                `${m.role === 'ai' ? '塔罗师' : '用户'}：${m.content}`
            ).join('\n') 
            : '无追问记录';

        // ✅ 修改为简洁格式，适合聊天侧栏显示
        return `请根据以下占卜信息，生成一份简洁、温暖、有深度的总结。

【占卜背景】
用户问题： ${userQuestion || '未提供'}
牌阵： ${spread.name}（${spread.cardCount}张牌）

【牌面信息】
${cardList}

【对话历史】
${historyText}

【总结要求】
请用简洁、温暖的语言，生成一份完整的占卜总结。要求：

1. 整体趋势： 用1-2句话概括牌面的整体感觉
2. 问题解答: 针对用户问题，用3-4句话给出明确解答
3. 行动建议: 列出3-4条具体可执行的步骤
4. 温暖寄语: 用2-3句温暖的话鼓励用户

【格式要求】
- 使用简洁的标题，如"整体趋势"、"问题解答"、"行动建议"、"温暖寄语"
- 不要使用长分隔线（如══════）
- 内容要有深度但易懂
- 语气温暖友善，像朋友聊天
- 总字数300-500字`;
    },

    async getFollowUpReading(question, cards, conversationHistory) {
        const systemPrompt = {
            role: 'system',
            content: `你是一位温和、简洁的塔罗占卜师。
【人设要求】
- 语气温暖友善，像知心朋友
- 回答简洁明了，不啰嗦
- 直接给建议，不绕弯子
- 用短句，易读易懂
- 快速响应，抓住重点
- 记住之前的对话内容`
        };
        const userPrompt = {
            role: 'user',
            content: this.buildFollowUpPrompt(question, cards)
        };
        return await this.chat([systemPrompt, userPrompt]);
    },

    async getSummary(userQuestion, spread, cards, conversationHistory) {
        const systemPrompt = {
            role: 'system',
            content: `你是一位温和、简洁的塔罗占卜师。
【人设要求】
- 语气温暖友善，像知心朋友
- 回答简洁明了，不啰嗦
- 直接给建议，不绕弯子
- 用短句，易读易懂
- 快速响应，抓住重点
- 擅长总结和提炼关键信息`
        };
        const userPrompt = {
            role: 'user',
            content: this.buildSummaryPrompt(userQuestion, spread, cards, conversationHistory)
        };
        return await this.chat([systemPrompt, userPrompt]);
    },

    async chatWithContext(message, userQuestion, spread, cards, chatHistory) {
        console.log('=== TarotAI.chatWithContext 开始 ===');
        console.log('参数检查:', {
            message: message?.substring(0, 50),
            userQuestion: userQuestion?.substring(0, 50),
            spread: spread?.name,
            cardsCount: cards?.length,
            historyLength: chatHistory?.length
        });
        
        // 参数验证
        if (!message || typeof message !== 'string') {
            throw new Error('消息内容无效');
        }
        
        // 安全地处理chatHistory
        const safeChatHistory = Array.isArray(chatHistory) ? chatHistory : [];
        const historyContext = safeChatHistory.slice(-10).map(m => 
            `${m.role === 'ai' ? '塔罗师' : '用户'}：${m.content}`
        ).join('\n');
        
        // 安全地处理cards
        const safeCards = Array.isArray(cards) ? cards : [];
        const cardsInfo = safeCards.length > 0 
            ? safeCards.map((item, i) => `${i + 1}. ${item?.card?.name || '未知'}${item?.reversed ? '（逆位）' : ''}`).join('\n')
            : '尚未抽牌';
        
        // 安全地处理spread
        const spreadName = spread?.name || '未选择';
        
        const systemPrompt = {
            role: 'system',
            content: `你是一位温和、简洁的塔罗占卜师助手。

【人设要求】
- 语气温暖友善，像知心朋友
- 回答简洁明了，不啰嗦
- 直接给建议，不绕弯子
- 用短句，易读易懂
- 快速响应，抓住重点

当前占卜信息：
- 用户问题：${userQuestion || '未提供'}
- 牌阵：${spreadName}
- 牌面：
${cardsInfo}

对话历史：
${historyContext}

请根据用户的问题和当前占卜状态，给出有帮助的回应。保持回复简洁（50-100字）。`
        };
        
        const userPrompt = {
            role: 'user',
            content: message
        };
        
        console.log('调用 this.chat()...');
        
        try {
            const response = await this.chat([systemPrompt, userPrompt]);
            console.log('=== TarotAI.chatWithContext 成功 ===');
            console.log('响应长度:', response?.length);
            return response;
        } catch (error) {
            console.error('=== TarotAI.chatWithContext 失败 ===');
            console.error('错误:', error);
            throw error;
        }
    },

    async explainSpreadChoice(userQuestion, spread) {
        const systemPrompt = {
            role: 'system',
            content: `你是一位温和、简洁的塔罗占卜师。
【人设要求】
- 语气温暖友善，像知心朋友
- 回答简洁明了，不啰嗦
- 直接给建议，不绕弯子
- 用短句，易读易懂
- 快速响应，抓住重点`
        };
        
        const userPrompt = {
            role: 'user',
            content: `用户问题：「${userQuestion || '未提供具体问题'}」
我选择了「${spread.name}」牌阵（${spread.description}，${spread.cardCount}张牌）

请简洁解释为什么这个牌阵适合（2-3句话）。`
        };
        
        return await this.chat([systemPrompt, userPrompt]);
    },
    
    async explainCardCount() {
        const systemPrompt = {
            role: 'system',
            content: `你是一位温和、简洁的塔罗占卜师。
【人设要求】
- 语气温暖友善，像知心朋友
- 回答简洁明了，不啰嗦
- 直接给建议，不绕弯子
- 用短句，易读易懂
- 快速响应，抓住重点`
        };
        
        const userPrompt = {
            role: 'user',
            content: `为什么塔罗牌是78张？

请简洁说明（2-3句话）：
1. 塔罗牌的历史起源
2. 78张牌的结构（大阿卡纳和小阿卡纳）
3. 这个数字的神秘学意义`
        };
        
        return await this.chat([systemPrompt, userPrompt]);
    },

    extractScores(response) {
        // 已移除JSON示例，AI不再返回JSON数据
        return null;
    },

    getLayoutBySpreadType(spreadId) {
        const layoutMap = {
            'three-card': {
                charts: ['radar', 'line', 'pie'],
                positions: ['top', 'bottom-left', 'bottom-right'],
                emphasis: 'career'
            },
            'three-card-choice': {
                charts: ['compare', 'radar', 'bar'],
                positions: ['top', 'bottom-left', 'bottom-right'],
                emphasis: 'career'
            },
            'choice-detailed': {
                charts: ['compare', 'bar', 'radar', 'energy'],
                positions: ['top', 'middle', 'bottom-left', 'bottom-right'],
                emphasis: 'career'
            },
            'relationship': {
                charts: ['relation', 'radar', 'energy'],
                positions: ['top', 'bottom-left', 'bottom-right'],
                emphasis: 'love'
            },
            'love-pyramid': {
                charts: ['relation', 'radar', 'gauge'],
                positions: ['top', 'bottom-left', 'bottom-right'],
                emphasis: 'love'
            },
            'chakra-energy': {
                charts: ['chakra', 'energy', 'gauge'],
                positions: ['top', 'bottom-left', 'bottom-right'],
                emphasis: 'health'
            },
            'financial-fortune': {
                charts: ['bar', 'pie', 'gauge', 'progress'],
                positions: ['top', 'middle', 'bottom-left', 'bottom-right'],
                emphasis: 'wealth'
            },
            'career-development': {
                charts: ['radar', 'line', 'progress', 'bar'],
                positions: ['top', 'middle', 'bottom-left', 'bottom-right'],
                emphasis: 'career'
            },
            'weekly-forecast': {
                charts: ['timeline', 'radar', 'energy'],
                positions: ['top', 'bottom-left', 'bottom-right'],
                emphasis: 'career'
            },
            'annual-fortune': {
                charts: ['timeline', 'radar', 'bar'],
                positions: ['top', 'bottom-left', 'bottom-right'],
                emphasis: 'wealth'
            },
            'mind-body-spirit': {
                charts: ['radar', 'energy', 'gauge'],
                positions: ['top', 'bottom-left', 'bottom-right'],
                emphasis: 'health'
            },
            'four-elements': {
                charts: ['pie', 'energy', 'radar'],
                positions: ['top', 'bottom-left', 'bottom-right'],
                emphasis: 'health'
            },
            'celtic-cross': {
                charts: ['radar', 'bar', 'line', 'pie'],
                positions: ['top', 'middle', 'bottom-left', 'bottom-right'],
                emphasis: 'career'
            },
            'horseshoe': {
                charts: ['radar', 'bar', 'pie', 'line'],
                positions: ['top', 'middle', 'bottom-left', 'bottom-right'],
                emphasis: 'career'
            },
            'single': {
                charts: ['gauge', 'radar'],
                positions: ['left', 'right'],
                emphasis: 'career'
            }
        };
        
        return layoutMap[spreadId] || {
            charts: ['radar', 'pie', 'line'],
            positions: ['top', 'bottom-left', 'bottom-right'],
            emphasis: 'career'
        };
    },

    cleanResponseForDisplay(response) {
        if (!response) return response;
        
        let cleaned = response.replace(/```json\s*[\s\S]*?```\s*/g, '');
        cleaned = cleaned.replace(/【数据评分】[\s\S]*?(?=\n\n|$)/g, '');
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
        cleaned = cleaned.trim();
        
        return cleaned;
    },

    getMockResponse(messages) {
        const lastMessage = messages[messages.length - 1];
        const content = lastMessage?.content || '';
        
        if (content.includes('推荐') || content.includes('牌阵')) {
            return JSON.stringify({
                spreadId: 'three-card',
                reason: '三牌阵适合了解事情的时间线和发展趋势，能够帮助你更清晰地看清过去、现在和未来的走向。'
            });
        }
        
        if (content.includes('解读') || content.includes('塔罗') || content.includes('牌')) {
            return `【测试模式 - AI已禁用】

这是一段模拟的塔罗解读内容。

**第一张牌**：代表过去的影响和基础。
这张牌显示了你在这件事情上的起点和已经经历的过程。

**第二张牌**：代表现在的状态。
当前的局面和你的心理状态正在这个位置上呈现。

**第三张牌**：代表未来的趋势。
这张牌预示着事情可能的发展方向。

【最终指引】
请相信自己的直觉，塔罗牌是帮助你思考的工具，真正的答案在你心中。

【数据评分】
\`\`\`json
{
  "scores": {
    "love": 75,
    "career": 70,
    "wealth": 65,
    "health": 80,
    "study": 60
  },
  "trend": [60, 70, 80],
  "elements": {
    "fire": 25,
    "water": 30,
    "air": 20,
    "earth": 25
  },
  "layout": {
    "charts": ["radar", "pie", "line"],
    "positions": ["top", "bottom-left", "bottom-right"],
    "emphasis": "career"
  }
}
\`\`\`

---
*提示：当前为测试模式，请在 config.js 中设置 aiEnabled: true 以启用真实的 AI 解读。*`;
        }
        
        return `【测试模式】AI功能已禁用。如需启用，请在 config.js 中设置 aiEnabled: true`;
    }
};
