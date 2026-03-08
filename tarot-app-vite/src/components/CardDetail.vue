<script setup lang="ts">
import { computed } from 'vue'
import type { TarotCard, CardPosition, SpreadPosition } from '@/types'

interface Props {
  card: TarotCard
  position: CardPosition
  positionInfo: SpreadPosition
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isReversed = computed(() => props.position === 'reversed')

const meaning = computed(() => 
  isReversed.value ? props.card.reversed : props.card.upright
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="card-modal" @click.self="emit('close')">
        <div class="modal-overlay" @click="emit('close')"></div>
        <div class="modal-content">
          <button class="modal-close" @click="emit('close')">×</button>
          
          <div class="modal-card" :class="{ 'modal-card--reversed': isReversed }">
            <img 
              :src="card.imageUrl" 
              :alt="card.name"
              class="modal-card__image"
              loading="lazy"
            />
            <h3 class="modal-card__name">{{ card.name }}</h3>
            <p v-if="card.nameEn" class="modal-card__en">{{ card.nameEn }}</p>
            <p v-if="card.suit" class="modal-card__suit">{{ card.suit }}</p>
            <p class="modal-card__status">{{ isReversed ? '逆位' : '正位' }}</p>
            <p v-if="card.element" class="modal-card__element">元素：{{ card.element }}</p>
          </div>
          
          <div class="modal-info">
            <h4>【{{ positionInfo.name }}】</h4>
            <p class="position-meaning">{{ positionInfo.description }}</p>
            
            <div class="card-reading">
              <h5>牌意解读 {{ isReversed ? '（逆位）' : '（正位）' }}</h5>
              <p>{{ meaning }}</p>
            </div>
            
            <div v-if="card.detailed" class="card-reading">
              <h5>深度解读</h5>
              <p>{{ card.detailed }}</p>
            </div>
            
            <div v-if="card.advice" class="card-reading">
              <h5>指引建议</h5>
              <p class="advice-text">{{ card.advice }}</p>
            </div>
            
            <div v-if="card.keywords?.length" class="modal-keywords">
              <span 
                v-for="keyword in card.keywords" 
                :key="keyword" 
                class="keyword"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.card-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(5px);
}

.modal-content {
  position: relative;
  display: flex;
  gap: 25px;
  background: var(--bg-card);
  border: 1px solid var(--gold);
  border-radius: 15px;
  padding: 35px;
  max-width: 750px;
  max-height: 85vh;
  overflow-y: auto;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.4rem;
  cursor: pointer;
  z-index: 10;
}

.modal-close:hover {
  color: var(--gold);
}

.modal-card {
  text-align: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  min-width: 180px;
  flex-shrink: 0;
}

.modal-card--reversed .modal-card__image {
  transform: rotate(180deg);
}

.modal-card__image {
  width: 150px;
  height: auto;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
  border: 1px solid var(--gold-dark);
  transition: transform 0.3s ease;
}

.modal-card__name {
  font-size: 1.2rem;
  color: var(--gold-light);
  margin-bottom: 6px;
  font-family: 'Cinzel', serif;
}

.modal-card__en {
  font-size: 0.8rem;
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: 4px;
}

.modal-card__suit {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.modal-card__status {
  font-size: 0.9rem;
  color: var(--accent-purple);
  font-weight: 600;
  margin-top: 8px;
}

.modal-card__element {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 6px;
  padding: 4px 12px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  display: inline-block;
}

.modal-info {
  flex: 1;
  min-width: 0;
}

.modal-info h4 {
  font-family: 'Cinzel', serif;
  font-size: 1.3rem;
  color: var(--gold);
  margin-bottom: 10px;
}

.position-meaning {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-style: italic;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--border-color);
}

.card-reading {
  margin-bottom: 18px;
}

.card-reading h5 {
  color: var(--gold-light);
  margin-bottom: 10px;
  font-size: 1rem;
  font-family: 'Cinzel', serif;
}

.card-reading p {
  color: var(--text-primary);
  line-height: 1.8;
  font-size: 0.95rem;
}

.advice-text {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
  padding: 12px 15px;
  border-radius: 8px;
  border-left: 3px solid var(--gold);
}

.modal-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid var(--border-color);
}

.keyword {
  font-size: 0.75rem;
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.08) 100%);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 15px;
  color: var(--gold-light);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .modal-content {
    flex-direction: column;
    padding: 25px;
    margin: 15px;
  }
  
  .modal-card {
    min-width: auto;
  }
  
  .modal-card__image {
    width: 120px;
  }
}
</style>
