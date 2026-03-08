<script setup lang="ts">
import { ref } from 'vue'
import { useTarotStore } from '@/stores'
import { CardDeck } from '@/components'

const tarotStore = useTarotStore()

const shufflePhase = ref(0)
const isAnimating = ref(false)

function handleShuffle() {
  if (isAnimating.value) return
  
  isAnimating.value = true
  shufflePhase.value = 1
  tarotStore.performShuffle()
  
  setTimeout(() => {
    shufflePhase.value = 2
    isAnimating.value = false
  }, 800)
}

function continueShuffle() {
  shufflePhase.value = 0
}

function goToCut() {
  shufflePhase.value = 3
}

function performCut() {
  isAnimating.value = true
  
  setTimeout(() => {
    shufflePhase.value = 4
    isAnimating.value = false
  }, 1600)
}

function goToDraw() {
  tarotStore.setPhase('draw')
}

function goBack() {
  tarotStore.setPhase('spread-select')
  shufflePhase.value = 0
}
</script>

<template>
  <div class="shuffle-view">
    <div class="text-center mb-8">
      <h2 class="font-display text-2xl text-[var(--gold-light)] mb-2">洗牌与冥想</h2>
      <p class="text-[var(--text-secondary)]">在心中默念你的问题，然后进行洗牌</p>
    </div>
    
    <div class="shuffle-phases min-h-[320px]">
      <div v-if="shufflePhase === 0" class="shuffle-phase">
        <div class="flex justify-center mb-6">
          <CardDeck :card-count="5" />
        </div>
        <div class="flex justify-center gap-4">
          <button class="btn-mystical" @click="handleShuffle">
            <span>开始洗牌</span>
          </button>
        </div>
      </div>
      
      <div v-else-if="shufflePhase === 1" class="shuffle-phase">
        <div class="flex justify-center mb-6">
          <CardDeck :card-count="5" :is-shuffling="true" />
        </div>
        <p class="text-center text-[var(--text-secondary)]">洗牌中...</p>
      </div>
      
      <div v-else-if="shufflePhase === 2" class="shuffle-phase">
        <div class="flex justify-center mb-6">
          <CardDeck :card-count="5" />
        </div>
        <p class="text-center text-[var(--gold)] mb-4">已洗牌 {{ tarotStore.shuffleCount }} 次</p>
        <p class="text-center text-[var(--text-secondary)] mb-6">是否继续洗牌？</p>
        <div class="flex justify-center gap-4">
          <button class="btn-mystical" @click="continueShuffle">
            <span>再洗一次</span>
          </button>
          <button class="btn-mystical btn-secondary" @click="goToCut">
            <span>准备切牌</span>
          </button>
        </div>
      </div>
      
      <div v-else-if="shufflePhase === 3" class="shuffle-phase">
        <div class="cut-area">
          <p class="text-center text-[var(--text-secondary)] mb-6">将牌堆分成三叠，点击执行切牌</p>
          <div class="three-piles flex justify-center gap-8">
            <div class="pile">
              <div class="pile-cards">
                <div class="pile-card"></div>
                <div class="pile-card"></div>
                <div class="pile-card"></div>
              </div>
              <span class="pile-label">左</span>
            </div>
            <div class="pile">
              <div class="pile-cards">
                <div class="pile-card"></div>
                <div class="pile-card"></div>
                <div class="pile-card"></div>
              </div>
              <span class="pile-label">中</span>
            </div>
            <div class="pile">
              <div class="pile-cards">
                <div class="pile-card"></div>
                <div class="pile-card"></div>
                <div class="pile-card"></div>
              </div>
              <span class="pile-label">右</span>
            </div>
          </div>
        </div>
        <div class="flex justify-center mt-6">
          <button class="btn-mystical" @click="performCut" :disabled="isAnimating">
            <span>执行切牌</span>
          </button>
        </div>
      </div>
      
      <div v-else-if="shufflePhase === 4" class="shuffle-phase">
        <div class="flex justify-center mb-6">
          <CardDeck :card-count="5" />
        </div>
        <p class="text-center text-[var(--gold)] mb-4">牌已准备好</p>
        <div class="flex justify-center">
          <button class="btn-mystical" @click="goToDraw">
            <span>开始抽牌</span>
          </button>
        </div>
      </div>
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

.three-piles {
  min-height: 180px;
}

.pile {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pile-cards {
  position: relative;
  width: 100px;
  height: 150px;
}

.pile-card {
  position: absolute;
  width: 100px;
  height: 150px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
  border: 2px solid var(--gold);
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
}

.pile-card:nth-child(1) { transform: translate(0, 0); }
.pile-card:nth-child(2) { transform: translate(2px, -2px); }
.pile-card:nth-child(3) { transform: translate(4px, -4px); }

.pile-label {
  margin-top: 8px;
  font-size: 0.8rem;
  color: var(--text-muted);
  font-family: 'Cinzel', serif;
}
</style>
