/**
 * 移动端登录注册修复脚本
 * 专门修复登录、注册表单在移动端无法提交的问题
 */
(function() {
    'use strict';
    
    console.log('🔧 移动端登录注册修复脚本启动');
    
    // 等待页面完全加载
    function waitForLoad() {
        if (document.readyState === 'complete' && typeof app !== 'undefined') {
            console.log('✅ 页面和app对象已就绪');
            setTimeout(fixLoginForms, 500);
        } else {
            setTimeout(waitForLoad, 100);
        }
    }
    
    // 修复登录注册表单
    function fixLoginForms() {
        console.log('🚀 开始修复登录注册表单');
        
        // 1. 修复登录表单提交按钮
        const loginForm = document.getElementById('login-form');
        const loginSubmitBtn = loginForm ? loginForm.querySelector('button[type="submit"]') : null;
        
        if (loginSubmitBtn) {
            console.log('🔧 修复登录提交按钮');
            
            // 添加触摸事件
            loginSubmitBtn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                console.log('✅ 登录按钮被触摸');
                
                // 手动触发表单提交
                const phone = document.getElementById('login-phone').value;
                const password = document.getElementById('login-password').value;
                
                if (!phone || !password) {
                    alert('请输入手机号和密码');
                    return;
                }
                
                console.log('📝 准备登录:', phone);
                
                // 调用登录方法
                if (typeof UserService !== 'undefined') {
                    UserService.login(phone, password)
                        .then(result => {
                            console.log('✅ 登录结果:', result);
                            if (result.success) {
                                app.hideLoginModal();
                                app.initUserUI();
                                app.showToast('登录成功！', 'success');
                            } else {
                                app.showToast(result.message || '登录失败', 'error');
                            }
                        })
                        .catch(error => {
                            console.error('❌ 登录错误:', error);
                            app.showToast('登录失败，请重试', 'error');
                        });
                }
            }, { passive: false });
        }
        
        // 2. 修复注册表单提交按钮
        const registerForm = document.getElementById('register-form');
        const registerSubmitBtn = registerForm ? registerForm.querySelector('button[type="submit"]') : null;
        
        if (registerSubmitBtn) {
            console.log('🔧 修复注册提交按钮');
            
            registerSubmitBtn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                console.log('✅ 注册按钮被触摸');
                
                const phone = document.getElementById('register-phone').value;
                const password = document.getElementById('register-password').value;
                const nickname = document.getElementById('register-nickname').value;
                
                if (!phone || !password) {
                    alert('请输入手机号和密码');
                    return;
                }
                
                if (phone.length !== 11) {
                    alert('请输入正确的手机号');
                    return;
                }
                
                if (password.length < 6) {
                    alert('密码至少6位');
                    return;
                }
                
                console.log('📝 准备注册:', phone, nickname);
                
                // 调用注册方法
                if (typeof UserService !== 'undefined') {
                    UserService.register(phone, password, nickname)
                        .then(result => {
                            console.log('✅ 注册结果:', result);
                            if (result.success) {
                                app.hideLoginModal();
                                app.initUserUI();
                                app.showToast('注册成功！赠送50积分', 'success');
                            } else {
                                app.showToast(result.message || '注册失败', 'error');
                            }
                        })
                        .catch(error => {
                            console.error('❌ 注册错误:', error);
                            app.showToast('注册失败，请重试', 'error');
                        });
                }
            }, { passive: false });
        }
        
        // 3. 修复切换标签按钮（登录/注册切换）
        const switchBtns = document.querySelectorAll('.tab-btn[onclick*="switchLoginTab"]');
        console.log(`📋 找到 ${switchBtns.length} 个切换按钮`);
        
        switchBtns.forEach(function(btn, index) {
            const onclick = btn.getAttribute('onclick');
            console.log(`🔧 修复切换按钮 ${index + 1}: ${onclick}`);
            
            btn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                console.log('✅ 切换按钮被触摸:', onclick);
                
                if (onclick.includes('register')) {
                    app.switchLoginTab('register');
                } else {
                    app.switchLoginTab('login');
                }
            }, { passive: false });
        });
        
        // 4. 修复游客登录按钮
        const guestBtn = document.querySelector('.btn-guest');
        if (guestBtn) {
            console.log('🔧 修复游客登录按钮');
            
            guestBtn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                console.log('✅ 游客登录按钮被触摸');
                app.guestLogin();
            }, { passive: false });
        }
        
        // 5. 修复关闭按钮
        const closeBtn = document.querySelector('#login-modal .modal-close');
        if (closeBtn) {
            console.log('🔧 修复登录框关闭按钮');
            
            closeBtn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                console.log('✅ 关闭按钮被触摸');
                app.hideLoginModal();
            }, { passive: false });
        }
        
        // 6. 修复忘记密码链接
        const forgotLink = document.querySelector('.forgot-link');
        if (forgotLink) {
            forgotLink.addEventListener('touchstart', function(e) {
                e.preventDefault();
                console.log('✅ 忘记密码被触摸');
                app.showForgotPassword();
            }, { passive: false });
        }
        
        // 7. 修复用户协议和隐私政策链接
        const agreementLinks = document.querySelectorAll('a[onclick*="showUserAgreement"], a[onclick*="showPrivacyPolicy"]');
        agreementLinks.forEach(function(link, index) {
            const onclick = link.getAttribute('onclick');
            console.log(`🔧 修复协议链接 ${index + 1}: ${onclick}`);
            
            link.addEventListener('touchstart', function(e) {
                e.preventDefault();
                console.log('✅ 协议链接被触摸:', onclick);
                
                if (onclick.includes('showUserAgreement')) {
                    app.showUserAgreement();
                } else if (onclick.includes('showPrivacyPolicy')) {
                    app.showPrivacyPolicy();
                }
            }, { passive: false });
        });
        
        console.log('✅ 登录注册表单修复完成！');
    }
    
    // 启动
    waitForLoad();
    
})();
