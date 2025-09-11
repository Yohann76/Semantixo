<template>
  <div class="keyword-wordcloud">
    <h5>☁️ Nuage de mots-clés</h5>
    <div class="wordcloud-container" ref="wordcloudContainer">
      <div 
        v-for="(word, index) in sortedWords" 
        :key="index"
        class="word-item"
        :style="getWordStyle(word)"
        :title="`${word.keyword}: ${word.frequency} occurrences (${word.density.toFixed(2)}%)`"
        @click="onWordClick(word)"
      >
        {{ word.keyword }}
      </div>
    </div>
    
    <!-- Légende -->
    <div class="wordcloud-legend">
      <div class="legend-item">
        <span class="legend-color optimal"></span>
        <span>Optimal</span>
      </div>
      <div class="legend-item">
        <span class="legend-color underused"></span>
        <span>Sous-utilisé</span>
      </div>
      <div class="legend-item">
        <span class="legend-color overused"></span>
        <span>Sur-utilisé</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick } from 'vue'

const props = defineProps({
  keywordData: {
    type: Array,
    default: () => []
  },
  maxWords: {
    type: Number,
    default: 20
  }
})

const emit = defineEmits(['wordClick'])

const wordcloudContainer = ref(null)

// Calculer les mots triés par fréquence
const sortedWords = computed(() => {
  if (!props.keywordData || props.keywordData.length === 0) return []
  
  return props.keywordData
    .slice()
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, props.maxWords)
})

// Calculer la taille maximale et minimale
const maxFrequency = computed(() => {
  if (sortedWords.value.length === 0) return 1
  return Math.max(...sortedWords.value.map(w => w.frequency))
})

const minFrequency = computed(() => {
  if (sortedWords.value.length === 0) return 1
  return Math.min(...sortedWords.value.map(w => w.frequency))
})

// Déterminer le statut du mot (optimal, sous-utilisé, sur-utilisé)
const getWordStatus = (word) => {
  if (!word.optimalRange) return 'optimal'
  
  const density = word.density
  const { min, max } = word.optimalRange
  
  if (density < min) return 'underused'
  if (density > max) return 'overused'
  return 'optimal'
}

// Calculer le style du mot
const getWordStyle = (word) => {
  const status = getWordStatus(word)
  const frequency = word.frequency
  
  // Calculer la taille basée sur la fréquence
  const minSize = 12
  const maxSize = 32
  const size = minSize + ((frequency - minFrequency.value) / (maxFrequency.value - minFrequency.value)) * (maxSize - minSize)
  
  // Couleurs selon le statut
  const colors = {
    optimal: '#28a745',    // Vert
    underused: '#ffc107',  // Jaune
    overused: '#dc3545'    // Rouge
  }
  
  return {
    fontSize: `${Math.max(size, minSize)}px`,
    color: colors[status],
    fontWeight: status === 'overused' ? 'bold' : 'normal',
    opacity: status === 'underused' ? 0.7 : 1
  }
}

// Gérer le clic sur un mot
const onKeywordClick = (word) => {
  emit('wordClick', word)
}

// Animation d'apparition
onMounted(() => {
  nextTick(() => {
    const words = wordcloudContainer.value?.querySelectorAll('.word-item')
    if (words) {
      words.forEach((word, index) => {
        word.style.animationDelay = `${index * 0.1}s`
        word.classList.add('animate-in')
      })
    }
  })
})
</script>

<style scoped>
.keyword-wordcloud {
  margin: 20px 0;
}

.wordcloud-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 1px solid #dee2e6;
  min-height: 200px;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.word-item {
  display: inline-block;
  margin: 4px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  opacity: 0;
  transform: scale(0.8);
}

.word-item:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-color: currentColor;
}

.word-item.animate-in {
  animation: wordAppear 0.5s ease forwards;
}

@keyframes wordAppear {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.wordcloud-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6c757d;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: inline-block;
}

.legend-color.optimal {
  background-color: #28a745;
}

.legend-color.underused {
  background-color: #ffc107;
}

.legend-color.overused {
  background-color: #dc3545;
}

/* Responsive */
@media (max-width: 768px) {
  .wordcloud-container {
    padding: 15px;
    gap: 6px;
  }
  
  .word-item {
    padding: 4px 8px;
    font-size: 14px;
  }
  
  .wordcloud-legend {
    gap: 15px;
  }
  
  .legend-item {
    font-size: 12px;
  }
}

/* Animation de fond */
.wordcloud-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 123, 255, 0.05) 0%, transparent 70%);
  animation: float 20s ease-in-out infinite;
  pointer-events: none;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(30px, -30px) rotate(120deg); }
  66% { transform: translate(-20px, 20px) rotate(240deg); }
}
</style>
