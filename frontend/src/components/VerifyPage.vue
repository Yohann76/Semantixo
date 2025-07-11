<template>
  <ApplicationLayout ref="layoutRef">
    <template #default="{ selectedAnalysis }">
      <div class="verify-page">
        <div class="container">
          <!-- Affichage du formulaire d'analyse -->
          <div v-if="!selectedAnalysis" class="analysis-form-section">
            <h1 class="page-title">Analyse SEO de Page</h1>
            <p class="page-description">
              Analysez une page web pour optimiser son référencement SEO
            </p>
          
            <div class="analysis-form">
              <div class="form-group">
                <label for="url-input" class="form-label">URL de la page à analyser :</label>
                <input 
                  id="url-input"
                  v-model="urlToAnalyze"
                  type="url"
                  class="url-input"
                  placeholder="https://example.com ou example.com"
                />
                <small class="form-help">
                  Entrez l'URL complète de la page que vous souhaitez analyser
                </small>
              </div>
              
              <div class="form-actions">
                <button 
                  @click="analyzePage" 
                  :disabled="!urlToAnalyze.trim() || loading"
                  class="analyze-btn"
                >
                  {{ loading ? 'Analyse en cours...' : 'Analyser la page' }}
                </button>
              </div>
            </div>
            
            <div v-if="analysisResult" class="analysis-result">
              <AnalysisResult :analysis="analysisResult" />
            </div>
            
            <div v-if="error" class="error-message">
              <h3>Erreur :</h3>
              <p>{{ error }}</p>
            </div>
          </div>

          <!-- Affichage du résultat d'une analyse sélectionnée -->
          <div v-else class="selected-analysis-section">
            <div class="back-button-container">
              <button @click="clearSelection" class="back-btn">
                ← Retour à l'analyse
              </button>
            </div>
            <AnalysisResult :analysis="selectedAnalysis" />
          </div>
        </div>
      </div>
    </template>
  </ApplicationLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuth } from '../composables/useGlobalStores.js'
import ApplicationLayout from './ApplicationLayout.vue'
import AnalysisResult from './AnalysisResult.vue'

// État réactif
const urlToAnalyze = ref('')
const analysisResult = ref(null)
const error = ref(null)
const loading = ref(false)
const layoutRef = ref(null)
const selectedAnalysis = ref(null)

// Utilisation du composable d'authentification
const { isAuthenticated, getAuthHeaders } = useAuth()

// Fonction pour nettoyer le formulaire
const clearForm = () => {
  urlToAnalyze.value = ''
  analysisResult.value = null
  error.value = null
  loading.value = false
  console.log('🧹 [VERIFY PAGE] Formulaire nettoyé')
}

// Surveiller les changements de selectedAnalysis depuis le layout
watch(() => layoutRef.value?.selectedAnalysis?.value, (newAnalysis) => {
  selectedAnalysis.value = newAnalysis
  
  // Si aucune analyse n'est sélectionnée, nettoyer le formulaire
  if (!newAnalysis) {
    clearForm()
  }
}, { immediate: true })

// Surveiller aussi les changements de selectedAnalysis dans le template
watch(selectedAnalysis, (newAnalysis) => {
  if (!newAnalysis) {
    clearForm()
  }
})

// Méthode d'analyse
const analyzePage = async () => {
  if (!urlToAnalyze.value.trim()) {
    error.value = 'Veuillez entrer une URL à analyser'
    return
  }
  
  loading.value = true
  error.value = null
  analysisResult.value = null
  
  try {
    if (!isAuthenticated.value) {
      error.value = 'Vous devez être connecté pour analyser une page'
      return
    }

    const headers = getAuthHeaders()
    
    const response = await fetch('http://localhost:3000/api/analysis-page-seo', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        url: urlToAnalyze.value
      })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      analysisResult.value = data.data.analysis
      // Rafraîchir l'historique après une analyse réussie
      if (layoutRef.value) {
        layoutRef.value.refreshAnalyses()
      }
    } else {
      error.value = data.message || 'Erreur lors de l\'analyse'
    }
  } catch (err) {
    error.value = `Erreur lors de l'analyse: ${err.message}`
    console.error('Erreur analyse page:', err)
  } finally {
    loading.value = false
  }
}

// Effacer la sélection pour revenir au formulaire
const clearSelection = () => {
  if (layoutRef.value) {
    layoutRef.value.selectedAnalysis = null
  }
  // Nettoyer complètement le formulaire
  clearForm()
}
</script>

<style scoped>
.verify-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 800px;
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

.analysis-form {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.url-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.url-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-help {
  display: block;
  margin-top: 5px;
  color: #6c757d;
  font-size: 0.9rem;
}

.form-actions {
  text-align: center;
}

.analyze-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.analyze-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.analysis-result {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.analysis-result h3 {
  color: #28a745;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.analysis-result pre {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.9rem;
  border: 1px solid #e9ecef;
  line-height: 1.5;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #dc3545;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.error-message h3 {
  color: #721c24;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.error-message p {
  margin: 0;
  font-size: 1rem;
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

.analysis-form-section {
  padding: 20px 0;
}
</style> 