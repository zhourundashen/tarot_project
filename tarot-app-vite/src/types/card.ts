export type CardPosition = 'upright' | 'reversed'

export type ArcanaType = 'major' | 'minor'

export type SuitType = 'Major' | 'Wands' | 'Cups' | 'Swords' | 'Pentacles'

export type ElementType = '火' | '水' | '风' | '地'

export interface TarotCard {
  id: number | string
  number?: number
  name: string
  nameEn: string
  type: ArcanaType
  suit?: SuitType
  element?: ElementType
  keywords: string[]
  upright: string
  reversed: string
  symbolism?: string
  detailed?: string
  advice?: string
  imageUrl: string
  isMinor?: boolean
  numeral?: string
  color?: string
}

export interface DrawnCard {
  card: TarotCard
  position: CardPosition
  slotIndex: number
}

export interface SpreadPosition {
  name: string
  description: string
  style?: string
}

export interface Spread {
  id: string
  name: string
  nameEn: string
  cardCount: number
  difficulty: '初级' | '中级' | '高级'
  description: string
  icon: string
  positions: SpreadPosition[]
}

export interface Theme {
  id: string
  name: string
  nameEn: string
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    accent: string
  }
  preview: string
}

export interface ReadingRecord {
  id: string
  date: string
  spread: Spread
  cards: DrawnCard[]
  question?: string
  interpretation?: string
}

export interface AIInterpretationRequest {
  cards: Array<{
    card: TarotCard
    position: CardPosition
    slotName: string
  }>
  spreadType: string
  question?: string
}

export interface AIInterpretationResponse {
  interpretation: string
  summary: string
  advice: string
}
