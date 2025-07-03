<template>
  <div id="app">
    <!-- Test console.log -->
    <script>
      console.log('🧪 [TEST] App.vue template chargé')
    </script>
    
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'
import Navbar from './components/Navbar.vue'

const authStore = useAuthStore()

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
