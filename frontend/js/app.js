/**
 * 塔罗占卜应用主模块
 * @namespace app
 * @description 管理整个占卜流程的核心应用对象
 * 
 * @property {Object|null} currentSpread - 当前选择的牌阵
 * @property {Array} deck - 完整的78张塔罗牌组
 * @property {Array} shuffledDeck - 洗牌后的牌组
 * @property {Array<boolean>} cardReversals - 每张牌的正逆位状态
 * @property {Array} drawnCards - 已抽取的牌
 * @property {number} shuffleCount - 洗牌次数
 * @property {number} cardsToDraw - 需要抽取的牌数
 * @property {boolean} isDrawing - 是否正在抽牌中
 * @property {string} userQuestion - 用户的问题
 * @property {string} aiInterpretation - AI解读内容
 * @property {Array} conversationHistory - 对话历史
 * @property {string} aiSummary - AI总结
 * @property {boolean} isAILoading - AI是否正在加载
 * @property {string} currentPhase - 当前阶段 (shuffle/draw/result)
 * @property {Array} chatMessages - 聊天消息列表
 * @property {boolean} isChatCollapsed - 聊天侧栏是否收起
 */
const app = {
    currentSpread: null,
    deck: [],
    shuffledDeck: [],
    cardReversals: [],
    drawnCards: [],
    shuffleCount: 0,
    cardsToDraw: 0,
    isDrawing: false,
    
    userQuestion: '',
    aiInterpretation: '',
    conversationHistory: [],
    aiSummary: '',
    isAILoading: false,
    recommendedSpreadId: null,
    recommendReason: '',
    
    currentPhase: 'shuffle',
    chatMessages: [],
    isChatCollapsed: false,
    currentGuideStep: 1,
    totalGuideSteps: 5,
    _followupMode: false,

    /**
     * 初始化应用
     * @description 设置错误监控、加载牌组、初始化UI组件
     * @returns {void}
     */
    init() {
        if (typeof ErrorMonitor !== 'undefined') {
            ErrorMonitor.init({
                environment: 'development',
                version: '1.5.0',
                config: {
                    captureGlobalErrors: true,
                    capturePromiseRejections: true,
                    captureConsoleErrors: false,
                    reportInterval: 0
                }
            });
        }
        
        this.deck = TarotDeck.getFullDeck();
        this.renderSpreads();
        this.createStars();
        this.initUserUI();
        this.initLoginForm();
        this.initChatInput();
        this.initSoundButton();
        this.initAIButton();
        this.initRitualButton();
        this.initMobileTouchEvents();
        this.checkFirstVisit();
        this.initKnowledge();
    },

    async initKnowledge() {
        await TarotKnowledge.init();
        if (TarotKnowledge.isLoaded()) {
            console.log('知识库来源:', TarotKnowledge.getSource());
        }
    },

    initSoundButton() {
        const btnSound = document.getElementById('btn-sound');
        if (btnSound) {
            this.updateSoundButton();
        }
    },

    initChatInput() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendChatMessage();
                }
            });
        }
    },

    initRitualButton() {
        if (typeof RitualEffects !== 'undefined') {
            RitualEffects.init();
        }
        this.updateRitualButton();
    },

    updateSoundButton() {
        const btnSound = document.getElementById('btn-sound');
        if (btnSound) {
            const icon = btnSound.querySelector('.sound-icon');
            if (SoundManager.isEnabled()) {
                icon.textContent = '🔊';
                btnSound.classList.remove('muted');
            } else {
                icon.textContent = '🔇';
                btnSound.classList.add('muted');
            }
        }
    },

    toggleSound() {
        SoundManager.toggle();
        this.updateSoundButton();
        if (SoundManager.isEnabled()) {
            SoundManager.play('click');
        }
    },

    initMobileTouchEvents() {
        if (!('ontouchstart' in window)) return;
        
        const guideNextBtn = document.getElementById('guide-next-btn');
        const guidePrevBtn = document.getElementById('guide-prev-btn');
        const guideModal = document.getElementById('guide-modal');
        
        if (guideNextBtn) {
            guideNextBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Next button touched');
                this.nextGuideStep();
            }, { passive: false });
            
            guideNextBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
            }, { passive: false });
        }
        
        if (guidePrevBtn) {
            guidePrevBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Prev button touched');
                this.prevGuideStep();
            }, { passive: false });
            
            guidePrevBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
            }, { passive: false });
        }
        
        const closeBtn = guideModal ? guideModal.querySelector('.modal-close') : null;
        if (closeBtn) {
            closeBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close button touched');
                this.hideGuide();
            }, { passive: false });
        }
    },

    toggleAI() {
        CONFIG.aiEnabled = !CONFIG.aiEnabled;
        localStorage.setItem('aiEnabled', CONFIG.aiEnabled);
        this.updateAIButton();
        this.showToast(CONFIG.aiEnabled ? 'AI已启用' : 'AI已禁用（测试模式）', 'info');
        if (SoundManager.isEnabled()) {
            SoundManager.play('click');
        }
    },

    updateAIButton() {
        const btnAI = document.getElementById('btn-ai');
        if (btnAI) {
            if (CONFIG.aiEnabled) {
                btnAI.classList.add('active');
                btnAI.title = 'AI：已启用';
            } else {
                btnAI.classList.remove('active');
                btnAI.title = 'AI：已禁用（测试模式）';
            }
        }
    },

    initAIButton() {
        const saved = localStorage.getItem('aiEnabled');
        if (saved !== null) {
            CONFIG.aiEnabled = saved === 'true';
        }
        this.updateAIButton();
    },

    async toggleRitual() {
        if (typeof RitualEffects === 'undefined') {
            await ModuleLoader.load('ritual');
        }
        if (typeof RitualEffects !== 'undefined') {
            const enabled = RitualEffects.toggle();
            this.updateRitualButton();
            if (enabled && SoundManager.isEnabled()) {
                SoundManager.play('click');
            }
        }
    },

    updateRitualButton() {
        const btnRitual = document.getElementById('btn-ritual');
        if (btnRitual && typeof RitualEffects !== 'undefined') {
            if (RitualEffects.enabled) {
                btnRitual.classList.add('active');
                btnRitual.title = '仪式感：开启';
            } else {
                btnRitual.classList.remove('active');
                btnRitual.title = '仪式感：关闭';
            }
        }
    },

    checkFirstVisit() {
        if (!localStorage.getItem('hasVisited')) {
            setTimeout(() => {
                this.startGuide();
            }, 1000);
        }
    },

    startGuide() {
        this.currentGuideStep = 1;
        document.getElementById('guide-modal').style.display = 'flex';
        this.showGuideStep(1);
    },

    hideGuide() {
        document.getElementById('guide-modal').style.display = 'none';
        localStorage.setItem('hasVisited', 'true');
    },

    showGuideStep(step) {
        for (let i = 1; i <= this.totalGuideSteps; i++) {
            const stepEl = document.getElementById(`guide-step-${i}`);
            if (stepEl) {
                stepEl.style.display = i === step ? 'block' : 'none';
            }
        }
        
        const prevBtn = document.getElementById('guide-prev-btn');
        const nextBtn = document.getElementById('guide-next-btn');
        
        if (prevBtn) {
            prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';
        }
        
        if (nextBtn) {
            nextBtn.querySelector('span').textContent = step === this.totalGuideSteps ? '开始占卜' : '下一步';
        }
    },

    nextGuideStep() {
        SoundManager.play('click');
        
        if (this.currentGuideStep >= this.totalGuideSteps) {
            this.hideGuide();
            return;
        }
        
        this.currentGuideStep++;
        this.showGuideStep(this.currentGuideStep);
    },

    prevGuideStep() {
        SoundManager.play('click');
        
        if (this.currentGuideStep <= 1) return;
        
        this.currentGuideStep--;
        this.showGuideStep(this.currentGuideStep);
    },

    initUserUI() {
        const userBar = document.getElementById('user-bar');
        const btnLogin = document.getElementById('btn-login');
        
        if (UserService.isLoggedIn()) {
            userBar.style.display = 'flex';
            btnLogin.style.display = 'none';
            document.getElementById('user-nickname').textContent = UserService.user.nickname || '用户';
            const credits = UserService.user.credits || 0;
            const readingCount = UserService.user.readingCount || 0;
            document.getElementById('user-readings').textContent = `${readingCount}次`;
            document.getElementById('user-credits').textContent = `${credits}分`;
        } else {
            userBar.style.display = 'none';
            btnLogin.style.display = 'block';
        }
    },

    showLoginModal() {
        document.getElementById('login-modal').style.display = 'flex';
    },

    hideLoginModal() {
        document.getElementById('login-modal').style.display = 'none';
    },

    switchLoginTab(tab) {
        const tabs = document.querySelectorAll('.tab-btn');
        tabs.forEach(t => t.classList.remove('active'));
        
        if (tab === 'login') {
            tabs[0].classList.add('active');
            document.getElementById('login-form').style.display = 'flex';
            document.getElementById('register-form').style.display = 'none';
        } else {
            tabs[1].classList.add('active');
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('register-form').style.display = 'flex';
        }
    },

    initLoginForm() {
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = document.getElementById('login-phone').value;
            const password = document.getElementById('login-password').value;
            
            const result = await UserService.login(phone, password);
            
            if (result.success) {
                this.hideLoginModal();
                this.initUserUI();
            } else {
                alert(result.message || '登录失败');
            }
        });

        document.getElementById('register-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const phone = document.getElementById('register-phone').value;
            const password = document.getElementById('register-password').value;
            const nickname = document.getElementById('register-nickname').value;
            
            const result = await UserService.register(phone, password, nickname);
            
            if (result.success) {
                this.hideLoginModal();
                this.initUserUI();
            } else {
                alert(result.message || '注册失败');
            }
        });
    },

    async guestLogin() {
        const result = await UserService.guestLogin();
        if (result.success) {
            this.hideLoginModal();
            this.initUserUI();
        }
    },

    logout() {
        UserService.logout();
        this.initUserUI();
    },

    showForgotPassword() {
        alert('如需重置密码，请联系客服：support@tarot.com');
    },

    showUserAgreement() {
        document.getElementById('user-agreement-modal').style.display = 'flex';
    },

    hideUserAgreement() {
        document.getElementById('user-agreement-modal').style.display = 'none';
    },

    showPrivacyPolicy() {
        document.getElementById('privacy-policy-modal').style.display = 'flex';
    },

    hidePrivacyPolicy() {
        document.getElementById('privacy-policy-modal').style.display = 'none';
    },

    showDisclaimer() {
        document.getElementById('disclaimer-modal').style.display = 'flex';
    },

    hideDisclaimer() {
        document.getElementById('disclaimer-modal').style.display = 'none';
        localStorage.setItem('disclaimerAgreed', 'true');
        if (this._pendingStartReading) {
            this._pendingStartReading = false;
            this.showScreen('question-screen');
        }
    },

    createStars() {
        const starsContainer = document.querySelector('.stars');
        if (!starsContainer) return;
        
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 3}s`;
            star.style.width = `${Math.random() * 3 + 1}px`;
            star.style.height = star.style.width;
            starsContainer.appendChild(star);
        }
    },

    showScreen(screenId) {
        SoundManager.play('click');
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
            screen.scrollTop = 0;
        }
        if (typeof RitualEffects !== 'undefined') {
            RitualEffects.updateVisibility();
        }
    },

    startReading() {
        if (!localStorage.getItem('disclaimerAgreed')) {
            this.showDisclaimer();
            this._pendingStartReading = true;
            return;
        }
        this.showScreen('question-screen');
    },

    submitQuestion() {
        const input = document.getElementById('user-question-input');
        this.userQuestion = input ? input.value.trim() : '';
        this.showScreen('spread-select');
    },

    skipQuestion() {
        this.userQuestion = '';
        this.showScreen('spread-select');
    },

    chooseManualSpread() {
        const input = document.getElementById('user-question-input');
        this.userQuestion = input ? input.value.trim() : '';
        this.showScreen('spread-select');
    },

    toggleCategory(category) {
        const questions = document.getElementById(`${category}-questions`);
        const arrow = document.getElementById(`${category}-arrow`);
        
        if (questions.style.display === 'none' || questions.style.display === '') {
            questions.style.display = 'flex';
            arrow.textContent = '▲';
        } else {
            questions.style.display = 'none';
            arrow.textContent = '▼';
        }
    },

    selectQuestion(question) {
        document.getElementById('user-question-input').value = question;
        document.getElementById('user-question-input').focus();
    },

    async requestAIRecommend() {
        const input = document.getElementById('user-question-input');
        this.userQuestion = input ? input.value.trim() : '';
        
        this.showScreen('ai-recommend-screen');
        
        document.getElementById('ai-recommend-loading').style.display = 'flex';
        document.getElementById('ai-recommend-result').style.display = 'none';
        document.getElementById('ai-recommend-hint').textContent = '正在分析您的问题...';
        
        if (typeof LoadingWheel === 'undefined') {
            await ModuleLoader.load('loadingWheel');
        }
        
        if (typeof LoadingWheel !== 'undefined') {
            LoadingWheel.start('recommend', 'wheel-text-recommend');
        }
        
        try {
            const result = await TarotAI.recommendSpread(this.userQuestion);
            this.recommendedSpreadId = result.spreadId;
            this.recommendReason = result.reason;
            
            const spread = Spreads.getSpreadById(result.spreadId);
            if (spread) {
                document.getElementById('recommend-icon').textContent = spread.icon;
                document.getElementById('recommend-name').textContent = spread.name;
                document.getElementById('recommend-name-en').textContent = spread.nameEn;
                document.getElementById('recommend-cards').textContent = `${spread.cardCount}张牌 · ${spread.difficulty}`;
                document.getElementById('recommend-reason').textContent = result.reason;
            }
            
            if (typeof LoadingWheel !== 'undefined') {
                LoadingWheel.stop('recommend');
            }
            document.getElementById('ai-recommend-loading').style.display = 'none';
            document.getElementById('ai-recommend-result').style.display = 'block';
            document.getElementById('ai-recommend-hint').textContent = '根据您的问题，AI为您推荐以下牌阵：';
            
        } catch (error) {
            if (typeof LoadingWheel !== 'undefined') {
                LoadingWheel.stop('recommend');
            }
            document.getElementById('ai-recommend-hint').textContent = '推荐失败，请手动选择牌阵';
            console.error('AI推荐失败:', error);
            
            setTimeout(() => {
                this.showScreen('spread-select');
            }, 2000);
        }
    },

    acceptRecommend() {
        if (this.recommendedSpreadId) {
            this.selectSpread(this.recommendedSpreadId, true);
        }
    },

    showOtherSpreads() {
        this.showScreen('spread-select');
    },

    renderSpreads() {
        const grid = document.getElementById('spread-grid');
        if (!grid) return;

        grid.innerHTML = Spreads.getAllSpreads().map(spread => `
            <div class="spread-card" onclick="app.selectSpread('${spread.id}')">
                <div class="spread-icon">${spread.icon}</div>
                <div class="spread-info">
                    <h3>${spread.name}</h3>
                    <p class="spread-name-en">${spread.nameEn}</p>
                    <p class="spread-cards">${spread.cardCount}张牌</p>
                    <span class="spread-difficulty ${spread.difficulty}">${spread.difficulty}</span>
                </div>
                <p class="spread-desc">${spread.description}</p>
            </div>
        `).join('');
    },

    /**
     * 选择牌阵并初始化占卜流程
     * @param {string} spreadId - 牌阵ID
     * @param {boolean} [isAIRecommended=false] - 是否为AI推荐
     * @returns {void}
     */
    async selectSpread(spreadId, isAIRecommended = false) {
        if (UserService.isLoggedIn()) {
            const readingCount = UserService.user?.readingCount || 0;
            if (readingCount < 1) {
                this.showCreditsInsufficient();
                return;
            }
        }
        
        this.currentSpread = Spreads.getSpreadById(spreadId);
        this.cardsToDraw = this.currentSpread.cardCount;
        this.drawnCards = [];
        this.shuffleCount = 0;
        this.shuffledDeck = [];
        this.cardReversals = new Array(this.deck.length).fill(false);
        this.conversationHistory = [];
        this.aiInterpretation = '';
        this.aiSummary = '';
        this.chatMessages = [];
        this._followupMode = false;
        this._interpretationStarted = false;
        
        this.showScreen('main-process-screen');
        this.showPhase('shuffle');
        
        this.addAIMessage(`我已为您选择了【${this.currentSpread.name}】牌阵。\n\n${isAIRecommended ? this.recommendReason : '这个牌阵适合解读您的问题。'}\n\n现在请开始洗牌，在洗牌过程中，请在心中默念您的问题。`);
    },

    showCreditsInsufficient() {
        CreditsManager.showExchangeModal();
    },

    /**
     * 显示指定阶段的UI
     * @param {string} phase - 阶段名称 (shuffle/draw/result)
     * @returns {void}
     */
    showPhase(phase) {
        this.currentPhase = phase;
        document.querySelectorAll('.process-phase').forEach(p => p.style.display = 'none');
        const phaseEl = document.getElementById(`phase-${phase}`);
        if (phaseEl) {
            phaseEl.style.display = 'flex';
        }
        
        if (typeof RitualEffects !== 'undefined') {
            RitualEffects.updateVisibility();
        }
        
        if (phase === 'shuffle') {
            this.showShufflePhase(0);
        }
    },

    /**
     * 切换聊天侧栏展开/收起状态
     * @returns {void}
     */
    toggleChatSidebar() {
        const sidebar = document.getElementById('chat-sidebar');
        const toggleBtn = document.querySelector('.chat-toggle-btn');
        this.isChatCollapsed = !this.isChatCollapsed;
        if (this.isChatCollapsed) {
            sidebar.classList.add('collapsed');
            if (toggleBtn) toggleBtn.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
            if (toggleBtn) toggleBtn.classList.remove('collapsed');
        }
    },

    toggleChatFullscreen() {
        const sidebar = document.getElementById('chat-sidebar');
        const toggleBtn = document.querySelector('.chat-toggle-btn');
        
        if (sidebar.classList.contains('fullscreen')) {
            sidebar.classList.add('closing');
            setTimeout(() => {
                sidebar.classList.remove('fullscreen', 'closing');
                if (toggleBtn) toggleBtn.style.display = '';
                document.body.style.overflow = '';
            }, 400);
        } else {
            sidebar.classList.add('fullscreen');
            sidebar.classList.remove('collapsed');
            if (toggleBtn) toggleBtn.style.display = 'none';
            this.isChatCollapsed = false;
            document.body.style.overflow = 'hidden';
            const chatInput = document.getElementById('chat-input');
            if (chatInput) chatInput.focus();
        }
    },

    /**
     * 添加AI消息到聊天记录（支持打字机效果）
     * @param {string} content - 消息内容
     * @param {Array<Object>|null} [quickActions=null] - 快捷操作按钮
     * @param {boolean} [useTypewriter=true] - 是否使用打字机效果
     * @returns {void}
     */
    addAIMessage(content, quickActions = null, useTypewriter = true) {
        console.log('=== addAIMessage 被调用 ===');
        console.log('内容:', content?.substring(0, 100));
        console.log('内容长度:', content?.length);
        
        this.chatMessages.push({ role: 'ai', content });
        console.log('当前聊天消息数:', this.chatMessages.length);
        
        const isReadingResult = content.includes('【') && 
                                 (content.includes('核心启示') || 
                                  content.includes('最终指引') ||
                                  content.includes('牌面启示') ||
                                  content.includes('第') && content.includes('张'));
        
        console.log('是否是解读结果:', isReadingResult);
        
        if (useTypewriter && isReadingResult && content.length > 100) {
            // 打字机效果（仅用于长篇解读）
            console.log('使用打字机效果');
            this.renderChatMessages(null, false);  // 先显示空消息容器
            this.saveChatHistory();
            
            const messageIndex = this.chatMessages.length - 1;
            this.typewriterEffect(content, messageIndex).then(() => {
                console.log('打字机效果完成');
                if (quickActions) {
                    this.renderChatMessages(quickActions, true);
                }
            });
        } else {
            // 普通聊天消息：直接显示
            console.log('普通消息，直接渲染');
            this.renderChatMessages(quickActions, false);  // ✅ 修改为false，立即显示内容
            this.saveChatHistory();
            
            console.log('消息已添加到界面');
        }
    },

    addUserMessage(content) {
        this.chatMessages.push({ role: 'user', content });
        this.renderChatMessages();
        this.saveChatHistory();
    },

    renderChatMessages(quickActions = null, emptyLastMessage = false) {
        const container = document.getElementById('chat-messages');
        if (!container) {
            console.error('❌ 聊天消息容器不存在');
            return;
        }
        
        console.log('=== renderChatMessages 被调用 ===');
        console.log('消息数量:', this.chatMessages.length);
        console.log('emptyLastMessage:', emptyLastMessage);
        
        let html = this.chatMessages.map((msg, index) => {
            const isLastMessage = index === this.chatMessages.length - 1;
            const shouldShowContent = !(emptyLastMessage && isLastMessage);
            
            console.log(`消息${index}: ${msg.role}, isLast=${isLastMessage}, show=${shouldShowContent}`);
            
            return `
                <div class="chat-message ${msg.role}">
                    <div class="message-role">
                        ${msg.role === 'ai' ? '🌙 塔罗师' : '👤 你'}
                    </div>
                    <div class="message-content">${shouldShowContent ? this.formatMessageContent(msg.content) : ''}</div>
                </div>
            `;
        }).join('');
        
        if (quickActions) {
            html += `
                <div class="quick-actions">
                    ${quickActions.map(action => `
                        <button class="quick-action-btn" onclick="app.handleQuickAction('${action.action}')">${action.label}</button>
                    `).join('')}
                </div>
            `;
        }
        
        container.innerHTML = html;
        container.scrollTop = container.scrollHeight;
        
        console.log('✅ 消息已渲染到界面');
    },

    formatMessageContent(content) {
        return content.replace(/\n/g, '<br>');
    },

    /**
     * 打字机效果显示消息（速读速度）
     * @param {string} content - 要显示的内容
     * @param {string} messageIndex - 消息索引
     * @param {number} speed - 每个字符的延迟（毫秒），默认25ms（速读速度，约2400字/分钟）
     */
    async typewriterEffect(content, messageIndex, speed = 25) {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        const messageDiv = container.children[messageIndex];
        if (!messageDiv) return;

        const contentDiv = messageDiv.querySelector('.message-content');
        if (!contentDiv) return;

        const formattedContent = content.replace(/\n/g, '<br>');
        let displayText = '';
        let i = 0;

        const type = () => {
            return new Promise((resolve) => {
                const timer = setInterval(() => {
                    if (i < formattedContent.length) {
                        const char = formattedContent[i];
                        
                        if (char === '<' && formattedContent.substring(i, i + 4) === '<br>') {
                            displayText += '<br>';
                            i += 4;
                        } else {
                            displayText += char;
                            i++;
                        }
                        
                        contentDiv.innerHTML = displayText;
                        container.scrollTop = container.scrollHeight;
                    } else {
                        clearInterval(timer);
                        resolve();
                    }
                }, speed);
            });
        };

        await type();
    },

    showTypingIndicator() {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-typing';
        typingDiv.id = 'typing-indicator';
        
        const renderLoadingWheel = () => {
            if (typeof LoadingWheel !== 'undefined') {
                typingDiv.innerHTML = LoadingWheel.generateInlineWheelHTML();
                container.appendChild(typingDiv);
                container.scrollTop = container.scrollHeight;
                
                const textEl = typingDiv.querySelector('.wheel-dynamic-text');
                if (textEl) {
                    this._chatLoadingInterval = setInterval(() => {
                        const messages = [
                            "正在思考...", "连接智慧之源...", "灵感正在汇聚...",
                            "深入探索答案...", "解读命运的讯息...", "答案即将呈现..."
                        ];
                        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                        textEl.style.opacity = '0';
                        setTimeout(() => {
                            textEl.textContent = randomMsg;
                            textEl.style.opacity = '1';
                        }, 200);
                    }, 3000);
                }
            } else {
                typingDiv.innerHTML = `
                    <div class="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <span style="color: var(--text-muted); font-size: 0.85rem;">正在思考...</span>
                `;
                container.appendChild(typingDiv);
                container.scrollTop = container.scrollHeight;
            }
        };
        
        if (typeof LoadingWheel === 'undefined') {
            ModuleLoader.load('loadingWheel').then(() => {
                renderLoadingWheel();
            }).catch(() => {
                renderLoadingWheel();
            });
        } else {
            renderLoadingWheel();
        }
    },

    hideTypingIndicator() {
        const typing = document.getElementById('typing-indicator');
        if (typing) typing.remove();
        if (this._chatLoadingInterval) {
            clearInterval(this._chatLoadingInterval);
            this._chatLoadingInterval = null;
        }
    },

    async sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input ? input.value.trim() : '';
        
        if (!message) {
            console.warn('聊天消息为空');
            return;
        }
        
        console.log('=== 开始发送聊天消息 ===');
        console.log('消息内容:', message);
        console.log('当前状态:', {
            userQuestion: this.userQuestion,
            currentSpread: this.currentSpread?.name,
            drawnCards: this.drawnCards?.length,
            chatMessages: this.chatMessages.length
        });
        
        input.value = '';
        this.addUserMessage(message);
        
        this.showTypingIndicator();
        
        try {
            // 检查TarotAI是否可用
            if (typeof TarotAI === 'undefined') {
                throw new Error('TarotAI模块未加载，请刷新页面重试');
            }
            
            // 检查chatWithContext方法是否存在
            if (typeof TarotAI.chatWithContext !== 'function') {
                throw new Error('TarotAI.chatWithContext方法不存在');
            }
            
            console.log('调用 TarotAI.chatWithContext()...');
            
            const response = await TarotAI.chatWithContext(
                message,
                this.userQuestion || '',
                this.currentSpread || { name: '未选择牌阵' },
                this.drawnCards || [],
                this.chatMessages || []
            );
            
            console.log('AI响应成功:', response);
            
            this.hideTypingIndicator();
            this.addAIMessage(response);
            
            console.log('=== 聊天消息处理完成 ===');
            
        } catch (error) {
            console.error('=== 聊天消息处理失败 ===');
            console.error('错误类型:', error.name);
            console.error('错误信息:', error.message);
            console.error('错误堆栈:', error.stack);
            
            this.hideTypingIndicator();
            
            // 根据错误类型显示不同的提示
            let errorMessage = '抱歉，我暂时无法回应。';
            
            if (error.message.includes('NetworkError') || 
                error.message.includes('Failed to fetch') ||
                error.message.includes('Network request failed')) {
                errorMessage = '❌ 网络连接失败。\n\n请检查：\n1. 后端服务是否启动 (cd backend/server && npm start)\n2. 浏览器是否允许访问 http://localhost:3000';
                console.error('网络错误: 无法连接到后端服务');
            } else if (error.message.includes('TarotAI模块未加载')) {
                errorMessage = '❌ AI模块未加载。\n\n请刷新页面重试。';
                console.error('模块错误: TarotAI未定义');
            } else if (error.message.includes('API') || error.message.includes('401') || error.message.includes('403')) {
                errorMessage = '❌ AI服务认证失败。\n\n请检查后端.env文件中的ZHIPU_API_KEY是否正确。';
                console.error('认证错误: API密钥无效');
            } else if (error.message.includes('timeout') || error.message.includes('Timeout')) {
                errorMessage = '❌ 请求超时。\n\nAI响应时间过长，请稍后重试。';
                console.error('超时错误: AI响应超时');
            } else {
                errorMessage = `❌ 发生错误：${error.message}\n\n请查看浏览器控制台(F12)获取详细信息。`;
                console.error('未知错误:', error);
            }
            
            this.addAIMessage(errorMessage);
            
            // 同时显示toast提示
            if (this.showToast) {
                this.showToast(errorMessage.split('\n')[0], 'error');
            }
        }
    },

    handleQuickAction(action) {
        switch (action) {
            case 'why-this-spread':
                this.askWhySpread();
                break;
            case 'change-spread':
                this.backToSpreadSelect();
                break;
            case 'start-draw':
                this.goToDrawScreen();
                break;
            case 'ask-followup':
                this.askFollowup();
                break;
            case 'generate-summary':
                this.generateSummary();
                break;
        }
    },

    async askWhySpread() {
        this.addUserMessage('为什么选择这个牌阵？');
        this.showTypingIndicator();
        
        try {
            const response = await TarotAI.explainSpreadChoice(
                this.userQuestion,
                this.currentSpread
            );
            this.hideTypingIndicator();
            this.addAIMessage(response);
        } catch (error) {
            this.hideTypingIndicator();
            this.addAIMessage('这个牌阵非常适合您的问题类型，能够从多个角度为您揭示答案。');
        }
    },

    backToSpreadSelect() {
        this.showScreen('spread-select');
    },

    saveChatHistory() {
        const data = {
            question: this.userQuestion,
            spread: this.currentSpread?.id,
            messages: this.chatMessages,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('currentChat', JSON.stringify(data));
    },

    loadChatHistory() {
        const data = localStorage.getItem('currentChat');
        if (data) {
            const parsed = JSON.parse(data);
            this.chatMessages = parsed.messages || [];
            this.renderChatMessages();
        }
    },

    showShufflePhase(phase) {
        document.querySelectorAll('.shuffle-phase').forEach((el, i) => {
            el.style.display = i === phase ? 'block' : 'none';
        });
        
        if (phase === 0) {
            this.initDeckDisplay('deck');
        } else if (phase === 2) {
            this.initDeckDisplay('deck-paused');
        } else if (phase === 3) {
            this.initCutDisplay();
        } else if (phase === 4) {
            this.initDeckDisplay('deck-ready');
        }
    },

    initDeckDisplay(deckId) {
        const deck = document.getElementById(deckId);
        if (!deck) return;
        
        deck.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const card = document.createElement('div');
            card.className = 'deck-card';
            card.style.transform = `translateX(${i * 2}px) translateY(${-i * 2}px)`;
            deck.appendChild(card);
        }
    },

    initCutDisplay() {
        const piles = ['pile-left', 'pile-center', 'pile-right'];
        
        piles.forEach(pileId => {
            const pile = document.getElementById(pileId);
            if (pile) {
                const label = pile.querySelector('.pile-label');
                pile.innerHTML = '';
                if (label) pile.appendChild(label);
                
                for (let i = 0; i < 3; i++) {
                    const card = document.createElement('div');
                    card.className = 'deck-card';
                    pile.appendChild(card);
                }
            }
        });
    },

    performShuffle() {
        this.showShufflePhase(1);
        this.shuffleCount++;
        
        SoundManager.play('shuffle');
        
        for (let i = 0; i < this.deck.length; i++) {
            this.cardReversals[i] = Math.random() < 0.5;
        }
        
        const activeDeck = document.getElementById('deck-active');
        if (activeDeck) {
            activeDeck.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const card = document.createElement('div');
                card.className = 'deck-card';
                card.style.transform = `translateX(${i * 2}px) translateY(${-i * 2}px)`;
                activeDeck.appendChild(card);
            }
            
            activeDeck.classList.add('shuffling');
            
            const cards = activeDeck.querySelectorAll('.deck-card');
            cards.forEach((card, i) => {
                card.style.animationDelay = `${i * 0.08}s`;
            });
        }
        
        document.getElementById('shuffle-count').textContent = `已洗牌 ${this.shuffleCount} 次（含正逆位打乱）`;
        
        if (this.shuffleCount === 1) {
            this.addAIMessage('很好，感受牌的能量与你的问题连接。你可以继续洗牌，也可以准备切牌。');
        }
        
        setTimeout(() => {
            this.showShufflePhase(2);
        }, 800);
    },

    showCutPhase() {
        this.showShufflePhase(3);
        this.addAIMessage('现在请执行切牌仪式。将牌分成三叠，这代表着过去、现在和未来。');
    },

    performCut() {
        const leftPile = document.getElementById('pile-left');
        const centerPile = document.getElementById('pile-center');
        const rightPile = document.getElementById('pile-right');
        
        if (!leftPile || !centerPile || !rightPile) return;
        
        document.getElementById('perform-cut-btn').disabled = true;
        
        centerPile.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        centerPile.style.transform = 'translateY(-100px)';
        centerPile.style.zIndex = '20';
        
        setTimeout(() => {
            leftPile.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            leftPile.style.transform = 'translateY(40px)';
            
            rightPile.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            rightPile.style.transform = 'translateY(20px)';
        }, 400);
        
        setTimeout(() => {
            centerPile.style.transition = 'all 0.5s ease';
            centerPile.style.transform = 'translateY(0) scale(1)';
            centerPile.style.opacity = '1';
            
            leftPile.style.transition = 'all 0.5s ease';
            leftPile.style.transform = 'translateX(130px) translateY(0)';
            leftPile.style.opacity = '0';
            
            rightPile.style.transition = 'all 0.5s ease';
            rightPile.style.transform = 'translateX(-130px) translateY(0)';
            rightPile.style.opacity = '0';
        }, 1000);
        
        setTimeout(() => {
            this.shuffledDeck = TarotDeck.shuffleDeck(this.deck);
            this.showShufflePhase(4);
            this.addAIMessage('切牌完成，牌已准备好。现在请点击"开始抽牌"，从78张牌中选择你的命运之牌。', [
                { label: '开始抽牌', action: 'start-draw' }
            ]);
        }, 1600);
    },

    goToDrawScreen() {
        this.showPhase('draw');
        this.initDrawScreen();
        
        this.addAIMessage(`请从下方的弧形牌阵中选择 ${this.cardsToDraw} 张牌。\n\n${this.currentSpread.positions.map((p, i) => `第${i + 1}张：${p.name}`).join('\n')}\n\n点击牌面选择，也可以使用"自动抽牌"让命运为你选择。`);
    },

    initDrawScreen() {
        const container = document.getElementById('fan-container');
        const drawnArea = document.getElementById('drawn-area');
        
        if (!container) return;
        
        if (this._fanMouseMoveHandler) {
            container.removeEventListener('mousemove', this._fanMouseMoveHandler);
            this._fanMouseMoveHandler = null;
        }
        if (this._fanContainerHandler) {
            container.removeEventListener('click', this._fanContainerHandler);
            this._fanContainerHandler = null;
        }
        if (this._fanMouseLeaveHandler) {
            container.removeEventListener('mouseleave', this._fanMouseLeaveHandler);
            this._fanMouseLeaveHandler = null;
        }
        this._hoveredCard = null;
        
        container.innerHTML = '';
        if (drawnArea) drawnArea.style.display = 'block';
        this.renderDrawnSlots();
        
        this.shuffledDeck = this.shuffledDeck.length > 0 ? this.shuffledDeck : TarotDeck.shuffleDeck(this.deck);
        
        const totalCards = this.shuffledDeck.length;
        const fanAngle = 160;
        const startAngle = -fanAngle / 2;
        const angleStep = fanAngle / (totalCards - 1);
        const radius = 350;
        
        const fragment = document.createDocumentFragment();
        
        this.shuffledDeck.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'fan-card';
            cardEl.dataset.index = index;
            cardEl.dataset.angle = startAngle + (index * angleStep);
            
            const angle = parseFloat(cardEl.dataset.angle);
            const radian = (angle * Math.PI) / 180;
            const x = Math.sin(radian) * radius * 0.3;
            const y = Math.abs(Math.cos(radian)) * radius * 0.15;
            
            cardEl.style.left = `calc(50% + ${x}px - 40px)`;
            cardEl.style.bottom = `${y}px`;
            cardEl.style.transform = `rotate(${angle}deg)`;
            cardEl.style.zIndex = index;
            
            cardEl.innerHTML = `
                <div class="card-back">
                    <div class="back-pattern"></div>
                    <div class="back-symbol"></div>
                </div>
            `;
            
            fragment.appendChild(cardEl);
        });
        
        container.appendChild(fragment);
        
        this.setupFanContainerEvents(container);
        
        this.updateDrawHint();
        const autoDrawBtn = document.getElementById('auto-draw-btn');
        const revealBtn = document.getElementById('reveal-btn');
        if (autoDrawBtn) autoDrawBtn.style.display = 'inline-flex';
        if (revealBtn) revealBtn.style.display = 'none';
    },

    setupFanContainerEvents(container) {
        if (this._fanMouseMoveHandler) {
            container.removeEventListener('mousemove', this._fanMouseMoveHandler);
        }
        if (this._fanContainerHandler) {
            container.removeEventListener('click', this._fanContainerHandler);
        }
        if (this._fanMouseLeaveHandler) {
            container.removeEventListener('mouseleave', this._fanMouseLeaveHandler);
        }
        
        this._hoveredCard = null;
        
        const onMouseMove = (e) => {
            const cardEl = e.target.closest('.fan-card');
            
            if (cardEl && !cardEl.classList.contains('selected') && !cardEl.classList.contains('draw-animation')) {
                if (this._hoveredCard !== cardEl) {
                    if (this._hoveredCard) {
                        this._hoveredCard.classList.remove('hover');
                        this._hoveredCard = null;
                    }
                    
                    this._hoveredCard = cardEl;
                    cardEl.classList.add('hover');
                }
            } else if (!cardEl && this._hoveredCard) {
                this._hoveredCard.classList.remove('hover');
                this._hoveredCard = null;
            }
        };
        
        const onClick = (e) => {
            const cardEl = e.target.closest('.fan-card');
            if (!cardEl) return;
            if (cardEl.classList.contains('selected')) return;
            if (cardEl.classList.contains('draw-animation')) return;
            
            const index = parseInt(cardEl.dataset.index);
            this.drawCard(index);
        };
        
        const onMouseLeave = () => {
            if (this._hoveredCard) {
                this._hoveredCard.classList.remove('hover');
                this._hoveredCard = null;
            }
        };
        
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('click', onClick);
        container.addEventListener('mouseleave', onMouseLeave);
        
        this._fanMouseMoveHandler = onMouseMove;
        this._fanContainerHandler = onClick;
        this._fanMouseLeaveHandler = onMouseLeave;
    },

    addCardInteractions(cardEl, index) {
    },

    resetCardPosition(cardEl, index) {
    },

    renderDrawnSlots() {
        const container = document.getElementById('drawn-cards');
        if (!container) return;
        
        container.innerHTML = '';
        for (let i = 0; i < this.cardsToDraw; i++) {
            const slot = document.createElement('div');
            slot.className = 'drawn-slot';
            slot.dataset.index = i;
            slot.innerHTML = `<span class="slot-number">${this.currentSpread.positions[i]?.name || (i + 1)}</span>`;
            container.appendChild(slot);
        }
    },

    /**
     * 抽取一张牌
     * @param {number} index - 牌在牌组中的索引
     * @returns {void}
     */
    drawCard(index) {
        if (this.drawnCards.length >= this.cardsToDraw) return;
        if (this.isDrawing) return;
        
        const cardEl = document.querySelector(`.fan-card[data-index="${index}"]`);
        if (!cardEl || cardEl.classList.contains('selected')) return;
        
        this.isDrawing = true;
        
        SoundManager.play('draw');
        
        cardEl.classList.add('draw-animation');
        
        setTimeout(() => {
            cardEl.classList.add('selected');
        }, 400);
        
        const isReversed = this.cardReversals[index] || false;
        const card = this.shuffledDeck[index];
        
        this.drawnCards.push({
            card: card,
            reversed: isReversed,
            index: index
        });
        
        const slots = document.querySelectorAll('.drawn-slot');
        const currentSlot = slots[this.drawnCards.length - 1];
        
        if (currentSlot) {
            setTimeout(() => {
                currentSlot.classList.add('filled');
                currentSlot.innerHTML = `
                    <div class="drawn-card ${isReversed ? 'reversed' : ''}">
                        <div class="drawn-card-inner">
                            <div class="drawn-card-back"></div>
                        </div>
                    </div>
                    <span class="slot-number">${this.currentSpread.positions[this.drawnCards.length - 1]?.name || this.drawnCards.length}</span>
                `;
            }, 300);
        }
        
        setTimeout(() => {
            this.isDrawing = false;
            this.updateDrawHint();
            
            if (this.drawnCards.length >= this.cardsToDraw) {
                document.getElementById('reveal-btn').style.display = 'inline-flex';
                document.getElementById('auto-draw-btn').style.display = 'none';
            }
        }, 600);
    },

    autoDraw() {
        const remaining = this.cardsToDraw - this.drawnCards.length;
        const available = [];
        
        document.querySelectorAll('.fan-card:not(.selected)').forEach(el => {
            available.push(parseInt(el.dataset.index));
        });
        
        const toDraw = [];
        while (toDraw.length < remaining && available.length > 0) {
            const randIndex = Math.floor(Math.random() * available.length);
            toDraw.push(available[randIndex]);
            available.splice(randIndex, 1);
        }
        
        toDraw.forEach((idx, i) => {
            setTimeout(() => this.drawCard(idx), i * 300);
        });
    },

    updateDrawHint() {
        const hint = document.getElementById('draw-hint');
        const remaining = this.cardsToDraw - this.drawnCards.length;
        
        if (remaining > 0) {
            hint.textContent = `还需选择 ${remaining} 张牌 - 点击或拖拽牌到下方`;
        } else {
            hint.textContent = '所有牌已选择完毕，可以翻开牌面';
        }
    },

    async revealCards() {
        SoundManager.play('reveal');
        
        await this.consumeCreditsForReading();
        
        this.showPhase('result');
        this.displayResults();
    },

    async consumeCreditsForReading() {
        if (!UserService.isLoggedIn()) {
            return;
        }
        
        const cards = this.drawnCards.map(item => ({
            cardId: item.card.id,
            name: item.card.name,
            reversed: item.reversed
        }));
        
        const result = await UserService.saveReading(
            this.currentSpread.id,
            this.userQuestion || '',
            cards
        );
        
        if (result.success && result.data) {
            if (result.data.currentCredits !== undefined) {
                UserService.user.credits = result.data.currentCredits;
            }
            if (result.data.readingCount !== undefined) {
                UserService.user.readingCount = result.data.readingCount;
            }
            localStorage.setItem('user', JSON.stringify(UserService.user));
            this.initUserUI();
        }
    },

    checkAllCardsFlipped() {
        const cards = document.querySelectorAll('.result-card');
        if (cards.length === 0) return false;
        
        const allFlipped = this._flippedCards.size === cards.length;
        
        if (allFlipped && !this._interpretationStarted) {
            this._interpretationStarted = true;
            
            const cardNames = this.drawnCards.map((item, i) => 
                `${this.currentSpread.positions[i].name}：${item.card.name}${item.reversed ? '（逆位）' : ''}`
            ).join('\n');
            
            this.addAIMessage(`你抽到的牌是：\n\n${cardNames}\n\n正在为你解读...`);
            this.getAIInterpretation();
        }
        
        return allFlipped;
    },

    async getAIInterpretation() {
        const flipAllBtn = document.getElementById('flip-all-btn');
        if (flipAllBtn) flipAllBtn.style.display = 'none';

        if (!CONFIG.aiEnabled) {
            this.addAIMessage('【测试模式】AI解读已禁用。\n\n如需启用，请点击顶部的AI按钮。');
            this.generateTodayKeywords();
            this.showReadingCompleteActions();
            return;
        }

        this.isAILoading = true;

        try {
            if (CONFIG.useBackend) {
                // 尝试流式输出
                try {
                    await this.getAIInterpretationStream();
                } catch (streamError) {
                    console.warn('流式输出失败，回退到普通模式:', streamError);
                    // 降级到普通模式
                    await this.getAIInterpretationNormal();
                }
            } else {
                await this.getAIInterpretationNormal();
            }

        } catch (error) {
            console.error('AI解读失败:', error);
            this.addAIMessage('抱歉，解读过程中出现了一些问题。请稍后再试，或者您可以继续向我提问。');
        } finally {
            this.isAILoading = false;
        }
    },

    async getAIInterpretationNormal() {
        const reading = await TarotAI.getInitialReading(
            this.userQuestion,
            this.currentSpread,
            this.drawnCards
        );

        const cleanReading = TarotAI.cleanResponseForDisplay(reading);
        this.aiInterpretation = cleanReading;
        this._rawInterpretation = reading;
        this.addAIMessage(cleanReading, null, true);
        this.generateTodayKeywords();
        this.showReadingActions();
    },

    async getAIInterpretationStream() {
        let fullContent = '';
        let contentDiv = null;
        let container = null;
        
        try {
            const messages = [
                {
                    role: 'system',
                    content: '你是专业的塔罗占卜师，语调温暖、积极、有启发性。'
                },
                {
                    role: 'user',
                    content: await TarotAI.buildInitialPrompt(this.userQuestion, this.currentSpread, this.drawnCards)
                }
            ];

            console.log('🚀 开始流式输出...');
            
            this.chatMessages.push({ role: 'ai', content: '' });
            this.renderChatMessages(null, false);
            
            const messageIndex = this.chatMessages.length - 1;
            container = document.getElementById('chat-messages');
            const messageDiv = container.children[messageIndex];
            contentDiv = messageDiv.querySelector('.message-content');

            const response = await fetch(`${CONFIG.backendUrl}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages, stream: true })
            });

            console.log('📡 响应状态:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let chunkCount = 0;

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    console.log('✅ 流式读取完成');
                    break;
                }

                const chunk = decoder.decode(value, { stream: true });
                chunkCount++;
                console.log(`📦 第${chunkCount}块数据:`, chunk.substring(0, 100));
                
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();
                        
                        if (data === '[DONE]') {
                            console.log('🏁 收到[DONE]');
                            continue;
                        }

                        try {
                            const json = JSON.parse(data);
                            const content = json.content || json.choices?.[0]?.delta?.content || '';
                            
                            if (content) {
                                fullContent += content;
                                contentDiv.innerHTML = fullContent.replace(/\n/g, '<br>');
                                container.scrollTop = container.scrollHeight;
                            }
                        } catch (e) {
                            console.warn('⚠️  解析失败:', data.substring(0, 50));
                        }
                    }
                }
            }

            if (!fullContent) {
                console.warn('⚠️  未收到任何内容，回退到普通模式');
                contentDiv.innerHTML = '⚠️ 流式输出未收到内容，正在切换到普通模式...';
                throw new Error('流式输出失败');
            }

            console.log('✅ 流式输出成功，内容长度:', fullContent.length);
            
            this.aiInterpretation = fullContent;
            this._rawInterpretation = fullContent;
            this.chatMessages[messageIndex].content = fullContent;
            this.saveChatHistory();
            
            this.generateTodayKeywords();
            this.showReadingActions();

        } catch (error) {
            console.error('❌ 流式输出失败:', error);
            
            // 降级到普通模式
            if (contentDiv) {
                contentDiv.innerHTML = '⏳ 正在使用普通模式重新生成解读...';
            }
            
            try {
                const reading = await TarotAI.getInitialReading(
                    this.userQuestion,
                    this.currentSpread,
                    this.drawnCards
                );

                const cleanReading = TarotAI.cleanResponseForDisplay(reading);
                this.aiInterpretation = cleanReading;
                this._rawInterpretation = reading;
                
                // 移除失败的流式消息
                if (messageIndex !== undefined && this.chatMessages[messageIndex]) {
                    this.chatMessages[messageIndex].content = cleanReading;
                    this.renderChatMessages(null, true);
                } else {
                    this.addAIMessage(cleanReading, null, true);
                }
                
                this.saveChatHistory();
                this.generateTodayKeywords();
                this.showReadingActions();
                
            } catch (fallbackError) {
                console.error('❌ 降级也失败:', fallbackError);
                if (contentDiv) {
                    contentDiv.innerHTML = '❌ 解读失败，请稍后重试';
                }
            }
        }
    },

    showReadingActions() {
        const flipAllBtn = document.getElementById('flip-all-btn');
        if (flipAllBtn) flipAllBtn.style.display = 'none';

        const actionsHtml = `
            <div class="reading-actions-inline" id="reading-actions-inline">
                <button class="btn-action-secondary" onclick="app.askFollowup()">
                    <span>❓ 我有疑问</span>
                </button>
                <button class="btn-action-primary" onclick="app.generateSummary()">
                    <span>📋 生成总结</span>
                </button>
            </div>
        `;
        this.addCustomMessage(actionsHtml);
    },

    addCustomMessage(html) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const msgDiv = document.createElement('div');
        msgDiv.className = 'chat-message ai-message custom-message';
        msgDiv.innerHTML = html;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    },

    askFollowup() {
        const actionsEl = document.getElementById('reading-actions-inline');
        if (actionsEl) actionsEl.remove();

        this.addAIMessage('请告诉我您的疑问，我会为您详细解答。');

        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.focus();
            chatInput.placeholder = '输入您的问题...';
        }

        this._followupMode = true;
    },

    async sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input ? input.value.trim() : '';
        
        if (!message) return;
        
        input.value = '';
        this.addUserMessage(message);
        
        this.showTypingIndicator();
        
        try {
            const response = await TarotAI.chatWithContext(
                message,
                this.userQuestion,
                this.currentSpread,
                this.drawnCards,
                this.chatMessages
            );
            
            this.hideTypingIndicator();
            this.addAIMessage(response);

            if (this._followupMode) {
                this.conversationHistory.push({
                    question: message,
                    answer: response
                });
                this.showReadingActions();
            }
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addAIMessage('抱歉，我暂时无法回应。请稍后再试。');
        }
    },

    async generateSummary() {
        const actionsEl = document.getElementById('reading-actions-inline');
        if (actionsEl) actionsEl.remove();

        this._followupMode = false;

        if (!CONFIG.aiEnabled) {
            this.showReadingCompleteActions();
            return;
        }

        this.addAIMessage('正在为您生成总结...');
        this.showTypingIndicator();

        try {
            const summary = await TarotAI.getSummary(
                this.userQuestion,
                this.currentSpread,
                this.drawnCards,
                this.conversationHistory
            );

            this.hideTypingIndicator();
            this.aiSummary = summary;
            this.addAIMessage(summary);
            this.showReadingCompleteActions();

        } catch (error) {
            console.error('生成总结失败:', error);
            this.hideTypingIndicator();
            this.addAIMessage('总结生成失败，但您可以保存当前的解读结果。');
            this.showReadingCompleteActions();
        }
    },

    showReadingCompleteActions() {
        document.getElementById('result-actions').style.display = 'flex';
        document.getElementById('today-keywords').style.display = 'block';
    },

    generateTodayKeywords() {
        const keywords = [];
        
        console.log('生成今日关键词，抽取的牌数:', this.drawnCards.length);
        
        this.drawnCards.forEach((item, index) => {
            console.log(`牌${index + 1}:`, item.card.name, '关键词:', item.card.keywords);
            if (item.card.keywords && item.card.keywords.length > 0) {
                keywords.push(...item.card.keywords.slice(0, 3));
            }
        });

        const uniqueKeywords = [...new Set(keywords)].slice(0, 3);
        
        console.log('提取的关键词:', keywords);
        console.log('去重后的关键词:', uniqueKeywords);
        
        const container = document.getElementById('keywords-container');
        const todayKeywordsEl = document.getElementById('today-keywords');
        
        if (uniqueKeywords.length > 0 && container && todayKeywordsEl) {
            container.innerHTML = uniqueKeywords.map(k => 
                `<span class="keyword-tag">${k}</span>`
            ).join('');
            todayKeywordsEl.style.display = 'block';
            console.log('今日关键词已显示');
        } else {
            console.log('今日关键词未显示，原因:', {
                keywordsCount: uniqueKeywords.length,
                containerExists: !!container,
                todayKeywordsExists: !!todayKeywordsEl
            });
        }
    },

    displayResults() {
        const display = document.getElementById('spread-display');
        
        if (!display || !this.currentSpread) return;
        
        display.innerHTML = '';
        
        const isLargeSpread = this.currentSpread.cardCount >= 7;
        if (isLargeSpread) {
            display.classList.add('large-spread');
        } else {
            display.classList.remove('large-spread');
        }
        
        const layout = this.getSpreadLayout(this.currentSpread.id, isLargeSpread);
        
        this._flippedCards = new Set();
        this._interpretationStarted = false;
        
        this.drawnCards.forEach((item, index) => {
            const position = this.currentSpread.positions[index];
            const cardEl = document.createElement('div');
            cardEl.className = `result-card ${item.reversed ? 'reversed' : ''}`;
            cardEl.dataset.index = index;
            cardEl.style.cssText = layout.getPositionStyle(index);
            cardEl.style.opacity = '0';
            
            cardEl.innerHTML = `
                <div class="result-card-inner">
                    <div class="result-card-back">
                        <div class="result-card-back-pattern"></div>
                        <span class="result-card-back-hint">点击翻开</span>
                    </div>
                    <div class="result-card-front">
                        <img data-src="${item.card.imageUrl}" alt="${item.card.name}" class="card-image" onerror="this.style.display='none'">
                        <div class="card-info">
                            <div class="card-name">${item.card.name}</div>
                            ${item.reversed ? '<div class="reversed-indicator">逆位</div>' : ''}
                        </div>
                    </div>
                </div>
                <div class="card-position-label">${position.name}</div>
            `;
            
            cardEl.addEventListener('click', (e) => this.handleCardClick(e, index));
            display.appendChild(cardEl);
            
            setTimeout(() => {
                cardEl.style.opacity = '1';
            }, index * 150);
        });
        
        display.style.width = layout.width;
        display.style.height = layout.height;
        
        if (typeof LazyLoader !== 'undefined') {
            const images = display.querySelectorAll('img[data-src]');
            images.forEach(img => LazyLoader.setupLazyImage(img, img.dataset.src));
        }
        
        const flipAllBtn = document.getElementById('flip-all-btn');
        if (flipAllBtn) flipAllBtn.style.display = 'inline-flex';
    },

    handleCardClick(e, index) {
        const cardEl = e.currentTarget;
        
        if (!cardEl.classList.contains('flipped')) {
            cardEl.classList.add('flipped');
            this._flippedCards.add(index);
            SoundManager.play('reveal');
            
            const hint = cardEl.querySelector('.result-card-back-hint');
            if (hint) hint.style.display = 'none';
            
            this.checkAllCardsFlipped();
        } else {
            this.showCardDetail(index);
        }
    },

    flipAllCards() {
        const cards = document.querySelectorAll('.result-card');
        if (cards.length === 0) return;
        
        const allFlipped = this._flippedCards.size === cards.length;
        if (allFlipped) {
            this.showToast('所有牌已翻开', 'info');
            return;
        }
        
        cards.forEach((card, index) => {
            if (!card.classList.contains('flipped')) {
                setTimeout(() => {
                    card.classList.add('flipped');
                    this._flippedCards.add(index);
                    SoundManager.play('reveal');
                    
                    const hint = card.querySelector('.result-card-back-hint');
                    if (hint) hint.style.display = 'none';
                }, index * 600);
            }
        });
        
        setTimeout(() => {
            const flipAllBtn = document.getElementById('flip-all-btn');
            if (flipAllBtn) flipAllBtn.style.display = 'none';
            this.checkAllCardsFlipped();
        }, cards.length * 700);
    },

    showCardDetail(index) {
        const item = this.drawnCards[index];
        const position = this.currentSpread.positions[index];
        const card = item.card;
        
        const modal = document.createElement('div');
        modal.className = 'card-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <button class="modal-close" onclick="this.parentElement.parentElement.remove()">×</button>
                <div class="modal-card ${item.reversed ? 'reversed' : ''}">
                    <img data-src="${card.imageUrl}" alt="${card.name}" class="modal-card-image" onerror="this.style.display='none'">
                    <h3 class="modal-card-name">${card.name}</h3>
                    ${card.nameEn ? `<p class="modal-card-en">${card.nameEn}</p>` : ''}
                    ${card.isMinor ? `<p class="modal-card-suit">${card.suit}</p>` : ''}
                    <p class="modal-card-status">${item.reversed ? '逆位' : '正位'}</p>
                    ${card.element ? `<p class="modal-card-element">元素：${card.element}</p>` : ''}
                </div>
                <div class="modal-info">
                    <h4>【${position.name}】</h4>
                    <p class="position-meaning">${position.description}</p>
                    <div class="card-reading">
                        <h5>牌意解读 ${item.reversed ? '（逆位）' : '（正位）'}</h5>
                        <p>${item.reversed ? card.reversed : card.upright}</p>
                    </div>
                    ${card.detailed ? `
                        <div class="card-reading">
                            <h5>深度解读</h5>
                            <p>${card.detailed}</p>
                        </div>
                    ` : ''}
                    ${card.advice ? `
                        <div class="card-reading">
                            <h5>指引建议</h5>
                            <p class="advice-text">${card.advice}</p>
                        </div>
                    ` : ''}
                    ${card.keywords ? `
                        <div class="modal-keywords">
                            ${card.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        if (typeof LazyLoader !== 'undefined') {
            const modalImg = modal.querySelector('img[data-src]');
            if (modalImg) {
                LazyLoader.setupLazyImage(modalImg, modalImg.dataset.src);
            }
        }
    },

    copyReading() {
        const content = this.generateReadingText();
        
        navigator.clipboard.writeText(content).then(() => {
            this.showToast('已复制到剪贴板', 'success');
        }).catch(err => {
            const textarea = document.createElement('textarea');
            textarea.value = content;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('已复制到剪贴板', 'success');
        });
    },

    downloadReading() {
        const content = this.generateReadingText();
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const now = new Date();
        const dateStr = `${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2,'0')}${now.getDate().toString().padStart(2,'0')}`;
        const timeStr = `${now.getHours().toString().padStart(2,'0')}${now.getMinutes().toString().padStart(2,'0')}`;
        const filename = `塔罗占卜_${dateStr}_${timeStr}.txt`;
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('解读已下载', 'success');
    },

    async shareReading() {
        if (typeof TarotShare === 'undefined') {
            await ModuleLoader.load('share');
        }
        if (typeof TarotShare === 'undefined') {
            this.showToast('分享功能加载失败', 'error');
            return;
        }
        
        this.showToast('正在生成分享图片...', 'info');
        
        const keywords = [];
        this.drawnCards.forEach(item => {
            const card = item.card;
            if (card.keywords && card.keywords.length > 0) {
                card.keywords.forEach(kw => {
                    if (!keywords.includes(kw) && keywords.length < 5) {
                        keywords.push(kw);
                    }
                });
            }
        });
        
        if (keywords.length < 3) {
            const defaultKeywords = ['勇气', '信任', '希望', '成长', '转变', '平衡', '智慧', '力量', '爱'];
            defaultKeywords.forEach(kw => {
                if (!keywords.includes(kw) && keywords.length < 5) {
                    keywords.push(kw);
                }
            });
        }
        
        const cardsWithPosition = this.drawnCards.map((item, i) => ({
            card: item.card,
            reversed: item.reversed,
            position: this.currentSpread.positions[i]?.name || `第${i+1}张`
        }));
        
        try {
            const shareOptions = {
                question: this.userQuestion || '一般指引',
                spreadName: this.currentSpread.name,
                cards: cardsWithPosition,
                interpretation: this.aiInterpretation,
                keywords: keywords.slice(0, 3),
                summary: this.aiSummary
            };
            
            TarotShare.setShareOptions(shareOptions);
            
            // 只生成占卜结果页，不强制生成数据洞察
            const pages = await TarotShare.generateMainPageOnly(shareOptions);
            
            TarotShare.showShareModalWithPages(pages, shareOptions);
            SoundManager.play('success');
        } catch (error) {
            console.error('生成分享图片失败:', error);
            this.showToast('生成分享图片失败，请重试', 'error');
        }
    },
    
    calculateDefaultInsight() {
        const cards = this.drawnCards || [];
        if (cards.length === 0) return null;
        
        let uprightCount = 0;
        let fireCount = 0, waterCount = 0, airCount = 0, earthCount = 0, majorCount = 0;
        
        cards.forEach(item => {
            if (!item.reversed) uprightCount++;
            
            const card = item.card;
            if (card.suit === '权杖' || card.element === '火') fireCount++;
            else if (card.suit === '圣杯' || card.element === '水') waterCount++;
            else if (card.suit === '宝剑' || card.element === '风') airCount++;
            else if (card.suit === '星币' || card.element === '土') earthCount++;
            else if (card.id !== undefined && card.id < 22) majorCount++;
        });
        
        const total = cards.length;
        const uprightRatio = uprightCount / total;
        
        const baseScore = 50;
        const variance = 30;
        
        const scores = {
            love: Math.round(baseScore + (Math.random() - 0.5) * variance + (waterCount / total) * 20),
            career: Math.round(baseScore + (Math.random() - 0.5) * variance + (fireCount / total) * 20),
            wealth: Math.round(baseScore + (Math.random() - 0.5) * variance + (earthCount / total) * 20),
            health: Math.round(baseScore + (Math.random() - 0.5) * variance + (uprightRatio - 0.5) * 20),
            study: Math.round(baseScore + (Math.random() - 0.5) * variance + (airCount / total) * 20)
        };
        
        Object.keys(scores).forEach(key => {
            scores[key] = Math.max(10, Math.min(95, scores[key]));
        });
        
        const totalElements = fireCount + waterCount + airCount + earthCount + majorCount;
        const elements = {
            fire: Math.round((fireCount / Math.max(totalElements, 1)) * 100),
            water: Math.round((waterCount / Math.max(totalElements, 1)) * 100),
            air: Math.round((airCount / Math.max(totalElements, 1)) * 100),
            earth: Math.round((earthCount / Math.max(totalElements, 1)) * 100)
        };
        
        const sum = elements.fire + elements.water + elements.air + elements.earth;
        if (sum !== 100 && sum > 0) {
            const diff = 100 - sum;
            elements.fire = Math.round(elements.fire + diff * (elements.fire / sum));
        }
        
        const trend = [
            Math.round(40 + Math.random() * 30),
            Math.round(50 + Math.random() * 30),
            Math.round(60 + uprightRatio * 30)
        ];
        
        return { scores, trend, elements };
    },

    generateReadingText() {
        const now = new Date();
        const dateStr = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${now.getHours()}:${now.getMinutes().toString().padStart(2,'0')}`;
        
        let text = `═══════════════════════════════════\n`;
        text += `       神 秘 塔 罗 占 卜 记 录\n`;
        text += `═══════════════════════════════════\n\n`;
        text += `📅 占卜时间：${dateStr}\n`;
        text += `🎯 占卜问题：${this.userQuestion || '无具体问题'}\n`;
        text += `🔮 使用牌阵：${this.currentSpread.name}\n\n`;
        text += `───────────────────────────────────\n`;
        text += `           牌 面 详 情\n`;
        text += `───────────────────────────────────\n\n`;
        
        this.drawnCards.forEach((item, i) => {
            const pos = this.currentSpread.positions[i];
            const status = item.reversed ? '逆位' : '正位';
            text += `【${pos.name}】${item.card.name}（${status}）\n`;
            if (item.reversed && item.card.reversed) {
                text += `牌义：${item.card.reversed.substring(0, 100)}...\n`;
            } else if (item.card.upright) {
                text += `牌义：${item.card.upright.substring(0, 100)}...\n`;
            }
            text += `\n`;
        });
        
        text += `───────────────────────────────────\n`;
        text += `           AI 解 读\n`;
        text += `───────────────────────────────────\n\n`;
        text += `${this.aiInterpretation}\n\n`;
        
        if (this.conversationHistory && this.conversationHistory.length > 0) {
            text += `───────────────────────────────────\n`;
            text += `           追 问 记 录\n`;
            text += `───────────────────────────────────\n\n`;
            this.conversationHistory.forEach((h, i) => {
                text += `Q: ${h.question}\n`;
                text += `A: ${h.answer}\n\n`;
            });
        }
        
        if (this.aiSummary) {
            text += `───────────────────────────────────\n`;
            text += `           占 卜 总 结\n`;
            text += `───────────────────────────────────\n\n`;
            text += `${this.aiSummary}\n\n`;
        }
        
        text += `═══════════════════════════════════\n`;
        text += `     由「神秘塔罗」AI占卜师生成\n`;
        text += `═══════════════════════════════════\n`;
        
        return text;
    },

    showToast(message, type = 'info') {
        const existing = document.querySelector('.toast-message');
        if (existing) existing.remove();
        
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            animation: toastIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },

    saveReading() {
        const reading = {
            date: new Date().toISOString(),
            userQuestion: this.userQuestion,
            spread: {
                id: this.currentSpread.id,
                name: this.currentSpread.name
            },
            cards: this.drawnCards.map(item => ({
                cardId: item.card.id,
                name: item.card.name,
                reversed: item.reversed
            })),
            aiInterpretation: this.aiInterpretation,
            conversationHistory: this.conversationHistory,
            aiSummary: this.aiSummary
        };
        
        let readings = JSON.parse(localStorage.getItem('tarotReadings') || '[]');
        readings.unshift(reading);
        if (readings.length > 50) readings = readings.slice(0, 50);
        localStorage.setItem('tarotReadings', JSON.stringify(readings));
        
        this.showToast('解读已保存！', 'success');
    },

    showHistory() {
        document.getElementById('history-modal').style.display = 'flex';
        this.renderHistoryList();
    },

    hideHistory() {
        document.getElementById('history-modal').style.display = 'none';
    },

    renderHistoryList(filter = '') {
        const container = document.getElementById('history-list');
        let readings = JSON.parse(localStorage.getItem('tarotReadings') || '[]');
        
        if (filter) {
            const lowerFilter = filter.toLowerCase();
            readings = readings.filter(r => 
                (r.userQuestion && r.userQuestion.toLowerCase().includes(lowerFilter)) ||
                (r.cards && r.cards.some(c => c.name && c.name.toLowerCase().includes(lowerFilter))) ||
                (r.spread && r.spread.name && r.spread.name.toLowerCase().includes(lowerFilter))
            );
        }
        
        if (readings.length === 0) {
            container.innerHTML = '<p class="history-empty">' + (filter ? '未找到匹配的记录' : '暂无历史记录') + '</p>';
            return;
        }
        
        container.innerHTML = readings.map((reading, index) => {
            const date = new Date(reading.date);
            const dateStr = `${date.getMonth()+1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2,'0')}`;
            const questionPreview = reading.userQuestion ? 
                (reading.userQuestion.length > 30 ? reading.userQuestion.substring(0, 30) + '...' : reading.userQuestion) : 
                '无问题';
            const cardsPreview = reading.cards ? reading.cards.map(c => c.name).join('、') : '';
            const cardsDisplay = cardsPreview.length > 40 ? cardsPreview.substring(0, 40) + '...' : cardsPreview;
            
            return `
                <div class="history-item" onclick="app.showHistoryDetail(${index})">
                    <div class="history-item-header">
                        <span class="history-date">${dateStr}</span>
                        <span class="history-spread">${reading.spread ? reading.spread.name : '未知牌阵'}</span>
                    </div>
                    <div class="history-question">${questionPreview}</div>
                    <div class="history-cards">牌面：${cardsDisplay}</div>
                </div>
            `;
        }).join('');
    },

    searchHistory() {
        const keyword = document.getElementById('history-search-input').value;
        this.renderHistoryList(keyword);
    },

    currentHistoryIndex: -1,

    showHistoryDetail(index) {
        this.currentHistoryIndex = index;
        const readings = JSON.parse(localStorage.getItem('tarotReadings') || '[]');
        const reading = readings[index];
        
        if (!reading) return;
        
        const date = new Date(reading.date);
        const dateStr = `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2,'0')}`;
        
        let html = `
            <div class="history-detail-header">
                <h3>占卜详情</h3>
                <p class="history-detail-date">${dateStr}</p>
            </div>
            
            <div class="history-detail-section">
                <h4>🎯 占卜问题</h4>
                <p>${reading.userQuestion || '无具体问题'}</p>
            </div>
            
            <div class="history-detail-section">
                <h4>🔮 牌阵：${reading.spread ? reading.spread.name : '未知'}</h4>
            </div>
            
            <div class="history-detail-section">
                <h4>🃏 牌面</h4>
                <div class="history-cards-detail">
                    ${reading.cards ? reading.cards.map((c, i) => `
                        <div class="history-card-item">
                            <span class="history-card-pos">${i + 1}</span>
                            <span class="history-card-name">${c.name}</span>
                            <span class="history-card-status">${c.reversed ? '逆位' : '正位'}</span>
                        </div>
                    `).join('') : '无'}
                </div>
            </div>
        `;
        
        if (reading.aiInterpretation) {
            html += `
                <div class="history-detail-section">
                    <h4>✨ AI解读</h4>
                    <div class="history-interpretation">${reading.aiInterpretation.replace(/\n/g, '<br>')}</div>
                </div>
            `;
        }
        
        if (reading.conversationHistory && reading.conversationHistory.length > 0) {
            html += `
                <div class="history-detail-section">
                    <h4>💬 追问记录</h4>
                    <div class="history-conversation">
                        ${reading.conversationHistory.map(h => `
                            <div class="history-qna">
                                <p class="history-q"><strong>问：</strong>${h.question}</p>
                                <p class="history-a"><strong>答：</strong>${h.answer.replace(/\n/g, '<br>')}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        if (reading.aiSummary) {
            html += `
                <div class="history-detail-section">
                    <h4>📝 占卜总结</h4>
                    <div class="history-summary">${reading.aiSummary.replace(/\n/g, '<br>')}</div>
                </div>
            `;
        }
        
        document.getElementById('history-detail-body').innerHTML = html;
        document.getElementById('history-detail-modal').style.display = 'flex';
    },

    hideHistoryDetail() {
        document.getElementById('history-detail-modal').style.display = 'none';
        this.currentHistoryIndex = -1;
    },

    deleteCurrentHistory() {
        if (this.currentHistoryIndex < 0) return;
        
        if (!confirm('确定要删除这条记录吗？')) return;
        
        let readings = JSON.parse(localStorage.getItem('tarotReadings') || '[]');
        readings.splice(this.currentHistoryIndex, 1);
        localStorage.setItem('tarotReadings', JSON.stringify(readings));
        
        this.hideHistoryDetail();
        this.renderHistoryList();
        this.showToast('记录已删除', 'success');
    },

    clearAllHistory() {
        if (!confirm('确定要清空所有历史记录吗？此操作不可恢复！')) return;
        
        localStorage.removeItem('tarotReadings');
        this.renderHistoryList();
        this.showToast('历史记录已清空', 'success');
    },

    newReading() {
        this.currentSpread = null;
        this.drawnCards = [];
        this.shuffledDeck = [];
        this.cardReversals = [];
        this.shuffleCount = 0;
        this.userQuestion = '';
        this.aiInterpretation = '';
        this.conversationHistory = [];
        this.aiSummary = '';
        this.chatMessages = [];
        this.currentPhase = 'shuffle';
        
        localStorage.removeItem('currentChat');
        
        document.getElementById('result-actions').style.display = 'none';
        document.getElementById('today-keywords').style.display = 'none';
        
        this.showScreen('welcome-screen');
    },

    getSpreadLayout(spreadId, isLarge = false) {
        const scale = 1;
        const cardW = 130;
        const cardH = 200;
        const gap = 20;
        
        const layouts = {
            'single': {
                width: `${200 * scale}px`,
                height: `${280 * scale}px`,
                getPositionStyle: (i) => `left: 50%; top: 50%; transform: translate(-50%, -50%);`
            },
            'three-card': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${cardH * scale + 40}px`,
                getPositionStyle: (i) => {
                    const positions = [
                        `left: calc(50% - ${(cardW + gap) * scale}px); top: 50%; transform: translate(-50%, -50%);`,
                        `left: 50%; top: 50%; transform: translate(-50%, -50%);`,
                        `left: calc(50% + ${(cardW + gap) * scale}px); top: 50%; transform: translate(-50%, -50%);`
                    ];
                    return positions[i];
                }
            },
            'three-card-choice': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${cardH * scale + 40}px`,
                getPositionStyle: (i) => {
                    const positions = [
                        `left: calc(50% - ${(cardW + gap) * scale}px); top: 50%; transform: translate(-50%, -50%);`,
                        `left: 50%; top: 50%; transform: translate(-50%, -50%);`,
                        `left: calc(50% + ${(cardW + gap) * scale}px); top: 50%; transform: translate(-50%, -50%);`
                    ];
                    return positions[i];
                }
            },
            'cross': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${(cardH * 2 + gap * 3) * scale}px`,
                getPositionStyle: (i) => {
                    const cx = (cardW * 1.5 + gap * 2) * scale;
                    const row1 = gap * scale;
                    const row2 = (cardH + gap * 2) * scale;
                    const col1 = (gap + cardW * 0.5) * scale;
                    const col2 = (cardW + gap * 2.5) * scale;
                    const col3 = (cardW * 2 + gap * 4 - cardW * 0.5) * scale;
                    
                    const positions = [
                        `left: ${col2}px; top: ${row1 + cardH * 0.5 * scale}px; transform: translate(-50%, -50%);`,
                        `left: ${col2}px; top: ${row2 + cardH * 0.5 * scale}px; transform: translate(-50%, -50%);`,
                        `left: ${col1}px; top: ${row1 + cardH * scale}px; transform: translateY(-50%);`,
                        `left: ${col3}px; top: ${row1 + cardH * scale}px; transform: translateY(-50%);`
                    ];
                    return positions[i];
                }
            },
            'relationship': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${(cardH * 3 + gap * 4) * scale}px`,
                getPositionStyle: (i) => {
                    const centerX = (cardW * 1.5 + gap * 2) * scale;
                    const leftX = gap * scale;
                    const rightX = (cardW * 2 + gap * 3) * scale;
                    const topY = gap * scale;
                    const centerY = (cardH * 1.5 + gap * 2) * scale;
                    const bottomY = (cardH * 2 + gap * 3) * scale;
                    
                    const positions = [
                        `left: ${leftX}px; top: ${centerY}px; transform: translate(0, -50%);`,
                        `left: ${rightX}px; top: ${centerY}px; transform: translate(0, -50%);`,
                        `left: ${centerX}px; top: ${centerY}px; transform: translate(-50%, -50%); z-index: 10;`,
                        `left: ${centerX}px; top: ${topY}px; transform: translate(-50%, 0);`,
                        `left: ${centerX}px; top: ${bottomY}px; transform: translate(-50%, 0);`
                    ];
                    return positions[i];
                }
            },
            'horseshoe': {
                width: `${(cardW * 5 + gap * 6) * scale}px`,
                height: `${(cardH * 1.8 + gap * 3) * scale}px`,
                getPositionStyle: (i) => {
                    const leftX = gap * scale;
                    const centerX = (cardW * 2.5 + gap * 3) * scale;
                    const rightX = (cardW * 5 + gap * 5) * scale;
                    const topY = gap * scale;
                    const midY = (cardH * 0.5 + gap) * scale;
                    const bottomY = (cardH * 0.8 + gap * 2) * scale;
                    
                    const positions = [
                        `left: ${leftX}px; top: ${bottomY}px;`,
                        `left: ${leftX + (cardW + gap) * scale}px; top: ${midY}px;`,
                        `left: ${leftX + (cardW + gap) * 2 * scale}px; top: ${topY}px;`,
                        `left: ${centerX}px; top: ${topY}px; transform: translateX(-50%);`,
                        `left: ${rightX - (cardW + gap) * 2 * scale}px; top: ${topY}px;`,
                        `left: ${rightX - (cardW + gap) * scale}px; top: ${midY}px;`,
                        `left: ${rightX}px; top: ${bottomY}px;`
                    ];
                    return positions[i];
                }
            },
            'celtic-cross': {
                width: `${(cardW * 5 + gap * 8) * scale}px`,
                height: `${(cardH * 4 + gap * 5) * scale}px`,
                getPositionStyle: (i) => {
                    const crossCx = (cardW * 1.5 + gap * 3) * scale;
                    const crossCy = (cardH * 2 + gap * 2.5) * scale;
                    const crossRadius = (cardH + gap * 1.5) * scale;
                    
                    const staffX = (cardW * 4 + gap * 6) * scale;
                    const staffGap = (cardH + gap * 1.2) * scale;
                    const staffBottom = (cardH * 0.5 + gap) * scale;
                    
                    const positions = [
                        `left: ${crossCx}px; top: ${crossCy}px; transform: translate(-50%, -50%); z-index: 10;`,
                        `left: ${crossCx}px; top: ${crossCy}px; transform: translate(-50%, -50%) rotate(90deg); z-index: 11;`,
                        `left: ${crossCx}px; top: ${crossCy + crossRadius}px; transform: translate(-50%, -50%);`,
                        `left: ${crossCx - crossRadius}px; top: ${crossCy}px; transform: translate(-50%, -50%);`,
                        `left: ${crossCx}px; top: ${crossCy - crossRadius}px; transform: translate(-50%, -50%);`,
                        `left: ${crossCx + crossRadius}px; top: ${crossCy}px; transform: translate(-50%, -50%);`,
                        `left: ${staffX}px; bottom: ${staffBottom}px; transform: translate(-50%, 0);`,
                        `left: ${staffX}px; bottom: ${staffBottom + staffGap}px; transform: translate(-50%, 0);`,
                        `left: ${staffX}px; bottom: ${staffBottom + staffGap * 2}px; transform: translate(-50%, 0);`,
                        `left: ${staffX}px; bottom: ${staffBottom + staffGap * 3}px; transform: translate(-50%, 0);`
                    ];
                    return positions[i];
                }
            },
            'tree-of-life': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${(cardH * 4 + gap * 5) * scale}px`,
                getPositionStyle: (i) => {
                    const leftX = gap * scale;
                    const centerX = (cardW + gap * 2) * scale;
                    const rightX = (cardW * 2 + gap * 3) * scale;
                    const rowH = (cardH + gap) * scale;
                    
                    const positions = [
                        `left: ${centerX}px; top: ${gap * scale}px; transform: translate(-50%, 0);`,
                        `left: ${leftX}px; top: ${rowH * 1}px;`,
                        `left: ${rightX}px; top: ${rowH * 1}px;`,
                        `left: ${leftX}px; top: ${rowH * 2}px;`,
                        `left: ${rightX}px; top: ${rowH * 2}px;`,
                        `left: ${centerX}px; top: ${rowH * 2}px; transform: translate(-50%, 0);`,
                        `left: ${leftX}px; top: ${rowH * 3}px;`,
                        `left: ${rightX}px; top: ${rowH * 3}px;`,
                        `left: ${centerX}px; top: ${rowH * 3}px; transform: translate(-50%, 0);`,
                        `left: ${centerX}px; top: ${rowH * 4}px; transform: translate(-50%, 0);`
                    ];
                    return positions[i];
                }
            },
            'new-moon': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${(cardH * 2 + gap * 3) * scale}px`,
                getPositionStyle: (i) => {
                    const leftX = gap * scale;
                    const centerX = (cardW + gap * 2) * scale;
                    const rightX = (cardW * 2 + gap * 3) * scale;
                    
                    const positions = [
                        `left: ${centerX}px; top: ${gap * scale}px; transform: translate(-50%, 0);`,
                        `left: ${leftX}px; top: ${(cardH * 0.5 + gap) * scale}px;`,
                        `left: ${rightX}px; top: ${(cardH * 0.5 + gap) * scale}px;`,
                        `left: ${leftX}px; top: ${(cardH * 1.5 + gap * 2) * scale}px;`,
                        `left: ${rightX}px; top: ${(cardH * 1.5 + gap * 2) * scale}px;`,
                        `left: ${centerX}px; bottom: ${gap * scale}px; transform: translate(-50%, 0);`
                    ];
                    return positions[i];
                }
            },
            'full-moon': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${(cardH * 2 + gap * 3) * scale}px`,
                getPositionStyle: (i) => {
                    const leftX = gap * scale;
                    const centerX = (cardW + gap * 2) * scale;
                    const rightX = (cardW * 2 + gap * 3) * scale;
                    
                    const positions = [
                        `left: ${centerX}px; top: ${gap * scale}px; transform: translate(-50%, 0);`,
                        `left: ${leftX}px; top: ${(cardH * 0.5 + gap) * scale}px;`,
                        `left: ${rightX}px; top: ${(cardH * 0.5 + gap) * scale}px;`,
                        `left: ${leftX}px; bottom: ${gap * scale}px;`,
                        `left: ${rightX}px; bottom: ${gap * scale}px;`
                    ];
                    return positions[i];
                }
            },
            'mind-body-spirit': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${cardH * scale + 40}px`,
                getPositionStyle: (i) => {
                    const positions = [
                        `left: calc(50% - ${(cardW + gap) * scale}px); top: 50%; transform: translate(-50%, -50%);`,
                        `left: 50%; top: 50%; transform: translate(-50%, -50%);`,
                        `left: calc(50% + ${(cardW + gap) * scale}px); top: 50%; transform: translate(-50%, -50%);`
                    ];
                    return positions[i];
                }
            },
            'four-elements': {
                width: `${(cardW * 2 + gap * 3) * scale}px`,
                height: `${(cardH * 2 + gap * 3) * scale}px`,
                getPositionStyle: (i) => {
                    const cx = (cardW / 2 + gap * 1.5) * scale;
                    const positions = [
                        `left: ${cx}px; top: ${gap * scale}px; transform: translate(-50%, 0);`,
                        `left: ${gap * scale}px; top: 50%; transform: translateY(-50%);`,
                        `left: ${(cardW + gap * 2) * scale}px; top: 50%; transform: translateY(-50%);`,
                        `left: ${cx}px; bottom: ${gap * scale}px; transform: translate(-50%, 0);`
                    ];
                    return positions[i];
                }
            },
            'love-pyramid': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${(cardH * 2 + gap * 3) * scale}px`,
                getPositionStyle: (i) => {
                    const leftX = gap * scale;
                    const centerX = (cardW + gap * 2) * scale;
                    const rightX = (cardW * 2 + gap * 3) * scale;
                    
                    const positions = [
                        `left: ${leftX}px; top: ${gap * scale}px;`,
                        `left: ${rightX}px; top: ${gap * scale}px;`,
                        `left: ${centerX}px; top: ${gap * scale}px; transform: translate(-50%, 0);`,
                        `left: ${centerX}px; top: ${(cardH + gap * 2) * scale}px; transform: translate(-50%, 0);`,
                        `left: ${centerX}px; bottom: ${gap * scale}px; transform: translate(-50%, 0);`
                    ];
                    return positions[i];
                }
            },
            'choice-detailed': {
                width: `${(cardW * 2 + gap * 3) * scale}px`,
                height: `${(cardH * 3 + gap * 4) * scale}px`,
                getPositionStyle: (i) => {
                    const leftX = gap * scale;
                    const rightX = (cardW + gap * 2) * scale;
                    const rowH = (cardH + gap) * scale;
                    
                    const positions = [
                        `left: 50%; top: ${gap * scale}px; transform: translate(-50%, 0);`,
                        `left: ${leftX}px; top: ${rowH * 1}px;`,
                        `left: ${leftX}px; top: ${rowH * 2}px;`,
                        `left: ${rightX}px; top: ${rowH * 1}px;`,
                        `left: ${rightX}px; top: ${rowH * 2}px;`
                    ];
                    return positions[i];
                }
            },
            'career-development': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${(cardH * 3 + gap * 4) * scale}px`,
                getPositionStyle: (i) => {
                    const leftX = gap * scale;
                    const centerX = (cardW + gap * 2) * scale;
                    const rightX = (cardW * 2 + gap * 3) * scale;
                    const rowH = (cardH + gap) * scale;
                    
                    const positions = [
                        `left: ${centerX}px; top: ${gap * scale}px; transform: translate(-50%, 0);`,
                        `left: ${leftX}px; top: ${rowH * 1}px;`,
                        `left: ${rightX}px; top: ${rowH * 1}px;`,
                        `left: ${centerX}px; top: ${rowH * 1}px; transform: translate(-50%, 0);`,
                        `left: ${leftX}px; top: ${rowH * 2}px;`,
                        `left: ${rightX}px; top: ${rowH * 2}px;`,
                        `left: ${centerX}px; bottom: ${gap * scale}px; transform: translate(-50%, 0);`
                    ];
                    return positions[i];
                }
            },
            'problem-solving': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${(cardH * 3 + gap * 4) * scale}px`,
                getPositionStyle: (i) => {
                    const leftX = gap * scale;
                    const centerX = (cardW + gap * 2) * scale;
                    const rightX = (cardW * 2 + gap * 3) * scale;
                    const rowH = (cardH + gap) * scale;
                    
                    const positions = [
                        `left: ${centerX}px; top: ${gap * scale}px; transform: translate(-50%, 0);`,
                        `left: ${leftX}px; top: ${rowH * 1}px;`,
                        `left: ${rightX}px; top: ${rowH * 1}px;`,
                        `left: ${leftX}px; top: ${rowH * 2}px;`,
                        `left: ${rightX}px; top: ${rowH * 2}px;`,
                        `left: ${centerX}px; top: ${rowH * 2}px; transform: translate(-50%, 0);`,
                        `left: ${centerX}px; bottom: ${gap * scale}px; transform: translate(-50%, 0);`
                    ];
                    return positions[i];
                }
            },
            'weekly-forecast': {
                width: `${(cardW * 7 + gap * 8) * scale}px`,
                height: `${cardH * scale + 40}px`,
                getPositionStyle: (i) => {
                    const startX = (gap + cardW / 2) * scale;
                    const spacing = (cardW + gap) * scale;
                    return `left: ${startX + i * spacing}px; top: 50%; transform: translate(-50%, -50%);`;
                }
            },
            'chakra-energy': {
                width: `${cardW * scale + 40}px`,
                height: `${(cardH * 7 + gap * 8) * scale}px`,
                getPositionStyle: (i) => {
                    const startY = (gap + cardH / 2) * scale;
                    const spacing = (cardH + gap) * scale;
                    return `left: 50%; top: ${startY + i * spacing}px; transform: translate(-50%, -50%);`;
                }
            },
            'communication-bridge': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${(cardH * 2 + gap * 3) * scale}px`,
                getPositionStyle: (i) => {
                    const leftX = gap * scale;
                    const centerX = (cardW + gap * 2) * scale;
                    const rightX = (cardW * 2 + gap * 3) * scale;
                    
                    const positions = [
                        `left: ${leftX}px; top: ${gap * scale}px;`,
                        `left: ${centerX}px; top: ${(cardH * 0.5 + gap) * scale}px; transform: translate(-50%, -50%);`,
                        `left: ${rightX}px; top: ${gap * scale}px;`,
                        `left: ${centerX}px; top: ${(cardH + gap * 2) * scale}px; transform: translate(-50%, 0);`,
                        `left: ${centerX}px; bottom: ${gap * scale}px; transform: translate(-50%, 0);`
                    ];
                    return positions[i];
                }
            },
            'financial-fortune': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${(cardH * 3 + gap * 4) * scale}px`,
                getPositionStyle: (i) => {
                    const leftX = gap * scale;
                    const centerX = (cardW + gap * 2) * scale;
                    const rightX = (cardW * 2 + gap * 3) * scale;
                    const rowH = (cardH + gap) * scale;
                    
                    const positions = [
                        `left: ${leftX}px; top: ${gap * scale}px;`,
                        `left: ${centerX}px; top: ${gap * scale}px; transform: translate(-50%, 0);`,
                        `left: ${rightX}px; top: ${gap * scale}px;`,
                        `left: ${leftX}px; top: ${rowH * 1}px;`,
                        `left: ${centerX}px; top: ${rowH * 1}px; transform: translate(-50%, 0);`,
                        `left: ${rightX}px; top: ${rowH * 1}px;`,
                        `left: ${leftX}px; top: ${rowH * 2}px;`,
                        `left: ${centerX}px; top: ${rowH * 2}px; transform: translate(-50%, 0);`,
                        `left: ${rightX}px; top: ${rowH * 2}px;`
                    ];
                    return positions[i];
                }
            },
            'annual-fortune': {
                width: `${(cardW * 4 + gap * 5) * scale}px`,
                height: `${(cardH * 3 + gap * 4) * scale}px`,
                getPositionStyle: (i) => {
                    const startX = (gap + cardW / 2) * scale;
                    const spacingX = (cardW + gap) * scale;
                    const startY = (gap + cardH / 2) * scale;
                    const spacingY = (cardH + gap) * scale;
                    
                    const col = i % 4;
                    const row = Math.floor(i / 4);
                    
                    return `left: ${startX + col * spacingX}px; top: ${startY + row * spacingY}px; transform: translate(-50%, -50%);`;
                }
            },
            'past-life': {
                width: `${(cardW * 3 + gap * 4) * scale}px`,
                height: `${(cardH * 2 + gap * 3) * scale}px`,
                getPositionStyle: (i) => {
                    const leftX = gap * scale;
                    const centerX = (cardW + gap * 2) * scale;
                    const rightX = (cardW * 2 + gap * 3) * scale;
                    
                    const positions = [
                        `left: ${centerX}px; top: ${gap * scale}px; transform: translate(-50%, 0);`,
                        `left: ${leftX}px; top: ${(cardH * 0.5 + gap) * scale}px;`,
                        `left: ${rightX}px; top: ${(cardH * 0.5 + gap) * scale}px;`,
                        `left: ${leftX}px; top: ${(cardH * 1.5 + gap * 2) * scale}px;`,
                        `left: ${rightX}px; top: ${(cardH * 1.5 + gap * 2) * scale}px;`,
                        `left: ${centerX}px; bottom: ${gap * scale}px; transform: translate(-50%, 0);`
                    ];
                    return positions[i];
                }
            }
        };

        const baseLayout = layouts[spreadId] || layouts['three-card'];
        return {
            ...baseLayout,
            scale: scale
        };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
