/**
 * 移动端辅助模块
 * @description 提供移动端特定的功能和优化
 */

const MobileHelper = {
    /**
     * 检测是否为移动设备
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    },

    /**
     * 检测是否为iOS设备
     */
    isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent);
    },

    /**
     * 检测是否为Android设备
     */
    isAndroid() {
        return /Android/.test(navigator.userAgent);
    },

    /**
     * 获取设备宽度
     */
    getDeviceWidth() {
        return window.innerWidth || document.documentElement.clientWidth;
    },

    /**
     * 获取设备高度
     */
    getDeviceHeight() {
        return window.innerHeight || document.documentElement.clientHeight;
    },

    /**
     * 初始化移动端优化
     */
    init() {
        if (!this.isMobile()) return;

        console.log('📱 移动端模式已启用');

        // 添加移动端class
        document.body.classList.add('mobile-device');

        // 防止双击缩放
        this.preventDoubleZoom();

        // 优化触摸滚动
        this.optimizeTouchScroll();

        // 添加移动端特定的提示
        this.addMobileTips();

        // 监听屏幕旋转
        this.handleOrientationChange();

        // 优化输入框（防止键盘弹出时页面错位）
        this.optimizeInputs();

        // 改进聊天侧栏交互
        this.improveChatSidebar();

        // 优化长按事件
        this.handleLongPress();
    },

    /**
     * 防止双击缩放
     */
    preventDoubleZoom() {
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    },

    /**
     * 优化触摸滚动
     */
    optimizeTouchScroll() {
        // 为需要滚动的元素添加惯性滚动
        const scrollElements = document.querySelectorAll('.chat-messages, .history-list, .table-area, .share-preview');
        scrollElements.forEach(el => {
            el.style.webkitOverflowScrolling = 'touch';
        });
    },

    /**
     * 添加移动端提示
     */
    addMobileTips() {
        // 首次访问提示横屏体验更佳（仅在宽度<500时显示）
        if (this.getDeviceWidth() < 500 && !localStorage.getItem('mobile-tip-shown')) {
            setTimeout(() => {
                const toast = document.createElement('div');
                toast.className = 'mobile-tip-toast';
                toast.innerHTML = '💡 提示：横屏使用体验更佳';
                toast.style.cssText = `
                    position: fixed;
                    bottom: 80px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: rgba(212, 175, 55, 0.9);
                    color: #0a0a0f;
                    padding: 12px 24px;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    z-index: 10000;
                    animation: slideUp 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                `;
                document.body.appendChild(toast);

                setTimeout(() => {
                    toast.style.animation = 'slideDown 0.3s ease';
                    setTimeout(() => toast.remove(), 300);
                }, 3000);

                localStorage.setItem('mobile-tip-shown', 'true');
            }, 2000);
        }
    },

    /**
     * 处理屏幕旋转
     */
    handleOrientationChange() {
        let orientation = window.orientation;

        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const newOrientation = window.orientation;
                
                if (orientation !== newOrientation) {
                    // 屏幕旋转后重新计算布局
                    this.recalculateLayout();
                    
                    // 提示用户
                    if (Math.abs(newOrientation) === 90) {
                        this.showToast('横屏模式 📱');
                    } else {
                        this.showToast('竖屏模式 📱');
                    }
                }
                
                orientation = newOrientation;
            }, 100);
        });
    },

    /**
     * 重新计算布局
     */
    recalculateLayout() {
        // 重新调整牌阵显示
        const spreadDisplay = document.querySelector('.spread-display');
        if (spreadDisplay) {
            const width = this.getDeviceWidth();
            let scale = 0.5;
            
            if (width <= 360) {
                scale = 0.45;
            } else if (width <= 414) {
                scale = 0.5;
            } else if (width > 500) {
                scale = 0.6;
            }
            
            spreadDisplay.style.transform = `scale(${scale})`;
        }

        // 重新调整六芒星
        const ritualContainer = document.querySelector('.ritual-container');
        if (ritualContainer) {
            const width = this.getDeviceWidth();
            const size = width <= 360 ? 240 : (width <= 414 ? 280 : 300);
            ritualContainer.style.width = `${size}px`;
            ritualContainer.style.height = `${size}px`;
        }
    },

    /**
     * 优化输入框
     */
    optimizeInputs() {
        const inputs = document.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // 防止iOS自动缩放
            if (input.fontSize < 16) {
                input.style.fontSize = '16px';
            }

            // 输入框获得焦点时滚动到可见区域
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });
    },

    /**
     * 改进聊天侧栏交互（移动端点击header可折叠）
     */
    improveChatSidebar() {
        const chatHeader = document.querySelector('.chat-header');
        const chatSidebar = document.querySelector('.chat-sidebar');
        
        if (chatHeader && chatSidebar && this.getDeviceWidth() <= 768) {
            chatHeader.addEventListener('click', (e) => {
                // 如果点击的不是按钮，则切换折叠状态
                if (!e.target.closest('button')) {
                    chatSidebar.classList.toggle('collapsed');
                    
                    // 震动反馈（如果支持）
                    if (navigator.vibrate) {
                        navigator.vibrate(10);
                    }
                }
            });
        }
    },

    /**
     * 处理长按事件（用于分享图片长按保存）
     */
    handleLongPress() {
        let pressTimer;
        
        document.addEventListener('touchstart', (e) => {
            const shareImage = e.target.closest('.share-image');
            if (shareImage) {
                pressTimer = setTimeout(() => {
                    // 震动反馈
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                    
                    // 显示提示
                    this.showToast('长按图片可保存');
                }, 800);
            }
        });

        document.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });

        document.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
        });
    },

    /**
     * 显示Toast提示
     */
    showToast(message, duration = 2000) {
        const toast = document.createElement('div');
        toast.className = 'mobile-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(26, 26, 37, 0.95);
            color: #d4af37;
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 0.9rem;
            z-index: 10000;
            animation: fadeInUp 0.3s ease;
            border: 1px solid rgba(212, 175, 55, 0.3);
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOutDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * 优化触摸反馈
     */
    addTouchFeedback() {
        const buttons = document.querySelectorAll('.btn-mystical, .question-tag, .spread-card');
        
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', () => {
                btn.style.transform = 'scale(0.95)';
            });
            
            btn.addEventListener('touchend', () => {
                btn.style.transform = '';
            });
        });
    },

    /**
     * 检测PWA模式
     */
    isPWA() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    },

    /**
     * 获取网络状态
     */
    getNetworkStatus() {
        return navigator.onLine ? 'online' : 'offline';
    },

    /**
     * 监听网络变化
     */
    monitorNetwork() {
        window.addEventListener('online', () => {
            this.showToast('网络已恢复 ✓');
        });

        window.addEventListener('offline', () => {
            this.showToast('网络已断开 ✗');
        });
    }
};

// 添加动画CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideDown {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes fadeOutDown {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(10px);
        }
    }
`;
document.head.appendChild(style);

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => MobileHelper.init());
} else {
    MobileHelper.init();
}

// 导出
if (typeof window !== 'undefined') {
    window.MobileHelper = MobileHelper;
}
