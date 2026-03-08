<script setup lang="ts">
import { computed } from 'vue'
import type { DrawnCard, Spread } from '@/types'

interface Props {
  cards: DrawnCard[]
  spread: Spread
  isLoading?: boolean
  aiInterpretation?: string
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})

const majorCards = computed(() => 
  props.cards.filter(c => !c.card.isMinor)
)

const reversedCards = computed(() => 
  props.cards.filter(c => c.position === 'reversed')
)

const elementCount = computed(() => {
  const counts: Record<string, number> = {}
  props.cards.forEach(c => {
    const el = c.card.element
    if (el) {
      counts[el] = (counts[el] || 0) + 1
    }
  })
  return counts
})

const dominantElement = computed(() => {
  const entries = Object.entries(elementCount.value)
  if (entries.length === 0) return null
  return entries.sort((a, b) => b[1] - a[1])[0]
})

const elementMeanings: Record<string, { name: string; desc: string; advice: string }> = {
  '火': { name: '火元素', desc: '代表行动、激情、创造力和意志力', advice: '现在是采取行动的时刻' },
  '水': { name: '水元素', desc: '代表情感、直觉、关系和潜意识', advice: '倾听你的内心' },
  '风': { name: '风元素', desc: '代表思想、沟通、智慧和真理', advice: '运用理性的思维' },
  '地': { name: '地元素', desc: '代表物质、财富、稳定和实际', advice: '脚踏实地' }
}

function generateSummary(): string {
  let summary = ''
  
  if (majorCards.value.length > 0) {
    const names = majorCards.value.map(c => c.card.name).join('、')
    summary += `<p><strong>大阿卡纳牌：</strong>${names}</p>`
  }
  
  if (dominantElement.value) {
    const info = elementMeanings[dominantElement.value[0]]
    if (info) {
      summary += `<p><strong>主导元素：</strong>${info.name}（${dominantElement.value[1]}张）${info.desc}</p>`
    }
  }
  
  if (reversedCards.value.length > 0) {
    const ratio = reversedCards.value.length / props.cards.length
    let msg = `${reversedCards.value.length}张逆位牌`
    if (ratio > 0.5) {
      msg += '。大量逆位提示内在存在阻碍，建议深入反思。'
    } else if (ratio > 0.3) {
      msg += '。部分逆位表明某些领域存在挑战。'
    }
    summary += `<p><strong>逆位牌：</strong>${msg}</p>`
  } else {
    summary += '<p><strong>牌面状态：</strong>所有牌都是正位，能量流动顺畅。</p>'
  }
  
  return summary
}
</script>

<template>
  <div class="interpretation-panel">
    <div class="interpretation-header">
      <h3 class="font-display text-xl text-[var(--gold)] mb-2">{{ spread.name }}解读</h3>
      <p class="text-sm text-[var(--text-secondary)]">{{ spread.description }}</p>
    </div>
    
    <div class="card-interpretations">
      <div 
        v-for="(item, index) in cards" 
        :key="index"
        class="card-meaning"
      >
        <div class="position-header">
          <span class="position-num">{{ index + 1 }}</span>
          <span class="position-name">{{ spread.positions[index]?.name }}</span>
        </div>
        
        <div class="card-title" :class="{ 'card-title--reversed': item.position === 'reversed' }">
          {{ item.card.name }}
          <span v-if="item.position === 'reversed'">逆位</span>
          <span v-if="item.card.suit" class="card-suit">· {{ item.card.suit }}</span>
        </div>
        
        <p class="position-desc">{{ spread.positions[index]?.description }}</p>
        <p class="card-meaning-text">
          {{ item.position === 'reversed' ? item.card.reversed : item.card.upright }}
        </p>
        
        <div v-if="item.card.keywords?.length" class="keywords">
          <span v-for="k in item.card.keywords" :key="k" class="keyword">{{ k }}</span>
        </div>
      </div>
    </div>
    
    <div class="reading-summary">
      <h4 class="font-display text-lg text-[var(--gold)] mb-4 text-center">整体解读</h4>
      
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>AI正在为你解读...</p>
      </div>
      
      <div v-else-if="aiInterpretation" class="ai-interpretation" v-html="aiInterpretation"></div>
      
      <div v-else class="summary-text" v-html="generateSummary()"></div>
    </div>
  </div>
</template>

<style scoped>
.interpretation-panel {
  max-width: 900px;
  margin: 40px auto;
  padding: 25px;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 10px;
}

.interpretation-header {
  text-align: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.card-interpretations {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-meaning {
  padding: 20px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.15) 100%);
  border-radius: 12px;
  border-left: 3px solid var(--gold);
  transition: all 0.3s ease;
}

.card-meaning:hover {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 100%);
  transform: translateX(5px);
}

.position-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.position-num {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-dark) 100%);
  color: var(--bg-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
}

.position-name {
  font-weight: 600;
  color: var(--gold-light);
  font-size: 1.05rem;
}

.card-title {
  font-size: 1.05rem;
  margin-bottom: 10px;
  color: var(--text-primary);
  font-weight: 500;
}

.card-title--reversed {
  color: var(--accent-purple);
}

.card-suit {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: normal;
}

.position-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(212, 175, 55, 0.2);
}

.card-meaning-text {
  line-height: 1.8;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
}

.keyword {
  font-size: 0.75rem;
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 15px;
  color: var(--gold-light);
}

.reading-summary {
  margin-top: 30px;
  padding: 25px;
  border-top: 1px solid var(--border-color);
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

.summary-text p {
  color: var(--text-secondary);
  line-height: 1.8;
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 2px solid rgba(212, 175, 55, 0.3);
}

.loading-state {
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.ai-interpretation {
  line-height: 1.8;
  color: var(--text-primary);
}
</style>
