<template>
  <div class="internal-link-history">
    <div class="history-header">
      <h3 class="history-title">
        Analyses récentes de maillage interne
      </h3>
      <button @click="goToNewAnalysis" class="new-analysis-btn" title="Nouvelle analyse">
        <span class="btn-icon">+</span>
      </button>
    </div>
    
    <div class="history-content">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
      
      <div v-else-if="analyses.length === 0" class="empty-state">
        <div class="empty-icon">🔗</div>
        <h4>Aucune analyse</h4>
        <p>Commencez par analyser le maillage interne d'un site !</p>
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
            <div class="analysis-score-badge" :class="getScoreClass(analysis.internalLinkScore)">
              {{ analysis.internalLinkScore || '0' }}
            </div>
          </div>
          <div class="analysis-text">
            <div class="analysis-type-badge">
              🔗
            </div>
            {{ truncateText(analysis.url, 35) }}
          </div>
          <div class="analysis-stats">
            <div class="stat">
              <span class="stat-label">🔗</span>
              <span class="stat-value">{{ analysis.totalInternalLinks }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">❌</span>
              <span class="stat-value">{{ analysis.brokenLinks }}</span>
            </div>
            <div class="stat">
              <span class="stat-label">📄</span>
              <span class="stat-value">{{ analysis.uniqueInternalPages }}</span>
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

const emit = defineEmits(['select-analysis'])

// Charger l'historique des analyses de maillage interne
const loadAnalyses = async () => {
  if (!isAuthenticated.value) {
    loading.value = false
    return
  }
  try {
    const headers = getAuthHeaders()
    const response = await fetch('http://localhost:3000/api/analysis-internal-link', {
      method: 'GET',
      headers: headers
    })
    
    if (response.ok) {
      const data = await response.json()
      analyses.value = data.data.analyses
    } else {
      throw new Error('Erreur lors du chargement des analyses')
    }
  } catch (err) {
    error.value = `Erreur: ${err.message}`
    console.error('Erreur chargement historique maillage interne:', err)
  } finally {
    loading.value = false
  }
}

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

const getScoreClass = (score) => {
  if (!score || score === 0) return 'score-poor'
  if (score >= 80) return 'score-excellent'
  if (score >= 60) return 'score-good'
  if (score >= 40) return 'score-average'
  return 'score-poor'
}

const truncateText = (text, maxLength) => {
  if (!text) return 'Aucun contenu'
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const selectAnalysis = (analysis) => {
  emit('select-analysis', analysis)
}

const goToNewAnalysis = () => {
  window.location.href = '/internal-link-analysis'
}

onMounted(() => {
  loadAnalyses()
})

defineExpose({
  refreshAnalyses: loadAnalyses
})
</script>

<style scoped>
.internal-link-history {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
  background: #f8f9fa;
}

.history-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.new-analysis-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  transition: transform 0.2s;
}

.new-analysis-btn:hover {
  transform: scale(1.1);
}

.history-content {
  padding: 20px;
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
  color: #2c3e50;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

.analyses-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.analysis-item {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.analysis-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.2);
  transform: translateY(-1px);
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.analysis-date {
  font-size: 0.8rem;
  color: #6c757d;
}

.analysis-score-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
}

.score-excellent {
  background: #28a745;
}

.score-good {
  background: #17a2b8;
}

.score-average {
  background: #ffc107;
  color: #212529;
}

.score-poor {
  background: #dc3545;
}

.analysis-text {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  color: #2c3e50;
  line-height: 1.4;
}

.analysis-type-badge {
  font-size: 1rem;
}

.analysis-stats {
  display: flex;
  gap: 15px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: #6c757d;
}

.stat-label {
  font-size: 0.9rem;
}

.stat-value {
  font-weight: 600;
  color: #2c3e50;
}
</style> 