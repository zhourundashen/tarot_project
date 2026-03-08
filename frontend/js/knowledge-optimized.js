/**
 * 知识库按需加载器 - 优化版
 * @description 智能加载塔罗牌知识库，按需加载、缓存优化
 */
const TarotKnowledge = {
    index: null,
    loadedSources: {},
    cardCache: {},
    indexLoaded: false,
    
    // 新增：加载状态追踪
    loadingPromises: {},
    
    async init() {
        if (this.indexLoaded) return this.index;
        
        try {
            const response = await fetch('/data/knowledge/index.json');
            this.index = await response.json();
            this.indexLoaded = true;
            console.log('✅ 知识库索引加载成功，共', Object.keys(this.index.cards).length, '张牌');
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
        // 如果已加载，直接返回
        if (this.loadedSources[sourceId]) {
            return this.loadedSources[sourceId];
        }
        
        // 如果正在加载，返回同一个 Promise（避免重复加载）
        if (this.loadingPromises[sourceId]) {
            return this.loadingPromises[sourceId];
        }
        
        if (!this.index || !this.index.sources[sourceId]) {
            return null;
        }
        
        // 创建加载 Promise
        this.loadingPromises[sourceId] = new Promise(async (resolve, reject) => {
            try {
                const sourceInfo = this.index.sources[sourceId];
                const filePath = sourceInfo.file.startsWith('/') ? sourceInfo.file : `/data/${sourceInfo.file}`;
                
                console.log(`📚 加载知识库源: ${sourceInfo.title}...`);
                const startTime = Date.now();
                
                const response = await fetch(filePath);
                const data = await response.json();
                
                const elapsed = Date.now() - startTime;
                console.log(`✅ 知识库源加载完成: ${sourceInfo.title} (${elapsed}ms)`);
                
                this.loadedSources[sourceId] = data;
                delete this.loadingPromises[sourceId];
                
                resolve(data);
            } catch (error) {
                console.error(`❌ 知识库源加载失败 (${sourceId}):`, error.message);
                delete this.loadingPromises[sourceId];
                resolve(null);
            }
        });
        
        return this.loadingPromises[sourceId];
    },

    async getCardKnowledge(cardName) {
        const resolvedName = this.resolveCardName(cardName);
        
        // 检查缓存
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
     * 并行加载多张牌的知识库
     * @param {Array} cardNames - 牌名数组
     * @returns {Promise<Object>} 牌名到知识的映射
     */
    async loadCardsKnowledge(cardNames) {
        const results = {};
        const promises = cardNames.map(async (name) => {
            const knowledge = await this.getCardKnowledge(name);
            if (knowledge) {
                results[name] = knowledge;
            }
        });
        
        await Promise.all(promises);
        return results;
    },

    /**
     * 构建精简的知识库上下文（用于 AI Prompt）
     * @param {Array} cards - 卡片数组
     * @param {Object} options - 选项
     * @param {number} options.maxLength - 每张牌的最大字数（默认100）
     * @returns {Promise<string>} 知识库上下文字符串
     */
    async buildKnowledgeContext(cards, options = {}) {
        const { maxLength = 100 } = options;
        const contexts = [];
        
        console.log(`📚 开始加载 ${cards.length} 张牌的知识库...`);
        const startTime = Date.now();
        
        for (const item of cards) {
            try {
                const card = await this.getCardKnowledge(item.card.name);
                if (!card) continue;
                
                let context = `\n【${item.card.name}（${item.reversed ? '逆位' : '正位'}）】`;
                
                // 关键词（重要）
                if (card.keywords) {
                    const keywords = Array.isArray(card.keywords) ? card.keywords.slice(0, 5).join('、') : card.keywords;
                    context += `\n关键词：${keywords}`;
                }
                
                // 核心含义（根据正逆位选择）
                if (item.reversed && card.reversed) {
                    const meaning = this.extractMeaning(card.reversed, maxLength);
                    if (meaning) context += `\n逆位：${meaning}`;
                } else if (!item.reversed && card.upright) {
                    const meaning = this.extractMeaning(card.upright, maxLength);
                    if (meaning) context += `\n正位：${meaning}`;
                }
                
                // 原型（如果有且简短）
                if (card.archetype && card.archetype.length < 50) {
                    context += `\n原型：${card.archetype}`;
                }
                
                contexts.push(context);
            } catch (error) {
                console.warn(`加载 ${item.card.name} 知识失败:`, error.message);
            }
        }
        
        const elapsed = Date.now() - startTime;
        console.log(`✅ 知识库加载完成，耗时 ${elapsed}ms`);
        
        return contexts.length > 0 ? '\n【塔罗知识库参考】' + contexts.join('\n') : '';
    },

    /**
     * 提取含义文本（智能截取）
     * @param {*} meaning - 含义数据
     * @param {number} maxLength - 最大长度
     * @returns {string} 提取的含义
     */
    extractMeaning(meaning, maxLength) {
        if (!meaning) return '';
        
        let text = '';
        
        if (typeof meaning === 'string') {
            text = meaning;
        } else if (typeof meaning === 'object') {
            // 优先使用 general 或 keywords
            if (meaning.general) {
                text = meaning.general;
            } else if (meaning.keywords) {
                text = Array.isArray(meaning.keywords) 
                    ? meaning.keywords.slice(0, 5).join('、')
                    : meaning.keywords;
            } else if (meaning.negative && meaning.positive) {
                text = `${meaning.positive} / ${meaning.negative}`;
            } else if (meaning.negative) {
                text = meaning.negative;
            } else if (meaning.positive) {
                text = meaning.positive;
            }
        }
        
        // 智能截取（优先在句号处截断）
        if (text.length > maxLength) {
            const cutPoint = text.lastIndexOf('。', maxLength);
            if (cutPoint > maxLength * 0.5) {
                text = text.substring(0, cutPoint + 1);
            } else {
                text = text.substring(0, maxLength) + '...';
            }
        }
        
        return text;
    },

    isLoaded() {
        return this.indexLoaded;
    },

    getSource() {
        return '按需加载模式（优化版）';
    },
    
    getLoadedSources() {
        return Object.keys(this.loadedSources);
    },
    
    getCacheStats() {
        return {
            indexLoaded: this.indexLoaded,
            sourcesLoaded: Object.keys(this.loadedSources).length,
            cardsCached: Object.keys(this.cardCache).length,
            loadingInProgress: Object.keys(this.loadingPromises).length
        };
    },

    // 清除缓存（可选）
    clearCache() {
        this.cardCache = {};
        console.log('🗑️ 知识库缓存已清除');
    },

    // 预加载常用牌（可选优化）
    async preloadCommonCards() {
        // 预加载大阿卡纳的前10张牌
        const commonCards = ['愚者', '魔术师', '女祭司', '女皇', '皇帝', '教皇', '恋人', '战车', '力量', '隐士'];
        
        console.log('⚡ 预加载常用牌...');
        const startTime = Date.now();
        
        await this.loadCardsKnowledge(commonCards);
        
        const elapsed = Date.now() - startTime;
        console.log(`✅ 预加载完成，耗时 ${elapsed}ms`);
    },

    getAllMajorCards() {
        console.warn('getAllMajorCards 在按需加载模式下不可用');
        return [];
    },

    getAllMinorCards() {
        console.warn('getAllMinorCards 在按需加载模式下不可用');
        return [];
    },

    getAllCards() {
        console.warn('getAllCards 在按需加载模式下不可用');
        return [];
    }
};

window.TarotKnowledge = TarotKnowledge;
