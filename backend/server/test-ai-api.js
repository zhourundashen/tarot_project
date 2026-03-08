/**
 * AI API 测试脚本
 */

const ZHIPU_API_KEY = '7f0737275c254f3cb019c5a916e55225.6azAZXw3wk1NzaHD';
const ZHIPU_API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const ZHIPU_MODEL = 'glm-4-flash';

async function testAPI() {
    console.log('🧪 测试智谱GLM-4-Flash API...\n');
    
    const messages = [
        { role: 'system', content: '你是一个友好的助手。' },
        { role: 'user', content: '请说"测试成功"' }
    ];
    
    try {
        console.log('📤 发送请求...');
        console.log('API URL:', ZHIPU_API_URL);
        console.log('Model:', ZHIPU_MODEL);
        console.log('API Key:', ZHIPU_API_KEY.substring(0, 20) + '...\n');
        
        const response = await fetch(ZHIPU_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_API_KEY}`
            },
            body: JSON.stringify({
                model: ZHIPU_MODEL,
                messages: messages,
                max_tokens: 100,
                temperature: 0.8
            })
        });
        
        console.log('📥 响应状态:', response.status);
        console.log('📥 响应状态文本:', response.statusText);
        console.log('📥 响应头:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('\n❌ API调用失败!');
            console.error('错误响应:', errorText);
            return;
        }
        
        const data = await response.json();
        console.log('\n✅ API调用成功!');
        console.log('📦 响应数据:', JSON.stringify(data, null, 2));
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
            console.log('\n💬 AI回复:', data.choices[0].message.content);
        }
        
    } catch (error) {
        console.error('\n❌ 测试失败:', error.message);
        console.error('堆栈:', error.stack);
    }
}

async function testStreamAPI() {
    console.log('\n\n🧪 测试流式API...\n');
    
    const messages = [
        { role: 'system', content: '你是一个友好的助手。' },
        { role: 'user', content: '请说"流式测试成功"' }
    ];
    
    try {
        console.log('📤 发送流式请求...\n');
        
        const response = await fetch(ZHIPU_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ZHIPU_API_KEY}`
            },
            body: JSON.stringify({
                model: ZHIPU_MODEL,
                messages: messages,
                max_tokens: 100,
                temperature: 0.8,
                stream: true
            })
        });
        
        console.log('📥 响应状态:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('\n❌ 流式API调用失败!');
            console.error('错误响应:', errorText);
            return;
        }
        
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let chunkCount = 0;
        let fullContent = '';
        
        console.log('\n📊 开始接收流式数据:\n');
        
        while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
                console.log('\n✅ 流式传输完成');
                break;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            chunkCount++;
            
            console.log(`[第${chunkCount}块]`, chunk.substring(0, 100));
            
            const lines = chunk.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6).trim();
                    
                    if (data === '[DONE]') {
                        console.log('\n🏁 收到[DONE]信号');
                        continue;
                    }
                    
                    try {
                        const json = JSON.parse(data);
                        const content = json.choices?.[0]?.delta?.content || '';
                        
                        if (content) {
                            fullContent += content;
                            process.stdout.write(content);
                        }
                    } catch (e) {
                        // 忽略
                    }
                }
            }
        }
        
        console.log('\n\n💬 完整内容:', fullContent);
        
    } catch (error) {
        console.error('\n❌ 流式测试失败:', error.message);
        console.error('堆栈:', error.stack);
    }
}

// 运行测试
testAPI().then(() => {
    return testStreamAPI();
});
