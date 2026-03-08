const TarotShare = {
    canvas: null,
    ctx: null,
    currentTemplate: 'mystic',
    insightData: null,
    currentPages: [],
    currentPageIndex: 0,
    
    templates: {
        mystic: {
            name: '神秘星空',
            icon: '🌙',
            colors: {
                primary: '#6B21A8',
                secondary: '#9333EA',
                accent: '#D946EF',
                gold: '#FFD700',
                background: '#0F0A1A',
                text: '#FFFFFF',
                textMuted: '#A78BFA'
            }
        },
        forest: {
            name: '森林秘境',
            icon: '🌿',
            colors: {
                primary: '#166534',
                secondary: '#15803D',
                accent: '#22C55E',
                gold: '#84CC16',
                background: '#0A1F0D',
                text: '#ECFDF5',
                textMuted: '#86EFAC'
            }
        },
        dream: {
            name: '梦幻紫粉',
            icon: '✨',
            colors: {
                primary: '#EC4899',
                secondary: '#A855F7',
                accent: '#F472B6',
                gold: '#FBBF24',
                background: '#1F102E',
                text: '#FCE7F3',
                textMuted: '#F9A8D4'
            }
        },
        ice: {
            name: '冰雪冷静',
            icon: '❄️',
            colors: {
                primary: '#0EA5E9',
                secondary: '#38BDF8',
                accent: '#7DD3FC',
                gold: '#E0F2FE',
                background: '#0C1929',
                text: '#F0F9FF',
                textMuted: '#BAE6FD'
            }
        }
    },
    
    get colors() {
        return this.templates[this.currentTemplate].colors;
    },
    
    async generateShareImage(options) {
        const {
            question = '',
            spreadName = '',
            cards = [],
            interpretation = '',
            keywords = [],
            summary = '',
            template = 'mystic'
        } = options;
        
        this.currentTemplate = template || 'mystic';
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 1200;
        this.ctx = this.canvas.getContext('2d');
        
        switch (this.currentTemplate) {
            case 'forest':
                this.drawForestBackground();
                break;
            case 'dream':
                this.drawDreamBackground();
                break;
            case 'ice':
                this.drawIceBackground();
                break;
            default:
                this.drawMysticBackground();
        }
        
        this.drawHeader();
        
        if (question) {
            this.drawQuestion(question);
        }
        
        this.drawSpreadInfo(spreadName);
        
        if (cards.length > 0) {
            await this.drawCards(cards);
        }
        
        if (keywords.length > 0) {
            this.drawKeywords(keywords);
        }
        
        if (interpretation || summary) {
            this.drawInterpretation(interpretation || summary);
        }
        
        this.drawFooter();
        
        return this.canvas.toDataURL('image/png', 0.9);
    },
    
    drawMysticBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a0a2e');
        gradient.addColorStop(0.5, '#16082a');
        gradient.addColorStop(1, '#0d0518');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawStars();
        this.drawMysticCircles();
    },
    
    drawForestBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#0A1F0D');
        gradient.addColorStop(0.5, '#0D2810');
        gradient.addColorStop(1, '#061208');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawForestElements();
        this.drawLeaves();
    },
    
    drawForestElements() {
        this.ctx.strokeStyle = 'rgba(34, 197, 94, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            const x = 100 + i * 150;
            const height = 200 + Math.random() * 100;
            this.ctx.beginPath();
            this.ctx.moveTo(x, this.canvas.height);
            this.ctx.lineTo(x - 30, this.canvas.height - height);
            this.ctx.lineTo(x + 30, this.canvas.height - height);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    },
    
    drawLeaves() {
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.5;
            const size = Math.random() * 8 + 4;
            const rotation = Math.random() * Math.PI * 2;
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.rotate(rotation);
            this.ctx.fillStyle = `rgba(134, 239, 172, ${Math.random() * 0.3 + 0.1})`;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, size, size / 2, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
    },
    
    drawDreamBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#1F102E');
        gradient.addColorStop(0.3, '#2D1B4E');
        gradient.addColorStop(0.7, '#3D1B5E');
        gradient.addColorStop(1, '#1A0A2E');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawDreamBubbles();
        this.drawStars();
    },
    
    drawIceBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#0C1929');
        gradient.addColorStop(0.5, '#0F2744');
        gradient.addColorStop(1, '#081220');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawSnowflakes();
        this.drawIceCrystals();
    },
    
    drawSnowflakes() {
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.6;
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.6 + 0.3;
            
            this.ctx.save();
            this.ctx.translate(x, y);
            this.ctx.fillStyle = `rgba(186, 230, 253, ${opacity})`;
            
            for (let j = 0; j < 6; j++) {
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(0, size * 3);
                this.ctx.strokeStyle = `rgba(186, 230, 253, ${opacity})`;
                this.ctx.lineWidth = 1;
                this.ctx.stroke();
                this.ctx.rotate(Math.PI / 3);
            }
            
            this.ctx.restore();
        }
    },
    
    drawIceCrystals() {
        this.ctx.strokeStyle = 'rgba(125, 211, 252, 0.15)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.4;
            const size = Math.random() * 30 + 20;
            
            this.ctx.beginPath();
            this.ctx.moveTo(x - size, y);
            this.ctx.lineTo(x + size, y);
            this.ctx.moveTo(x, y - size);
            this.ctx.lineTo(x, y + size);
            this.ctx.moveTo(x - size * 0.7, y - size * 0.7);
            this.ctx.lineTo(x + size * 0.7, y + size * 0.7);
            this.ctx.moveTo(x + size * 0.7, y - size * 0.7);
            this.ctx.lineTo(x - size * 0.7, y + size * 0.7);
            this.ctx.stroke();
        }
    },
    
    drawStars() {
        const starCount = 50;
        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.4;
            const size = Math.random() * 2 + 0.5;
            const opacity = Math.random() * 0.8 + 0.2;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            this.ctx.fill();
        }
    },
    
    drawMysticCircles() {
        this.ctx.strokeStyle = 'rgba(147, 51, 234, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 3; i++) {
            const radius = 200 + i * 100;
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2, 400, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    },
    
    drawGoldPattern() {
        this.ctx.strokeStyle = 'rgba(218, 165, 32, 0.15)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 4; i++) {
            const radius = 150 + i * 80;
            this.ctx.beginPath();
            this.ctx.arc(this.canvas.width / 2, 350, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.strokeStyle = 'rgba(218, 165, 32, 0.1)';
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width / 2, 350);
            this.ctx.lineTo(
                this.canvas.width / 2 + Math.cos(angle) * 400,
                350 + Math.sin(angle) * 400
            );
            this.ctx.stroke();
        }
    },
    
    drawDreamBubbles() {
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height * 0.6;
            const radius = Math.random() * 30 + 10;
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, 'rgba(244, 114, 182, 0.2)');
            gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
    },
    
    drawMinimalLines() {
        this.ctx.strokeStyle = 'rgba(156, 163, 175, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 5; i++) {
            const y = 100 + i * 200;
            this.ctx.beginPath();
            this.ctx.moveTo(50, y);
            this.ctx.lineTo(this.canvas.width - 50, y);
            this.ctx.stroke();
        }
    },
    
    drawHeader() {
        this.ctx.save();
        
        const gradient = this.ctx.createLinearGradient(0, 30, 0, 80);
        gradient.addColorStop(0, this.colors.gold);
        gradient.addColorStop(1, this.currentTemplate === 'forest' ? '#15803d' : '#FFA500');
        this.ctx.fillStyle = gradient;
        this.ctx.font = 'bold 42px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('神 秘 塔 罗', this.canvas.width / 2, 65);
        
        this.ctx.strokeStyle = this.colors.accent;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(200, 85);
        this.ctx.lineTo(600, 85);
        this.ctx.stroke();
        
        this.ctx.fillStyle = this.colors.textMuted;
        this.ctx.font = '16px "Microsoft YaHei", sans-serif';
        this.ctx.fillText('✧ 占卜结果分享 ✧', this.canvas.width / 2, 110);
        
        this.ctx.restore();
    },
    
    drawQuestion(question) {
        this.ctx.save();
        
        const maxWidth = 700;
        const truncatedQuestion = this.truncateText(question, maxWidth, 18);
        
        this.ctx.fillStyle = this.currentTemplate === 'ice' 
            ? 'rgba(107, 114, 128, 0.2)'
            : `rgba(${this.currentTemplate === 'dream' ? '236, 72, 153' : '147, 51, 234'}, 0.2)`;
        this.roundRect(40, 130, this.canvas.width - 80, 60, 10);
        this.ctx.fill();
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '18px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`"${truncatedQuestion}"`, this.canvas.width / 2, 168);
        
        this.ctx.restore();
    },
    
    drawSpreadInfo(spreadName) {
        const y = this.questionUsed ? 210 : 140;
        
        this.ctx.fillStyle = this.colors.textMuted;
        this.ctx.font = '14px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`🔮 ${spreadName}`, this.canvas.width / 2, y);
    },
    
    async drawCards(cards) {
        const startY = 230;
        const cardWidth = 70;
        const cardHeight = 100;
        const gap = 15;
        
        const maxCardsPerRow = 7;
        const rows = Math.ceil(cards.length / maxCardsPerRow);
        
        for (let row = 0; row < rows; row++) {
            const rowCards = cards.slice(row * maxCardsPerRow, (row + 1) * maxCardsPerRow);
            const totalWidth = rowCards.length * cardWidth + (rowCards.length - 1) * gap;
            const startX = (this.canvas.width - totalWidth) / 2;
            
            for (let i = 0; i < rowCards.length; i++) {
                const x = startX + i * (cardWidth + gap);
                const y = startY + row * (cardHeight + 40);
                
                await this.drawCard(rowCards[i], x, y, cardWidth, cardHeight);
            }
        }
    },
    
    async drawCard(cardData, x, y, width, height) {
        const { card, reversed, position } = cardData;
        
        this.ctx.save();
        
        this.ctx.shadowColor = this.currentTemplate === 'ice'
            ? 'rgba(125, 211, 252, 0.3)'
            : `rgba(${this.currentTemplate === 'dream' ? '168, 85, 247' : this.currentTemplate === 'forest' ? '34, 197, 94' : '147, 51, 234'}, 0.5)`;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 5;
        
        const gradient = this.ctx.createLinearGradient(x, y, x, y + height);
        if (this.currentTemplate === 'forest') {
            gradient.addColorStop(0, '#14532d');
            gradient.addColorStop(1, '#052e16');
        } else if (this.currentTemplate === 'dream') {
            gradient.addColorStop(0, '#3D1B5E');
            gradient.addColorStop(1, '#1F102E');
        } else if (this.currentTemplate === 'ice') {
            gradient.addColorStop(0, '#164e63');
            gradient.addColorStop(1, '#0c4a6e');
        } else {
            gradient.addColorStop(0, '#2d1b4e');
            gradient.addColorStop(1, '#1a0a2e');
        }
        this.ctx.fillStyle = gradient;
        this.roundRect(x, y, width, height, 8);
        this.ctx.fill();
        
        this.ctx.strokeStyle = reversed ? '#EF4444' : this.colors.gold;
        this.ctx.lineWidth = 2;
        this.roundRect(x, y, width, height, 8);
        this.ctx.stroke();
        
        this.ctx.shadowColor = 'transparent';
        
        this.ctx.fillStyle = this.colors.gold;
        this.ctx.font = 'bold 12px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        
        const cardName = card.name.length > 4 ? card.name.substring(0, 4) : card.name;
        this.ctx.fillText(cardName, x + width / 2, y + 25);
        
        if (reversed) {
            this.ctx.save();
            this.ctx.translate(x + width / 2, y + 50);
            this.ctx.rotate(Math.PI);
            this.ctx.fillStyle = '#EF4444';
            this.ctx.font = '10px "Microsoft YaHei", sans-serif';
            this.ctx.fillText('逆位', 0, 0);
            this.ctx.restore();
        } else {
            this.ctx.fillStyle = '#22C55E';
            this.ctx.font = '10px "Microsoft YaHei", sans-serif';
            this.ctx.fillText('正位', x + width / 2, y + 55);
        }
        
        if (position) {
            const posName = position.length > 5 ? position.substring(0, 5) + '..' : position;
            this.ctx.fillStyle = this.colors.textMuted;
            this.ctx.font = '9px "Microsoft YaHei", sans-serif';
            this.ctx.fillText(posName, x + width / 2, y + height - 10);
        }
        
        this.ctx.restore();
    },
    
    drawKeywords(keywords) {
        const y = 420;
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('✨ 今日指引关键词 ✨', this.canvas.width / 2, y);
        
        const tagWidth = 100;
        const tagHeight = 36;
        const gap = 20;
        const totalWidth = keywords.length * tagWidth + (keywords.length - 1) * gap;
        const startX = (this.canvas.width - totalWidth) / 2;
        
        keywords.forEach((keyword, i) => {
            const x = startX + i * (tagWidth + gap);
            
            let gradient;
            if (this.currentTemplate === 'forest') {
                gradient = this.ctx.createLinearGradient(x, y + 15, x + tagWidth, y + 15 + tagHeight);
                gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
                gradient.addColorStop(1, 'rgba(22, 163, 74, 0.3)');
            } else if (this.currentTemplate === 'dream') {
                gradient = this.ctx.createLinearGradient(x, y + 15, x + tagWidth, y + 15 + tagHeight);
                gradient.addColorStop(0, 'rgba(236, 72, 153, 0.3)');
                gradient.addColorStop(1, 'rgba(168, 85, 247, 0.3)');
            } else if (this.currentTemplate === 'ice') {
                gradient = this.ctx.createLinearGradient(x, y + 15, x + tagWidth, y + 15 + tagHeight);
                gradient.addColorStop(0, 'rgba(125, 211, 252, 0.3)');
                gradient.addColorStop(1, 'rgba(56, 189, 248, 0.3)');
            } else {
                gradient = this.ctx.createLinearGradient(x, y + 15, x + tagWidth, y + 15 + tagHeight);
                gradient.addColorStop(0, 'rgba(147, 51, 234, 0.3)');
                gradient.addColorStop(1, 'rgba(217, 70, 239, 0.3)');
            }
            this.ctx.fillStyle = gradient;
            this.roundRect(x, y + 15, tagWidth, tagHeight, 18);
            this.ctx.fill();
            
            this.ctx.strokeStyle = this.colors.accent;
            this.ctx.lineWidth = 1;
            this.roundRect(x, y + 15, tagWidth, tagHeight, 18);
            this.ctx.stroke();
            
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '14px "Microsoft YaHei", sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(keyword, x + tagWidth / 2, y + 38);
        });
    },
    
    drawInterpretation(text) {
        const startY = 500;
        const padding = 40;
        const maxWidth = this.canvas.width - padding * 2;
        
        let bgColor, borderColor;
        if (this.currentTemplate === 'forest') {
            bgColor = 'rgba(5, 46, 22, 0.8)';
            borderColor = 'rgba(34, 197, 94, 0.3)';
        } else if (this.currentTemplate === 'dream') {
            bgColor = 'rgba(31, 16, 46, 0.8)';
            borderColor = 'rgba(168, 85, 247, 0.3)';
        } else if (this.currentTemplate === 'ice') {
            bgColor = 'rgba(12, 74, 110, 0.8)';
            borderColor = 'rgba(125, 211, 252, 0.3)';
        } else {
            bgColor = 'rgba(26, 10, 46, 0.8)';
            borderColor = 'rgba(147, 51, 234, 0.3)';
        }
        
        this.ctx.fillStyle = bgColor;
        this.roundRect(padding - 10, startY - 25, maxWidth + 20, 550, 15);
        this.ctx.fill();
        
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 1;
        this.roundRect(padding - 10, startY - 25, maxWidth + 20, 550, 15);
        this.ctx.stroke();
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('🔮 AI解读', padding, startY);
        
        const cleanText = this.cleanTextForShare(text);
        const lines = this.wrapText(cleanText, maxWidth - 20, 15);
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.font = '14px "Microsoft YaHei", sans-serif';
        
        let currentY = startY + 30;
        const maxLines = 28;
        const displayLines = lines.slice(0, maxLines);
        
        displayLines.forEach(line => {
            this.ctx.fillText(line, padding, currentY);
            currentY += 22;
        });
        
        if (lines.length > maxLines) {
            this.ctx.fillStyle = this.colors.textMuted;
            this.ctx.fillText('...', padding, currentY);
        }
    },
    
    drawFooter() {
        const y = this.canvas.height - 60;
        
        let lineColor;
        if (this.currentTemplate === 'forest') {
            lineColor = 'rgba(34, 197, 94, 0.3)';
        } else if (this.currentTemplate === 'dream') {
            lineColor = 'rgba(168, 85, 247, 0.3)';
        } else if (this.currentTemplate === 'ice') {
            lineColor = 'rgba(125, 211, 252, 0.3)';
        } else {
            lineColor = 'rgba(147, 51, 234, 0.3)';
        }
        
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(100, y - 20);
        this.ctx.lineTo(this.canvas.width - 100, y - 20);
        this.ctx.stroke();
        
        const now = new Date();
        const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
        
        this.ctx.fillStyle = this.colors.textMuted;
        this.ctx.font = '12px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`占卜时间：${dateStr}`, this.canvas.width / 2, y);
        
        this.ctx.fillStyle = this.currentTemplate === 'forest' 
            ? 'rgba(134, 239, 172, 0.8)' 
            : this.currentTemplate === 'ice'
            ? 'rgba(186, 230, 253, 0.8)'
            : 'rgba(255, 215, 0, 0.6)';
        this.ctx.font = '11px "Microsoft YaHei", sans-serif';
        this.ctx.fillText('神秘塔罗 · AI智能占卜', this.canvas.width / 2, y + 25);
    },
    
    roundRect(x, y, width, height, radius) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
        this.ctx.closePath();
    },
    
    truncateText(text, maxWidth, fontSize) {
        this.ctx.font = `${fontSize}px "Microsoft YaHei", sans-serif`;
        let truncated = text;
        while (this.ctx.measureText(truncated).width > maxWidth && truncated.length > 0) {
            truncated = truncated.slice(0, -1);
        }
        return truncated.length < text.length ? truncated + '...' : truncated;
    },
    
    wrapText(text, maxWidth, fontSize) {
        this.ctx.font = `${fontSize}px "Microsoft YaHei", sans-serif`;
        const lines = [];
        const paragraphs = text.split('\n');
        
        paragraphs.forEach(paragraph => {
            if (paragraph.trim() === '') {
                lines.push('');
                return;
            }
            
            let currentLine = '';
            for (let i = 0; i < paragraph.length; i++) {
                const char = paragraph[i];
                const testLine = currentLine + char;
                if (this.ctx.measureText(testLine).width > maxWidth) {
                    lines.push(currentLine);
                    currentLine = char;
                } else {
                    currentLine = testLine;
                }
            }
            if (currentLine) {
                lines.push(currentLine);
            }
        });
        
        return lines;
    },
    
    cleanTextForShare(text) {
        return text
            .replace(/【.*?】/g, '')
            .replace(/\*\*/g, '')
            .replace(/#{1,6}\s?/g, '')
            .replace(/```[\s\S]*?```/g, '')
            .substring(0, 800);
    },
    
    async downloadShareImage(imageData, filename = 'tarot-reading.png') {
        const link = document.createElement('a');
        link.download = filename;
        link.href = imageData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    async shareToSocial(imageData) {
        if (navigator.share && navigator.canShare) {
            try {
                const blob = await (await fetch(imageData)).blob();
                const file = new File([blob], 'tarot-reading.png', { type: 'image/png' });
                
                await navigator.share({
                    title: '神秘塔罗占卜结果',
                    text: '我刚刚完成了一次塔罗占卜，来看看结果吧！',
                    files: [file]
                });
                
                return true;
            } catch (err) {
                console.log('分享取消或失败:', err);
                return false;
            }
        }
        return false;
    },
    
    showShareModal(imageData) {
        const existingModal = document.getElementById('share-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'share-modal';
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content">
                <button class="share-modal-close" onclick="TarotShare.closeShareModal()">×</button>
                <h3 class="share-modal-title">分享占卜结果</h3>
                
                <div class="share-template-selector">
                    <span class="template-label">选择风格：</span>
                    <div class="template-options">
                        ${Object.entries(this.templates).map(([id, t]) => `
                            <button class="template-btn ${id === this.currentTemplate ? 'active' : ''}" 
                                    data-template="${id}"
                                    onclick="TarotShare.selectTemplate('${id}')">
                                <span class="template-icon">${t.icon}</span>
                                <span class="template-name">${t.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="share-preview">
                    <img src="${imageData}" alt="占卜结果" class="share-image" id="share-preview-image">
                </div>
                <div class="share-actions">
                    <button class="share-btn share-btn-primary" onclick="TarotShare.handleDownload()">
                        <span>📥 保存图片</span>
                    </button>
                    <button class="share-btn share-btn-secondary" onclick="TarotShare.handleShare()">
                        <span>📤 分享</span>
                    </button>
                </div>
                <p class="share-hint">长按图片可保存到相册</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => modal.classList.add('show'), 10);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeShareModal();
            }
        });
        
        this._currentImageData = imageData;
    },
    
    async selectTemplate(templateId) {
        if (!this._shareOptions) return;
        
        this.currentTemplate = templateId;
        
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.template === templateId);
        });
        
        const previewImg = document.getElementById('share-preview-image');
        if (previewImg) {
            previewImg.style.opacity = '0.5';
        }
        
        const newImageData = await this.generateShareImage({
            ...this._shareOptions,
            template: templateId
        });
        
        this._currentImageData = newImageData;
        
        if (previewImg) {
            previewImg.src = newImageData;
            previewImg.style.opacity = '1';
        }
    },
    
    setShareOptions(options) {
        this._shareOptions = options;
    },
    
    closeShareModal() {
        const modal = document.getElementById('share-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    },
    
    async handleDownload() {
        if (this._currentImageData) {
            const now = new Date();
            const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}`;
            const templateName = this.templates[this.currentTemplate].name;
            const filename = `塔罗占卜_${templateName}_${dateStr}.png`;
            await this.downloadShareImage(this._currentImageData, filename);
        }
    },
    
    async handleShare() {
        if (this._currentImageData) {
            const shared = await this.shareToSocial(this._currentImageData);
            if (!shared) {
                this.handleDownload();
            }
        }
    },
    
    setInsightData(data) {
        this.insightData = data;
    },
    
    async generateInsightImage(options) {
        const { 
            scores, trend, elements, question, spreadName, 
            template = 'mystic', layout, cards, uprightCount, reversedCount 
        } = options;
        
        this.currentTemplate = template || 'mystic';
        
        const chartLayout = this.resolveLayout(layout, spreadName);
        const chartCount = chartLayout.charts.length;
        const canvasHeight = this.calculateCanvasHeight(chartCount);
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = canvasHeight;
        this.ctx = this.canvas.getContext('2d');
        
        switch (this.currentTemplate) {
            case 'forest':
                this.drawForestBackground();
                break;
            case 'dream':
                this.drawDreamBackground();
                break;
            case 'ice':
                this.drawIceBackground();
                break;
            default:
                this.drawMysticBackground();
        }
        
        this.drawInsightHeader();
        
        const positions = this.calculateChartPositions(chartLayout, canvasHeight);
        
        for (let i = 0; i < chartLayout.charts.length; i++) {
            const chartType = chartLayout.charts[i];
            const pos = positions[i];
            
            this.drawChart(chartType, pos, { 
                scores, trend, elements, cards, uprightCount, reversedCount,
                emphasis: chartLayout.emphasis 
            });
        }
        
        this.drawInsightSummary(question, spreadName, scores, elements, trend, chartLayout.emphasis, canvasHeight);
        this.drawInsightFooter(question, spreadName);
        
        return this.canvas.toDataURL('image/png', 0.9);
    },
    
    resolveLayout(layout, spreadName) {
        if (layout && layout.charts && layout.charts.length > 0) {
            return layout;
        }
        
        const spreadId = this.spreadNameToId(spreadName);
        if (typeof TarotAI !== 'undefined' && TarotAI.getLayoutBySpreadType) {
            return TarotAI.getLayoutBySpreadType(spreadId);
        }
        
        return {
            charts: ['radar', 'pie', 'line'],
            positions: ['top', 'bottom-left', 'bottom-right'],
            emphasis: 'career'
        };
    },
    
    spreadNameToId(spreadName) {
        const nameMap = {
            '单牌指引': 'single',
            '三牌阵': 'three-card',
            '抉择牌阵': 'three-card-choice',
            '身心灵牌阵': 'mind-body-spirit',
            '十字牌阵': 'cross',
            '四元素牌阵': 'four-elements',
            '关系牌阵': 'relationship',
            '爱情金字塔': 'love-pyramid',
            '二选一详细版': 'choice-detailed',
            '事业发展牌阵': 'career-development',
            '问题解决牌阵': 'problem-solving',
            '每周运势牌阵': 'weekly-forecast',
            '脉轮能量牌阵': 'chakra-energy',
            '沟通桥梁牌阵': 'communication-bridge',
            '财运分析牌阵': 'financial-fortune',
            '年度运势牌阵': 'annual-fortune',
            '马蹄牌阵': 'horseshoe',
            '凯尔特十字': 'celtic-cross',
            '生命之树': 'tree-of-life',
            '新月愿望': 'new-moon',
            '满月启示': 'full-moon',
            '过去世探索牌阵': 'past-life'
        };
        return nameMap[spreadName] || 'three-card';
    },
    
    calculateCanvasHeight(chartCount) {
        const baseHeight = 500;
        const perChartHeight = 320;
        const summaryHeight = 350;
        return baseHeight + chartCount * perChartHeight + summaryHeight;
    },
    
    calculateChartPositions(layout, canvasHeight) {
        const positions = [];
        const charts = layout.charts;
        const chartCount = charts.length;
        
        const cardWidth = 340;
        const cardHeight = 280;
        const headerHeight = 120;
        const gap = 40;
        
        if (chartCount === 1) {
            positions.push({ 
                x: 400, 
                y: headerHeight + cardHeight / 2 + 20, 
                width: cardWidth, 
                height: cardHeight 
            });
        } else if (chartCount === 2) {
            const startY = headerHeight + 40;
            positions.push({ 
                x: 200, 
                y: startY + cardHeight / 2, 
                width: cardWidth, 
                height: cardHeight 
            });
            positions.push({ 
                x: 580, 
                y: startY + cardHeight / 2, 
                width: cardWidth, 
                height: cardHeight 
            });
        } else if (chartCount === 3) {
            const startY1 = headerHeight + 40;
            const startY2 = startY1 + cardHeight + gap;
            positions.push({ 
                x: 400, 
                y: startY1 + cardHeight / 2, 
                width: cardWidth + 100, 
                height: cardHeight 
            });
            positions.push({ 
                x: 200, 
                y: startY2 + cardHeight / 2, 
                width: cardWidth, 
                height: cardHeight 
            });
            positions.push({ 
                x: 580, 
                y: startY2 + cardHeight / 2, 
                width: cardWidth, 
                height: cardHeight 
            });
        } else if (chartCount >= 4) {
            const startY1 = headerHeight + 40;
            const startY2 = startY1 + cardHeight + gap;
            positions.push({ 
                x: 200, 
                y: startY1 + cardHeight / 2, 
                width: cardWidth, 
                height: cardHeight 
            });
            positions.push({ 
                x: 580, 
                y: startY1 + cardHeight / 2, 
                width: cardWidth, 
                height: cardHeight 
            });
            positions.push({ 
                x: 200, 
                y: startY2 + cardHeight / 2, 
                width: cardWidth, 
                height: cardHeight 
            });
            positions.push({ 
                x: 580, 
                y: startY2 + cardHeight / 2, 
                width: cardWidth, 
                height: cardHeight 
            });
        }
        
        return positions;
    },
    
    drawChartCard(x, y, width, height, title) {
        this.ctx.save();
        
        let bgColor, borderColor;
        if (this.currentTemplate === 'forest') {
            bgColor = 'rgba(5, 46, 22, 0.5)';
            borderColor = 'rgba(34, 197, 94, 0.6)';
        } else if (this.currentTemplate === 'dream') {
            bgColor = 'rgba(31, 16, 46, 0.5)';
            borderColor = 'rgba(168, 85, 247, 0.6)';
        } else if (this.currentTemplate === 'ice') {
            bgColor = 'rgba(12, 74, 110, 0.5)';
            borderColor = 'rgba(125, 211, 252, 0.6)';
        } else {
            bgColor = 'rgba(26, 10, 46, 0.5)';
            borderColor = 'rgba(212, 175, 55, 0.6)';
        }
        
        const cardX = x - width / 2;
        const cardY = y - height / 2;
        
        this.ctx.fillStyle = bgColor;
        this.roundRect(cardX, cardY, width, height, 15);
        this.ctx.fill();
        
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 2;
        this.roundRect(cardX, cardY, width, height, 15);
        this.ctx.stroke();
        
        this.ctx.fillStyle = this.colors.gold;
        this.ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(title, x, cardY + 25);
        
        this.ctx.strokeStyle = borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(cardX + 20, cardY + 40);
        this.ctx.lineTo(cardX + width - 20, cardY + 40);
        this.ctx.stroke();
        
        this.ctx.restore();
        
        return {
            contentX: cardX + 20,
            contentY: cardY + 55,
            contentWidth: width - 40,
            contentHeight: height - 75
        };
    },
    
    getChartTitle(chartType) {
        const titles = {
            radar: '五维分析',
            pie: '元素分布',
            line: '发展趋势',
            donut: '正逆位',
            bar: '维度对比',
            energy: '能量条',
            gauge: '整体能量',
            compare: '选项对比',
            relation: '关系分析',
            chakra: '脉轮能量',
            timeline: '时间轴',
            progress: '进度环'
        };
        return titles[chartType] || '数据分析';
    },
    
    drawChart(chartType, pos, data) {
        const titles = {
            radar: '📊 五维分析',
            pie: '🥧 元素分布',
            line: '📈 趋势走向',
            donut: '🍩 正逆位比例',
            bar: '📊 维度对比',
            energy: '⚡ 能量分布',
            gauge: '🎯 综合评分',
            compare: '⚖️ 维度比较',
            relation: '🔗 关联分析',
            chakra: '🔮 脉轮能量',
            timeline: '⏱️ 时间轴',
            progress: '📊 进度评估'
        };
        
        const contentArea = this.drawChartCard(pos.x, pos.y, pos.width, pos.height, titles[chartType] || '📊 数据图表');
        
        switch (chartType) {
            case 'radar':
                this.drawRadarChart(pos.x, pos.y + 15, Math.min(contentArea.contentWidth, contentArea.contentHeight) / 2.5, data.scores, data.emphasis);
                break;
            case 'pie':
                this.drawPieChart(pos.x, pos.y, Math.min(contentArea.contentWidth, contentArea.contentHeight) / 2.2, data.elements);
                break;
            case 'line':
                this.drawLineChart(contentArea.contentX + contentArea.contentWidth / 2, contentArea.contentY + contentArea.contentHeight / 2, contentArea.contentWidth - 40, contentArea.contentHeight - 40, data.trend);
                break;
            case 'donut':
                this.drawDonutChart(pos.x, pos.y, Math.min(contentArea.contentWidth, contentArea.contentHeight) / 2.2, data.uprightCount, data.reversedCount);
                break;
            case 'bar':
                this.drawBarChart(contentArea.contentX, contentArea.contentY + 20, contentArea.contentWidth, contentArea.contentHeight - 40, data.scores, data.emphasis);
                break;
            case 'energy':
                this.drawEnergyBars(contentArea.contentX, contentArea.contentY + 10, contentArea.contentWidth, contentArea.contentHeight - 20, data.scores, data.emphasis);
                break;
            case 'gauge':
                this.drawGaugeChart(pos.x, pos.y, Math.min(contentArea.contentWidth, contentArea.contentHeight) / 2.5, data.scores, data.emphasis);
                break;
            case 'compare':
                this.drawCompareChart(contentArea.contentX, contentArea.contentY + 20, contentArea.contentWidth, contentArea.contentHeight - 40, data.scores);
                break;
            case 'relation':
                this.drawRelationChart(pos.x, pos.y, Math.min(contentArea.contentWidth, contentArea.contentHeight) / 2.5, data.scores);
                break;
            case 'chakra':
                this.drawChakraChart(contentArea.contentX, contentArea.contentY + 10, contentArea.contentWidth, contentArea.contentHeight - 20, data.scores);
                break;
            case 'timeline':
                this.drawTimelineChart(contentArea.contentX, contentArea.contentY + 20, contentArea.contentWidth, contentArea.contentHeight - 40, data.trend);
                break;
            case 'progress':
                this.drawProgressChart(pos.x, pos.y, Math.min(contentArea.contentWidth, contentArea.contentHeight) / 3, data.scores, data.emphasis);
                break;
            default:
                this.drawRadarChart(pos.x, pos.y, Math.min(contentArea.contentWidth, contentArea.contentHeight) / 2.2, data.scores, data.emphasis);
        }
    },
    
    drawInsightSummary(question, spreadName, scores, elements, trend, emphasis) {
        const totalHeight = this.canvas.height;
        const startY = totalHeight - 350;
        const padding = 50;
        
        this.ctx.save();
        
        let bgColor;
        if (this.currentTemplate === 'forest') {
            bgColor = 'rgba(5, 46, 22, 0.7)';
        } else if (this.currentTemplate === 'dream') {
            bgColor = 'rgba(31, 16, 46, 0.7)';
        } else if (this.currentTemplate === 'ice') {
            bgColor = 'rgba(12, 74, 110, 0.7)';
        } else {
            bgColor = 'rgba(26, 10, 46, 0.7)';
        }
        
        this.ctx.fillStyle = bgColor;
        this.roundRect(padding, startY, this.canvas.width - padding * 2, 240, 15);
        this.ctx.fill();
        
        this.ctx.strokeStyle = this.colors.accent;
        this.ctx.lineWidth = 2;
        this.roundRect(padding, startY, this.canvas.width - padding * 2, 240, 15);
        this.ctx.stroke();
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 16px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('📝 综合分析', padding + 20, startY + 30);
        
        this.ctx.font = '14px "Microsoft YaHei", sans-serif';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        
        let lineY = startY + 60;
        const lineHeight = 24;
        const maxTextWidth = this.canvas.width - padding * 2 - 40;
        
        if (scores) {
            const scoreNames = { love: '感情', career: '事业', wealth: '财运', health: '健康', study: '学业' };
            
            let summary1;
            if (emphasis && scores[emphasis]) {
                const emphasisScore = scores[emphasis];
                summary1 = `本次占卜重点关注【${scoreNames[emphasis]}】维度，评分为${emphasisScore}分。`;
            } else {
                const maxScore = Math.max(...Object.values(scores));
                const maxKey = Object.keys(scores).find(k => scores[k] === maxScore);
                summary1 = `本次占卜中，【${scoreNames[maxKey]}】维度最为突出，评分达到${maxScore}分。`;
            }
            lineY = this.wrapAndDrawText(summary1, padding + 20, lineY, maxTextWidth, 14, lineHeight);
            lineY += lineHeight;
        }
        
        if (elements) {
            const maxElement = Object.entries(elements).sort((a, b) => b[1] - a[1])[0];
            const elementNames = { fire: '火（权杖）', water: '水（圣杯）', air: '风（宝剑）', earth: '土（星币）' };
            const elementMeanings = {
                fire: '代表行动力与激情',
                water: '代表情感与直觉',
                air: '代表思维与沟通',
                earth: '代表物质与稳定'
            };
            
            const summary2 = `牌面元素以【${elementNames[maxElement[0]]}】为主（${maxElement[1]}%），${elementMeanings[maxElement[0]]}。`;
            lineY = this.wrapAndDrawText(summary2, padding + 20, lineY, maxTextWidth, 14, lineHeight);
            lineY += lineHeight;
        }
        
        if (trend && trend.length >= 3) {
            const trendDesc = trend[2] > trend[0] ? '呈上升趋势' : trend[2] < trend[0] ? '呈下降趋势' : '保持稳定';
            const summary3 = `整体发展趋势${trendDesc}，未来能量评分为${trend[2]}分。`;
            lineY = this.wrapAndDrawText(summary3, padding + 20, lineY, maxTextWidth, 14, lineHeight);
            lineY += lineHeight;
        }
        
        const advice = '建议保持积极心态，顺应牌面指引，做出明智选择。';
        this.ctx.fillStyle = this.colors.gold;
        this.wrapAndDrawText('💡 ' + advice, padding + 20, lineY, maxTextWidth, 14, lineHeight);
        
        this.ctx.restore();
    },
    
    wrapAndDrawText(text, x, y, maxWidth, fontSize, lineHeight) {
        this.ctx.font = `${fontSize}px "Microsoft YaHei", sans-serif`;
        
        let currentLine = '';
        let currentY = y;
        
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const testLine = currentLine + char;
            
            if (this.ctx.measureText(testLine).width > maxWidth) {
                this.ctx.fillText(currentLine, x, currentY);
                currentLine = char;
                currentY += lineHeight;
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            this.ctx.fillText(currentLine, x, currentY);
        }
        
        return currentY;
    },
    
    drawInsightHeader() {
        this.ctx.save();
        
        const gradient = this.ctx.createLinearGradient(0, 30, 0, 80);
        gradient.addColorStop(0, this.colors.gold);
        gradient.addColorStop(1, this.currentTemplate === 'forest' ? '#15803d' : '#FFA500');
        this.ctx.fillStyle = gradient;
        this.ctx.font = 'bold 36px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('📊 占卜数据洞察', this.canvas.width / 2, 55);
        
        this.ctx.strokeStyle = this.colors.accent;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(200, 75);
        this.ctx.lineTo(600, 75);
        this.ctx.stroke();
        
        this.ctx.fillStyle = this.colors.textMuted;
        this.ctx.font = '14px "Microsoft YaHei", sans-serif';
        this.ctx.fillText('✧ 数据可视化分析 ✧', this.canvas.width / 2, 100);
        
        this.ctx.restore();
    },
    
    drawRadarChart(centerX, centerY, radius, scores, emphasis) {
        const dimensions = [
            { key: 'love', label: '感情', icon: '💕' },
            { key: 'career', label: '事业', icon: '💼' },
            { key: 'wealth', label: '财运', icon: '💰' },
            { key: 'health', label: '健康', icon: '💪' },
            { key: 'study', label: '学业', icon: '📚' }
        ];
        
        const angleStep = (Math.PI * 2) / dimensions.length;
        const startAngle = -Math.PI / 2;
        
        this.ctx.save();
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        for (let i = 1; i <= 5; i++) {
            this.ctx.beginPath();
            const r = (radius / 5) * i;
            for (let j = 0; j <= dimensions.length; j++) {
                const angle = startAngle + j * angleStep;
                const x = centerX + r * Math.cos(angle);
                const y = centerY + r * Math.sin(angle);
                if (j === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }
        
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        dimensions.forEach((dim, i) => {
            const angle = startAngle + i * angleStep;
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.lineTo(
                centerX + radius * Math.cos(angle),
                centerY + radius * Math.sin(angle)
            );
            this.ctx.stroke();
        });
        
        this.ctx.beginPath();
        dimensions.forEach((dim, i) => {
            const value = scores[dim.key] || 50;
            const r = (value / 100) * radius;
            const angle = startAngle + i * angleStep;
            const x = centerX + r * Math.cos(angle);
            const y = centerY + r * Math.sin(angle);
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        });
        this.ctx.closePath();
        
        let gradient;
        if (this.currentTemplate === 'forest') {
            gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, 'rgba(34, 197, 94, 0.6)');
            gradient.addColorStop(1, 'rgba(22, 163, 74, 0.3)');
        } else if (this.currentTemplate === 'dream') {
            gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, 'rgba(236, 72, 153, 0.6)');
            gradient.addColorStop(1, 'rgba(168, 85, 247, 0.3)');
        } else if (this.currentTemplate === 'ice') {
            gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, 'rgba(125, 211, 252, 0.6)');
            gradient.addColorStop(1, 'rgba(56, 189, 248, 0.3)');
        } else {
            gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, 'rgba(147, 51, 234, 0.6)');
            gradient.addColorStop(1, 'rgba(217, 70, 239, 0.3)');
        }
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        this.ctx.strokeStyle = this.colors.accent;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        dimensions.forEach((dim, i) => {
            const angle = startAngle + i * angleStep;
            const labelRadius = radius + 18;
            const x = centerX + labelRadius * Math.cos(angle);
            const y = centerY + labelRadius * Math.sin(angle);
            
            const isEmphasis = dim.key === emphasis;
            
            this.ctx.fillStyle = isEmphasis ? this.colors.gold : this.colors.text;
            this.ctx.font = `bold ${isEmphasis ? 14 : 13}px "Microsoft YaHei", sans-serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(`${dim.icon} ${dim.label}`, x, y - 8);
            
            const value = scores[dim.key] || 50;
            this.ctx.fillStyle = isEmphasis ? this.colors.gold : this.colors.text;
            this.ctx.font = `bold ${isEmphasis ? 16 : 14}px "Microsoft YaHei", sans-serif`;
            this.ctx.fillText(value, x, y + 10);
        });
        
        this.ctx.restore();
    },
    
    drawPieChart(centerX, centerY, radius, elements) {
        if (!elements) {
            console.warn('drawPieChart: elements 数据为空');
            return;
        }
        
        const elementConfig = [
            { key: 'fire', label: '火', color: '#EF4444', icon: '🔥' },
            { key: 'water', label: '水', color: '#3B82F6', icon: '💧' },
            { key: 'air', label: '风', color: '#10B981', icon: '🌬️' },
            { key: 'earth', label: '土', color: '#F59E0B', icon: '🌍' }
        ];
        
        this.ctx.save();
        
        // 绘制标题
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('⚖️ 四元素分布', centerX, centerY - radius - 25);
        
        // 计算总值
        const total = Object.values(elements).reduce((sum, val) => sum + (val || 0), 0);
        
        if (total === 0) {
            this.ctx.fillStyle = this.colors.textMuted;
            this.ctx.font = '12px "Microsoft YaHei", sans-serif';
            this.ctx.fillText('暂无数据', centerX, centerY);
            this.ctx.restore();
            return;
        }
        
        // 绘制饼图
        let startAngle = -Math.PI / 2; // 从顶部开始
        
        elementConfig.forEach((config, index) => {
            const value = elements[config.key] || 0;
            const ratio = value / total;
            const endAngle = startAngle + ratio * Math.PI * 2;
            
            // 绘制扇形
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = config.color;
            this.ctx.fill();
            
            // 绘制边框
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            startAngle = endAngle;
        });
        
        // 绘制中心圆（可选，创建环形效果）
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius * 0.4, 0, Math.PI * 2);
        this.ctx.fillStyle = this.colors.background;
        this.ctx.fill();
        
        // 绘制图例
        const legendY = centerY + radius + 30;
        const legendSpacing = 80;
        const legendStartX = centerX - (elementConfig.length - 1) * legendSpacing / 2;
        
        elementConfig.forEach((config, index) => {
            const value = elements[config.key] || 0;
            const ratio = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
            const x = legendStartX + index * legendSpacing;
            
            // 图例颜色块
            this.ctx.fillStyle = config.color;
            this.ctx.fillRect(x - 15, legendY - 8, 12, 12);
            
            // 图例文字
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '11px "Microsoft YaHei", sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`${config.icon}${config.label} ${ratio}%`, x, legendY);
        });
        
        this.ctx.restore();
    },
    
    drawDonutChart(centerX, centerY, radius, uprightCount, reversedCount) {
        this.ctx.save();
        
        const total = (uprightCount || 1) + (reversedCount || 0);
        const uprightRatio = (uprightCount || 0) / total;
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('◐ 正逆位分布', centerX, centerY - radius - 25);
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, uprightRatio * Math.PI * 2);
        this.ctx.arc(centerX, centerY, radius * 0.6, uprightRatio * Math.PI * 2, 0, true);
        this.ctx.closePath();
        this.ctx.fillStyle = '#22C55E';
        this.ctx.globalAlpha = 0.8;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, uprightRatio * Math.PI * 2, Math.PI * 2);
        this.ctx.arc(centerX, centerY, radius * 0.6, Math.PI * 2, uprightRatio * Math.PI * 2, true);
        this.ctx.closePath();
        this.ctx.fillStyle = '#EF4444';
        this.ctx.globalAlpha = 0.8;
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('正逆位', centerX, centerY - 8);
        this.ctx.fillText('比例', centerX, centerY + 8);
        
        const legendY = centerY + radius + 30;
        this.ctx.fillStyle = '#22C55E';
        this.ctx.beginPath();
        this.ctx.arc(centerX - 60, legendY, 6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = '12px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`正位 ${Math.round(uprightRatio * 100)}%`, centerX - 50, legendY + 4);
        
        this.ctx.fillStyle = '#EF4444';
        this.ctx.beginPath();
        this.ctx.arc(centerX + 30, legendY, 6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = this.colors.text;
        this.ctx.fillText(`逆位 ${Math.round((1 - uprightRatio) * 100)}%`, centerX + 40, legendY + 4);
        
        this.ctx.restore();
    },
    
    drawBarChart(x, y, width, height, scores, emphasis) {
        this.ctx.save();
        
        const dimensions = [
            { key: 'love', label: '感情', icon: '💕' },
            { key: 'career', label: '事业', icon: '💼' },
            { key: 'wealth', label: '财运', icon: '💰' },
            { key: 'health', label: '健康', icon: '💪' },
            { key: 'study', label: '学业', icon: '📚' }
        ];
        
        const barWidth = (width - 60) / dimensions.length - 10;
        const maxBarHeight = height - 50;
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('📊 维度对比', x + width / 2, y - 10);
        
        dimensions.forEach((dim, i) => {
            const value = scores[dim.key] || 50;
            const barHeight = (value / 100) * maxBarHeight;
            const barX = x + 30 + i * (barWidth + 10);
            const barY = y + height - 30 - barHeight;
            
            const isEmphasis = dim.key === emphasis;
            
            let gradient;
            if (this.currentTemplate === 'forest') {
                gradient = this.ctx.createLinearGradient(barX, barY + barHeight, barX, barY);
                gradient.addColorStop(0, isEmphasis ? '#15803D' : 'rgba(34, 197, 94, 0.5)');
                gradient.addColorStop(1, isEmphasis ? '#22C55E' : 'rgba(34, 197, 94, 0.8)');
            } else if (this.currentTemplate === 'dream') {
                gradient = this.ctx.createLinearGradient(barX, barY + barHeight, barX, barY);
                gradient.addColorStop(0, isEmphasis ? '#A855F7' : 'rgba(236, 72, 153, 0.5)');
                gradient.addColorStop(1, isEmphasis ? '#EC4899' : 'rgba(236, 72, 153, 0.8)');
            } else {
                gradient = this.ctx.createLinearGradient(barX, barY + barHeight, barX, barY);
                gradient.addColorStop(0, isEmphasis ? '#7C3AED' : 'rgba(147, 51, 234, 0.5)');
                gradient.addColorStop(1, isEmphasis ? '#A855F7' : 'rgba(147, 51, 234, 0.8)');
            }
            
            this.ctx.fillStyle = gradient;
            this.roundRect(barX, barY, barWidth, barHeight, 4);
            this.ctx.fill();
            
            if (isEmphasis) {
                this.ctx.strokeStyle = this.colors.gold;
                this.ctx.lineWidth = 2;
                this.roundRect(barX, barY, barWidth, barHeight, 4);
                this.ctx.stroke();
            }
            
            this.ctx.fillStyle = isEmphasis ? this.colors.gold : this.colors.text;
            this.ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value, barX + barWidth / 2, barY - 5);
            
            this.ctx.fillStyle = this.colors.textMuted;
            this.ctx.font = '10px "Microsoft YaHei", sans-serif';
            this.ctx.fillText(dim.icon, barX + barWidth / 2, y + height - 15);
        });
        
        this.ctx.restore();
    },
    
    drawEnergyBars(x, y, width, height, scores, emphasis) {
        this.ctx.save();
        
        const dimensions = [
            { key: 'love', label: '感情', icon: '💕', color: '#EC4899' },
            { key: 'career', label: '事业', icon: '💼', color: '#F59E0B' },
            { key: 'wealth', label: '财运', icon: '💰', color: '#10B981' },
            { key: 'health', label: '健康', icon: '💪', color: '#3B82F6' },
            { key: 'study', label: '学业', icon: '📚', color: '#8B5CF6' }
        ];
        
        const barHeight = (height - 40) / dimensions.length - 8;
        const barMaxWidth = width - 80;
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 14px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        
        dimensions.forEach((dim, i) => {
            const value = scores[dim.key] || 50;
            const barWidth = (value / 100) * barMaxWidth;
            const barY = y + 20 + i * (barHeight + 8);
            
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.roundRect(x + 60, barY, barMaxWidth, barHeight, 4);
            this.ctx.fill();
            
            const isEmphasis = dim.key === emphasis;
            this.ctx.fillStyle = isEmphasis ? dim.color : `${dim.color}99`;
            this.roundRect(x + 60, barY, barWidth, barHeight, 4);
            this.ctx.fill();
            
            this.ctx.fillStyle = this.colors.text;
            this.ctx.font = '12px "Microsoft YaHei", sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`${dim.icon} ${dim.label}`, x, barY + barHeight / 2 + 4);
            
            this.ctx.fillStyle = isEmphasis ? this.colors.gold : this.colors.textMuted;
            this.ctx.font = 'bold 11px "Microsoft YaHei", sans-serif';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(value, x + width - 5, barY + barHeight / 2 + 4);
        });
        
        this.ctx.restore();
    },
    
    drawGaugeChart(centerX, centerY, radius, scores, emphasis) {
        this.ctx.save();
        
        const avgScore = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 5);
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25, false);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 20;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
        
        const scoreRatio = avgScore / 100;
        const endAngle = Math.PI * 0.75 + scoreRatio * Math.PI * 1.5;
        
        let gaugeColor;
        if (avgScore >= 80) gaugeColor = '#22C55E';
        else if (avgScore >= 60) gaugeColor = '#F59E0B';
        else gaugeColor = '#EF4444';
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, Math.PI * 0.75, endAngle, false);
        this.ctx.strokeStyle = gaugeColor;
        this.ctx.lineWidth = 20;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 32px "Microsoft YaHei", sans-serif';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(avgScore, centerX, centerY);
        
        this.ctx.restore();
    },
    
    drawCompareChart(x, y, width, height, scores) {
        this.ctx.save();
        
        const dimensions = [
            { key: 'love', label: '感情', color: '#EC4899' },
            { key: 'career', label: '事业', color: '#F59E0B' },
            { key: 'wealth', label: '财运', color: '#10B981' },
            { key: 'health', label: '健康', color: '#EF4444' },
            { key: 'study', label: '学业', color: '#3B82F6' }
        ];
        
        const centerX = x + width / 2;
        const centerY = y + height / 2;
        const radius = Math.min(width, height) / 2 - 30;
        const ringWidth = 15;
        
        const avgScore = Math.round(dimensions.reduce((a, d) => a + (scores[d.key] || 50), 0) / dimensions.length);
        
        dimensions.forEach((dim, i) => {
            const value = scores[dim.key] || 50;
            const angle = (i / dimensions.length) * Math.PI * 2 - Math.PI / 2;
            const endAngle = angle + (value / 100) * (Math.PI * 2 / dimensions.length);
            const r = radius - 5;
            
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, r, angle, endAngle);
            this.ctx.strokeStyle = dim.color;
            this.ctx.lineWidth = ringWidth;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();
        });
        
        this.ctx.fillStyle = this.colors.text;
        this.ctx.font = 'bold 24px "Microsoft YaHei", sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(avgScore, centerX, centerY);
        
        const legendY = centerY + radius + 25;
        dimensions.forEach((dim, i) => {
            const lx = centerX - 60 + i * 60;
            this.ctx.fillStyle = dim.color;
            this.ctx.beginPath();
            this.ctx.arc(lx, legendY, 5, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = this.colors.textMuted;
            this.ctx.font = '10px "Microsoft YaHei", sans-serif';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(dim.label, lx + 10, legendY + 3);
        });
        
        this.ctx.restore();
    },
    
    drawInsightFooter(question, spreadName) {
        const y = this.canvas.height - 80;
        
        this.ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(100, y - 20);
        this.ctx.lineTo(this.canvas.width - 100, y - 20);
        this.ctx.stroke();
        
        if (question) {
            const maxLen = 30;
            const shortQuestion = question.length > maxLen ? question.substring(0, maxLen) + '...' : question;
            this.ctx.fillStyle = this.colors.textMuted;
            this.ctx.font = '12px "Microsoft YaHei", sans-serif';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(`问题：「${shortQuestion}」`, this.canvas.width / 2, y);
        }
        
        if (spreadName) {
            this.ctx.fillStyle = this.colors.textMuted;
            this.ctx.font = '12px "Microsoft YaHei", sans-serif';
            this.ctx.fillText(`牌阵：${spreadName}`, this.canvas.width / 2, y + 20);
        }
        
        const now = new Date();
        const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
        
        this.ctx.fillStyle = this.colors.textMuted;
        this.ctx.font = '11px "Microsoft YaHei", sans-serif';
        this.ctx.fillText(`占卜时间：${dateStr}`, this.canvas.width / 2, y + 45);
        
        this.ctx.fillStyle = this.colors.gold;
        this.ctx.font = '11px "Microsoft YaHei", sans-serif';
        this.ctx.fillText('神秘塔罗 · AI智能占卜', this.canvas.width / 2, y + 65);
    },
    
    async generateMainPageOnly(options) {
        const pages = [];
        
        const mainImage = await this.generateShareImage(options);
        pages.push({
            type: 'main',
            label: '占卜结果',
            imageData: mainImage
        });
        
        this.currentPages = pages;
        this.currentPageIndex = 0;
        
        return pages;
    },
    
    async generateAllPages(options) {
        const pages = [];
        
        const mainImage = await this.generateShareImage(options);
        pages.push({
            type: 'main',
            label: '占卜结果',
            imageData: mainImage
        });
        
        // 只有在明确有数据时才生成数据洞察
        if (options.scores || options.elements || options.trend) {
            const insightImage = await this.generateInsightImage(options);
            pages.push({
                type: 'insight',
                label: '数据洞察',
                imageData: insightImage
            });
        }
        
        this.currentPages = pages;
        this.currentPageIndex = 0;
        
        return pages;
    },
    
    showShareModalWithPages(pages, options) {
        this.currentPages = pages;
        this.currentPageIndex = 0;
        this._shareOptions = options;
        
        const existingModal = document.getElementById('share-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.id = 'share-modal';
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-modal-content share-modal-multi">
                <button class="share-modal-close" onclick="TarotShare.closeShareModal()">×</button>
                <h3 class="share-modal-title">分享占卜结果</h3>
                
                <div class="share-template-selector">
                    <span class="template-label">选择风格：</span>
                    <div class="template-options">
                        ${Object.entries(this.templates).map(([id, t]) => `
                            <button class="template-btn ${id === this.currentTemplate ? 'active' : ''}" 
                                    data-template="${id}"
                                    onclick="TarotShare.selectTemplateWithPages('${id}')">
                                <span class="template-icon">${t.icon}</span>
                                <span class="template-name">${t.name}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="share-page-tabs">
                    ${pages.map((page, i) => `
                        <button class="share-page-tab ${i === 0 ? 'active' : ''}" 
                                data-page="${i}"
                                onclick="TarotShare.switchPage(${i})">
                            ${i === 0 ? '🎴' : '📊'} ${page.label}
                        </button>
                    `).join('')}
                </div>
                
                <div class="share-preview">
                    <img src="${pages[0].imageData}" alt="占卜结果" class="share-image" id="share-preview-image">
                </div>
                
                <div class="share-actions">
                    <button class="share-btn share-btn-primary" onclick="TarotShare.handleDownload()">
                        <span>📥 保存当前页</span>
                    </button>
                    <button class="share-btn share-btn-secondary" onclick="TarotShare.handleDownloadAll()">
                        <span>📥 保存全部</span>
                    </button>
                    <button class="share-btn share-btn-secondary" onclick="TarotShare.handleShare()">
                        <span>📤 分享</span>
                    </button>
                </div>
                <p class="share-hint">长按图片可保存到相册 | 可切换页面查看不同内容</p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => modal.classList.add('show'), 10);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeShareModal();
            }
        });
        
        this._currentImageData = pages[0].imageData;
    },
    
    switchPage(index) {
        if (index < 0 || index >= this.currentPages.length) return;
        
        this.currentPageIndex = index;
        this._currentImageData = this.currentPages[index].imageData;
        
        document.querySelectorAll('.share-page-tab').forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
        });
        
        const previewImg = document.getElementById('share-preview-image');
        if (previewImg) {
            previewImg.src = this.currentPages[index].imageData;
        }
    },
    
    async selectTemplateWithPages(templateId) {
        if (!this._shareOptions) return;
        
        this.currentTemplate = templateId;
        
        document.querySelectorAll('.template-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.template === templateId);
        });
        
        const previewImg = document.getElementById('share-preview-image');
        if (previewImg) {
            previewImg.style.opacity = '0.5';
        }
        
        const pages = await this.generateAllPages({
            ...this._shareOptions,
            template: templateId
        });
        
        this.currentPages = pages;
        this._currentImageData = pages[this.currentPageIndex].imageData;
        
        if (previewImg) {
            previewImg.src = this._currentImageData;
            previewImg.style.opacity = '1';
        }
        
        const tabsContainer = document.querySelector('.share-page-tabs');
        if (tabsContainer) {
            tabsContainer.innerHTML = pages.map((page, i) => `
                <button class="share-page-tab ${i === this.currentPageIndex ? 'active' : ''}" 
                        data-page="${i}"
                        onclick="TarotShare.switchPage(${i})">
                    ${i === 0 ? '🎴' : '📊'} ${page.label}
                </button>
            `).join('');
        }
    },
    
    async handleDownloadAll() {
        const now = new Date();
        const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}`;
        const templateName = this.templates[this.currentTemplate].name;
        
        for (let i = 0; i < this.currentPages.length; i++) {
            const page = this.currentPages[i];
            const filename = `塔罗占卜_${templateName}_${page.label}_${dateStr}.png`;
            await this.downloadShareImage(page.imageData, filename);
            
            if (i < this.currentPages.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }
};

window.TarotShare = TarotShare;
