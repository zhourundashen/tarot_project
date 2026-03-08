<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  cardCount?: number
  isShuffling?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  cardCount: 5,
  isShuffling: false
})

const emit = defineEmits<{
  (e: 'shuffle'): void
  (e: 'draw'): void
}>()

const deckCards = ref<number[]>([])
const isAnimating = ref(false)

onMounted(() => {
  for (let i = 0; i < props.cardCount; i++) {
    deckCards.value.push(i)
  }
})

const deckClasses = computed(() => [
  'card-deck',
  {
    'card-deck--shuffling': props.isShuffling || isAnimating.value
  }
])

function handleShuffle() {
  emit('shuffle')
}
</script>

<template>
  <div :class="deckClasses">
    <div class="deck-stack">
      <div 
        v-for="i in cardCount" 
        :key="i"
        class="deck-card"
        :style="{
          transform: `translateX(${i * 2}px) translateY(${-i * 2}px)`,
          zIndex: i
        }"
      >
        <div class="deck-card__inner">
          <div class="deck-card__pattern"></div>
          <div class="deck-card__symbol">☽</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-deck {
  position: relative;
  width: 150px;
  height: 220px;
  cursor: pointer;
}

.card-deck--shuffling .deck-card {
  animation: shuffleCard 0.6s ease;
}

@keyframes shuffleCard {
  0% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-60px) rotate(-15deg) translateX(-40px); }
  50% { transform: translateY(-30px) rotate(10deg) translateX(30px); }
  75% { transform: translateY(-50px) rotate(-5deg) translateX(-20px); }
  100% { transform: translateY(0) rotate(0deg); }
}

.deck-stack {
  position: relative;
  width: 100%;
  height: 100%;
}

.deck-card {
  position: absolute;
  width: 150px;
  height: 220px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  border: 2px solid var(--gold);
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease;
  overflow: hidden;
}

.deck-card__inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.deck-card__pattern {
  position: absolute;
  inset: 8px;
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  background: 
    radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
    repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(212, 175, 55, 0.02) 8px, rgba(212, 175, 55, 0.02) 16px),
    repeating-linear-gradient(-45deg, transparent, transparent 8px, rgba(212, 175, 55, 0.02) 8px, rgba(212, 175, 55, 0.02) 16px);
}

.deck-card__symbol {
  font-size: 2rem;
  color: var(--gold);
  opacity: 0.8;
  z-index: 1;
}
</style>
