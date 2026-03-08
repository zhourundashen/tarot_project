/**
 * 移动端自动化测试脚本
 * 一键测试所有功能，生成测试报告
 */

const MobileAutoTest = {
    results: [],
    startTime: null,
    
    // 启动自动化测试
    async run() {
        this.startTime = Date.now();
        console.log('🚀 移动端自动化测试启动');
        console.log('━'.repeat(50));
        
        // 测试1: 检查核心对象
        await this.test('核心对象', () => {
            return typeof app !== 'undefined' && 
                   typeof UserService !== 'undefined' &&
                   typeof TarotDeck !== 'undefined';
        });
        
        // 测试2: 新手引导
        await this.test('新手引导', () => {
            const btn = document.getElementById('guide-next-btn');
            return btn && btn.getAttribute('data-touch-fixed') === 'true';
        });
        
        // 测试3: 登录按钮
        await this.test('登录按钮', () => {
            const btn = document.getElementById('btn-login');
            return btn && btn.getAttribute('data-touch-fixed') === 'true';
        });
        
        // 测试4: 登录表单
        await this.test('登录表单', () => {
            const form = document.getElementById('login-form');
            const phone = document.getElementById('login-phone');
            const password = document.getElementById('login-password');
            return form && phone && password;
        });
        
        // 测试5: 注册表单
        await this.test('注册表单', () => {
            const form = document.getElementById('register-form');
            const phone = document.getElementById('register-phone');
            const password = document.getElementById('register-password');
            return form && phone && password;
        });
        
        // 测试6: 牌阵选择
        await this.test('牌阵选择', () => {
            const spreads = document.querySelectorAll('.spread-card');
            return spreads.length >= 22;
        });
        
        // 测试7: 78张塔罗牌
        await this.test('塔罗牌数据', () => {
            const deck = TarotDeck.getFullDeck();
            return deck && deck.length === 78;
        });
        
        // 测试8: 触摸事件修复
        await this.test('触摸事件修复', () => {
            const fixedButtons = document.querySelectorAll('[data-touch-fixed]');
            return fixedButtons.length >= 40;
        });
        
        // 测试9: 响应式布局
        await this.test('响应式布局', () => {
            const meta = document.querySelector('meta[name="viewport"]');
            return meta && meta.content.includes('width=device-width');
        });
        
        // 测试10: CSS加载
        await this.test('CSS样式', () => {
            const sheets = document.styleSheets;
            return sheets.length >= 2;
        });
        
        // 生成报告
        this.generateReport();
    },
    
    // 单个测试
    async test(name, testFn) {
        const result = {
            name,
            status: 'unknown',
            error: null,
            time: 0
        };
        
        const start = Date.now();
        
        try {
            const passed = await testFn();
            result.status = passed ? 'PASS' : 'FAIL';
            result.time = Date.now() - start;
        } catch (error) {
            result.status = 'ERROR';
            result.error = error.message;
            result.time = Date.now() - start;
        }
        
        this.results.push(result);
        
        const icon = result.status === 'PASS' ? '✅' : 
                     result.status === 'FAIL' ? '❌' : '⚠️';
        console.log(`${icon} ${name}: ${result.status} (${result.time}ms)`);
        
        // 短暂延迟，让UI有时间更新
        await this.delay(100);
    },
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // 生成测试报告
    generateReport() {
        const total = this.results.length;
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const failed = this.results.filter(r => r.status === 'FAIL').length;
        const errors = this.results.filter(r => r.status === 'ERROR').length;
        const duration = Date.now() - this.startTime;
        
        console.log('━'.repeat(50));
        console.log('📊 测试报告');
        console.log('━'.repeat(50));
        console.log(`总计: ${total} 项测试`);
        console.log(`✅ 通过: ${passed} 项`);
        console.log(`❌ 失败: ${failed} 项`);
        console.log(`⚠️  错误: ${errors} 项`);
        console.log(`⏱️  耗时: ${duration}ms`);
        console.log(`📈 通过率: ${((passed/total)*100).toFixed(1)}%`);
        console.log('━'.repeat(50));
        
        // 显示失败项
        const failedTests = this.results.filter(r => r.status !== 'PASS');
        if (failedTests.length > 0) {
            console.log('\n❌ 失败项目:');
            failedTests.forEach(test => {
                console.log(`  - ${test.name}: ${test.error || '测试失败'}`);
            });
        }
        
        // 保存报告到localStorage
        localStorage.setItem('mobileTestReport', JSON.stringify({
            timestamp: new Date().toISOString(),
            total,
            passed,
            failed,
            errors,
            duration,
            results: this.results
        }));
        
        console.log('\n💾 测试报告已保存到 localStorage');
        console.log('💡 查看详细报告: MobileAutoTest.getReport()');
        
        return {
            total,
            passed,
            failed,
            errors,
            duration,
            passRate: ((passed/total)*100).toFixed(1)
        };
    },
    
    // 获取报告
    getReport() {
        const report = localStorage.getItem('mobileTestReport');
        return report ? JSON.parse(report) : null;
    },
    
    // 清除报告
    clearReport() {
        localStorage.removeItem('mobileTestReport');
        console.log('✅ 测试报告已清除');
    }
};

// 自动运行测试
setTimeout(() => {
    MobileAutoTest.run();
}, 2000);

window.MobileAutoTest = MobileAutoTest;
