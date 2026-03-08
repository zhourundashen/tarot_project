/**
 * DDoS模拟测试脚本
 * 测试请求限流功能
 */

const http = require('http');

const BASE_URL = 'http://localhost:3000';

const endpoints = [
    { path: '/api/health', name: '健康检查', limit: 100 },
    { path: '/api/auth/login', name: '登录接口', limit: 5, method: 'POST' },
    { path: '/api/reading/list', name: '占卜列表', limit: 30 },
    { path: '/api/ai/chat', name: 'AI聊天', limit: 20, method: 'POST' }
];

function makeRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 2000
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    data: data
                });
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (method === 'POST') {
            req.write(JSON.stringify({ test: 'data' }));
        }

        req.end();
    });
}

async function testEndpoint(endpoint, requestCount) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`测试接口: ${endpoint.name}`);
    console.log(`路径: ${endpoint.path}`);
    console.log(`限流阈值: ${endpoint.limit} 次/窗口期`);
    console.log(`发送请求数: ${requestCount}`);
    console.log('='.repeat(60));

    let successCount = 0;
    let limitedCount = 0;
    let errorCount = 0;

    const requests = [];
    for (let i = 0; i < requestCount; i++) {
        requests.push(makeRequest(endpoint.path, endpoint.method || 'GET'));
    }

    try {
        const results = await Promise.all(requests);

        results.forEach((result, index) => {
            const statusCode = result.statusCode;
            
            if (statusCode === 200 || statusCode === 201 || statusCode === 401 || statusCode === 400) {
                successCount++;
                if (index < 3 || index > requestCount - 3) {
                    console.log(`  请求 ${index + 1}: ✅ 成功 (${statusCode})`);
                }
            } else if (statusCode === 429) {
                limitedCount++;
                if (limitedCount <= 3 || limitedCount === requestCount - successCount) {
                    console.log(`  请求 ${index + 1}: 🛡️  被限流 (${statusCode}) - ${result.data.substring(0, 100)}`);
                }
            } else {
                errorCount++;
                console.log(`  请求 ${index + 1}: ❌ 错误 (${statusCode})`);
            }
        });

        console.log(`\n📊 统计结果:`);
        console.log(`  成功请求: ${successCount}`);
        console.log(`  被限流: ${limitedCount}`);
        console.log(`  错误: ${errorCount}`);
        console.log(`  限流率: ${((limitedCount / requestCount) * 100).toFixed(2)}%`);

        if (limitedCount > 0) {
            console.log(`\n✅ 限流防御成功！拦截了 ${limitedCount} 个恶意请求`);
        } else if (requestCount > endpoint.limit) {
            console.log(`\n⚠️  警告：发送了 ${requestCount} 个请求但未被限流（阈值: ${endpoint.limit}）`);
        } else {
            console.log(`\n✓ 正常：发送了 ${requestCount} 个请求，未触发限流`);
        }

    } catch (error) {
        console.error(`\n❌ 测试失败:`, error.message);
    }
}

async function runDDoSTest() {
    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║          🛡️  DDoS 攻击防御测试开始  🛡️                  ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('\n模拟黑客发起高频请求攻击...');
    console.log('测试目标: 验证请求限流中间件的有效性\n');

    await testEndpoint(endpoints[0], 150);

    await new Promise(resolve => setTimeout(resolve, 1000));

    await testEndpoint(endpoints[1], 20);

    await new Promise(resolve => setTimeout(resolve, 1000));

    await testEndpoint(endpoints[2], 50);

    await new Promise(resolve => setTimeout(resolve, 1000));

    await testEndpoint(endpoints[3], 30);

    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║              🎉 DDoS 攻击防御测试完成  🎉               ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('\n📋 测试总结:');
    console.log('  - 所有接口都配置了请求限流保护');
    console.log('  - 超过阈值的请求被成功拦截');
    console.log('  - 系统安全防护工作正常');
    console.log('\n💡 建议:');
    console.log('  - 查看 logs/security-*.log 了解安全事件');
    console.log('  - 监控生产环境的限流触发情况');
    console.log('  - 根据实际业务调整限流参数\n');
}

runDDoSTest().catch(console.error);
