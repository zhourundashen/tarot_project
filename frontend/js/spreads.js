const Spreads = {
    spreads: [
        {
            id: "single",
            name: "单牌指引",
            nameEn: "Single Card",
            cardCount: 1,
            difficulty: "初级",
            description: "最简单的牌阵，适合日常指引或快速问答",
            icon: "✦",
            positions: [
                {
                    name: "指引",
                    description: "当前的指引与建议"
                }
            ]
        },
        {
            id: "three-card",
            name: "三牌阵",
            nameEn: "Three Card Spread",
            cardCount: 3,
            difficulty: "初级",
            description: "经典的过去、现在、未来时间线牌阵",
            icon: "◇",
            positions: [
                {
                    name: "过去",
                    description: "影响当前情况的历史因素和根源"
                },
                {
                    name: "现在",
                    description: "当前的状况和你所处的位置"
                },
                {
                    name: "未来",
                    description: "根据当前趋势可能的发展方向"
                }
            ]
        },
        {
            id: "three-card-choice",
            name: "抉择牌阵",
            nameEn: "Choice Spread",
            cardCount: 3,
            difficulty: "初级",
            description: "帮助你看清选择的不同结果",
            icon: "◈",
            positions: [
                {
                    name: "选项A",
                    description: "选择A可能带来的结果"
                },
                {
                    name: "选项B",
                    description: "选择B可能带来的结果"
                },
                {
                    name: "建议",
                    description: "在决策中的建议和指引"
                }
            ]
        },
        {
            id: "cross",
            name: "十字牌阵",
            nameEn: "Cross Spread",
            cardCount: 4,
            difficulty: "中级",
            description: "简洁但深入的牌阵，适合解决具体问题",
            icon: "✚",
            positions: [
                {
                    name: "现状",
                    description: "当前面临的核心问题"
                },
                {
                    name: "阻碍",
                    description: "阻碍你前进的因素"
                },
                {
                    name: "帮助",
                    description: "可以助你一臂之力的因素"
                },
                {
                    name: "结果",
                    description: "如果继续当前道路的最终结果"
                }
            ]
        },
        {
            id: "relationship",
            name: "关系牌阵",
            nameEn: "Relationship Spread",
            cardCount: 5,
            difficulty: "中级",
            description: "探索你与他人之间的关系动态",
            icon: "♡",
            positions: [
                {
                    name: "你的立场",
                    description: "你在这段关系中的态度和感受"
                },
                {
                    name: "对方的立场",
                    description: "对方在这段关系中的态度和感受"
                },
                {
                    name: "连接",
                    description: "你们之间的纽带和共同点"
                },
                {
                    name: "挑战",
                    description: "关系中存在的障碍和问题"
                },
                {
                    name: "未来",
                    description: "这段关系可能的发展方向"
                }
            ]
        },
        {
            id: "horseshoe",
            name: "马蹄牌阵",
            nameEn: "Horseshoe Spread",
            cardCount: 7,
            difficulty: "中级",
            description: "全面分析问题的各个层面",
            icon: "☾",
            positions: [
                {
                    name: "过去",
                    description: "影响当前情况的历史事件"
                },
                {
                    name: "现在",
                    description: "当前的情况和主要问题"
                },
                {
                    name: "隐藏因素",
                    description: "你可能忽视或不知道的影响因素"
                },
                {
                    name: "阻碍",
                    description: "阻止你达成目标的障碍"
                },
                {
                    name: "环境",
                    description: "周围环境对他人的影响"
                },
                {
                    name: "希望与恐惧",
                    description: "你对结果的期望和担忧"
                },
                {
                    name: "结果",
                    description: "最可能的结果"
                }
            ]
        },
        {
            id: "celtic-cross",
            name: "凯尔特十字",
            nameEn: "Celtic Cross",
            cardCount: 10,
            difficulty: "高级",
            description: "最经典全面的塔罗牌阵，深入分析问题的各个层面",
            icon: "✙",
            positions: [
                {
                    name: "核心现状",
                    description: "当前核心问题和你所处的位置"
                },
                {
                    name: "挑战",
                    description: "你面临的主要挑战或阻碍"
                },
                {
                    name: "根源",
                    description: "问题的根源和潜意识的影响"
                },
                {
                    name: "过去",
                    description: "已经过去但仍影响现在的事件"
                },
                {
                    name: "目标",
                    description: "你意识和期望达到的目标"
                },
                {
                    name: "近期未来",
                    description: "即将发生的事件"
                },
                {
                    name: "自我",
                    description: "你对自己的看法和态度"
                },
                {
                    name: "环境",
                    description: "外界环境和他人的影响"
                },
                {
                    name: "希望与恐惧",
                    description: "你对结果的期望和担忧"
                },
                {
                    name: "最终结果",
                    description: "如果继续当前道路的最终结果"
                }
            ]
        },
        {
            id: "tree-of-life",
            name: "生命之树",
            nameEn: "Tree of Life",
            cardCount: 10,
            difficulty: "高级",
            description: "基于卡巴拉生命之树的神秘牌阵，深入探索灵魂之旅",
            icon: "🌳",
            positions: [
                {
                    name: "王冠 Kether",
                    description: "最高精神目标和生命意义"
                },
                {
                    name: "智慧 Chokmah",
                    description: "创造力和阳性能量"
                },
                {
                    name: "理解 Binah",
                    description: "直觉和阴性能量"
                },
                {
                    name: "仁慈 Chesed",
                    description: "慈悲、爱和扩展"
                },
                {
                    name: "严厉 Geburah",
                    description: "纪律、限制和净化"
                },
                {
                    name: "美丽 Tiphareth",
                    description: "和谐、平衡和自我"
                },
                {
                    name: "胜利 Netzach",
                    description: "情感、欲望和艺术"
                },
                {
                    name: "辉煌 Hod",
                    description: "智力、沟通和理性"
                },
                {
                    name: "基础 Yesod",
                    description: "潜意识、梦想和想象力"
                },
                {
                    name: "王国 Malkuth",
                    description: "物质世界和现实结果"
                }
            ]
        },
        {
            id: "new-moon",
            name: "新月愿望",
            nameEn: "New Moon Spread",
            cardCount: 6,
            difficulty: "中级",
            description: "在新月时设定意图和愿望的牌阵",
            icon: "🌑",
            positions: [
                {
                    name: "释放",
                    description: "需要放下和释放的旧模式"
                },
                {
                    name: "意图",
                    description: "这个周期你想显化的意图"
                },
                {
                    name: "行动",
                    description: "需要采取的具体行动"
                },
                {
                    name: "资源",
                    description: "可以支持你的资源和力量"
                },
                {
                    name: "祝福",
                    description: "宇宙给你的祝福和礼物"
                },
                {
                    name: "结果",
                    description: "下一个新月时的预期结果"
                }
            ]
        },
        {
            id: "full-moon",
            name: "满月启示",
            nameEn: "Full Moon Spread",
            cardCount: 5,
            difficulty: "中级",
            description: "在满月时反思和收获的牌阵",
            icon: "🌕",
            positions: [
                {
                    name: "完成",
                    description: "这个周期已经完成的事情"
                },
                {
                    name: "显现",
                    description: "正在显现的结果"
                },
                {
                    name: "隐藏",
                    description: "需要被照亮的隐藏因素"
                },
                {
                    name: "释放",
                    description: "需要释放和放下的事物"
                },
                {
                    name: "整合",
                    description: "需要整合到生活中的智慧"
                }
            ]
        },
        {
            id: "mind-body-spirit",
            name: "身心灵牌阵",
            nameEn: "Mind-Body-Spirit Spread",
            cardCount: 3,
            difficulty: "初级",
            description: "探索身体、心理和精神三个层面的状态",
            icon: "☯",
            positions: [
                {
                    name: "身体",
                    description: "身体状态和健康状况"
                },
                {
                    name: "心理",
                    description: "心理状态和情绪状况"
                },
                {
                    name: "灵性",
                    description: "精神层面和灵性成长"
                }
            ]
        },
        {
            id: "four-elements",
            name: "四元素牌阵",
            nameEn: "Four Elements Spread",
            cardCount: 4,
            difficulty: "中级",
            description: "分析生活中火水风土四个元素的平衡状态",
            icon: "◇",
            positions: [
                {
                    name: "火·行动",
                    description: "激情、行动力和能量状态"
                },
                {
                    name: "水·情感",
                    description: "情感、直觉和关系状态"
                },
                {
                    name: "风·思想",
                    description: "思维、沟通和智慧状态"
                },
                {
                    name: "土·物质",
                    description: "物质、稳定和务实状态"
                }
            ]
        },
        {
            id: "love-pyramid",
            name: "爱情金字塔",
            nameEn: "Love Pyramid Spread",
            cardCount: 5,
            difficulty: "中级",
            description: "深入分析双方情感关系现状和发展",
            icon: "△",
            positions: [
                {
                    name: "你的感受",
                    description: "你对对方的真实感受"
                },
                {
                    name: "对方感受",
                    description: "对方对你的感受"
                },
                {
                    name: "关系现状",
                    description: "双方关系当前的状态"
                },
                {
                    name: "未来发展",
                    description: "关系的未来走向"
                },
                {
                    name: "潜在挑战",
                    description: "可能面临的挑战和障碍"
                }
            ]
        },
        {
            id: "choice-detailed",
            name: "二选一详细版",
            nameEn: "Detailed Choice Spread",
            cardCount: 5,
            difficulty: "中级",
            description: "帮助在两个重要选项间做出明智决定",
            icon: "⚖",
            positions: [
                {
                    name: "当前状况",
                    description: "你现在的处境和背景"
                },
                {
                    name: "选项A现状",
                    description: "选择A的当前情况"
                },
                {
                    name: "选项A结果",
                    description: "选择A的最终结果"
                },
                {
                    name: "选项B现状",
                    description: "选择B的当前情况"
                },
                {
                    name: "选项B结果",
                    description: "选择B的最终结果"
                }
            ]
        },
        {
            id: "career-development",
            name: "事业发展牌阵",
            nameEn: "Career Development Spread",
            cardCount: 7,
            difficulty: "中级",
            description: "全面分析职业发展状况和前景",
            icon: "📈",
            positions: [
                {
                    name: "当前状态",
                    description: "目前的职业状况"
                },
                {
                    name: "核心技能",
                    description: "你的职业优势和技能"
                },
                {
                    name: "工作环境",
                    description: "工作环境和人际关系"
                },
                {
                    name: "面临挑战",
                    description: "职业发展中的障碍"
                },
                {
                    name: "晋升机会",
                    description: "可能的发展机会"
                },
                {
                    name: "发展路径",
                    description: "职业发展的建议方向"
                },
                {
                    name: "长期目标",
                    description: "职业的长期发展方向"
                }
            ]
        },
        {
            id: "problem-solving",
            name: "问题解决牌阵",
            nameEn: "Problem-Solving Spread",
            cardCount: 7,
            difficulty: "中级",
            description: "从多角度分析问题并寻找解决方案",
            icon: "🔍",
            positions: [
                {
                    name: "问题本质",
                    description: "问题的核心是什么"
                },
                {
                    name: "根本原因",
                    description: "问题产生的深层原因"
                },
                {
                    name: "现状分析",
                    description: "当前的情况评估"
                },
                {
                    name: "方案一",
                    description: "第一个可能的解决方案"
                },
                {
                    name: "方案二",
                    description: "第二个可能的解决方案"
                },
                {
                    name: "最佳选择",
                    description: "建议采取的最佳方案"
                },
                {
                    name: "预期结果",
                    description: "实施后的预期效果"
                }
            ]
        },
        {
            id: "weekly-forecast",
            name: "每周运势牌阵",
            nameEn: "Weekly Forecast Spread",
            cardCount: 7,
            difficulty: "初级",
            description: "预测一周七天的运势发展",
            icon: "📅",
            positions: [
                {
                    name: "周一",
                    description: "周一的运势和注意事项"
                },
                {
                    name: "周二",
                    description: "周二的运势和注意事项"
                },
                {
                    name: "周三",
                    description: "周三的运势和注意事项"
                },
                {
                    name: "周四",
                    description: "周四的运势和注意事项"
                },
                {
                    name: "周五",
                    description: "周五的运势和注意事项"
                },
                {
                    name: "周六",
                    description: "周六的运势和注意事项"
                },
                {
                    name: "周日",
                    description: "周日的运势和注意事项"
                }
            ]
        },
        {
            id: "chakra-energy",
            name: "脉轮能量牌阵",
            nameEn: "Chakra Energy Spread",
            cardCount: 7,
            difficulty: "高级",
            description: "检查七个脉轮的能量状态，促进身心平衡",
            icon: "🔮",
            positions: [
                {
                    name: "根轮·生存",
                    description: "海底轮：安全感、生存本能"
                },
                {
                    name: "腹轮·情感",
                    description: "生殖轮：情感、创造力"
                },
                {
                    name: "脐轮·力量",
                    description: "太阳神经丛：个人力量、意志"
                },
                {
                    name: "心轮·爱",
                    description: "心轮：爱、关系、同理心"
                },
                {
                    name: "喉轮·表达",
                    description: "喉轮：沟通、自我表达"
                },
                {
                    name: "眉心轮·直觉",
                    description: "第三眼：直觉、洞察力"
                },
                {
                    name: "顶轮·灵性",
                    description: "顶轮：灵性连接、高层意识"
                }
            ]
        },
        {
            id: "communication-bridge",
            name: "沟通桥梁牌阵",
            nameEn: "Communication Bridge Spread",
            cardCount: 5,
            difficulty: "中级",
            description: "改善与他人沟通，理解彼此的想法",
            icon: "🌉",
            positions: [
                {
                    name: "你的意图",
                    description: "你想要表达的真实意图"
                },
                {
                    name: "表达方式",
                    description: "你当前的沟通方式"
                },
                {
                    name: "对方理解",
                    description: "对方实际接收到的信息"
                },
                {
                    name: "沟通障碍",
                    description: "阻碍有效沟通的因素"
                },
                {
                    name: "改善建议",
                    description: "如何改善沟通效果"
                }
            ]
        },
        {
            id: "financial-fortune",
            name: "财运分析牌阵",
            nameEn: "Financial Fortune Spread",
            cardCount: 9,
            difficulty: "高级",
            description: "全面分析财务状况和财运走向",
            icon: "💰",
            positions: [
                {
                    name: "收入状况",
                    description: "当前的收入来源和状态"
                },
                {
                    name: "支出模式",
                    description: "消费习惯和支出方向"
                },
                {
                    name: "储蓄情况",
                    description: "储蓄能力和现状"
                },
                {
                    name: "投资机会",
                    description: "可能的投资方向"
                },
                {
                    name: "风险因素",
                    description: "财务方面的潜在风险"
                },
                {
                    name: "财务规划",
                    description: "建议的财务规划方向"
                },
                {
                    name: "长期目标",
                    description: "长期财务目标"
                },
                {
                    name: "财务挑战",
                    description: "需要克服的财务障碍"
                },
                {
                    name: "财富建议",
                    description: "改善财运的建议"
                }
            ]
        },
        {
            id: "annual-fortune",
            name: "年度运势牌阵",
            nameEn: "Annual Fortune Spread",
            cardCount: 12,
            difficulty: "高级",
            description: "预测未来十二个月的运势走向",
            icon: "🌟",
            positions: [
                {
                    name: "第1月",
                    description: "第一个月的运势"
                },
                {
                    name: "第2月",
                    description: "第二个月的运势"
                },
                {
                    name: "第3月",
                    description: "第三个月的运势"
                },
                {
                    name: "第4月",
                    description: "第四个月的运势"
                },
                {
                    name: "第5月",
                    description: "第五个月的运势"
                },
                {
                    name: "第6月",
                    description: "第六个月的运势"
                },
                {
                    name: "第7月",
                    description: "第七个月的运势"
                },
                {
                    name: "第8月",
                    description: "第八个月的运势"
                },
                {
                    name: "第9月",
                    description: "第九个月的运势"
                },
                {
                    name: "第10月",
                    description: "第十个月的运势"
                },
                {
                    name: "第11月",
                    description: "第十一个月的运势"
                },
                {
                    name: "第12月",
                    description: "第十二个月的运势"
                }
            ]
        },
        {
            id: "past-life",
            name: "过去世探索牌阵",
            nameEn: "Past Life Spread",
            cardCount: 6,
            difficulty: "高级",
            description: "探索前世今生，了解灵魂旅程",
            icon: "🌀",
            positions: [
                {
                    name: "前世身份",
                    description: "前世的主要身份或角色"
                },
                {
                    name: "前世经历",
                    description: "前世的重要经历"
                },
                {
                    name: "未竟之事",
                    description: "前世未完成的事情"
                },
                {
                    name: "带来天赋",
                    description: "从前世带来的天赋和能力"
                },
                {
                    name: "今生课题",
                    description: "今生需要学习的课题"
                },
                {
                    name: "灵性指引",
                    description: "灵魂层面的指引"
                }
            ]
        }
    ],

    getSpreadById(id) {
        return this.spreads.find(s => s.id === id);
    },

    getSpreadsByDifficulty(difficulty) {
        return this.spreads.filter(s => s.difficulty === difficulty);
    },

    getAllSpreads() {
        return this.spreads;
    },

    getPositionInterpretation(card, position, isReversed) {
        const baseMeaning = isReversed ? card.reversed : card.upright;
        return `【${position.name}】\n${position.description}\n\n${card.name}${isReversed ? '（逆位）' : '（正位）'}\n${baseMeaning}`;
    },

    generateInterpretation(cards, spread) {
        let interpretation = `<div class="interpretation-header">
            <h3>${spread.name}解读</h3>
            <p class="spread-desc">${spread.description}</p>
        </div>`;

        interpretation += '<div class="card-interpretations">';
        
        cards.forEach((item, index) => {
            const position = spread.positions[index];
            const card = item.card;
            const isReversed = item.reversed;
            
            interpretation += `
                <div class="card-meaning" data-position="${index}">
                    <div class="position-header">
                        <span class="position-num">${index + 1}</span>
                        <span class="position-name">${position.name}</span>
                    </div>
                    <div class="card-title ${isReversed ? 'reversed' : ''}">
                        ${card.name}${isReversed ? ' 逆位' : ''}
                        ${card.isMinor ? `<span class="card-suit">· ${card.suit}</span>` : ''}
                    </div>
                    <p class="position-desc">${position.description}</p>
                    <p class="card-meaning-text">${isReversed ? card.reversed : card.upright}</p>
                    ${card.keywords ? `<div class="keywords">${card.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}</div>` : ''}
                </div>
            `;
        });

        interpretation += '</div>';

        interpretation += `
            <div class="reading-summary">
                <h4>整体解读</h4>
                <p class="summary-text">${this.generateSummary(cards, spread)}</p>
            </div>
        `;

        return interpretation;
    },

    generateSummary(cards, spread) {
        const majorCards = cards.filter(c => !c.card.isMinor);
        const reversedCards = cards.filter(c => c.reversed);
        const minorCards = cards.filter(c => c.card.isMinor);
        
        let summary = "";
        let themes = [];
        
        if (majorCards.length > 0) {
            const majorNames = majorCards.map(c => c.card.name).join('、');
            summary += `<p class="summary-paragraph"><span class="summary-highlight">大阿卡纳牌：</span>${majorNames}`;
            if (majorCards.length >= 3) {
                summary += "。这些大牌的出现表明有重要的命运主题在运作，这是一个具有深远意义的时刻。";
                themes.push("命运转折");
            } else {
                summary += "。大阿卡纳的出现提示有重要的精神层面需要关注。";
                themes.push("精神成长");
            }
            summary += "</p>";
        }
        
        const elements = {};
        const suits = {};
        cards.forEach(c => {
            const el = c.card.element;
            const suit = c.card.suit;
            elements[el] = (elements[el] || 0) + 1;
            if (suit) {
                suits[suit] = (suits[suit] || 0) + 1;
            }
        });

        const elementMeanings = {
            '火': { name: '火元素', desc: '代表行动、激情、创造力和意志力', advice: '现在是采取行动的时刻，追随你的热情，勇敢地追求目标' },
            '水': { name: '水元素', desc: '代表情感、直觉、关系和潜意识', advice: '倾听你的内心，关注情感需求，相信直觉的指引' },
            '风': { name: '风元素', desc: '代表思想、沟通、智慧和真理', advice: '运用理性的思维，清晰地表达，寻求知识和理解' },
            '地': { name: '地元素', desc: '代表物质、财富、稳定和实际', advice: '脚踏实地，关注物质层面的需求，建立稳固的基础' }
        };

        const dominantElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0];
        if (dominantElement && dominantElement[1] > 0) {
            const elInfo = elementMeanings[dominantElement[0]];
            if (elInfo) {
                summary += `<p class="summary-paragraph"><span class="summary-highlight">主导元素：</span>${elInfo.name}（${dominantElement[1]}张）${elInfo.desc}。<span class="summary-advice">建议：${elInfo.advice}。</span></p>`;
                themes.push(elInfo.name);
            }
        }

        if (Object.keys(suits).length > 0) {
            const suitNames = Object.entries(suits)
                .sort((a, b) => b[1] - a[1])
                .map(([suit, count]) => `${suit}${count}张`)
                .join('、');
            summary += `<p class="summary-paragraph"><span class="summary-highlight">牌组分布：</span>${suitNames}。</p>`;
        }
        
        const reversedRatio = reversedCards.length / cards.length;
        if (reversedCards.length > 0) {
            summary += `<p class="summary-paragraph"><span class="summary-highlight">逆位牌：</span>${reversedCards.length}张`;
            if (reversedRatio > 0.5) {
                summary += "。大量逆位牌提示内在存在阻碍和需要面对的阴影面，建议深入反思，释放限制性信念。";
                themes.push("内在探索");
            } else if (reversedRatio > 0.3) {
                summary += "。部分逆位牌表明某些领域存在延迟或挑战，需要调整期望并保持耐心。";
                themes.push("耐心等待");
            } else {
                summary += "。少量逆位牌是正常现象，它们为解读增添了深度和细微差别。";
            }
            summary += "</p>";
        } else {
            summary += `<p class="summary-paragraph"><span class="summary-highlight">牌面状态：</span>所有牌都是正位，能量流动顺畅，方向明确，这是一个积极的信号。</p>`;
            themes.push("顺畅发展");
        }

        let overallAdvice = "";
        if (themes.includes("命运转折")) {
            overallAdvice = "命运正在为你展开新的篇章，保持开放的心态，接受即将到来的变化。";
        } else if (themes.includes("内在探索")) {
            overallAdvice = "现在是一个向内探索的时刻，面对内心的阴影将带来深刻的转变。";
        } else if (themes.includes("火元素")) {
            overallAdvice = "点燃你内心的火焰，勇敢地迈向目标，现在是行动的最佳时机。";
        } else if (themes.includes("水元素")) {
            overallAdvice = "让情感自由流动，相信直觉的智慧，爱的能量正在围绕着你。";
        } else if (themes.includes("顺畅发展")) {
            overallAdvice = "道路已经铺就，继续前行，保持积极的心态，成功就在前方。";
        } else {
            overallAdvice = "相信命运的安排，每张牌都在为你指引方向，保持觉察和感恩之心。";
        }
        
        summary += `<p class="summary-paragraph summary-final"><span class="summary-highlight">整体建议：</span>${overallAdvice}</p>`;
        
        summary += `<div class="summary-themes">`;
        themes.forEach(theme => {
            summary += `<span class="theme-tag">${theme}</span>`;
        });
        summary += `</div>`;

        return summary;
    }
};
