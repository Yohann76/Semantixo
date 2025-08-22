<template>
  <div id="app">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
    <MainFooter v-if="!isApplicationPage" />
  </div>
</template>

<script setup>
import { watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth.js'
import Navbar from './components/layout/Navbar.vue'
import MainFooter from './components/layout/Footer.vue'

const authStore = useAuthStore()
const route = useRoute()

// Déterminer si nous sommes sur la page Application
const isApplicationPage = computed(() => {
  return route.path === '/verify-text' || 
         route.path === '/verify-page' || 
         route.path === '/internal-link-analysis' ||
         route.path === '/domain-analysis'
})

onMounted(() => {
  console.log('🎯 [APP] Application montée')
})

// Watcher global pour forcer la réactivité de l'application
watch(() => authStore.isAuthenticated, (newVal, oldVal) => {
  console.log('🔄 [APP] État d\'authentification changé:', { old: oldVal, new: newVal })
}, { immediate: true })

watch(() => authStore.user, (newVal, oldVal) => {
  console.log('🔄 [APP] Utilisateur changé:', { old: oldVal, new: newVal })
}, { immediate: true })
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>
