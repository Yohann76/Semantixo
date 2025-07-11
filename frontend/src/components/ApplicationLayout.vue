<template>
  <div class="application-layout">
    <AppSidebar />
    <div class="app-main-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './Sidebar.vue'
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
}
</style> 