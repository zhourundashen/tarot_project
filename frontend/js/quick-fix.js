/**
 * 移动端快速修复脚本
 * 直接修复所有按钮
 */
(function() {
    'use strict';
    
    console.log('🔧 移动端快速修复脚本启动');
    
    // 等待app对象初始化
    function waitForApp() {
        if (typeof app !== 'undefined' && app.init) {
            console.log('✅ app对象已就绪');
            fixAllButtonsNow();
        } else {
            console.log('⏳ 等待app对象初始化...');
            setTimeout(waitForApp, 100);
        }
    }
    
    // 立即修复所有按钮
    function fixAllButtonsNow() {
        console.log('🚀 开始修复所有按钮');
        
        // 修复登录按钮
        const loginBtn = document.getElementById('btn-login');
        if (loginBtn) {
            console.log('🔧 修复登录按钮');
            loginBtn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                console.log('✅ 登录按钮被点击');
                if (typeof app !== 'undefined') {
                    app.showLoginModal();
                }
            }, { passive: false });
        }
        
        // 修复所有onclick按钮
        const allButtons = document.querySelectorAll('[onclick]');
        console.log(`📋 找到 ${allButtons.length} 个按钮`);
        
        allButtons.forEach(function(btn, index) {
            const onclickCode = btn.getAttribute('onclick');
            if (!onclickCode) return;
            
            console.log(`🔧 修复按钮 ${index + 1}: ${onclickCode.substring(0, 30)}...`);
            
            // 移除原有的onclick（避免重复触发）
            btn.removeAttribute('onclick');
            
            // 添加touchstart事件
            btn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log(`✅ 按钮 ${index + 1} 被触摸: ${onclickCode.substring(0, 30)}`);
                
                try {
                    // 执行onclick代码
                    eval(onclickCode);
                } catch (error) {
                    console.error('❌ 执行错误:', error);
                }
            }, { passive: false });
            
            // 添加click事件（兼容）
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log(`✅ 按钮 ${index + 1} 被点击: ${onclickCode.substring(0, 30)}`);
                
                try {
                    eval(onclickCode);
                } catch (error) {
                    console.error('❌ 执行错误:', error);
                }
            });
        });
        
        console.log('✅ 所有按钮修复完成！');
    }
    
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForApp);
    } else {
        waitForApp();
    }
    
})();
