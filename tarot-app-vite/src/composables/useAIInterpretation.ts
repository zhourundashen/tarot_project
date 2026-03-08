import { ref } from 'vue'
import type { AIInterpretationRequest } from '@/types'
import { getAIInterpretation } from '@/api/ai'

const API_KEY_STORAGE = 'tarot-ai-key'

export function useAIInterpretation() {
  const interpretation = ref('')
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  function getApiKey(): string {
    const stored = localStorage.getItem(API_KEY_STORAGE)
    if (!stored) {
      const key = prompt('请输入您的阿里云百炼 API Key：')
      if (key) {
        localStorage.setItem(API_KEY_STORAGE, key)
        return key
      }
      return ''
    }
    return stored
  }

  async function fetchInterpretation(request: AIInterpretationRequest): Promise<void> {
    const apiKey = getApiKey()
    if (!apiKey) {
      error.value = '未提供API Key'
      return
    }

    isLoading.value = true
    error.value = null

    try {
      const result = await getAIInterpretation(request, apiKey)
      interpretation.value = result.interpretation
    } catch (e) {
      error.value = e instanceof Error ? e.message : '解读失败，请稍后重试'
      console.error('AI解读错误:', e)
    } finally {
      isLoading.value = false
    }
  }

  function clearInterpretation() {
    interpretation.value = ''
    error.value = null
  }

  return {
    interpretation,
    isLoading,
    error,
    fetchInterpretation,
    clearInterpretation
  }
}
