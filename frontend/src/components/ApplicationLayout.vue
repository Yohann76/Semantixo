<template>
  <div class="application-layout">
    <AppSidebar />
    <AnalysisHistory ref="historyRef" @select-analysis="handleAnalysisSelect" />
    <div class="app-main-content">
      <slot :selected-analysis="selectedAnalysis" @clear-form="clearForm" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
import AppSidebar from './Sidebar.vue'
import AnalysisHistory from './AnalysisHistory.vue'

const historyRef = ref(null)
const selectedAnalysis = ref(null)

// Gérer la sélection d'une analyse
const handleAnalysisSelect = (analysis) => {
  selectedAnalysis.value = analysis
  console.log('📊 [LAYOUT] Analyse sélectionnée:', analysis)
}

// Méthode pour nettoyer le formulaire
const clearForm = () => {
  selectedAnalysis.value = null
  console.log('📊 [LAYOUT] Formulaire nettoyé')
}

// Exposer la référence à AnalysisHistory
defineExpose({
  refreshAnalyses: () => {
    if (historyRef.value) {
      historyRef.value.refreshAnalyses()
    }
  },
  selectedAnalysis: selectedAnalysis
})
</script>

<style scoped>
.application-layout {
  display: flex;
  min-height: 100vh;
}

.app-main-content {
  flex: 1;
  margin-left: 530px;
  padding-top: 80px;
  min-height: calc(100vh - 70px);
  margin-right: 20px;
}
</style> 