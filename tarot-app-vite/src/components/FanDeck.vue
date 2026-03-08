<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { TarotCard } from '@/types'

interface Props {
  cards: TarotCard[]
  selectedIndices: number[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', index: number): void
}>()

const containerRef = ref<HTMLElement | null>(null)

const fanAngle = 160
const radius = 350

function getCardStyle(index: number): Record<string, string> {
  const totalCards = props.cards.length
  const startAngle = -fanAngle / 2
  const angleStep = fanAngle / (totalCards - 1)
  
  const angle = startAngle + (index * angleStep)
  const radian = (angle * Math.PI) / 180
  const x = Math.sin(radian) * radius * 0.3
  const y = Math.abs(Math.cos(radian)) * radius * 0.15
  
  return {
    left: `calc(50% + ${x}px - 40px)`,
    bottom: `${y}px`,
    transform: `rotate(${angle}deg)`,
    zIndex: String(index)
  }
}

function handleCardClick(index: number) {
  if (!props.selectedIndices.includes(index)) {
    emit('select', index)
  }
}

function isSelected(index: number): boolean {
  return props.selectedIndices.includes(index)
}
</script>

<template>
  <div ref="containerRef" class="fan-deck relative w-full h-[450px] flex items-end justify-center p-5">
    <div 
      v-for="(card, index) in cards" 
      :key="index"
      class="fan-card"
      :class="{ 'fan-card--selected': isSelected(index) }"
      :style="getCardStyle(index)"
      @click="handleCardClick(index)"
    >
      <div class="fan-card__inner">
        <div class="fan-card__back">
          <div class="fan-card__pattern"></div>
          <span class="fan-card__symbol">☽</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fan-deck {
  perspective: 1000px;
}

.fan-card {
  position: absolute;
  width: 80px;
  height: 130px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: bottom center;
  user-select: none;
}

.fan-card:hover {
  z-index: 100 !important;
  transform: translateY(-50px) scale(1.25) rotate(0deg) !important;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(212, 175, 55, 0.4);
}

.fan-card--selected {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-100px) scale(0.5) !important;
}

.fan-card__inner {
  width: 100%;
  height: 100%;
}

.fan-card__back {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  border: 1px solid var(--gold);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.fan-card__pattern {
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 6px;
  background: 
    radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(212, 175, 55, 0.03) 6px, rgba(212, 175, 55, 0.03) 12px);
}

.fan-card__symbol {
  font-size: 1.5rem;
  color: var(--gold);
  opacity: 0.8;
  z-index: 1;
}
</style>
