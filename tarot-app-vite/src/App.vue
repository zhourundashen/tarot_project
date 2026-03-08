<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTarotStore, useThemeStore } from '@/stores'
import { 
  WelcomeView, 
  SpreadSelectView, 
  ShuffleView, 
  DrawView, 
  ResultView 
} from '@/views'

const tarotStore = useTarotStore()
const themeStore = useThemeStore()

const currentView = computed(() => tarotStore.currentPhase)

onMounted(() => {
  themeStore.initTheme()
  createStars()
})

function createStars() {
  const starsContainer = document.querySelector('.stars')
  if (!starsContainer) return
  
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div')
    star.className = 'star'
    star.style.left = `${Math.random() * 100}%`
    star.style.top = `${Math.random() * 100}%`
    star.style.animationDelay = `${Math.random() * 3}s`
    star.style.width = `${Math.random() * 3 + 1}px`
    star.style.height = star.style.width
    starsContainer.appendChild(star)
  }
}
</script>

<template>
  <div class="app-container">
    <div class="stars"></div>
    <div class="moon-glow"></div>
    
    <header class="header">
      <h1 class="logo">✧ 神秘塔罗 ✧</h1>
      <p class="subtitle">聆听命运的指引</p>
    </header>

    <main class="main-content">
      <Transition name="fade" mode="out-in">
        <WelcomeView v-if="currentView === 'welcome'" />
        <SpreadSelectView v-else-if="currentView === 'spread-select'" />
        <ShuffleView v-else-if="currentView === 'shuffle'" />
        <DrawView v-else-if="currentView === 'draw'" />
        <ResultView v-else-if="currentView === 'result'" />
      </Transition>
    </main>

    <footer class="footer">
      <p>✧ 命运的轮盘永不停歇 ✧</p>
    </footer>
  </div>
</template>

<style>
.app-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.star {
  position: absolute;
  background: #fff;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.moon-glow {
  position: fixed;
  top: -200px;
  right: -200px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

.header {
  text-align: center;
  padding: 20px;
  position: relative;
  z-index: 10;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(180deg, rgba(10, 10, 15, 0.9) 0%, transparent 100%);
}

.logo {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  color: var(--gold);
  text-shadow: 0 0 30px var(--glow-gold);
  letter-spacing: 0.3em;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  letter-spacing: 0.5em;
}

.main-content {
  flex: 1;
  position: relative;
  z-index: 10;
  padding: 20px;
}

.footer {
  text-align: center;
  padding: 15px;
  border-top: 1px solid var(--border-color);
  position: relative;
  z-index: 10;
}

.footer p {
  font-size: 0.8rem;
  color: var(--text-muted);
  letter-spacing: 0.2em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .logo {
    font-size: 1.5rem;
    letter-spacing: 0.1em;
  }
  
  .subtitle {
    font-size: 0.75rem;
    letter-spacing: 0.3em;
  }
}
</style>
