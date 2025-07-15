<template>
  <div class="domain-analysis">
    <!-- Affichage du formulaire d'analyse -->
    <div v-if="!props.selectedAnalysis" class="analysis-form-section">
      <div class="analysis-header">
        <h2 class="analysis-title">Analyse du nom de domaine</h2>
        <p class="analysis-description">
          Analysez la qualité et l'efficacité de votre nom de domaine pour optimiser votre présence en ligne
        </p>
      </div>

      <div class="analysis-form">
        <div class="form-group">
          <label for="domain" class="form-label">Nom de domaine à analyser</label>
          <div class="input-group">
            <input
              id="domain"
              v-model="domain"
              type="text"
              class="form-input"
              placeholder="exemple.com"
              :disabled="loading"
              @keyup.enter="analyzeDomain"
            />
            <button
              @click="analyzeDomain"
              :disabled="loading || !domain.trim()"
              class="analyze-btn"
            >
              <span v-if="loading" class="loading-spinner"></span>
              <span v-else>Analyser</span>
            </button>
          </div>
          <small class="form-help">
            Entrez le nom de domaine sans http:// ou www
          </small>
        </div>
      </div>

      <div v-if="error" class="error-message">
        <div class="error-icon">⚠️</div>
        <div class="error-text">{{ error }}</div>
      </div>

      <div v-if="analysisResult" class="analysis-result">
        <AnalysisResultDomain :analysis="analysisResult" />
      </div>
    </div>

    <!-- Affichage du résultat d'une analyse sélectionnée -->
    <div v-else class="selected-analysis-section">
      <div class="back-button-container">
        <button @click="clearSelection" class="back-btn">
          ← Retour à l'analyse
        </button>
      </div>
      <AnalysisResultDomain :analysis="props.selectedAnalysis" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '../composables/useGlobalStores.js'
import AnalysisResultDomain from './AnalysisResultDomain.vue'

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

const domain = ref('')
const loading = ref(false)
const error = ref('')
const analysisResult = ref(null)

const analyzeDomain = async () => {
  if (!domain.value.trim()) {
    error.value = 'Veuillez entrer un nom de domaine'
    return
  }

  loading.value = true
  error.value = ''
  analysisResult.value = null

  try {
    const headers = getAuthHeaders()
    const response = await fetch('http://localhost:3000/api/analysis-domain', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ domain: domain.value.trim() })
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
    console.error('Erreur analyse domaine:', err)
  } finally {
    loading.value = false
  }
}

// Watcher pour détecter quand une analyse est sélectionnée
watch(() => props.selectedAnalysis, (newAnalysis) => {
  if (newAnalysis) {
    // Utiliser directement les données complètes de l'historique
    analysisResult.value = newAnalysis
    domain.value = newAnalysis.domain
  } else {
    // Nettoyer le formulaire si aucune analyse n'est sélectionnée
    clearForm()
  }
}, { immediate: true })

// Fonction pour nettoyer le formulaire
const clearForm = () => {
  domain.value = ''
  analysisResult.value = null
  error.value = ''
  loading.value = false
}

// Effacer la sélection pour revenir au formulaire
const clearSelection = () => {
  emit('clear-form')
  clearForm()
}
</script>

<style scoped>
.domain-analysis {
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