<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTarotStore } from '@/stores'
import { SpreadDisplay, InterpretationPanel, CardDetail } from '@/components'
import { useAIInterpretation } from '@/composables/useAIInterpretation'

const tarotStore = useTarotStore()
const { interpretation, isLoading, fetchInterpretation } = useAIInterpretation()

const selectedCardIndex = ref<number | null>(null)
const showCardDetail = ref(false)

const selectedCard = computed(() => {
  if (selectedCardIndex.value === null) return null
  return tarotStore.drawnCards[selectedCardIndex.value]
})

const selectedPositionInfo = computed(() => {
  if (selectedCardIndex.value === null || !tarotStore.currentSpread) return null
  return tarotStore.currentSpread.positions[selectedCardIndex.value]
})

function handleCardClick(index: number) {
  selectedCardIndex.value = index
  showCardDetail.value = true
}

function closeCardDetail() {
  showCardDetail.value = false
}

function toggleCardPosition() {
  if (selectedCardIndex.value !== null) {
    tarotStore.toggleCardPosition(selectedCardIndex.value)
  }
}

async function getAIInterpretation() {
  if (!tarotStore.currentSpread) return
  
  await fetchInterpretation({
    cards: tarotStore.drawnCards.map(item => ({
      card: item.card,
      position: item.position,
      slotName: tarotStore.currentSpread?.positions[item.slotIndex]?.name || ''
    })),
    spreadType: tarotStore.currentSpread.name,
    question: ''
  })
}

function saveReading() {
  const reading = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    spread: tarotStore.currentSpread,
    cards: tarotStore.drawnCards,
    interpretation: interpretation.value
  }
  
  const readings = JSON.parse(localStorage.getItem('tarot-readings') || '[]')
  readings.unshift(reading)
  if (readings.length > 50) readings.pop()
  localStorage.setItem('tarot-readings', JSON.stringify(readings))
  
  alert('解读已保存！')
}

function newReading() {
  tarotStore.resetReading()
}
</script>

<template>
  <div class="result-view">
    <div class="text-center mb-6">
      <h2 class="font-display text-2xl text-[var(--gold-light)] mb-2">牌面解读</h2>
    </div>
    
    <div v-if="tarotStore.currentSpread && tarotStore.drawnCards.length > 0" class="table-area">
      <SpreadDisplay 
        :spread="tarotStore.currentSpread"
        :cards="tarotStore.drawnCards"
        @card-click="handleCardClick"
      />
    </div>
    
    <InterpretationPanel 
      v-if="tarotStore.currentSpread"
      :cards="tarotStore.drawnCards"
      :spread="tarotStore.currentSpread"
      :is-loading="isLoading"
      :ai-interpretation="interpretation"
    />
    
    <div class="flex justify-center gap-4 mt-8">
      <button class="btn-mystical btn-secondary" @click="getAIInterpretation" :disabled="isLoading">
        <span>{{ isLoading ? '解读中...' : 'AI深度解读' }}</span>
      </button>
      <button class="btn-mystical" @click="saveReading">
        <span>保存解读</span>
      </button>
      <button class="btn-mystical btn-secondary" @click="newReading">
        <span>新的占卜</span>
      </button>
    </div>
    
    <CardDetail 
      v-if="selectedCard && selectedPositionInfo"
      :card="selectedCard.card"
      :position="selectedCard.position"
      :position-info="selectedPositionInfo"
      :show="showCardDetail"
      @close="closeCardDetail"
    />
  </div>
</template>

<style scoped>
.table-area {
  background: radial-gradient(ellipse at center, rgba(26, 26, 46, 0.8) 0%, rgba(10, 10, 15, 0.9) 100%);
  border: 2px solid var(--border-color);
  border-radius: 20px;
  padding: 30px;
  margin: 20px auto;
  min-height: 400px;
  box-shadow: 
    inset 0 0 100px rgba(212, 175, 55, 0.05),
    0 20px 60px rgba(0, 0, 0, 0.5);
  max-width: 1400px;
}

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

.btn-mystical:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  color: var(--text-secondary);
  border-color: var(--text-muted);
}

.btn-secondary:hover {
  color: var(--text-primary);
  border-color: var(--text-secondary);
}
</style>
