<template>
  <div class="internal-link-analysis">
    <!-- Affichage du formulaire d'analyse -->
    <div v-if="!selectedAnalysis" class="analysis-form-section">
      <div class="analysis-header">
        <h2 class="analysis-title">Analyse du maillage interne</h2>
        <p class="analysis-description">
          Analysez la structure de liens internes de votre site web pour optimiser la navigation et le SEO
        </p>
      </div>

      <div class="analysis-form">
        <div class="form-group">
          <label for="url" class="form-label">URL du site à analyser</label>
          <div class="input-group">
            <input
              id="url"
              v-model="url"
              type="url"
              class="form-input"
              placeholder="https://exemple.com"
              :disabled="loading"
              @keyup.enter="analyzeInternalLinks"
            />
            <button
              @click="analyzeInternalLinks"
              :disabled="loading || !url.trim()"
              class="analyze-btn"
            >
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>Analyser</span>
            </button>
          </div>
          <small class="form-help">
            Entrez l'URL de la page principale de votre site web
          </small>
        </div>
      </div>

      <div v-if="error" class="error-message">
        <div class="error-icon">⚠️</div>
        <div class="error-text">{{ error }}</div>
      </div>

      <div v-if="analysisResult" class="analysis-result">
        <AnalysisResultInternalLink :analysis="analysisResult" />
      </div>
    </div>

    <!-- Affichage du résultat d'une analyse sélectionnée -->
    <div v-else class="selected-analysis-section">
      <div class="back-button-container">
        <button @click="clearSelection" class="back-btn">
          ← Retour à l'analyse
        </button>
      </div>
      <AnalysisResultInternalLink :analysis="selectedAnalysis" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '../composables/useGlobalStores.js'
import AnalysisResultInternalLink from './AnalysisResultInternalLink.vue'

const { getAuthHeaders } = useAuth()

// eslint-disable-next-line no-undef
const props = defineProps({
  selectedAnalysis: {
    type: Object,
    default: null
  }
})

// eslint-disable-next-line no-undef
const emit = defineEmits(['clear-form'])

const url = ref('')
const loading = ref(false)
const error = ref('')
const analysisResult = ref(null)

const analyzeInternalLinks = async () => {
  if (!url.value.trim()) {
    error.value = 'Veuillez entrer une URL'
    return
  }

  loading.value = true
  error.value = ''
  analysisResult.value = null

  try {
    const headers = getAuthHeaders()
    const response = await fetch('http://localhost:3000/api/analysis-internal-link', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url.value.trim() })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erreur lors de l\'analyse')
    }

    analysisResult.value = data.data.analysis
    // Émettre l'événement pour nettoyer la sélection
    emit('clear-form')
  } catch (err) {
    error.value = err.message
    console.error('Erreur analyse maillage interne:', err)
  } finally {
    loading.value = false
  }
}

// Watcher pour détecter quand une analyse est sélectionnée
watch(() => props.selectedAnalysis, (newAnalysis) => {
  if (newAnalysis) {
    // Si l'analyse a déjà les détails complets, l'utiliser directement
    if (newAnalysis.metrics && newAnalysis.internalPages) {
      analysisResult.value = newAnalysis
      url.value = newAnalysis.url
    } else {
      // Sinon, charger les détails complets de l'analyse
      loadAnalysisDetails(newAnalysis.id)
    }
  } else {
    // Nettoyer le formulaire si aucune analyse n'est sélectionnée
    clearForm()
  }
}, { immediate: true })

const loadAnalysisDetails = async (analysisId) => {
  try {
    const headers = getAuthHeaders()
    const response = await fetch(`http://localhost:3000/api/analysis-internal-link/${analysisId}`, {
      method: 'GET',
      headers: headers
    })
    
    if (response.ok) {
      const data = await response.json()
      analysisResult.value = data.data.analysis
      url.value = data.data.analysis.url
    }
  } catch (error) {
    console.error('Erreur lors du chargement des détails:', error)
  }
}

// Fonction pour nettoyer le formulaire
const clearForm = () => {
  url.value = ''
  analysisResult.value = null
  error.value = ''
  loading.value = false
}

// Effacer la sélection pour revenir au formulaire
const clearSelection = () => {
  emit('clear-form')
  clearForm()
}

// Supprimé car non utilisé dans ce composant
</script>

<style scoped>
.internal-link-analysis {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.analysis-header {
  text-align: center;
  margin-bottom: 30px;
}

.analysis-title {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.analysis-description {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.analysis-form {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.input-group {
  display: flex;
  gap: 10px;
}

.form-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
}

.form-help {
  color: #6c757d;
  font-size: 0.9rem;
  margin-top: 5px;
}

.analyze-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.analyze-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.error-icon {
  font-size: 1.2rem;
}

.analysis-result {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.result-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.result-score {
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(255,255,255,0.2);
}

.score-excellent {
  background: rgba(40, 167, 69, 0.8) !important;
}

.score-good {
  background: rgba(23, 162, 184, 0.8) !important;
}

.score-average {
  background: rgba(255, 193, 7, 0.8) !important;
}

.score-poor {
  background: rgba(220, 53, 69, 0.8) !important;
}

.result-content {
  padding: 30px;
}

.metrics-section,
.pages-section,
.broken-links-section,
.recommendations-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.metric-card {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.metric-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.metric-info {
  flex: 1;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.metric-label {
  color: #6c757d;
  font-size: 0.9rem;
}

.pages-list,
.broken-links-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.page-item,
.broken-link-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.page-info,
.link-info {
  flex: 1;
}

.page-title,
.link-url {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

.page-url,
.link-anchor {
  color: #6c757d;
  font-size: 0.9rem;
}

.stat-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.error {
  background: #ffebee;
  color: #c62828;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  background: #fff3cd;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.recommendation-icon {
  font-size: 1.2rem;
  margin-top: 2px;
}

.recommendation-text {
  color: #856404;
  line-height: 1.5;
}

.back-button-container {
  margin-bottom: 20px;
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background: #5a6268;
}

.analysis-form-section,
.selected-analysis-section {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}
</style> 