<template>
  <div class="analysis-history">
    <div class="history-header">
      <h3 class="history-title">Analyses Récentes</h3>
    </div>
    
    <div class="history-content">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
      
      <div v-else-if="analyses.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <h4>Aucune analyse</h4>
        <p>Commencez par analyser un texte !</p>
      </div>
      
              <div v-else class="analyses-list">
          <div 
            v-for="analysis in analyses" 
            :key="analysis.id" 
            class="analysis-item"
            @click="selectAnalysis(analysis)"
          >
            <div class="analysis-header">
              <div class="analysis-date">
                {{ formatShortDate(analysis.createdAt) }}
              </div>
              <div class="analysis-score-badge" :class="getScoreClass(analysis.seoScore)">
                {{ analysis.seoScore || '0' }}
              </div>
            </div>
            <div class="analysis-text">
              {{ truncateText(analysis.text || 'Aucun texte', 35) }}
            </div>
            <div class="analysis-stats">
              <div class="stat">
                <span class="stat-label">📝</span>
                <span class="stat-value">{{ analysis.wordCount }}</span>
              </div>
              <div class="stat">
                <span class="stat-label">🔤</span>
                <span class="stat-value">{{ analysis.characterCount }}</span>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineExpose, defineEmits } from 'vue'
import { useAuth } from '../composables/useGlobalStores.js'

const { isAuthenticated, getAuthHeaders } = useAuth()

const analyses = ref([])
const loading = ref(true)
const error = ref(null)

// Définir les émetteurs d'événements
const emit = defineEmits(['select-analysis'])

// Charger l'historique des analyses
const loadAnalyses = async () => {
  if (!isAuthenticated.value) {
    loading.value = false
    return
  }
  
  try {
    const headers = getAuthHeaders()
    const response = await fetch('http://localhost:3000/api/analysis', {
      method: 'GET',
      headers: headers
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('📊 [HISTORY] Données reçues:', data)
      analyses.value = data.data.analyses || []
      console.log('📊 [HISTORY] Analyses chargées:', analyses.value.length)
    } else {
      error.value = 'Erreur lors du chargement de l\'historique'
      console.error('📊 [HISTORY] Erreur API:', response.status)
    }
  } catch (err) {
    error.value = `Erreur: ${err.message}`
    console.error('Erreur chargement historique:', err)
  } finally {
    loading.value = false
  }
}

// Formater la date courte
const formatShortDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Aujourd\'hui'
  if (diffDays === 2) return 'Hier'
  if (diffDays <= 7) return `Il y a ${diffDays}j`
  
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit'
  })
}

// Obtenir la classe CSS pour le score
const getScoreClass = (score) => {
  if (!score || score === 0) return 'score-poor'
  if (score >= 80) return 'score-excellent'
  if (score >= 60) return 'score-good'
  if (score >= 40) return 'score-average'
  return 'score-poor'
}

// Tronquer le texte
const truncateText = (text, maxLength) => {
  if (!text) return 'Aucun texte'
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// Sélectionner une analyse
const selectAnalysis = (analysis) => {
  // Émettre un événement pour informer le composant parent
  emit('select-analysis', analysis)
  console.log('📊 [HISTORY] Analyse sélectionnée:', analysis)
}

onMounted(() => {
  console.log('📊 [HISTORY] Composant monté')
  loadAnalyses()
})

// Exposer la fonction de rechargement pour les composants parents
defineExpose({
  refreshAnalyses: loadAnalyses
})
</script>

<style scoped>
.analysis-history {
  width: 250px;
  height: calc(100vh - 70px);
  background: white;
  border-left: 1px solid #e9ecef;
  overflow-y: auto;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);
  position: fixed;
  left: 280px;
  top: 70px;
  z-index: 997;
}

.history-header {
  padding: 20px 15px 15px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
  position: sticky;
  top: 0;
  z-index: 1;
}

.history-title {
  font-size: 1rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.history-content {
  padding: 15px;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e9ecef;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.empty-state h4 {
  margin: 0 0 10px 0;
  color: #495057;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
}

.analyses-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.analysis-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  margin-bottom: 12px;
}

.analysis-item:hover {
  border-color: #667eea;
  box-shadow: 0 1px 4px rgba(102, 126, 234, 0.15);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.analysis-date {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
}

.analysis-score-badge {
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 20px;
  text-align: center;
}

.score-excellent {
  background: #d4edda;
  color: #155724;
}

.score-good {
  background: #d1ecf1;
  color: #0c5460;
}

.score-average {
  background: #fff3cd;
  color: #856404;
}

.score-poor {
  background: #f8d7da;
  color: #721c24;
}

.analysis-text {
  font-size: 0.8rem;
  color: #2c3e50;
  line-height: 1.3;
  margin-bottom: 6px;
  font-weight: 500;
}

.analysis-stats {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 3px;
}

.stat-label {
  font-size: 0.7rem;
}

.stat-value {
  font-size: 0.7rem;
  font-weight: 600;
  color: #495057;
}

/* Scrollbar personnalisée */
.analysis-history::-webkit-scrollbar {
  width: 6px;
}

.analysis-history::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.analysis-history::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.analysis-history::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 