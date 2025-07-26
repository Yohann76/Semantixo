<template>
  <ApplicationLayout ref="layoutRef">
    <template #default="{ selectedAnalysis }">
      <div class="domain-analysis-page">
        <div class="container">
          <!-- Formulaire d'analyse (toujours visible) -->
          <div class="analysis-form-section">
            <h1 class="page-title">Analyse du Nom de Domaine</h1>
            <p class="page-description">
              Analysez l'autorité et la réputation d'un nom de domaine pour optimiser votre stratégie SEO
            </p>
          
            <DomainAnalysisForm 
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

          <!-- Résultat de l'analyse (affiché directement sous le formulaire) -->
          <div v-if="currentAnalysis" class="analysis-result-section">
            <div class="result-separator">
              <h2 class="result-title">📊 Résultats de l'analyse</h2>
            </div>
            <DomainAnalysisResult :analysis="currentAnalysis" />
          </div>

          <!-- Résultat d'une analyse sélectionnée depuis l'historique -->
          <div v-if="selectedAnalysis && !currentAnalysis" class="selected-analysis-section">
            <div class="back-button-container">
              <button @click="clearSelection" class="back-btn">
                ← Retour à l'analyse
              </button>
            </div>
            <DomainAnalysisResult :analysis="selectedAnalysis" />
          </div>
        </div>
      </div>
    </template>
  </ApplicationLayout>
</template>

<script setup>
import { ref, watch } from 'vue'
import ApplicationLayout from '../../common/ApplicationLayout.vue'
import DomainAnalysisForm from './DomainAnalysisForm.vue'
import DomainAnalysisResult from './DomainAnalysisResult.vue'
import ErrorMessage from '../../common/ErrorMessage.vue'

// État réactif
const error = ref(null)
const layoutRef = ref(null)
const selectedAnalysis = ref(null)
const currentAnalysis = ref(null) // Nouvelle analyse en cours

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
  currentAnalysis.value = analysisResult // Afficher directement sous le formulaire
  error.value = null
  
  // Rafraîchir l'historique après une analyse réussie
  if (layoutRef.value) {
    layoutRef.value.refreshAnalyses()
  }
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
</script>

<style scoped>
.domain-analysis-page {
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
</style> 