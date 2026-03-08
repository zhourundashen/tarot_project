/**
 * 移动端新手引导修复补丁
 * 使用方法：在 app.init() 之后调用 MobileGuideFix.init()
 */

const MobileGuideFix = {
    init() {
        if (!('ontouchstart' in window)) {
            console.log('非移动端设备，跳过修复');
            return;
        }

        console.log('🔧 移动端新手引导修复已启用');
        
        setTimeout(() => {
            this.fixGuideButtons();
        }, 100);
        
        document.addEventListener('DOMContentLoaded', () => {
            this.fixGuideButtons();
        });
    },

    fixGuideButtons() {
        const guideNextBtn = document.getElementById('guide-next-btn');
        const guidePrevBtn = document.getElementById('guide-prev-btn');
        const guideModal = document.getElementById('guide-modal');
        const closeBtn = guideModal ? guideModal.querySelector('.modal-close') : null;

        if (guideNextBtn) {
            const newBtn = guideNextBtn.cloneNode(true);
            guideNextBtn.parentNode.replaceChild(newBtn, guideNextBtn);
            
            newBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('✅ 下一步按钮触摸成功');
                if (typeof app !== 'undefined') {
                    app.nextGuideStep();
                }
            }, { passive: false });
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('✅ 下一步按钮点击成功');
                if (typeof app !== 'undefined') {
                    app.nextGuideStep();
                }
            });
            
            console.log('✅ 下一步按钮修复完成');
        }

        if (guidePrevBtn) {
            const newBtn = guidePrevBtn.cloneNode(true);
            guidePrevBtn.parentNode.replaceChild(newBtn, guidePrevBtn);
            
            newBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('✅ 上一步按钮触摸成功');
                if (typeof app !== 'undefined') {
                    app.prevGuideStep();
                }
            }, { passive: false });
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('✅ 上一步按钮点击成功');
                if (typeof app !== 'undefined') {
                    app.prevGuideStep();
                }
            });
            
            console.log('✅ 上一步按钮修复完成');
        }

        if (closeBtn) {
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            
            newCloseBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('✅ 关闭按钮触摸成功');
                if (typeof app !== 'undefined') {
                    app.hideGuide();
                }
            }, { passive: false });
            
            newCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('✅ 关闭按钮点击成功');
                if (typeof app !== 'undefined') {
                    app.hideGuide();
                }
            });
            
            console.log('✅ 关闭按钮修复完成');
        }

        console.log('✅ 移动端新手引导按钮修复完成');
    },

    showGuide() {
        if (typeof app !== 'undefined') {
            localStorage.removeItem('hasVisited');
            app.startGuide();
        }
    }
};

if (typeof app !== 'undefined') {
    setTimeout(() => {
        MobileGuideFix.init();
    }, 500);
}

window.MobileGuideFix = MobileGuideFix;
