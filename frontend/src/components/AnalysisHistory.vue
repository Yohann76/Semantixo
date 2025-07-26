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
          type === 'domain' ? 'un nom de domaine' :
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
              {{ formatShortDate(analysis.createdAt || analysis.timestamp) }}
            </div>
            <div class="analysis-score-section">
              <div class="analysis-score-badge" :class="getScoreClass(getAnalysisScore(analysis))">
                {{ getAnalysisScore(analysis) || '0' }}
              </div>
              <div v-if="analysis.notation" class="analysis-notation-badge" :class="getNotationClass(analysis.notation)">
                {{ analysis.notation }}
              </div>
            </div>
          </div>
          <div class="analysis-text">
            <div class="analysis-type-badge" :class="analysis.type">
              {{ 
                analysis.type === 'page' ? '🌐' : 
                analysis.type === 'internal-link' ? '🔗' : 
                analysis.type === 'domain' ? '🌐' :
                '📝' 
              }}
            </div>
            {{ truncateText(analysis.displayText || 'Aucun contenu', 35) }}
          </div>
          
          <!-- Informations supplémentaires pour les analyses de texte -->
          <div v-if="analysis.type === 'text' && analysis.keywords && analysis.keywords.length > 0" class="analysis-keywords">
            <span class="keywords-label">Mots-clés :</span>
            <span class="keywords-value">{{ analysis.keywords.join(', ') }}</span>
          </div>
          
          <div class="analysis-stats">
            <div v-if="analysis.type === 'internal-link'" class="stat">
              <span class="stat-label">🔗</span>
              <span class="stat-value">{{ analysis.metrics?.totalInternalLinks || analysis.totalInternalLinks || 0 }}</span>
            </div>
            <div v-if="analysis.type === 'internal-link'" class="stat">
              <span class="stat-label">❌</span>
              <span class="stat-value">{{ (analysis.brokenLinks || []).length }}</span>
            </div>
            <div v-if="analysis.type === 'internal-link'" class="stat">
              <span class="stat-label">📄</span>
              <span class="stat-value">{{ analysis.metrics?.uniqueInternalPages || analysis.uniqueInternalPages || 0 }}</span>
            </div>
            <div v-if="analysis.type === 'domain'" class="stat">
              <span class="stat-label">📏</span>
              <span class="stat-value">{{ analysis.metrics?.domainLength || 0 }}</span>
            </div>
            <div v-if="analysis.type === 'domain'" class="stat">
              <span class="stat-label">⭐</span>
              <span class="stat-value">{{ analysis.metrics?.domainAuthority || 0 }}</span>
            </div>
            <div v-if="analysis.type === 'domain'" class="stat">
              <span class="stat-label">📖</span>
              <span class="stat-value">{{ analysis.metrics?.domainReadability || 0 }}%</span>
            </div>
            <div v-if="analysis.type === 'text'" class="stat">
              <span class="stat-label">📝</span>
              <span class="stat-value">{{ analysis.metrics?.wordCount || analysis.wordCount || 0 }}</span>
            </div>
            <div v-if="analysis.type === 'text'" class="stat">
              <span class="stat-label">🔤</span>
              <span class="stat-value">{{ analysis.metrics?.characterCount || analysis.characterCount || 0 }}</span>
            </div>
            <div v-if="analysis.type === 'text'" class="stat">
              <span class="stat-label">📄</span>
              <span class="stat-value">{{ analysis.metrics?.paragraphCount || 0 }}</span>
            </div>
            <div v-if="analysis.type === 'page'" class="stat">
              <span class="stat-label">📝</span>
              <span class="stat-value">{{ analysis.wordCount || 0 }}</span>
            </div>
            <div v-if="analysis.type === 'page'" class="stat">
              <span class="stat-label">🔤</span>
              <span class="stat-value">{{ analysis.characterCount || 0 }}</span>
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
      return ['text', 'page', 'internal-link', 'domain'].includes(value)
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
  if (props.type === 'domain') return 'Analyses récentes de noms de domaine'
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
    let allAnalyses = []
    
    // Charger les analyses de texte
    try {
      const textResponse = await fetch('http://localhost:3000/api/analysis-text-seo', {
        method: 'GET',
        headers: headers
      })
      
      if (textResponse.ok) {
        const textData = await textResponse.json()
        console.log('📊 [HISTORY] Text data received:', textData)
        
        // Vérification robuste de la structure
        if (textData && typeof textData === 'object') {
          let textArray = []
          
          // Cas 1: textData.data est un tableau
          if (textData.data && Array.isArray(textData.data)) {
            textArray = textData.data
          }
          // Cas 2: textData est directement un tableau
          else if (Array.isArray(textData)) {
            textArray = textData
          }
          // Cas 3: textData.data existe mais n'est pas un tableau
          else if (textData.data && typeof textData.data === 'object') {
            textArray = [textData.data]
          }
          
          if (textArray.length > 0) {
            const textAnalyses = textArray.map(analysis => ({
              ...analysis,
              type: 'text',
              displayText: analysis.text || '',
              notation: analysis.notation || 'Non évalué'
            }))
            allAnalyses = allAnalyses.concat(textAnalyses)
          } else {
            console.warn('⚠️ [HISTORY] No text analyses found in response:', textData)
          }
        } else {
          console.warn('⚠️ [HISTORY] Text data structure unexpected:', textData)
        }
      } else {
        console.warn('⚠️ [HISTORY] Text response not ok:', textResponse.status, textResponse.statusText)
      }
    } catch (err) {
      console.error('❌ [HISTORY] Erreur chargement analyses texte:', err)
    }
    
    // Charger les analyses de page
    try {
      const pageResponse = await fetch('http://localhost:3000/api/analysis-page-seo', {
        method: 'GET',
        headers: headers
      })
      
      if (pageResponse.ok) {
        const pageData = await pageResponse.json()
        console.log('📊 [HISTORY] Page data received:', pageData)
        
        // Vérification robuste de la structure
        if (pageData && typeof pageData === 'object') {
          let pageArray = []
          
          // Cas 1: pageData.data est un tableau
          if (pageData.data && Array.isArray(pageData.data)) {
            pageArray = pageData.data
          }
          // Cas 2: pageData est directement un tableau
          else if (Array.isArray(pageData)) {
            pageArray = pageData
          }
          // Cas 3: pageData.data existe mais n'est pas un tableau
          else if (pageData.data && typeof pageData.data === 'object') {
            pageArray = [pageData.data]
          }
          
          if (pageArray.length > 0) {
            const pageAnalyses = pageArray.map(analysis => ({
              ...analysis,
              type: 'page',
              displayText: analysis.url || analysis.pageTitle || ''
            }))
            allAnalyses = allAnalyses.concat(pageAnalyses)
          } else {
            console.warn('⚠️ [HISTORY] No page analyses found in response:', pageData)
          }
        } else {
          console.warn('⚠️ [HISTORY] Page data structure unexpected:', pageData)
        }
      } else {
        console.warn('⚠️ [HISTORY] Page response not ok:', pageResponse.status, pageResponse.statusText)
      }
    } catch (err) {
      console.error('❌ [HISTORY] Erreur chargement analyses page:', err)
    }
    
    // Charger les analyses de maillage interne
    try {
      const internalLinkResponse = await fetch('http://localhost:3000/api/analysis-internal-link', {
        method: 'GET',
        headers: headers
      })
      
      if (internalLinkResponse.ok) {
        const internalLinkData = await internalLinkResponse.json()
        console.log('📊 [HISTORY] Internal link data received:', internalLinkData)
        
        // Vérification robuste de la structure
        if (internalLinkData && typeof internalLinkData === 'object') {
          let internalLinkArray = []
          
          // Cas 1: internalLinkData.data est un tableau
          if (internalLinkData.data && Array.isArray(internalLinkData.data)) {
            internalLinkArray = internalLinkData.data
          }
          // Cas 2: internalLinkData est directement un tableau
          else if (Array.isArray(internalLinkData)) {
            internalLinkArray = internalLinkData
          }
          // Cas 3: internalLinkData.data existe mais n'est pas un tableau
          else if (internalLinkData.data && typeof internalLinkData.data === 'object') {
            internalLinkArray = [internalLinkData.data]
          }
          
          if (internalLinkArray.length > 0) {
            const internalLinkAnalyses = internalLinkArray.map(analysis => ({
              ...analysis,
              type: 'internal-link',
              displayText: analysis.url || analysis.domain || ''
            }))
            allAnalyses = allAnalyses.concat(internalLinkAnalyses)
          } else {
            console.warn('⚠️ [HISTORY] No internal link analyses found in response:', internalLinkData)
          }
        } else {
          console.warn('⚠️ [HISTORY] Internal link data structure unexpected:', internalLinkData)
        }
      } else {
        console.warn('⚠️ [HISTORY] Internal link response not ok:', internalLinkResponse.status, internalLinkResponse.statusText)
      }
    } catch (err) {
      console.error('❌ [HISTORY] Erreur chargement analyses maillage interne:', err)
    }
    
    // Charger les analyses de domaine
    try {
      const domainResponse = await fetch('http://localhost:3000/api/analysis-domain', {
        method: 'GET',
        headers: headers
      })
      
      if (domainResponse.ok) {
        const domainData = await domainResponse.json()
        console.log('📊 [HISTORY] Domain data received:', domainData)
        
        // Vérification robuste de la structure
        if (domainData && typeof domainData === 'object') {
          let domainArray = []
          
          // Cas 1: domainData.data est un tableau
          if (domainData.data && Array.isArray(domainData.data)) {
            domainArray = domainData.data
          }
          // Cas 2: domainData est directement un tableau
          else if (Array.isArray(domainData)) {
            domainArray = domainData
          }
          // Cas 3: domainData.data existe mais n'est pas un tableau
          else if (domainData.data && typeof domainData.data === 'object') {
            domainArray = [domainData.data]
          }
          
          if (domainArray.length > 0) {
            const domainAnalyses = domainArray.map(analysis => ({
              ...analysis,
              type: 'domain',
              displayText: analysis.domain || analysis.url || ''
            }))
            allAnalyses = allAnalyses.concat(domainAnalyses)
          } else {
            console.warn('⚠️ [HISTORY] No domain analyses found in response:', domainData)
          }
        } else {
          console.warn('⚠️ [HISTORY] Domain data structure unexpected:', domainData)
        }
      } else {
        console.warn('⚠️ [HISTORY] Domain response not ok:', domainResponse.status, domainResponse.statusText)
      }
    } catch (err) {
      console.error('❌ [HISTORY] Erreur chargement analyses domaine:', err)
    }
    
    // Trier par date de création (plus récent en premier)
    allAnalyses.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.timestamp || 0)
      const dateB = new Date(b.createdAt || b.timestamp || 0)
      return dateB.getTime() - dateA.getTime()
    })
    
    analyses.value = allAnalyses
    console.log('📊 [HISTORY] Analyses chargées:', allAnalyses.length)
  } catch (err) {
    error.value = `Erreur: ${err.message}`
    console.error('❌ [HISTORY] Erreur chargement historique:', err)
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
  if (analysis.type === 'domain') {
    return analysis.domainScore
  }
  return analysis.seoScore
}

