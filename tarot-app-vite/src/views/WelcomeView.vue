<script setup lang="ts">
import { useTarotStore } from '@/stores'

const tarotStore = useTarotStore()

function startReading() {
  tarotStore.initDeck()
  tarotStore.setPhase('spread-select')
}
</script>

<template>
  <div class="welcome-view flex items-center justify-center min-h-[calc(100vh-200px)]">
    <div class="welcome-content text-center max-w-xl">
      <div class="tarot-symbol mb-8">
        <svg viewBox="0 0 100 100" class="mystical-symbol w-24 h-24 mx-auto">
          <circle cx="50" cy="50" r="45" fill="none" stroke="url(#goldGradient)" stroke-width="2"/>
          <circle cx="50" cy="50" r="35" fill="none" stroke="url(#goldGradient)" stroke-width="1"/>
          <path d="M50 10 L50 90 M10 50 L90 50" stroke="url(#goldGradient)" stroke-width="1"/>
          <path d="M50 15 L55 25 L50 20 L45 25 Z" fill="#d4af37"/>
          <path d="M50 85 L55 75 L50 80 L45 75 Z" fill="#d4af37"/>
          <path d="M15 50 L25 55 L20 50 L25 45 Z" fill="#d4af37"/>
          <path d="M85 50 L75 55 L80 50 L75 45 Z" fill="#d4af37"/>
          <text x="50" y="55" text-anchor="middle" fill="#d4af37" font-size="14">☽</text>
          <defs>
            <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#d4af37"/>
              <stop offset="50%" style="stop-color:#f4e4ba"/>
              <stop offset="100%" style="stop-color:#d4af37"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <h2 class="font-display text-2xl text-[var(--gold-light)] mb-4 tracking-wider">
        欢迎来到塔罗的世界
      </h2>
      
      <p class="text-[var(--text-secondary)] mb-10 leading-relaxed">
        在星光与月影之间，塔罗牌将为你揭示命运的奥秘
      </p>
      
      <button class="btn-mystical" @click="startReading">
        <span>开始占卜</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.mystical-symbol {
  animation: rotate 30s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

.btn-mystical::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, var(--glow-gold), transparent);
  transition: left 0.5s ease;
}

.btn-mystical:hover::before {
  left: 100%;
}

.btn-mystical:hover {
  background: rgba(212, 175, 55, 0.1);
  box-shadow: 0 0 30px var(--glow-gold);
  transform: translateY(-2px);
}
</style>
