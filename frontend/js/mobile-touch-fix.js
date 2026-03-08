/**
 * 移动端通用触摸事件修复器
 * 自动修复所有onclick按钮在移动端无响应的问题
 */

const MobileTouchFix = {
    init() {
        if (!('ontouchstart' in window) && !('ontouchend' in window)) {
            console.log('✅ 非移动端设备，跳过触摸修复');
            return;
        }

        console.log('🔧 移动端触摸事件修复器启动');
        
        // 延迟修复，确保DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.fixAllButtons();
            });
        } else {
            this.fixAllButtons();
        }
        
        // 监听动态添加的元素
        this.observeNewElements();
    },

    fixAllButtons() {
        console.log('🔍 开始修复所有按钮...');
        
        // 修复所有带onclick的元素
        const onclickElements = document.querySelectorAll('[onclick]');
        console.log(`📋 找到 ${onclickElements.length} 个onclick元素`);
        
        onclickElements.forEach((element, index) => {
            this.fixButton(element, index);
        });
        
        // 修复所有btn-mystical按钮
        const mysticalBtns = document.querySelectorAll('.btn-mystical');
        console.log(`📋 找到 ${mysticalBtns.length} 个btn-mystical按钮`);
        
        mysticalBtns.forEach((btn, index) => {
            if (!btn.hasAttribute('data-touch-fixed')) {
                this.addTouchEvents(btn, `mystical-btn-${index}`);
            }
        });
        
        // 修复登录按钮
        const loginBtn = document.getElementById('btn-login');
        if (loginBtn) {
            this.addTouchEvents(loginBtn, 'btn-login');
        }
        
        // 修复所有modal-close按钮
        const closeBtns = document.querySelectorAll('.modal-close');
        closeBtns.forEach((btn, index) => {
            this.addTouchEvents(btn, `modal-close-${index}`);
        });
        
        console.log('✅ 所有按钮修复完成');
    },

    fixButton(element, index) {
        if (element.hasAttribute('data-touch-fixed')) {
            return;
        }
        
        // 获取onclick属性
        const onclickAttr = element.getAttribute('onclick');
        if (!onclickAttr) {
            return;
        }
        
        // 标记为已修复
        element.setAttribute('data-touch-fixed', 'true');
        
        // 添加触摸事件
        this.addTouchEvents(element, `onclick-btn-${index}`);
    },

    addTouchEvents(element, name) {
        if (!element) {
            return;
        }
        
        // 克隆元素，移除原有事件
        const newElement = element.cloneNode(true);
        element.parentNode.replaceChild(newElement, element);
        
        // 获取onclick属性
        const onclickCode = newElement.getAttribute('onclick');
        
        // 定义处理函数
        const handleTouch = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`✅ 触摸成功: ${name}`);
            
            // 执行onclick代码
            if (onclickCode) {
                try {
                    // 创建函数并执行
                    const func = new Function(onclickCode);
                    func.call(newElement);
                } catch (error) {
                    console.error('❌ 执行onclick失败:', error, onclickCode);
                }
            }
            
            // 触发点击音效
            if (typeof SoundManager !== 'undefined' && SoundManager.isEnabled()) {
                SoundManager.play('click');
            }
        };
        
        // 添加触摸事件
        newElement.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleTouch(e);
        }, { passive: false });
        
        newElement.addEventListener('touchend', (e) => {
            e.preventDefault();
        }, { passive: false });
        
        // 保留click事件作为备用
        newElement.addEventListener('click', (e) => {
            e.preventDefault();
            handleTouch(e);
        });
        
        console.log(`✅ 已修复: ${name}`);
    },

    observeNewElements() {
        // 监听DOM变化，自动修复新添加的按钮
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查新节点及其子节点
                        const buttons = node.querySelectorAll ? 
                            node.querySelectorAll('[onclick], .btn-mystical, .btn-login, .modal-close') : 
                            [];
                        
                        if (node.hasAttribute && node.hasAttribute('onclick')) {
                            this.fixButton(node, 'dynamic');
                        }
                        
                        buttons.forEach((btn, index) => {
                            this.fixButton(btn, `dynamic-${index}`);
                        });
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('✅ DOM监听器已启动');
    },

    // 手动修复特定按钮
    fixButtonById(id) {
        const element = document.getElementById(id);
        if (element) {
            this.addTouchEvents(element, id);
            console.log(`✅ 手动修复: ${id}`);
        } else {
            console.warn(`⚠️ 未找到元素: ${id}`);
        }
    },

    // 手动修复特定选择器的所有元素
    fixBySelector(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            this.addTouchEvents(element, `${selector}-${index}`);
        });
        console.log(`✅ 已修复 ${elements.length} 个元素: ${selector}`);
    },

    // 重新修复所有按钮
    reFix() {
        console.log('🔄 重新修复所有按钮...');
        document.querySelectorAll('[data-touch-fixed]').forEach(el => {
            el.removeAttribute('data-touch-fixed');
        });
        this.fixAllButtons();
    }
};

// 自动启动
if (typeof app !== 'undefined') {
    setTimeout(() => {
        MobileTouchFix.init();
    }, 800);
} else {
    window.addEventListener('load', () => {
        setTimeout(() => {
            MobileTouchFix.init();
        }, 800);
    });
}

// 暴露到全局
window.MobileTouchFix = MobileTouchFix;

console.log('✅ 移动端触摸事件修复器已加载');
