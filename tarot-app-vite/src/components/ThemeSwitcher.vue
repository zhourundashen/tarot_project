<script setup lang="ts">
import { useThemeStore } from '@/stores'

const themeStore = useThemeStore()

function selectTheme(themeId: string) {
  themeStore.setTheme(themeId)
}
</script>

<template>
  <div class="theme-switcher">
    <h3 class="text-lg font-display text-[var(--gold-light)] mb-4">选择主题</h3>
    <div class="theme-grid">
      <div 
        v-for="theme in themeStore.allThemes" 
        :key="theme.id"
        class="theme-card"
        :class="{ 'theme-card--active': themeStore.currentTheme.id === theme.id }"
        @click="selectTheme(theme.id)"
      >
        <div 
          class="theme-preview"
          :style="{ background: theme.preview }"
        ></div>
        <div class="theme-info">
          <span class="theme-name">{{ theme.name }}</span>
          <span class="theme-name-en">{{ theme.nameEn }}</span>
        </div>
        <div v-if="themeStore.currentTheme.id === theme.id" class="theme-check">✓</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-switcher {
  padding: 20px;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 12px;
}

.theme-card {
  position: relative;
  cursor: pointer;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
}

.theme-card:hover {
  border-color: var(--gold);
  transform: translateY(-2px);
}

.theme-card--active {
  border-color: var(--gold);
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
}

.theme-preview {
  height: 80px;
  border-radius: 10px 10px 0 0;
}

.theme-info {
  padding: 10px;
  background: var(--bg-card);
  text-align: center;
}

.theme-name {
  display: block;
  font-size: 0.9rem;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.theme-name-en {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.theme-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: var(--gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: var(--bg-primary);
  font-weight: bold;
}
</style>
