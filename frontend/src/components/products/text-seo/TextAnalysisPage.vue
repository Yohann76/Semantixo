<template>
  <ApplicationLayout ref="layoutRef">
    <template #default="{ selectedAnalysis }">
      <div class="text-analysis-page">
        <div class="container">
          <!-- Affichage du formulaire d'analyse -->
          <div v-if="!selectedAnalysis" class="analysis-form-section">
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

          <!-- Affichage du résultat d'une analyse sélectionnée -->
          <div v-else class="selected-analysis-section">
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
import { ref, watch } from 'vue'
import ApplicationLayout from '../../common/ApplicationLayout.vue'
import TextAnalysisForm from './TextAnalysisForm.vue'
import TextAnalysisResult from './TextAnalysisResult.vue'
import ErrorMessage from '../../common/ErrorMessage.vue'

// État réactif
const error = ref(null)
const layoutRef = ref(null)
const selectedAnalysis = ref(null)

// Surveiller les changements de selectedAnalysis depuis le layout
watch(() => layoutRef.value?.selectedAnalysis?.value, (newAnalysis) => {
  selectedAnalysis.value = newAnalysis
}, { immediate: true })

// Gérer la completion d'une analyse
const handleAnalysisComplete = (analysisResult) => {
  selectedAnalysis.value = analysisResult
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
  error.value = null
}
</script>

<style scoped>
.text-analysis-page {
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