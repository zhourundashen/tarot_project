<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTarotStore } from '@/stores'
import { FanDeck, TarotCard } from '@/components'

const tarotStore = useTarotStore()

const selectedIndices = ref<number[]>([])
const isDrawing = ref(false)

const remainingToDraw = computed(() => 
  tarotStore.currentSpread ? 
  tarotStore.currentSpread.cardCount - selectedIndices.value.length : 0
)

const canReveal = computed(() => remainingToDraw.value === 0)

function handleCardSelect(index: number) {
  if (isDrawing.value || remainingToDraw.value <= 0) return
  
  isDrawing.value = true
  selectedIndices.value.push(index)
  
  setTimeout(() => {
    isDrawing.value = false
  }, 400)
}

function autoDraw() {
  const remaining = remainingToDraw.value
  const available: number[] = []
  
  for (let i = 0; i < tarotStore.shuffledDeck.length; i++) {
    if (!selectedIndices.value.includes(i)) {
      available.push(i)
    }
  }
  
  for (let i = 0; i < remaining && available.length > 0; i++) {
    const randIndex = Math.floor(Math.random() * available.length)
    selectedIndices.value.push(available[randIndex])
    available.splice(randIndex, 1)
  }
}

function revealCards() {
  tarotStore.drawnCards = []
  
  for (const idx of selectedIndices.value) {
    const card = tarotStore.shuffledDeck[idx]
    if (card) {
      tarotStore.drawnCards.push({
        card,
        position: Math.random() < 0.3 ? 'reversed' : 'upright',
        slotIndex: tarotStore.drawnCards.length
      })
    }
  }
  
  tarotStore.setPhase('result')
}

function goBack() {
  selectedIndices.value = []
  tarotStore.setPhase('shuffle')
}
</script>

<template>
  <div class="draw-view">
    <div class="text-center mb-4">
      <h2 class="font-display text-2xl text-[var(--gold-light)] mb-2">抽牌</h2>
      <p class="text-[var(--text-secondary)]">
        {{ remainingToDraw > 0 ? `还需选择 ${remainingToDraw} 张牌` : '所有牌已选择完毕，可以翻开牌面' }}
      </p>
    </div>
    
    <FanDeck 
      v-if="tarotStore.shuffledDeck.length > 0"
      :cards="tarotStore.shuffledDeck"
      :selected-indices="selectedIndices"
      @select="handleCardSelect"
    />
    
    <div v-if="tarotStore.currentSpread" class="drawn-slots mt-6">
      <h4 class="text-center font-display text-[var(--gold)] mb-4">已选牌位</h4>
      <div class="flex justify-center gap-4 flex-wrap">
        <div 
          v-for="i in tarotStore.currentSpread.cardCount" 
          :key="i"
          class="drawn-slot"
          :class="{ 'drawn-slot--filled': i <= selectedIndices.length }"
        >
          <template v-if="i <= selectedIndices.length">
            <div class="drawn-card">
              <div class="drawn-card-back"></div>
            </div>
          </template>
          <span class="slot-label">{{ tarotStore.currentSpread?.positions[i-1]?.name || i }}</span>
        </div>
      </div>
    </div>
    
    <div class="flex justify-center gap-4 mt-8">
      <button 
        v-if="!canReveal"
        class="btn-mystical btn-secondary"
        @click="autoDraw"
      >
        <span>自动抽牌</span>
      </button>
      <button 
        v-if="canReveal"
        class="btn-mystical"
        @click="revealCards"
      >
        <span>翻开牌面</span>
      </button>
    </div>
    
    <div class="text-center mt-6">
      <button class="btn-back" @click="goBack">← 返回</button>
    </div>
  </div>
</template>

<style scoped>
.btn-mystical {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 15px 40px;
  font-family: 'Cinzel', serif;
  font-size: 0.95rem;
  letter-spacing: 0.15em;
  color: var(--gold);
  background: transparent;
  border: 1px solid var(--gold);
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-mystical span {
  position: relative;
  z-index: 2;
}

.btn-mystical:hover {
  background: rgba(212, 175, 55, 0.1);
  box-shadow: 0 0 30px var(--glow-gold);
}

.btn-secondary {
  color: var(--text-secondary);
  border-color: var(--text-muted);
}

.btn-secondary:hover {
  color: var(--text-primary);
  border-color: var(--text-secondary);
}

.btn-back {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 10px 20px;
  transition: color 0.3s ease;
}

.btn-back:hover {
  color: var(--gold);
}

.drawn-slot {
  width: 80px;
  height: 125px;
  border: 2px dashed rgba(212, 175, 55, 0.3);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  position: relative;
}

.drawn-slot--filled {
  border: 2px solid var(--gold);
  background: transparent;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
}

.drawn-card {
  width: 60px;
  height: 95px;
}

.drawn-card-back {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid var(--gold);
  border-radius: 6px;
}

.slot-label {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: var(--text-secondary);
  white-space: nowrap;
  background: var(--bg-primary);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}
</style>
