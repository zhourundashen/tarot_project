/**
 * AI 智能知识库系统
 * @description 让 AI 智能选择和使用塔罗知识库
 */
const TarotKnowledge = {
    index: null,
    loadedSources: {},
    cardCache: {},
    indexLoaded: false,
    loadingPromises: {},
    
    async init() {
        if (this.indexLoaded) return this.index;
        
        try {
            const response = await fetch('/data/knowledge/index.json');
            this.index = await response.json();
            this.indexLoaded = true;
            console.log('✅ 知识库索引加载成功');
        } catch (error) {
            console.error('❌ 知识库索引加载失败:', error.message);
            this.indexLoaded = true;
        }
        
        return this.index;
    },

    resolveCardName(cardName) {
        if (!this.index) return cardName;
        if (this.index.cards[cardName]) return cardName;
        if (this.index.aliases && this.index.aliases[cardName]) {
            return this.index.aliases[cardName];
        }
        for (const [name, info] of Object.entries(this.index.cards)) {
            if (cardName.includes(name) || name.includes(cardName)) {
                return name;
            }
        }
        return cardName;
    },

    async loadSource(sourceId) {
        if (this.loadedSources[sourceId]) {
            return this.loadedSources[sourceId];
        }
        if (this.loadingPromises[sourceId]) {
            return this.loadingPromises[sourceId];
        }
        if (!this.index || !this.index.sources[sourceId]) {
            return null;
        }
        
        this.loadingPromises[sourceId] = new Promise(async (resolve, reject) => {
            try {
                const sourceInfo = this.index.sources[sourceId];
                const filePath = sourceInfo.file.startsWith('/') ? sourceInfo.file : `/data/${sourceInfo.file}`;
                const response = await fetch(filePath);
                const data = await response.json();
                this.loadedSources[sourceId] = data;
                delete this.loadingPromises[sourceId];
                resolve(data);
            } catch (error) {
                console.error(`知识库源加载失败 (${sourceId}):`, error.message);
                delete this.loadingPromises[sourceId];
                resolve(null);
            }
        });
        
        return this.loadingPromises[sourceId];
    },

    async getCardKnowledge(cardName) {
        const resolvedName = this.resolveCardName(cardName);
        
        if (this.cardCache[resolvedName] || this.cardCache[cardName]) {
            return this.cardCache[resolvedName] || this.cardCache[cardName];
        }
        
        if (!this.index || !this.index.cards[resolvedName]) {
            return null;
        }
        
        const cardIndex = this.index.cards[resolvedName];
        const source = await this.loadSource(cardIndex.source);
        
        if (!source) return null;
        
        let cardData = null;
        
        if (cardIndex.type === 'major') {
            cardData = source.majorArcana?.find(c => c.id === cardIndex.id);
            if (!cardData) {
                cardData = source.majorArcana?.find(c => 
                    c.name === cardName || 
                    c.name === resolvedName ||
                    cardName.includes(c.name) || 
                    c.name.includes(cardName)
                );
            }
        } else if (cardIndex.type === 'minor' && cardIndex.suit) {
            cardData = source.minorArcana?.[cardIndex.suit]?.cards?.find(c => c.id === cardIndex.id);
        }
        
        if (cardData) {
            this.cardCache[resolvedName] = cardData;
            this.cardCache[cardName] = cardData;
        }
        
        return cardData;
    },

    /**
     * 构建AI知识库上下文（智能版）
     * @description 提供完整的知识库信息，让AI自己决定如何使用
     */
    async buildAIKnowledgeContext(cards, userQuestion = '') {
        console.log('📚 开始构建AI知识库上下文...');
        const startTime = Date.now();
        
        const knowledgeArray = [];
        
        // 并行加载所有牌的知识
        const loadPromises = cards.map(async (item, index) => {
            try {
                const knowledge = await this.getCardKnowledge(item.card.name);
                if (!knowledge) return null;
                
                // 构建完整的知识库对象（供AI选择使用）
                const cardKnowledge = {
                    牌名: item.card.name,
                    位置: index + 1,
                    状态: item.reversed ? '逆位' : '正位',
                    
                    // 基础信息
                    关键词: knowledge.keywords || [],
                    元素: knowledge.element || item.card.element || '未知',
                    
                    // 核心含义（根据正逆位）
                    核心含义: this.extractCoreMeaning(knowledge, item.reversed),
                    
                    // 深层含义（可选，AI可以选择使用）
                    深层含义: this.extractDeepMeaning(knowledge, item.reversed),
                    
                    // 原型（可选）
                    原型: knowledge.archetype || null,
                    
                    // 心理层面（可选）
                    心理暗示: knowledge.psychological || null,
                    
                    // 实用建议（可选）
                    实用建议: knowledge.practical_advice || null
                };
                
                return cardKnowledge;
            } catch (error) {
                console.warn(`加载 ${item.card.name} 知识失败:`, error.message);
                return null;
            }
        });
        
        const results = await Promise.all(loadPromises);
        const validKnowledge = results.filter(k => k !== null);
        
        const elapsed = Date.now() - startTime;
        console.log(`✅ 知识库构建完成，耗时 ${elapsed}ms，加载了 ${validKnowledge.length}/${cards.length} 张牌`);
        
        return validKnowledge;
    },

    /**
     * 提取核心含义（简洁版）
     */
    extractCoreMeaning(knowledge, reversed) {
        if (reversed && knowledge.reversed) {
            if (typeof knowledge.reversed === 'string') {
                return knowledge.reversed.substring(0, 100);
            }
            return knowledge.reversed.general || knowledge.reversed.negative || '';
        } else if (!reversed && knowledge.upright) {
            if (typeof knowledge.upright === 'string') {
                return knowledge.upright.substring(0, 100);
            }
            return knowledge.upright.general || '';
        }
        return '';
    },

    /**
     * 提取深层含义（详细版）
     */
    extractDeepMeaning(knowledge, reversed) {
        const deep = {};
        
        if (reversed && knowledge.reversed && typeof knowledge.reversed === 'object') {
            if (knowledge.reversed.positive) deep.积极面 = knowledge.reversed.positive;
            if (knowledge.reversed.negative) deep.警示 = knowledge.reversed.negative;
            if (knowledge.reversed.advice) deep.建议 = knowledge.reversed.advice;
        } else if (!reversed && knowledge.upright && typeof knowledge.upright === 'object') {
            if (knowledge.upright.general) deep.整体 = knowledge.upright.general;
            if (knowledge.upright.career) deep.事业 = knowledge.upright.career;
            if (knowledge.upright.love) deep.感情 = knowledge.upright.love;
        }
        
        return Object.keys(deep).length > 0 ? deep : null;
    },

    /**
     * 构建给AI的完整Prompt（智能版）
     */
    async buildSmartPrompt(userQuestion, spread, cards) {
        // 加载知识库
        const knowledgeArray = await this.buildAIKnowledgeContext(cards, userQuestion);
        
        const cardList = cards.map((item, i) => {
            const pos = spread.positions[i];
            const status = item.reversed ? '逆位' : '正位';
            return `${i + 1}. 【${pos.name}】${item.card.name}（${status}）`;
        }).join('\n');

        const isLargeSpread = cards.length >= 7;
        const cardWordCount = isLargeSpread ? '40-60字' : '80-120字';

        // 将知识库转换为JSON字符串（供AI解析）
        const knowledgeJSON = JSON.stringify(knowledgeArray, null, 2);

        return `【用户占卜请求】
问题：${userQuestion || '无具体问题'}
牌阵：${spread.name}（${spread.cardCount}张牌）

【抽到的牌】
${cardList}

【塔罗知识库】
以下是本次占卜涉及的塔罗牌的专业知识库，请根据用户问题智能选择和使用：

${knowledgeJSON}

【AI占卜师指南】
你是一位专业的塔罗占卜师，拥有丰富的塔罗知识。现在你有：
1. 用户的问题和牌面信息
2. 专业的塔罗知识库（包含每张牌的关键词、核心含义、深层含义、原型等）

【你的任务】
根据用户问题，从知识库中选择最相关的信息，结合牌面位置和相互关系，给出深度解读。

【使用知识库的建议】
- 选择与用户问题最相关的关键词和含义
- 可以使用深层含义增加解读深度
- 参考原型和心理学暗示，但不要生硬
- 将专业知识转化为易懂的语言
- 每张牌解读${cardWordCount}

【输出格式】
${cards.map((item, i) => {
    const pos = spread.positions[i];
    return `${i + 1}. 【${pos.name}】${item.card.name}
[结合知识库的深度解读，${cardWordCount}]`;
}).join('\n\n')}

【综合指引】
📍 核心启示：融合多张牌的知识库智慧，一句话总结
🎯 明确建议：基于知识库的专业建议，告诉用户具体怎么做
💪 面对态度：结合原型和象征，建议以怎样的心态面对

【语调要求】
专业但温暖，有深度但易懂，像一位智慧的导师。`;
    },

    isLoaded() {
        return this.indexLoaded;
    },

    getLoadedSources() {
        return Object.keys(this.loadedSources);
    },
    
    getCacheStats() {
        return {
            indexLoaded: this.indexLoaded,
            sourcesLoaded: Object.keys(this.loadedSources).length,
            cardsCached: Object.keys(this.cardCache).length
        };
    }
};

window.TarotKnowledge = TarotKnowledge;
