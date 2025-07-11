<template>
  <div class="application-layout">
    <AppSidebar />
    <AnalysisHistory ref="historyRef" />
    <div class="app-main-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue'
import AppSidebar from './Sidebar.vue'
import AnalysisHistory from './AnalysisHistory.vue'

const historyRef = ref(null)

// Exposer la référence à AnalysisHistory
defineExpose({
  refreshAnalyses: () => {
    if (historyRef.value) {
      historyRef.value.refreshAnalyses()
    }
  }
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