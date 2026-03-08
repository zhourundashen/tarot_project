import { useLocalStorage } from '@vueuse/core'
import type { ReadingRecord } from '@/types'

export function useHistory() {
  const readings = useLocalStorage<ReadingRecord[]>('tarot-readings', [])

  function saveReading(reading: ReadingRecord): void {
    readings.value.unshift(reading)
    if (readings.value.length > 50) {
      readings.value = readings.value.slice(0, 50)
    }
  }

  function deleteReading(id: string): void {
    const index = readings.value.findIndex(r => r.id === id)
    if (index !== -1) {
      readings.value.splice(index, 1)
    }
  }

  function getReadings(): ReadingRecord[] {
    return readings.value
  }

  function clearHistory(): void {
    readings.value = []
  }

  return {
    readings,
    saveReading,
    deleteReading,
    getReadings,
    clearHistory
  }
}
