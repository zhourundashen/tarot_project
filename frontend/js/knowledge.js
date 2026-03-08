const TarotKnowledge = {
    index: null,
    loadedSources: {},
    cardCache: {},
    indexLoaded: false,
    
    async init() {
        if (this.indexLoaded) return this.index;
        
        try {
            const response = await fetch('/data/knowledge/index.json');
            this.index = await response.json();
            this.indexLoaded = true;
            console.log('知识库索引加载成功，共', Object.keys(this.index.cards).length, '张牌');
        } catch (error) {
            console.error('知识库索引加载失败:', error.message);
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
        
        if (!this.index || !this.index.sources[sourceId]) {
            return null;
        }
        
        try {
            const sourceInfo = this.index.sources[sourceId];
            const filePath = sourceInfo.file.startsWith('/') ? sourceInfo.file : `/data/${sourceInfo.file}`;
            const response = await fetch(filePath);
            const data = await response.json();
            this.loadedSources[sourceId] = data;
            console.log(`知识库源加载: ${sourceInfo.title}`);
            return data;
        } catch (error) {
            console.error(`知识库源加载失败 (${sourceId}):`, error.message);
            return null;
        }
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

    async getCardMeaning(cardName, reversed = false) {
        const card = await this.getCardKnowledge(cardName);
        
        if (!card) return null;
        
        if (card.upright && card.reversed) {
            if (reversed) {
                if (typeof card.reversed === 'string') return card.reversed;
                return card.reversed.negative || card.reversed.general || card.reversed;
            }
            return card.upright?.general || card.upright;
        }
        
        if (card.meanings) {
            const sourceOrder = ['waite_deep', 'sunflower', 'actually_you_are_tarot'];
            for (const sourceId of sourceOrder) {
                const meanings = card.meanings[sourceId];
                if (meanings) {
                    if (reversed) {
                        return meanings.reversed?.general || meanings.reversed || null;
                    }
                    return meanings.upright?.general || meanings.upright || null;
                }
            }
        }
        
        return null;
    },

    async loadCardsForReading(cardNames) {
        const results = {};
        const promises = cardNames.map(async (name) => {
            const card = await this.getCardKnowledge(name);
            if (card) {
                results[name] = card;
            }
        });
        await Promise.all(promises);
        return results;
    },

    async buildKnowledgeContext(cards) {
        console.log('🔍 开始加载知识库上下文...');
        const startTime = Date.now();
        
        // 并行加载所有需要的牌的知识
        const knowledgePromises = cards.map(async (item) => {
            try {
                const card = await this.getCardKnowledge(item.card.name);
                if (!card) return '';
                
                // 构建精简的知识库上下文（最多100字）
                let context = `\n【${item.card.name}（${item.reversed ? '逆位' : '正位'}）`;
                
                // 添加关键词
                if (card.keywords && Array.isArray(card.keywords)) {
                    context += `\n关键词：${card.keywords.slice(0, 3).join('、')}`;
                }
                
                // 添加核心含义（精简到最多80字）
                if (item.reversed && card.reversed) {
                    const meaning = typeof card.reversed === 'string' 
                        ? card.reversed 
                        : (card.reversed.negative || card.reversed.positive || '');
                    context += `\n核心：${meaning.substring(0, 80)}`;
                } else if (!item.reversed && card.upright) {
                    const meaning = typeof card.upright === 'string' 
                        ? card.upright 
                        : (card.upright.general || '');
                    context += `\n核心：${meaning.substring(0, 80)}`;
                }
                
                return context;
            } catch (error) {
                console.warn(`加载 ${item.card.name} 知识库失败:`, error.message);
                return '';
            }
        });
        
        // 等待所有知识库加载完成
        const contexts = await Promise.all(knowledgePromises);
        const validContexts = contexts.filter(c => c.length > 0);
        
        const elapsed = Date.now() - startTime;
        console.log(`✅ 癆识库加载完成，耗时 ${elapsed}ms， 加载了 ${validContexts.length}/${cards.length} 张牌的知识`);
        
        return validContexts.length > 0 ? '\n【塔罗知识库参考】' + validContexts.join('\n') : '';
    },

    isLoaded() {
        return this.indexLoaded;
    },

    getSource() {
        return '按需加载模式';
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
