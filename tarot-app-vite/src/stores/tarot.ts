import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { TarotCard, DrawnCard, Spread, CardPosition } from '@/types'
import { getFullDeck, shuffleDeck } from '@/data/cards'
import { getAllSpreads, getSpreadById } from '@/data/spreads'

export const useTarotStore = defineStore('tarot', () => {
  const deck = ref<TarotCard[]>([])
  const shuffledDeck = ref<TarotCard[]>([])
  const currentSpread = ref<Spread | null>(null)
  const drawnCards = ref<DrawnCard[]>([])
  const shuffleCount = ref(0)
  const isShuffling = ref(false)
  const currentPhase = ref<'welcome' | 'spread-select' | 'shuffle' | 'draw' | 'result'>('welcome')

  const allSpreads = computed(() => getAllSpreads())

  const remainingCards = computed(() => {
    return shuffledDeck.value.length
  })

  const cardsToDraw = computed(() => {
    return currentSpread.value ? currentSpread.value.cardCount - drawnCards.value.length : 0
  })

  function initDeck() {
    deck.value = getFullDeck()
    shuffledDeck.value = []
    drawnCards.value = []
    shuffleCount.value = 0
  }

  function selectSpread(spreadId: string) {
    const spread = getSpreadById(spreadId)
    if (spread) {
      currentSpread.value = spread
      drawnCards.value = []
      currentPhase.value = 'shuffle'
    }
  }

  function performShuffle() {
    isShuffling.value = true
    shuffledDeck.value = shuffleDeck(deck.value)
    shuffleCount.value++
    
    setTimeout(() => {
      isShuffling.value = false
    }, 800)
    
    return shuffledDeck.value
  }

  function drawCard(): DrawnCard | null {
    if (!currentSpread.value || cardsToDraw.value <= 0 || shuffledDeck.value.length === 0) {
      return null
    }

    const card = shuffledDeck.value.shift()
    if (!card) return null

    const position: CardPosition = Math.random() < 0.3 ? 'reversed' : 'upright'
    const drawnCard: DrawnCard = {
      card,
      position,
      slotIndex: drawnCards.value.length
    }

    drawnCards.value.push(drawnCard)
    return drawnCard
  }

  function autoDrawCards(): DrawnCard[] {
    const cards: DrawnCard[] = []
    while (cardsToDraw.value > 0) {
      const card = drawCard()
      if (card) cards.push(card)
      else break
    }
    return cards
  }

  function toggleCardPosition(index: number) {
    if (index >= 0 && index < drawnCards.value.length) {
      drawnCards.value[index].position = 
        drawnCards.value[index].position === 'upright' ? 'reversed' : 'upright'
    }
  }

  function resetReading() {
    currentSpread.value = null
    drawnCards.value = []
    shuffledDeck.value = []
    shuffleCount.value = 0
    currentPhase.value = 'welcome'
  }

  function setPhase(phase: typeof currentPhase.value) {
    currentPhase.value = phase
  }

  return {
    deck,
    shuffledDeck,
    currentSpread,
    drawnCards,
    shuffleCount,
    isShuffling,
    currentPhase,
    allSpreads,
    remainingCards,
    cardsToDraw,
    initDeck,
    selectSpread,
    performShuffle,
    drawCard,
    autoDrawCards,
    toggleCardPosition,
    resetReading,
    setPhase
  }
})
