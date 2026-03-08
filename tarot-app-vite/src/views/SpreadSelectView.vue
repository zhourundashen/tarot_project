<script setup lang="ts">
import { useTarotStore } from '@/stores'
import { SpreadSelector } from '@/components'

const tarotStore = useTarotStore()

function selectSpread(spreadId: string) {
  tarotStore.selectSpread(spreadId)
}

function goBack() {
  tarotStore.setPhase('welcome')
}
</script>

<template>
  <div class="spread-select-view">
    <div class="text-center mb-8">
      <h2 class="font-display text-2xl text-[var(--gold-light)] mb-2">选择牌阵</h2>
      <p class="text-[var(--text-secondary)]">每种牌阵都有其独特的解读方式</p>
    </div>
    
    <SpreadSelector 
      :spreads="tarotStore.allSpreads"
      @select="selectSpread"
    />
    
    <div class="text-center mt-6">
      <button class="btn-back" @click="goBack">← 返回</button>
    </div>
  </div>
</template>

<style scoped>
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
</style>
