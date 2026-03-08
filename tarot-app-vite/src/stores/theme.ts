import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Theme } from '@/types'

const themes: Theme[] = [
  {
    id: 'mystic-night',
    name: '神秘之夜',
    nameEn: 'Mystic Night',
    colors: {
      primary: '#d4af37',
      secondary: '#6b5b95',
      background: '#0a0a0f',
      text: '#e8e6e3',
      accent: '#4a6fa5'
    },
    preview: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)'
  },
  {
    id: 'golden-dawn',
    name: '黄金黎明',
    nameEn: 'Golden Dawn',
    colors: {
      primary: '#ffd700',
      secondary: '#b8860b',
      background: '#1a1510',
      text: '#f5f5dc',
      accent: '#cd853f'
    },
    preview: 'linear-gradient(135deg, #1a1510 0%, #2d261a 50%, #3d3520 100%)'
  },
  {
    id: 'crystal-cave',
    name: '水晶洞穴',
    nameEn: 'Crystal Cave',
    colors: {
      primary: '#9370db',
      secondary: '#6a5acd',
      background: '#0d0d1a',
      text: '#e6e6fa',
      accent: '#8a2be2'
    },
    preview: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #2d1f3d 100%)'
  },
  {
    id: 'forest-mystery',
    name: '森林秘境',
    nameEn: 'Forest Mystery',
    colors: {
      primary: '#2e8b57',
      secondary: '#3cb371',
      background: '#0a100a',
      text: '#98fb98',
      accent: '#228b22'
    },
    preview: 'linear-gradient(135deg, #0a100a 0%, #1a2a1a 50%, #0d1f0d 100%)'
  },
  {
    id: 'silk-road',
    name: '丝绸之路',
    nameEn: 'Silk Road',
    colors: {
      primary: '#dc143c',
      secondary: '#b22222',
      background: '#1a0a0a',
      text: '#ffd0d0',
      accent: '#8b0000'
    },
    preview: 'linear-gradient(135deg, #1a0a0a 0%, #2a1a1a 50%, #3d2020 100%)'
  }
]

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<Theme>(themes[0])
  const allThemes = ref<Theme[]>(themes)

  function setTheme(themeId: string) {
    const theme = themes.find(t => t.id === themeId)
    if (theme) {
      currentTheme.value = theme
      applyTheme(theme)
    }
  }

  function applyTheme(theme: Theme) {
    const root = document.documentElement
    root.style.setProperty('--bg-primary', theme.colors.background)
    root.style.setProperty('--text-primary', theme.colors.text)
    root.style.setProperty('--gold', theme.colors.primary)
    root.style.setProperty('--accent-purple', theme.colors.secondary)
    root.style.setProperty('--accent-blue', theme.colors.accent)
  }

  function initTheme() {
    const savedThemeId = localStorage.getItem('tarot-theme')
    if (savedThemeId) {
      setTheme(savedThemeId)
    } else {
      applyTheme(currentTheme.value)
    }
  }

  watch(currentTheme, (newTheme) => {
    localStorage.setItem('tarot-theme', newTheme.id)
  })

  return {
    currentTheme,
    allThemes,
    setTheme,
    initTheme
  }
})
