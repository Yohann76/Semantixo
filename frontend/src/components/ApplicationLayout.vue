<template>
  <div class="application-layout">
    <AppSidebar />
    <AnalysisHistory v-if="historyType" ref="historyRef" :type="historyType" @select-analysis="handleAnalysisSelect" />
    <div class="app-main-content" :class="{ 'with-history': historyType }">
      <slot :selected-analysis="selectedAnalysis" @clear-form="clearForm" />
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from './Sidebar.vue'
import AnalysisHistory from './AnalysisHistory.vue'

const historyRef = ref(null)
const selectedAnalysis = ref(null)
const route = useRoute()

// Déterminer le type d'analyse selon la route
const historyType = computed(() => {
  if (route.path.startsWith('/verify-page')) return 'page'
  if (route.path.startsWith('/app')) return null // Pas d'historique sur la page d'accueil
  return 'text'
})

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
  margin-left: 280px;
  padding-top: 80px;
  min-height: calc(100vh - 70px);
  margin-right: 20px;
  transition: margin-left 0.3s ease;
}

.app-main-content.with-history {
  margin-left: 530px;
}
</style> 