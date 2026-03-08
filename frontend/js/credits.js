/**
 * 积分管理模块
 * @description 管理用户积分、签到、兑换功能
 */

const CreditsManager = {
    CREDITS_PER_SIGN: 10,
    CREDITS_PER_READING: 20,

    async getStatus() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return {
                    hasSignedToday: false,
                    currentCredits: 0,
                    totalCredits: 0
                };
            }

            const response = await fetch(`${CONFIG.backendUrl}/api/credits/status`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            
            if (result.success) {
                return result.data;
            } else {
                console.error('获取积分状态失败:', result.message);
                return {
                    hasSignedToday: false,
                    currentCredits: 0,
                    totalCredits: 0
                };
            }
        } catch (error) {
            console.error('获取积分状态失败:', error);
            return {
                hasSignedToday: false,
                currentCredits: 0,
                totalCredits: 0
            };
        }
    },

    async signIn() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return {
                    success: false,
                    message: '请先登录'
                };
            }

            const response = await fetch(`${CONFIG.backendUrl}/api/credits/sign`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            
            if (result.success) {
                if (typeof UserService !== 'undefined' && UserService.user) {
                    UserService.user.credits = result.data.currentCredits;
                    localStorage.setItem('user', JSON.stringify(UserService.user));
                }
                this.updateCreditsDisplay(result.data.currentCredits);
                this.showToast(`签到成功！+${result.data.creditsEarned}积分`, 'success');
            } else {
                this.showToast(result.message || '签到失败', 'error');
            }

            return result;
        } catch (error) {
            console.error('签到失败:', error);
            this.showToast('签到失败，请稍后重试', 'error');
            return {
                success: false,
                message: '签到失败'
            };
        }
    },

    async exchangeForReading() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return {
                    success: false,
                    message: '请先登录'
                };
            }

            const response = await fetch(`${CONFIG.backendUrl}/api/credits/exchange`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            
            if (result.success) {
                if (typeof UserService !== 'undefined' && UserService.user) {
                    UserService.user.credits = result.data.currentCredits;
                    UserService.user.readingCount = result.data.readingCount;
                    localStorage.setItem('user', JSON.stringify(UserService.user));
                }
                this.updateCreditsDisplay(result.data.currentCredits);
                this.showToast(`兑换成功！+1次占卜`, 'success');
            } else {
                this.showToast(result.message || '兑换失败', 'error');
            }

            return result;
        } catch (error) {
            console.error('兑换失败:', error);
            this.showToast('兑换失败，请稍后重试', 'error');
            return {
                success: false,
                message: '兑换失败'
            };
        }
    },

    async checkCanRead() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return { canRead: true, needCredits: false };
            }

            const response = await fetch(`${CONFIG.backendUrl}/api/credits/check`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();
            
            return result.success ? result.data : { canRead: true, needCredits: false };
        } catch (error) {
            console.error('检查积分失败:', error);
            return { canRead: true, needCredits: false };
        }
    },

    async getHistory(page = 1, limit = 20) {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                return {
                    success: false,
                    message: '请先登录'
                };
            }

            const response = await fetch(
                `${CONFIG.backendUrl}/api/credits/history?page=${page}&limit=${limit}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            const result = await response.json();
            return result;
        } catch (error) {
            console.error('获取积分历史失败:', error);
            return {
                success: false,
                message: '获取积分历史失败'
            };
        }
    },

    updateCreditsDisplay(credits) {
        const creditsElement = document.getElementById('user-credits');
        if (creditsElement) {
            creditsElement.textContent = credits;
            creditsElement.style.animation = 'none';
            creditsElement.offsetHeight;
            creditsElement.style.animation = 'pulse 0.3s ease';
        }
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `credits-toast credits-toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 0.9rem;
            z-index: 10000;
            animation: slideDown 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            ${type === 'success' ? 
                'background: linear-gradient(135deg, #22c55e, #16a34a); color: white;' : 
                'background: linear-gradient(135deg, #ef4444, #dc2626); color: white;'}
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    },

    showSignInModal() {
        const existingModal = document.querySelector('.signin-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'signin-modal';
        modal.innerHTML = `
            <div class="signin-overlay" onclick="CreditsManager.hideSignInModal()"></div>
            <div class="signin-content">
                <button class="signin-close" onclick="CreditsManager.hideSignInModal()">×</button>
                <div class="signin-header">
                    <div class="signin-icon">📅</div>
                    <h3>每日签到</h3>
                </div>
                <div class="signin-body">
                    <div class="signin-info">
                        <div class="info-item">
                            <span class="info-label">当前积分</span>
                            <span class="info-value" id="modal-current-credits">--</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">累计获得</span>
                            <span class="info-value" id="modal-total-credits">--</span>
                        </div>
                    </div>
                    <div class="signin-rules">
                        <p>📅 每日签到获得 <span class="highlight">+10积分</span></p>
                    </div>
                </div>
                <div class="signin-footer">
                    <button class="btn-mystical btn-sign" id="btn-modal-sign" onclick="CreditsManager.handleSignIn()">
                        <span>立即签到</span>
                    </button>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .signin-modal {
                position: fixed;
                inset: 0;
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            .signin-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
            }
            .signin-content {
                position: relative;
                background: linear-gradient(135deg, #1a1a25 0%, #12121a 100%);
                border: 2px solid #d4af37;
                border-radius: 20px;
                padding: 30px;
                max-width: 400px;
                width: 90%;
                animation: scaleIn 0.3s ease;
            }
            .signin-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 50%;
                color: #9d9a94;
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            .signin-close:hover {
                background: #d4af37;
                color: #0a0a0f;
            }
            .signin-header {
                text-align: center;
                margin-bottom: 25px;
            }
            .signin-icon {
                font-size: 3rem;
                margin-bottom: 15px;
                animation: bounce 1s ease infinite;
            }
            .signin-header h3 {
                color: #d4af37;
                font-size: 1.5rem;
                letter-spacing: 0.1em;
            }
            .signin-body {
                margin-bottom: 25px;
            }
            .signin-desc {
                text-align: center;
                color: #e8e6e3;
                margin-bottom: 10px;
                font-size: 0.95rem;
            }
            .signin-desc .highlight {
                color: #d4af37;
                font-weight: 600;
                font-size: 1.1rem;
            }
            .signin-info {
                display: flex;
                gap: 15px;
                margin-top: 20px;
                padding: 15px;
                background: rgba(212, 175, 55, 0.1);
                border-radius: 12px;
            }
            .info-item {
                flex: 1;
                text-align: center;
            }
            .info-label {
                display: block;
                color: #9d9a94;
                font-size: 0.85rem;
                margin-bottom: 5px;
            }
            .info-value {
                display: block;
                color: #d4af37;
                font-size: 1.5rem;
                font-weight: 600;
            }
            .signin-footer {
                display: flex;
                justify-content: center;
            }
            .signin-footer .btn-mystical {
                min-width: 180px;
                padding: 12px 30px;
            }
            .signin-footer .btn-sign {
                background: linear-gradient(135deg, #9333ea, #7c3aed);
            }
            .signin-rules {
                text-align: center;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid rgba(212, 175, 55, 0.2);
            }
            .signin-rules p {
                color: #9d9a94;
                font-size: 0.9rem;
                margin: 5px 0;
            }
            .signin-rules .highlight {
                color: #d4af37;
                font-weight: 600;
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.9); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-20px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateX(-50%) translateY(0); opacity: 1; }
                to { transform: translateX(-50%) translateY(-20px); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);

        this.loadModalData();
    },

    hideSignInModal() {
        const modal = document.querySelector('.signin-modal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    },

    showExchangeModal() {
        const existingModal = document.querySelector('.exchange-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'exchange-modal';
        modal.innerHTML = `
            <div class="exchange-overlay" onclick="CreditsManager.hideExchangeModal()"></div>
            <div class="exchange-content">
                <button class="exchange-close" onclick="CreditsManager.hideExchangeModal()">×</button>
                <div class="exchange-header">
                    <div class="exchange-icon">💎</div>
                    <h3>兑换占卜次数</h3>
                </div>
                <div class="exchange-body">
                    <div class="exchange-cards">
                        <div class="exchange-card card-credits">
                            <div class="card-icon">💰</div>
                            <div class="card-value" id="exchange-credits">--</div>
                            <div class="card-label">当前积分</div>
                        </div>
                        <div class="exchange-card card-readings">
                            <div class="card-icon">🔮</div>
                            <div class="card-value" id="exchange-readings">--</div>
                            <div class="card-label">当前次数</div>
                        </div>
                    </div>
                    <div class="exchange-rate">
                        <span class="rate-badge">20积分 = 1次占卜</span>
                    </div>
                </div>
                <div class="exchange-footer">
                    <button class="btn-mystical btn-do-exchange" id="btn-do-exchange" onclick="CreditsManager.handleExchange()">
                        <span>立即兑换</span>
                    </button>
                    <p class="exchange-tip" id="exchange-tip"></p>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .exchange-modal {
                position: fixed;
                inset: 0;
                z-index: 3000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            .exchange-overlay {
                position: absolute;
                inset: 0;
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(8px);
            }
            .exchange-content {
                position: relative;
                background: linear-gradient(135deg, #1a1a25 0%, #12121a 100%);
                border: 2px solid #d4af37;
                border-radius: 20px;
                padding: 30px;
                max-width: 420px;
                width: 90%;
                animation: scaleIn 0.3s ease;
            }
            .exchange-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 50%;
                color: #9d9a94;
                font-size: 1.5rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            .exchange-close:hover {
                background: #d4af37;
                color: #0a0a0f;
            }
            .exchange-header {
                text-align: center;
                margin-bottom: 25px;
            }
            .exchange-icon {
                font-size: 3rem;
                margin-bottom: 10px;
            }
            .exchange-header h3 {
                color: #d4af37;
                font-size: 1.4rem;
                letter-spacing: 0.1em;
            }
            .exchange-cards {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 15px;
                margin-bottom: 20px;
            }
            .exchange-card {
                background: rgba(212, 175, 55, 0.1);
                border: 1px solid rgba(212, 175, 55, 0.3);
                border-radius: 15px;
                padding: 20px 25px;
                text-align: center;
                min-width: 100px;
            }
            .card-icon {
                font-size: 2rem;
                margin-bottom: 8px;
            }
            .card-value {
                color: #d4af37;
                font-size: 1.8rem;
                font-weight: 700;
            }
            .card-label {
                color: #9d9a94;
                font-size: 0.8rem;
                margin-top: 5px;
            }
            .exchange-arrow {
                color: #d4af37;
                font-size: 1.5rem;
                font-weight: bold;
            }
            .exchange-rate {
                text-align: center;
                margin-bottom: 20px;
            }
            .rate-badge {
                background: rgba(147, 51, 234, 0.2);
                color: #a855f7;
                padding: 8px 20px;
                border-radius: 20px;
                font-size: 0.9rem;
            }
            .exchange-footer {
                text-align: center;
            }
            .btn-do-exchange {
                min-width: 180px;
                padding: 14px 30px;
                background: linear-gradient(135deg, #d4af37, #b8960c) !important;
                font-size: 1rem;
            }
            .btn-do-exchange:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .exchange-tip {
                color: #ef4444;
                font-size: 0.85rem;
                margin-top: 10px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);

        this.loadExchangeData();
    },

    hideExchangeModal() {
        const modal = document.querySelector('.exchange-modal');
        if (modal) {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        }
    },

    async loadExchangeData() {
        const status = await this.getStatus();
        const creditsEl = document.getElementById('exchange-credits');
        const readingsEl = document.getElementById('exchange-readings');
        const tipEl = document.getElementById('exchange-tip');
        const btn = document.getElementById('btn-do-exchange');
        
        const canExchange = Math.floor(status.currentCredits / this.CREDITS_PER_READING);
        const currentReadings = status.readingCount || 0;
        
        if (creditsEl) creditsEl.textContent = status.currentCredits;
        if (readingsEl) readingsEl.textContent = currentReadings;
        
        if (btn) {
            btn.disabled = canExchange < 1;
        }
        
        if (tipEl) {
            if (status.currentCredits < this.CREDITS_PER_READING) {
                const need = this.CREDITS_PER_READING - status.currentCredits;
                tipEl.textContent = `积分不足，还需${need}积分`;
            } else {
                tipEl.textContent = `可兑换 ${canExchange} 次`;
            }
        }
    },

    async loadModalData() {
        const status = await this.getStatus();
        const currentCreditsEl = document.getElementById('modal-current-credits');
        const totalCreditsEl = document.getElementById('modal-total-credits');
        
        if (currentCreditsEl) currentCreditsEl.textContent = status.currentCredits;
        if (totalCreditsEl) totalCreditsEl.textContent = status.totalCredits;
        
        const signBtn = document.getElementById('btn-modal-sign');
        if (signBtn && status.hasSignedToday) {
            signBtn.disabled = true;
            signBtn.innerHTML = '<span>✓ 已签到</span>';
            signBtn.style.opacity = '0.6';
        }
    },

    async handleSignIn() {
        const result = await this.signIn();
        
        if (result.success) {
            await this.loadModalData();
            if (typeof app !== 'undefined' && app.initUserUI) {
                app.initUserUI();
            }
        }
    },

    async handleExchange() {
        const result = await this.exchangeForReading();
        
        if (result.success) {
            await this.loadExchangeData();
            if (typeof app !== 'undefined' && app.initUserUI) {
                app.initUserUI();
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.CreditsManager = CreditsManager;
}
