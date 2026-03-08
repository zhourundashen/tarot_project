/**
 * 移动端登录诊断和修复脚本
 * 用于调试登录失败问题
 */
(function() {
    'use strict';
    
    console.log('🔧 移动端登录诊断脚本已加载');
    
    window.LoginDebug = {
        async testLogin(phone, password) {
            console.log('━━━━ 开始登录诊断 ━━━━');
            console.log('📱 手机号:', phone);
            console.log('🔑 密码长度:', password.length);
            
            try {
                console.log('1️⃣ 检查UserService...');
                if (typeof UserService === 'undefined') {
                    console.error('❌ UserService未定义');
                    return;
                }
                console.log('✅ UserService已加载');
                
                console.log('2️⃣ 检查后端URL...');
                console.log('   backendUrl:', UserService.backendUrl);
                
                console.log('3️⃣ 发送登录请求...');
                const startTime = Date.now();
                const result = await UserService.login(phone, password);
                const endTime = Date.now();
                
                console.log('⏱️  响应时间:', endTime - startTime, 'ms');
                console.log('📦 返回结果:', JSON.stringify(result, null, 2));
                
                if (result.success) {
                    console.log('✅ 登录成功！');
                    console.log('   用户ID:', result.data.user.id);
                    console.log('   昵称:', result.data.user.nickname);
                    console.log('   积分:', result.data.user.credits);
                    console.log('   Token:', result.data.token.substring(0, 20) + '...');
                    
                    console.log('4️⃣ 检查localStorage...');
                    const savedToken = localStorage.getItem('token');
                    const savedUser = localStorage.getItem('user');
                    console.log('   Token已保存:', !!savedToken);
                    console.log('   User已保存:', !!savedUser);
                    
                    return result;
                } else {
                    console.error('❌ 登录失败:', result.message);
                    return result;
                }
            } catch (error) {
                console.error('❌ 登录异常:', error);
                console.error('   错误类型:', error.name);
                console.error('   错误消息:', error.message);
                console.error('   错误堆栈:', error.stack);
                
                if (error.message.includes('Failed to fetch')) {
                    console.error('💡 可能原因:');
                    console.error('   1. 后端服务器未启动');
                    console.error('   2. 后端URL配置错误');
                    console.error('   3. CORS跨域问题');
                    console.error('   4. 网络连接问题');
                }
                
                throw error;
            }
        },
        
        async testBackend() {
            console.log('━━━━ 测试后端连接 ━━━━');
            try {
                const response = await fetch('http://localhost:3000/api/auth/guest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                const data = await response.json();
                console.log('✅ 后端连接正常:', data);
                return true;
            } catch (error) {
                console.error('❌ 后端连接失败:', error.message);
                return false;
            }
        },
        
        checkApp() {
            console.log('━━━━ 检查app对象 ━━━━');
            if (typeof app === 'undefined') {
                console.error('❌ app对象未定义');
                return false;
            }
            
            console.log('✅ app对象存在');
            console.log('   app.hideLoginModal:', typeof app.hideLoginModal);
            console.log('   app.initUserUI:', typeof app.initUserUI);
            console.log('   app.showToast:', typeof app.showToast);
            return true;
        },
        
        fullDiagnose() {
            console.log('');
            console.log('╔══════════════════════════════════════╗');
            console.log('║    移动端登录完整诊断                 ║');
            console.log('╚══════════════════════════════════════╝');
            console.log('');
            
            this.checkApp();
            console.log('');
            this.testBackend();
            console.log('');
            
            console.log('💡 使用方法:');
            console.log('   LoginDebug.testLogin("18129858819", "LYXlyx664486628~")');
            console.log('');
        },
        
        fixAndLogin() {
            console.log('━━━━ 修复并登录 ━━━━');
            
            const phone = document.getElementById('login-phone')?.value;
            const password = document.getElementById('login-password')?.value;
            
            if (!phone || !password) {
                console.error('❌ 请先输入手机号和密码');
                return;
            }
            
            this.testLogin(phone, password).then(result => {
                if (result && result.success) {
                    console.log('5️⃣ 更新UI...');
                    if (typeof app !== 'undefined') {
                        app.hideLoginModal();
                        app.initUserUI();
                        app.showToast('登录成功！', 'success');
                    }
                }
            }).catch(error => {
                console.error('登录失败:', error);
            });
        }
    };
    
    setTimeout(() => {
        LoginDebug.fullDiagnose();
    }, 1000);
    
})();
