<template>
  <ApplicationLayout ref="layoutRef">
    <template #default="{ selectedAnalysis }">
      <div class="text-analysis-page">
        <div class="container">
          <!-- Formulaire d'analyse (visible seulement si pas d'analyse sélectionnée) -->
          <div v-if="!selectedAnalysis && !isProcessing" class="analysis-form-section">
            <h1 class="page-title">Analyse SEO de Texte</h1>
            <p class="page-description">
              Analysez votre texte pour optimiser son référencement SEO avec notre système de barème avancé
            </p>
          
            <TextAnalysisForm 
              @analysis-complete="handleAnalysisComplete"
              @error="handleError"
            />
            
            <ErrorMessage 
              v-if="error" 
              :error="error" 
              title="Erreur d'analyse"
              show-retry
              @retry="clearError"
            />
          </div>

          <!-- Suivi en temps réel de l'analyse -->
          <div v-if="isProcessing" class="processing-container">
            <div class="processing-header">
              <h2>🚀 Analyse en cours...</h2>
              <p>Votre contenu est en cours d'analyse par nos algorithmes SEO avancés</p>
            </div>

            <div class="progress-section">
              <div class="progress-bar-container">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    :style="{ width: `${analysisProgress}%` }"
                  ></div>
                </div>
                <span class="progress-text">{{ analysisProgress }}%</span>
              </div>

              <div class="jobs-status">
                <div 
                  v-for="job in jobsStatus" 
                  :key="job.name"
                  class="job-item"
                  :class="getJobStatusClass(job.status)"
                >
                  <div class="job-icon">{{ getJobIcon(job.status) }}</div>
                  <div class="job-info">
                    <span class="job-name">{{ getJobDisplayName(job.name) }}</span>
                    <span class="job-status">{{ getJobStatusText(job.status) }}</span>
                  </div>
                  <div v-if="job.progress > 0" class="job-progress">{{ job.progress }}%</div>
                </div>
              </div>

              <div class="processing-time">
                <p>⏱️ Temps écoulé: {{ formatTime(processingTime) }}</p>
                <p v-if="estimatedTimeRemaining > 0">⏳ Temps estimé restant: {{ formatTime(estimatedTimeRemaining) }}</p>
              </div>
            </div>
          </div>



          <!-- Résultat de l'analyse (affiché directement sous le formulaire) -->
          <div v-if="currentAnalysis" class="analysis-result-section">
            <div class="result-separator">
              <h2 class="result-title">📊 Résultats de l'analyse</h2>
            </div>
            <TextAnalysisResult :analysis="currentAnalysis" />
          </div>





          <!-- Résultat d'une analyse sélectionnée depuis l'historique -->
          <div v-if="selectedAnalysis && !currentAnalysis" class="selected-analysis-section">
            <div class="back-button-container">
              <button @click="clearSelection" class="back-btn">
                ← Retour à l'analyse
              </button>
            </div>
            <TextAnalysisResult :analysis="selectedAnalysis" />
          </div>
        </div>
      </div>
    </template>
  </ApplicationLayout>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'
import ApplicationLayout from '../../common/ApplicationLayout.vue'
import TextAnalysisForm from './TextAnalysisForm.vue'
import TextAnalysisResult from './TextAnalysisResult.vue'
import ErrorMessage from '../../common/ErrorMessage.vue'
// import { useAuth } from '@/composables/useGlobalStores' // Non utilisé avec le nouveau service
import AnalysisTextSeoService from '../../../services/analysisTextSeo.js'

console.log('🔥 [PAGE] TextAnalysisPage loaded!')
console.log('🔥 [PAGE] TextAnalysisResult component:', TextAnalysisResult)

// État réactif
const error = ref(null)
const layoutRef = ref(null)
const selectedAnalysis = ref(null)
const currentAnalysis = ref(null) // Nouvelle analyse en cours

// État pour le suivi asynchrone
const isProcessing = ref(false)
const analysisProgress = ref(0)
const jobsStatus = ref([])
const processingTime = ref(0)
const estimatedTimeRemaining = ref(0)
const processingStartTime = ref(null)
const stopPolling = ref(null) // Fonction pour arrêter le polling
const currentAnalysisId = ref(null)

// Surveiller les changements de selectedAnalysis depuis le layout
watch(() => layoutRef.value?.selectedAnalysis?.value, (newAnalysis) => {
  selectedAnalysis.value = newAnalysis
  // Si on sélectionne une analyse depuis l'historique, on efface l'analyse courante
  if (newAnalysis) {
    currentAnalysis.value = null
  }
}, { immediate: true })

