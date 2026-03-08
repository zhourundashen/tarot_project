<script setup lang="ts">
import { computed } from 'vue'
import type { DrawnCard, Spread } from '@/types'
import TarotCard from './TarotCard.vue'

interface Props {
  spread: Spread
  cards: DrawnCard[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'cardClick', index: number): void
}>()

const isLargeSpread = computed(() => props.spread.cardCount >= 7)

const layoutConfigs: Record<string, (index: number, count: number) => Record<string, string>> = {
  single: () => ({
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }),
  'three-card': (i) => ({
    left: `${i * 180 + 120}px`,
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }),
  'three-card-choice': (i) => ({
    left: `${i * 180 + 120}px`,
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }),
  cross: (i) => {
    const positions = [
      { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' },
      { left: '50%', top: '50%', transform: 'translate(-50%, -50%) rotate(90deg)' },
      { left: '50%', top: '15%', transform: 'translate(-50%, 0)' },
      { left: '50%', bottom: '15%', transform: 'translate(-50%, 0)' }
    ]
    return positions[i] || positions[0]
  },
  relationship: (i) => {
    const positions = [
      { left: '15%', top: '20%' },
      { right: '15%', top: '20%' },
      { left: '50%', top: '20%', transform: 'translateX(-50%)' },
      { left: '50%', top: '52%', transform: 'translateX(-50%)' },
      { left: '50%', bottom: '8%', transform: 'translateX(-50%)' }
    ]
    return positions[i] || positions[0]
  },
  horseshoe: (i) => ({
    left: `${5 + i * 13}%`,
    bottom: `${15 + (i < 3 ? i * 20 : (6 - i) * 20)}%`
  }),
  'celtic-cross': (i) => {
    const centerX = 220
    const centerY = 290
    const positions = [
      { left: `${centerX}px`, top: `${centerY}px`, transform: 'translate(-50%, -50%)' },
      { left: `${centerX}px`, top: `${centerY}px`, transform: 'translate(-50%, -50%) rotate(90deg)' },
      { left: `${centerX}px`, top: `${centerY + 150}px`, transform: 'translate(-50%, -50%)' },
      { left: `${centerX - 150}px`, top: `${centerY}px`, transform: 'translate(-50%, -50%)' },
      { left: `${centerX}px`, top: `${centerY - 150}px`, transform: 'translate(-50%, -50%)' },
      { left: `${centerX + 150}px`, top: `${centerY}px`, transform: 'translate(-50%, -50%)' },
      { left: '700px', top: '440px', transform: 'translate(-50%, -50%)' },
      { left: '700px', top: '330px', transform: 'translate(-50%, -50%)' },
      { left: '700px', top: '220px', transform: 'translate(-50%, -50%)' },
      { left: '700px', top: '110px', transform: 'translate(-50%, -50%)' }
    ]
    return positions[i] || positions[0]
  },
  'tree-of-life': (i) => {
    const positions = [
      { left: '50%', top: '25px', transform: 'translateX(-50%)' },
      { left: '18%', top: '110px' },
      { right: '18%', top: '110px' },
      { left: '12%', top: '260px' },
      { right: '12%', top: '260px' },
      { left: '50%', top: '260px', transform: 'translateX(-50%)' },
      { left: '12%', top: '420px' },
      { right: '12%', top: '420px' },
      { left: '50%', top: '420px', transform: 'translateX(-50%)' },
      { left: '50%', bottom: '25px', transform: 'translateX(-50%)' }
    ]
    return positions[i] || positions[0]
  },
  'new-moon': (i) => {
    const positions = [
      { left: '50%', top: '10%', transform: 'translateX(-50%)' },
      { left: '15%', top: '32%' },
      { right: '15%', top: '32%' },
      { left: '15%', top: '58%' },
      { right: '15%', top: '58%' },
      { left: '50%', bottom: '8%', transform: 'translateX(-50%)' }
    ]
    return positions[i] || positions[0]
  },
  'full-moon': (i) => {
    const positions = [
      { left: '50%', top: '10%', transform: 'translateX(-50%)' },
      { left: '12%', top: '38%' },
      { right: '12%', top: '38%' },
      { left: '22%', bottom: '8%' },
      { right: '22%', bottom: '8%' }
    ]
    return positions[i] || positions[0]
  }
}

function getCardStyle(index: number): Record<string, string> {
  const spreadId = props.spread.id
  const config = layoutConfigs[spreadId] || layoutConfigs['three-card']
  return config(index, props.cards.length)
}
</script>

<template>
  <div 
    class="spread-display relative mx-auto"
    :class="{ 'spread-display--large': isLargeSpread }"
  >
    <div 
      v-for="(item, index) in cards" 
      :key="index"
      class="result-card"
      :style="getCardStyle(index)"
      @click="emit('cardClick', index)"
    >
      <TarotCard
        :card="item.card"
        :position="item.position"
        :is-revealed="true"
        size="large"
      />
      <div class="card-position-label">
        {{ spread.positions[index]?.name }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.spread-display {
  min-height: 500px;
  position: relative;
}

.spread-display--large {
  min-height: 600px;
}

.result-card {
  position: absolute;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: cardAppear 0.6s ease backwards;
}

.result-card:hover {
  transform: scale(1.12) translateY(-10px) !important;
  z-index: 100;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(212, 175, 55, 0.4);
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(40px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-position-label {
  position: absolute;
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.7rem;
  color: var(--text-secondary);
  background: var(--bg-primary);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}
</style>
