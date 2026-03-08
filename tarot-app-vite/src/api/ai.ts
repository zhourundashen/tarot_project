import type { AIInterpretationRequest, AIInterpretationResponse } from '@/types'

const API_URL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'

export async function getAIInterpretation(
  request: AIInterpretationRequest,
  apiKey: string
): Promise<AIInterpretationResponse> {
  const prompt = buildPrompt(request)
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'qwen-turbo',
      input: {
        messages: [
          {
            role: 'system',
            content: `你是一位经验丰富的塔罗师，拥有深厚的神秘学知识和直觉能力。请用温暖、神秘但专业的语气进行解读，帮助求问者获得启发和指引。解读时注意：
1. 结合每张牌在特定位置的含义
2. 分析牌与牌之间的关联和整体故事
3. 给出具体可行的建议
4. 保持积极正面的态度，即使遇到挑战牌也要给予希望`
          },
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      parameters: {
        result_format: 'message'
      }
    })
  })

  if (!response.ok) {
    throw new Error(`API请求失败: ${response.status}`)
  }

  const data = await response.json()
  const content = data.output?.choices?.[0]?.message?.content || ''
  
  return {
    interpretation: content,
    summary: extractSummary(content),
    advice: extractAdvice(content)
  }
}

function buildPrompt(request: AIInterpretationRequest): string {
  let prompt = `请为我进行塔罗牌解读。

牌阵类型：${request.spreadType}

抽到的牌：`
  
  request.cards.forEach((item, index) => {
    const position = item.position === 'reversed' ? '逆位' : '正位'
    prompt += `
${index + 1}. 【${item.slotName}】${item.card.name}（${position}）
   - 关键词：${item.card.keywords?.join('、') || '无'}
   - 含义：${item.position === 'reversed' ? item.card.reversed : item.card.upright}`
  })
  
  if (request.question) {
    prompt += `

我的问题是：${request.question}`
  }
  
  prompt += `

请给出详细的解读，包括：
1. 每张牌在当前位置的具体含义
2. 牌与牌之间的关联和整体故事线
3. 对我的建议和指引
4. 可能的发展方向`
  
  return prompt
}

function extractSummary(content: string): string {
  const summaryMatch = content.match(/整体[：:]\s*([\s\S]*?)(?=\n\n|\n\d|$)/i)
  return summaryMatch ? summaryMatch[1].trim() : ''
}

function extractAdvice(content: string): string {
  const adviceMatch = content.match(/建议[：:]\s*([\s\S]*?)(?=\n\n|\n\d|$)/i)
  return adviceMatch ? adviceMatch[1].trim() : ''
}