// Gérer la completion d'une analyse
const handleAnalysisComplete = (analysisResult) => {
  console.log('🔍 [DEBUG] handleAnalysisComplete called with:', analysisResult)
  console.log('🔍 [DEBUG] analysisResult.status:', analysisResult.status)
  
  if (analysisResult.status === 'processing') {
    // Démarrer le suivi asynchrone
    console.log('🔍 [DEBUG] Starting async tracking...')
    startAsyncTracking(analysisResult)
  } else {
    // Analyse terminée immédiatement
    console.log('🔍 [DEBUG] Analysis completed immediately, setting currentAnalysis')
    currentAnalysis.value = analysisResult
    error.value = null
    
    // Rafraîchir l'historique après une analyse réussie
    if (layoutRef.value) {
      layoutRef.value.refreshAnalyses()
    }
  }
}

// Démarrer le suivi d'une analyse asynchrone avec le nouveau service
const startAsyncTracking = async (analysisResult) => {
  isProcessing.value = true
  currentAnalysisId.value = analysisResult.id
  analysisProgress.value = analysisResult.progress || 0
  jobsStatus.value = analysisResult.jobsSummary || []
  processingStartTime.value = Date.now()
  processingTime.value = 0
  
  // Charger immédiatement les données en temps réel et les afficher
  await loadRealtimeData()
  
  // Démarrer le polling avec le nouveau service
  stopPolling.value = AnalysisTextSeoService.startProgressPolling(
    analysisResult.id,
    handlePollingUpdate,
    2000 // Toutes les 2 secondes
  )
  
  // Démarrer le timer
  const timer = setInterval(() => {
    processingTime.value = Math.floor((Date.now() - processingStartTime.value) / 1000)
  }, 1000)
  
  // Nettoyer le timer quand l'analyse est terminée
  watch(isProcessing, (processing) => {
    if (!processing) {
      clearInterval(timer)
    }
  })
}

// Gérer les mises à jour du polling
const handlePollingUpdate = async (overview) => {
  if (overview.error) {
    console.error('❌ [POLLING] Erreur:', overview.error)
    error.value = overview.error
    stopAsyncTracking()
    return
  }
  
  console.log('🔄 [POLLING] Mise à jour reçue:', overview)
  
  // Mettre à jour l'état
  analysisProgress.value = overview.progress || 0
  jobsStatus.value = overview.jobsSummary || []
  
  // Mettre à jour les données en temps réel pour montrer les résultats partiels
  await loadRealtimeData()
  
  if (overview.status === 'completed') {
    // Analyse terminée - récupérer les détails complets
    console.log('🔍 [DEBUG] Analysis completed via polling')
    stopAsyncTracking()
    loadCompleteAnalysis(overview.id)
    
    // Rafraîchir l'historique
    if (layoutRef.value) {
      layoutRef.value.refreshAnalyses()
    }
  } else if (overview.status === 'failed') {
    console.error('❌ [POLLING] Analyse échouée')
    error.value = 'L\'analyse a échoué'
    stopAsyncTracking()
  }
}

// Charger l'analyse complète une fois terminée
const loadCompleteAnalysis = async (analysisId) => {
  try {
    const completeData = await AnalysisTextSeoService.getAnalysisComplete(analysisId)
    console.log('🔍 [DEBUG] Complete analysis loaded:', completeData)
    currentAnalysis.value = completeData
  } catch (error) {
    console.error('❌ [PAGE] Erreur chargement analyse complète:', error)
    // Fallback vers l'overview si le complet échoue
    try {
      const overview = await AnalysisTextSeoService.getAnalysisOverview(analysisId)
      currentAnalysis.value = { analysis: overview, jobs: {} }
    } catch (fallbackError) {
      console.error('❌ [PAGE] Erreur fallback overview:', fallbackError)
      error.value = 'Impossible de charger les résultats'
    }
  }
}

// Charger les données en temps réel depuis la base de données
const loadRealtimeData = async () => {
  if (!currentAnalysisId.value) return
  
  try {
    console.log('🔄 [PAGE] Chargement des données en temps réel...')
    const completeData = await AnalysisTextSeoService.getAnalysisComplete(currentAnalysisId.value)
    
    if (completeData && completeData.jobs) {
      console.log('✅ [PAGE] Données en temps réel chargées:', completeData)
      currentAnalysis.value = completeData
    } else {
      console.log('⚠️ [PAGE] Pas de données complètes disponibles, création de données factices')
      currentAnalysis.value = createFallbackData()
    }
  } catch (error) {
    console.log('⚠️ [PAGE] Erreur chargement données temps réel, utilisation des données factices:', error.message)
    currentAnalysis.value = createFallbackData()
  }
}

// Créer des données factices pour l'affichage initial
const createFallbackData = () => {
  return {
    analysis: {
      id: currentAnalysisId.value,
      status: 'processing',
      progress: analysisProgress.value,
      createdAt: new Date().toISOString(),
      user_id: 'current',
      parameter: {
        text: 'Analyse en cours...',
        keywords: []
      }
    },
    jobs: {
      'keyword-analysis': {
        status: getJobStatus('keyword-analysis'),
        score: 0,
        details: 'Job en cours de traitement...'
      },
      'keyword-position': {
        status: getJobStatus('keyword-position'),
        score: 0,
        details: 'Job en cours de traitement...'
      },
      'content-length': {
        status: getJobStatus('content-length'),
        score: 0,
        details: 'Job en cours de traitement...'
      },
      'readability': {
        status: getJobStatus('readability'),
        score: 0,
        details: 'Job en cours de traitement...'
      },
      'uniqueness': {
        status: getJobStatus('uniqueness'),
        score: 0,
        details: 'Job en cours de traitement...'
      }
    }
  }
}

