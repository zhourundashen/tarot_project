<script setup lang="ts">
import { computed } from 'vue'
import type { Spread } from '@/types'

interface Props {
  spreads: Spread[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', spreadId: string): void
}>()

const difficultyColors: Record<string, string> = {
  '初级': 'bg-green-500/20 text-green-400',
  '中级': 'bg-yellow-500/20 text-yellow-400',
  '高级': 'bg-purple-500/20 text-purple-400'
}

function getDifficultyClass(difficulty: string): string {
  return difficultyColors[difficulty] || 'bg-gray-500/20 text-gray-400'
}
</script>

<template>
  <div class="spread-selector grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    <div 
      v-for="spread in spreads" 
      :key="spread.id"
      class="spread-card group cursor-pointer transition-all duration-300 hover:-translate-y-1"
      @click="emit('select', spread.id)"
    >
      <div class="spread-card__inner border border-[var(--border-color)] bg-[var(--bg-card)] p-5 rounded-lg hover:border-[var(--gold)] hover:shadow-lg hover:shadow-gold/20">
        <div class="flex items-start gap-4">
          <span class="text-3xl opacity-80">{{ spread.icon }}</span>
          <div class="flex-1">
            <h3 class="font-display text-lg text-[var(--gold-light)] mb-1">{{ spread.name }}</h3>
            <p class="text-xs text-[var(--text-muted)] mb-2">{{ spread.nameEn }}</p>
            <p class="text-sm text-[var(--text-secondary)]">{{ spread.cardCount }}张牌</p>
          </div>
        </div>
        
        <span 
          class="inline-block text-xs px-2 py-1 rounded-full mt-3"
          :class="getDifficultyClass(spread.difficulty)"
        >
          {{ spread.difficulty }}
        </span>
        
        <p class="text-sm text-[var(--text-secondary)] mt-3 leading-relaxed">
          {{ spread.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spread-card__inner {
  position: relative;
  overflow: hidden;
}

.spread-card__inner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.spread-card:hover .spread-card__inner::before {
  transform: scaleX(1);
}
</style>
