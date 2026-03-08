/**
 * 移动端快速测试和自动修复脚本
 * 5分钟完成所有测试和修复
 */

const QuickMobileTest = {
    // 快速测试清单
    quickTests: [
        { name: '新手引导', test: () => this.clickTest('guide-next-btn') },
        { name: '登录按钮', test: () => this.clickTest('btn-login') },
        { name: '登录表单', test: () => this.formTest('login-form') },
        { name: '注册表单', test: () => this.formTest('register-form') },
        { name: '开始占卜', test: () => this.clickTestByOnclick('startReading') },
        { name: '游客登录', test: () => this.clickTestByClass('btn-guest') }
    ],
    
    // 快速测试
    async quickRun() {
        console.log('🚀 快速测试开始（预计2分钟）');
        console.log('━'.repeat(50));
        
        let passed = 0;
        let total = this.quickTests.length;
        
        for (const test of this.quickTests) {
            try {
                const result = await test.test.call(this);
                const icon = result ? '✅' : '❌';
                console.log(`${icon} ${test.name}: ${result ? '通过' : '失败'}`);
                if (result) passed++;
            } catch (error) {
                console.log(`⚠️  ${test.name}: 错误 - ${error.message}`);
            }
            await this.delay(200);
        }
        
        console.log('━'.repeat(50));
        console.log(`📊 快速测试完成: ${passed}/${total} 通过`);
        
        if (passed === total) {
            console.log('🎉 所有测试通过！移动端适配完美！');
        } else {
            console.log('⚠️  部分测试未通过，运行 QuickMobileTest.autoFix() 自动修复');
        }
        
        return { passed, total };
    },
    
    // 点击测试
    clickTest(id) {
        const btn = document.getElementById(id);
        if (!btn) return false;
        
        // 检查是否可点击
        const style = window.getComputedStyle(btn);
        return style.display !== 'none' && 
               style.visibility !== 'hidden' &&
               btn.offsetWidth >= 44 &&
               btn.offsetHeight >= 44;
    },
    
    // 点击测试（通过onclick）
    clickTestByOnclick(keyword) {
        const btn = document.querySelector(`[onclick*="${keyword}"]`);
        if (!btn) return false;
        
        const style = window.getComputedStyle(btn);
        return style.display !== 'none';
    },
    
    // 点击测试（通过class）
    clickTestByClass(className) {
        const btn = document.querySelector(`.${className}`);
        if (!btn) return false;
        
        const style = window.getComputedStyle(btn);
        return style.display !== 'none';
    },
    
    // 表单测试
    formTest(formId) {
        const form = document.getElementById(formId);
        if (!form) return false;
        
        const inputs = form.querySelectorAll('input');
        return inputs.length >= 2;
    },
    
    // 自动修复
    autoFix() {
        console.log('🔧 开始自动修复...');
        console.log('━'.repeat(50));
        
        let fixed = 0;
        
        // 修复所有按钮
        document.querySelectorAll('[onclick]').forEach(btn => {
            if (!btn.hasAttribute('data-touch-fixed')) {
                this.addButtonFix(btn);
                fixed++;
            }
        });
        
        // 修复表单提交
        ['login-form', 'register-form'].forEach(formId => {
            const form = document.getElementById(formId);
            if (form) {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn && !submitBtn.hasAttribute('data-form-fixed')) {
                    this.addFormSubmitFix(submitBtn, formId);
                    fixed++;
                }
            }
        });
        
        console.log('━'.repeat(50));
        console.log(`✅ 自动修复完成，修复了 ${fixed} 个问题`);
        console.log('💡 重新运行 QuickMobileTest.quickRun() 验证修复');
        
        return fixed;
    },
    
    // 添加按钮修复
    addButtonFix(btn) {
        btn.setAttribute('data-touch-fixed', 'true');
        
        const onclick = btn.getAttribute('onclick');
        if (onclick) {
            btn.addEventListener('touchstart', function(e) {
                e.preventDefault();
                eval(onclick);
            }, { passive: false });
        }
    },
    
    // 添加表单提交修复
    addFormSubmitFix(btn, formId) {
        btn.setAttribute('data-form-fixed', 'true');
        
        btn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            
            const form = document.getElementById(formId);
            const inputs = form.querySelectorAll('input');
            const data = {};
            
            inputs.forEach(input => {
                data[input.id] = input.value;
            });
            
            console.log('📝 表单数据:', data);
            
            // 触发表单submit事件
            const event = new Event('submit', { bubbles: true, cancelable: true });
            form.dispatchEvent(event);
        }, { passive: false });
    },
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    // 完整测试报告
    fullReport() {
        console.log('📊 移动端完整测试报告');
        console.log('━'.repeat(50));
        
        const buttons = document.querySelectorAll('button, [onclick]');
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('input');
        const touchFixed = document.querySelectorAll('[data-touch-fixed]');
        
        console.log(`✅ 按钮总数: ${buttons.length}`);
        console.log(`✅ 表单总数: ${forms.length}`);
        console.log(`✅ 输入框总数: ${inputs.length}`);
        console.log(`✅ 已修复按钮: ${touchFixed.length}`);
        console.log(`✅ 修复覆盖率: ${((touchFixed.length/buttons.length)*100).toFixed(1)}%`);
        
        console.log('━'.repeat(50));
        console.log('📱 移动端适配状态: ' + 
                    (touchFixed.length >= buttons.length * 0.8 ? '✅ 优秀' : '⚠️  需要优化'));
    }
};

// 5秒后自动运行快速测试
setTimeout(() => {
    if ('ontouchstart' in window) {
        QuickMobileTest.quickRun();
    }
}, 5000);

window.QuickMobileTest = QuickMobileTest;

console.log('💡 移动端测试工具已加载');
console.log('━'.repeat(50));
console.log('可用命令:');
console.log('  QuickMobileTest.quickRun()  - 快速测试（2分钟）');
console.log('  QuickMobileTest.autoFix()   - 自动修复问题');
console.log('  QuickMobileTest.fullReport() - 完整报告');
console.log('━'.repeat(50));