// Obtenir le statut d'un job depuis jobsStatus
const getJobStatus = (jobType) => {
  const job = jobsStatus.value.find(j => j.type === jobType)
  return job ? job.status : 'waiting'
}

// Arrêter le suivi asynchrone
const stopAsyncTracking = () => {
  isProcessing.value = false
  if (stopPolling.value) {
    stopPolling.value()
    stopPolling.value = null
  }
  currentAnalysisId.value = null
}

// Gérer les erreurs
const handleError = (errorMessage) => {
  error.value = errorMessage
}

// Effacer l'erreur
const clearError = () => {
  error.value = null
}

// Effacer la sélection pour revenir au formulaire
const clearSelection = () => {
  if (layoutRef.value) {
    layoutRef.value.selectedAnalysis = null
  }
  selectedAnalysis.value = null
  error.value = null
}



// Fonctions utilitaires pour l'affichage des jobs
const getJobDisplayName = (jobName) => {
  const names = {
    'keyword-analysis': 'Analyse des mots-clés',
    'keyword-position': 'Position des mots-clés',
    'content-length': 'Longueur du contenu',
    'readability': 'Lisibilité',
    'uniqueness': 'Originalité'
  }
  return names[jobName] || jobName
}

// Nettoyage au démontage du composant
onUnmounted(() => {
  console.log('🧹 [PAGE] Nettoyage du composant')
  stopAsyncTracking()
})

const getJobIcon = (status) => {
  const icons = {
    'waiting': '⏳',
    'active': '🔄',
    'completed': '✅',
    'failed': '❌'
  }
  return icons[status] || '⏳'
}

const getJobStatusClass = (status) => {
  return `job-${status}`
}

const getJobStatusText = (status) => {
  const texts = {
    'waiting': 'En attente',
    'active': 'En cours',
    'completed': 'Terminé',
    'failed': 'Échoué'
  }
  return texts[status] || status
}

const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`
  }
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}m ${remainingSeconds}s`
}


</script>

<style scoped>
.text-analysis-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  width: 90%;
  margin: 0 auto;
  padding: 30px 20px;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.page-description {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
}

.analysis-form-section {
  margin-bottom: 40px;
}

.analysis-result-section {
  margin-top: 40px;
}



.result-separator {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px 0;
  border-top: 2px solid #e9ecef;
  border-bottom: 2px solid #e9ecef;
}

.result-title {
  font-size: 1.8rem;
  color: #333;
  margin: 0;
  font-weight: bold;
}

.back-button-container {
  margin-bottom: 20px;
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.selected-analysis-section {
  padding: 20px 0;
}

/* Styles pour le suivi asynchrone */
.processing-container {
  background: white;
  border-radius: 15px;
  padding: 30px;
  margin: 30px auto;
  max-width: 800px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.1);
}

.processing-header {
  text-align: center;
  margin-bottom: 30px;
}

.processing-header h2 {
  color: #333;
  margin-bottom: 10px;
  font-size: 1.8rem;
}

.processing-header p {
  color: #666;
  font-size: 1.1rem;
}

.progress-section {
  margin-top: 25px;
}

.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background: #e9ecef;
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 6px;
  transition: width 0.3s ease;
}

.progress-text {
  font-weight: bold;
  color: #333;
  min-width: 50px;
  text-align: right;
}

.jobs-status {
  display: grid;
  gap: 12px;
  margin-bottom: 25px;
}

.job-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  border-radius: 8px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.job-item.job-waiting {
  border-color: #ffc107;
  background: #fff8e1;
}

.job-item.job-active {
  border-color: #17a2b8;
  background: #e1f5fe;
  animation: pulse 2s infinite;
}

.job-item.job-completed {
  border-color: #28a745;
  background: #e8f5e8;
}

.job-item.job-failed {
  border-color: #dc3545;
  background: #ffebee;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.job-icon {
  font-size: 1.2rem;
  margin-right: 12px;
  min-width: 24px;
  text-align: center;
}

.job-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.job-name {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.job-status {
  font-size: 0.85rem;
  color: #666;
}

.job-progress {
  font-weight: bold;
  color: #667eea;
  font-size: 0.9rem;
}

.processing-time {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.processing-time p {
  margin: 5px 0;
  color: #555;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 768px) {
  .processing-container {
    margin: 20px;
    padding: 20px;
  }
  
  .job-item {
    padding: 10px 12px;
  }
  
  .progress-bar-container {
    gap: 10px;
  }
}
</style> 