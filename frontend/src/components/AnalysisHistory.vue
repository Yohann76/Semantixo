<template>
  <div class="analysis-history">
    <div class="history-header">
      <h3 class="history-title">
        {{ historyTitle }}
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
      
      <div v-else-if="filteredAnalyses.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <h4>Aucune analyse</h4>
        <p>Commencez par analyser {{ 
          type === 'page' ? 'une page SEO' : 
          type === 'internal-link' ? 'le maillage interne d\'un site' : 
          'un texte SEO' 
        }} !</p>
      </div>
      
      <div v-else class="analyses-list">
        <div 
          v-for="analysis in filteredAnalyses" 
          :key="analysis.id" 
          class="analysis-item"
          @click="selectAnalysis(analysis)"
        >
          <div class="analysis-header">
            <div class="analysis-date">
              {{ formatShortDate(analysis.createdAt) }}
            </div>
            <div class="analysis-score-badge" :class="getScoreClass(getAnalysisScore(analysis))">
              {{ getAnalysisScore(analysis) || '0' }}
            </div>
          </div>
          <div class="analysis-text">
            <div class="analysis-type-badge" :class="analysis.type">
              {{ 
                analysis.type === 'page' ? '🌐' : 
                analysis.type === 'internal-link' ? '🔗' : 
                '📝' 
              }}
            </div>
            {{ truncateText(analysis.displayText || 'Aucun contenu', 35) }}
          </div>
          <div class="analysis-stats">
            <div v-if="analysis.type === 'internal-link'" class="stat">
              <span class="stat-label">🔗</span>
              <span class="stat-value">{{ analysis.metrics?.totalInternalLinks || analysis.totalInternalLinks || 0 }}</span>
            </div>
            <div v-if="analysis.type === 'internal-link'" class="stat">
              <span class="stat-label">❌</span>
              <span class="stat-value">{{ analysis.metrics?.brokenLinks || analysis.brokenLinks || 0 }}</span>
            </div>
            <div v-if="analysis.type === 'internal-link'" class="stat">
              <span class="stat-label">📄</span>
              <span class="stat-value">{{ analysis.metrics?.uniqueInternalPages || analysis.uniqueInternalPages || 0 }}</span>
            </div>
            <div v-if="analysis.type !== 'internal-link'" class="stat">
              <span class="stat-label">📝</span>
              <span class="stat-value">{{ analysis.wordCount }}</span>
            </div>
            <div v-if="analysis.type !== 'internal-link'" class="stat">
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
import { ref, onMounted, defineExpose, defineEmits, computed } from 'vue'
import { useAuth } from '../composables/useGlobalStores.js'

// eslint-disable-next-line no-undef
const props = defineProps({
  type: {
    type: String,
    default: 'text',
    validator: function(value) {
      return ['text', 'page', 'internal-link'].includes(value)
    }
  }
})

const { isAuthenticated, getAuthHeaders } = useAuth()

const analyses = ref([])
const loading = ref(true)
const error = ref(null)

const emit = defineEmits(['select-analysis'])

// Filtrer selon le type demandé
const filteredAnalyses = computed(() => {
  return analyses.value.filter(a => a.type === props.type)
})

const historyTitle = computed(() => {
  if (props.type === 'page') return 'Analyses récentes de page SEO'
  if (props.type === 'internal-link') return 'Analyses récentes de maillage interne'
  return 'Analyses récentes de texte SEO'
})

// Charger l'historique des analyses (tous types)
const loadAnalyses = async () => {
  if (!isAuthenticated.value) {
    loading.value = false
    return
  }
  try {
    const headers = getAuthHeaders()
    // Charger les analyses de texte
    const textResponse = await fetch('http://localhost:3000/api/analysis-text-seo', {
      method: 'GET',
      headers: headers
    })
    // Charger les analyses de page
    const pageResponse = await fetch('http://localhost:3000/api/analysis-page-seo', {
      method: 'GET',
      headers: headers
    })
    // Charger les analyses de maillage interne
    const internalLinkResponse = await fetch('http://localhost:3000/api/analysis-internal-link', {
      method: 'GET',
      headers: headers
    })
    let allAnalyses = []
    if (textResponse.ok) {
      const textData = await textResponse.json()
      const textAnalyses = textData.data.analyses.map(analysis => ({
        ...analysis,
        type: 'text',
        displayText: analysis.text
      }))
      allAnalyses = allAnalyses.concat(textAnalyses)
    }
    if (pageResponse.ok) {
      const pageData = await pageResponse.json()
      const pageAnalyses = pageData.data.analyses.map(analysis => ({
        ...analysis,
        type: 'page',
        displayText: analysis.url
      }))
      allAnalyses = allAnalyses.concat(pageAnalyses)
    }
    if (internalLinkResponse.ok) {
      const internalLinkData = await internalLinkResponse.json()
      const internalLinkAnalyses = internalLinkData.data.analyses.map(analysis => ({
        ...analysis,
        type: 'internal-link',
        displayText: analysis.url
      }))
      allAnalyses = allAnalyses.concat(internalLinkAnalyses)
    }
    // Trier par date de création (plus récent en premier)
    allAnalyses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    analyses.value = allAnalyses
  } catch (err) {
    error.value = `Erreur: ${err.message}`
    console.error('Erreur chargement historique:', err)
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
const getAnalysisScore = (analysis) => {
  if (analysis.type === 'internal-link') {
    return analysis.internalLinkScore
  }
  return analysis.seoScore
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
  // Rediriger vers la bonne page selon le type
  if (props.type === 'page') {
    window.location.href = '/verify-page'
  } else if (props.type === 'internal-link') {
    window.location.href = '/internal-link-analysis'
  } else {
    window.location.href = '/verify-text'
  }
}
onMounted(() => {
  loadAnalyses()
})
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-title {
  font-size: 1rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

.new-analysis-btn {
  background-color: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  font-size: 1.2rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.2);
}

.new-analysis-btn:hover {
  background-color: #5a67d8;
}

.new-analysis-btn .btn-icon {
  font-size: 1.2rem;
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.analysis-type-badge {
  font-size: 0.8rem;
  padding: 2px 4px;
  border-radius: 3px;
  min-width: 16px;
  text-align: center;
}

.analysis-type-badge.text {
  background: #e3f2fd;
  color: #1976d2;
}

.analysis-type-badge.page {
  background: #f3e5f5;
  color: #7b1fa2;
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