const getScoreClass = (score) => {
  if (!score || score === 0) return 'score-poor'
  if (score >= 85) return 'score-excellent'
  if (score >= 70) return 'score-good'
  if (score >= 55) return 'score-average'
  return 'score-poor'
}

const getNotationClass = (notation) => {
  switch (notation) {
    case 'Excellent': return 'notation-excellent'
    case 'Très bon': return 'notation-good'
    case 'Bon': return 'notation-average'
    case 'Moyen': return 'notation-poor'
    case 'Insuffisant': return 'notation-poor'
    default: return 'notation-unknown'
  }
}

const truncateText = (text, maxLength) => {
  if (!text || typeof text !== 'string') return 'Aucun contenu'
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
  } else if (props.type === 'domain') {
    window.location.href = '/domain-analysis'
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
  align-items: flex-start;
  margin-bottom: 6px;
}

.analysis-date {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 500;
}

.analysis-score-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.analysis-score-badge {
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  min-width: 20px;
  text-align: center;
}

.analysis-notation-badge {
  font-size: 0.6rem;
  font-weight: bold;
  padding: 1px 4px;
  border-radius: 3px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.score-excellent, .notation-excellent {
  background: #d4edda;
  color: #155724;
}

.score-good, .notation-good {
  background: #d1ecf1;
  color: #0c5460;
}

.score-average, .notation-average {
  background: #fff3cd;
  color: #856404;
}

.score-poor, .notation-poor {
  background: #f8d7da;
  color: #721c24;
}

.notation-unknown {
  background: #e2e3e5;
  color: #383d41;
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

.analysis-type-badge.internal-link {
  background: #e8f5e8;
  color: #2e7d32;
}

.analysis-type-badge.domain {
  background: #fff3e0;
  color: #f57c00;
}

.analysis-keywords {
  font-size: 0.7rem;
  color: #6c757d;
  margin-bottom: 6px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.keywords-label {
  font-weight: 500;
  color: #495057;
}

.keywords-value {
  font-style: italic;
  color: #6c757d;
  word-break: break-word;
}

.analysis-stats {
  display: flex;
  gap: 8px;
  margin-top: 6px;
  flex-wrap: wrap;
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