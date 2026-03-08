const LoadingWheel = {
    intervals: {},
    
    messages: {
        recommend: {
            phase1: [
                "正在连接宇宙能量...",
                "命运之轮开始转动...",
                "星辰正在排列..."
            ],
            phase2: [
                "感知你的问题能量...",
                "时空的帷幕正在揭开...",
                "古老的智慧正在苏醒..."
            ],
            phase3: [
                "牌阵正在形成...",
                "命运的线正在交汇...",
                "答案即将显现..."
            ]
        },
        reading: {
            phase1: [
                "正在连接宇宙能量...",
                "命运之轮缓缓转动...",
                "星辰指引着答案..."
            ],
            phase2: [
                "感知牌面的能量波动...",
                "解读命运的密码...",
                "神秘的信息正在传达..."
            ],
            phase3: [
                "答案正在浮现...",
                "真相即将揭示...",
                "命运的启示即将来临..."
            ]
        },
        chat: {
            phase1: [
                "正在思考...",
                "连接智慧之源...",
                "灵感正在汇聚..."
            ],
            phase2: [
                "深入探索答案...",
                "解读命运的讯息...",
                "神秘力量指引中..."
            ],
            phase3: [
                "答案即将呈现...",
                "真相逐渐明朗...",
                "智慧的火花闪现..."
            ]
        }
    },
    
    start(type, textElementId) {
        const textElement = document.getElementById(textElementId);
        if (!textElement) return;
        
        if (this.intervals[type]) {
            clearInterval(this.intervals[type]);
        }
        
        const messages = this.messages[type] || this.messages.recommend;
        let phase = 1;
        let messageIndex = 0;
        
        const updateText = () => {
            let currentMessages;
            if (phase === 1) currentMessages = messages.phase1;
            else if (phase === 2) currentMessages = messages.phase2;
            else currentMessages = messages.phase3;
            
            textElement.style.opacity = '0';
            
            setTimeout(() => {
                textElement.textContent = currentMessages[messageIndex];
                textElement.style.opacity = '1';
                messageIndex = (messageIndex + 1) % currentMessages.length;
            }, 300);
        };
        
        updateText();
        
        this.intervals[type] = setInterval(() => {
            messageIndex++;
            if (messageIndex >= messages.phase1.length) {
                messageIndex = 0;
                phase++;
                if (phase > 3) phase = 3;
            }
            updateText();
        }, 3000);
    },
    
    stop(type) {
        if (this.intervals[type]) {
            clearInterval(this.intervals[type]);
            delete this.intervals[type];
        }
    },
    
    stopAll() {
        Object.keys(this.intervals).forEach(type => {
            this.stop(type);
        });
    },
    
    generateInlineWheelHTML() {
        return `
            <div class="wheel-loading chat-inline">
                <div class="wheel-container">
                    <div class="wheel-ripple"></div>
                    <div class="wheel-ripple"></div>
                    
                    <div class="wheel-outer-stars">
                        <span class="wheel-star large">✦</span>
                        <span class="wheel-star small">·</span>
                        <span class="wheel-star large">✧</span>
                        <span class="wheel-star small">·</span>
                        <span class="wheel-star large">✦</span>
                        <span class="wheel-star small">·</span>
                        <span class="wheel-star large">✧</span>
                        <span class="wheel-star small">·</span>
                    </div>
                    
                    <div class="wheel-planets">
                        <span class="wheel-planet">☉</span>
                        <span class="wheel-planet">☽</span>
                        <span class="wheel-planet">☿</span>
                        <span class="wheel-planet">♀</span>
                        <span class="wheel-planet">♂</span>
                        <span class="wheel-planet">♃</span>
                        <span class="wheel-planet">♄</span>
                    </div>
                    
                    <div class="wheel-runes">
                        <span class="wheel-rune">ᚠ</span>
                        <span class="wheel-rune">ᚢ</span>
                        <span class="wheel-rune">ᚦ</span>
                        <span class="wheel-rune">ᚨ</span>
                        <span class="wheel-rune">ᚱ</span>
                        <span class="wheel-rune">ᚲ</span>
                        <span class="wheel-rune">ᚷ</span>
                        <span class="wheel-rune">ᚹ</span>
                    </div>
                    
                    <div class="wheel-center">
                        <span class="wheel-center-icon">🔮</span>
                    </div>
                </div>
                <div class="wheel-text">
                    <span class="wheel-text-content wheel-dynamic-text">正在思考...</span>
                </div>
            </div>
        `;
    }
};
