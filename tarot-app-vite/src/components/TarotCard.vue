<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TarotCard, CardPosition } from '@/types'

interface Props {
  card: TarotCard
  position?: CardPosition
  isRevealed?: boolean
  isSelectable?: boolean
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  position: 'upright',
  isRevealed: false,
  isSelectable: false,
  size: 'medium'
})

const emit = defineEmits<{
  (e: 'click'): void
  (e: 'togglePosition'): void
}>()

const isFlipped = ref(false)

const cardClasses = computed(() => [
  'tarot-card',
  `tarot-card--${props.size}`,
  {
    'tarot-card--reversed': props.position === 'reversed',
    'tarot-card--revealed': props.isRevealed,
    'tarot-card--selectable': props.isSelectable
  }
])

function flipCard() {
  isFlipped.value = !isFlipped.value
}

function handleClick() {
  if (props.isSelectable) {
    emit('click')
  } else if (props.isRevealed) {
    emit('togglePosition')
  }
}

defineExpose({ flipCard })
</script>

<template>
  <div 
    :class="cardClasses"
    @click="handleClick"
  >
    <div class="tarot-card__inner" :class="{ 'is-flipped': isRevealed }">
      <div class="tarot-card__front">
        <div class="card-back">
          <div class="card-back__pattern"></div>
          <div class="card-back__symbol">☽</div>
        </div>
      </div>
      <div class="tarot-card__back">
        <div class="card-face">
          <img 
            v-if="card.imageUrl"
            :src="card.imageUrl"
            :alt="card.name"
            class="card-face__image"
            loading="lazy"
          />
          <div class="card-face__info">
            <span class="card-face__name">{{ card.name }}</span>
            <span v-if="position === 'reversed'" class="card-face__status">逆位</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tarot-card {
  perspective: 1000px;
  cursor: pointer;
}

.tarot-card--small {
  width: 60px;
  height: 90px;
}

.tarot-card--medium {
  width: 80px;
  height: 120px;
}

.tarot-card--large {
  width: 130px;
  height: 200px;
}

.tarot-card--selectable:hover {
  transform: translateY(-10px);
}

.tarot-card--reversed .tarot-card__inner {
  transform: rotate(180deg);
}

.tarot-card--revealed .tarot-card__inner.is-flipped {
  transform: rotateY(180deg);
}

.tarot-card--revealed.tarot-card--reversed .tarot-card__inner.is-flipped {
  transform: rotateY(180deg) rotate(180deg);
}

.tarot-card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.tarot-card__front,
.tarot-card__back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 8px;
  overflow: hidden;
}

.tarot-card__back {
  transform: rotateY(180deg);
}

.card-back {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  border: 1px solid var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.card-back__pattern {
  position: absolute;
  inset: 6px;
  border: 1px solid rgba(212, 175, 55, 0.25);
  border-radius: 6px;
  background: 
    radial-gradient(circle at 50% 30%, rgba(212, 175, 55, 0.1) 0%, transparent 50%),
    repeating-linear-gradient(45deg, transparent, transparent 6px, rgba(212, 175, 55, 0.03) 6px, rgba(212, 175, 55, 0.03) 12px);
}

.card-back__symbol {
  font-size: 1.5rem;
  color: var(--gold);
  opacity: 0.8;
  z-index: 1;
}

.card-face {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #2a2a3e 0%, #1a1a2e 100%);
  border: 2px solid var(--gold);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
}

.card-face__image {
  width: 100%;
  height: 80%;
  object-fit: contain;
  background: #1a1a2e;
}

.card-face__info {
  padding: 4px 8px;
  text-align: center;
  background: linear-gradient(transparent, rgba(26, 26, 46, 0.98));
}

.card-face__name {
  font-size: 0.7rem;
  color: var(--gold-light);
  font-weight: 600;
}

.card-face__status {
  font-size: 0.6rem;
  color: var(--accent-purple);
  margin-left: 4px;
}
</style>
