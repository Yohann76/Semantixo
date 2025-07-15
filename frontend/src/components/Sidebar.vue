<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <h3 class="sidebar-title">Semantixo</h3>
      <p class="sidebar-subtitle">Analyse SEO</p>
    </div>
    
    <nav class="sidebar-nav">
      <div class="nav-section">
        <h4 class="nav-section-title">Analyse de Contenu</h4>
        <router-link to="/verify-text" class="nav-item" active-class="active">
          <i class="nav-icon">📝</i>
          <span>Analyse de texte SEO</span>
        </router-link>
        <router-link to="/verify-page" class="nav-item" active-class="active">
          <i class="nav-icon">🔍</i>
          <span>Analyse page SEO</span>
        </router-link>
        <router-link to="/internal-link-analysis" class="nav-item" active-class="active">
          <i class="nav-icon">🔗</i>
          <span>Analyse du maillage interne</span>
        </router-link>
        <router-link to="/domain-analysis" class="nav-item" active-class="active">
          <i class="nav-icon">🌐</i>
          <span>Analyse du nom de domaine</span>
        </router-link>
      </div>
      
      <div class="nav-section">
        <h4 class="nav-section-title">Support</h4>
        <router-link to="/help" class="nav-item" active-class="active">
          <i class="nav-icon">❓</i>
          <span>Aide</span>
        </router-link>
        <router-link to="/contact" class="nav-item" active-class="active">
          <i class="nav-icon">📧</i>
          <span>Contact</span>
        </router-link>
      </div>

      <div v-if="isAuthenticated && currentUser?.role === 'admin'" class="nav-section">
        <h4 class="nav-section-title">Administration</h4>
        <router-link to="/admin" class="nav-item" active-class="active">
          <i class="nav-icon">⚙️</i>
          <span>Test API</span>
        </router-link>
      </div>


    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

// Computed properties pour la réactivité
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)
</script>

<script>
export default {
  name: 'AppSidebar'
}
</script>

<style scoped>
.sidebar {
  width: 280px;
  height: calc(100vh - 70px);
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  position: fixed;
  left: 0;
  top: 70px;
  z-index: 998;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  overflow-y: auto;
}

.sidebar-header {
  padding: 30px 20px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  text-align: center;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: #ecf0f1;
}

.sidebar-subtitle {
  font-size: 0.9rem;
  color: #bdc3c7;
  margin: 0;
  opacity: 0.8;
}

.sidebar-nav {
  padding: 20px 0;
}

.nav-section {
  margin-bottom: 30px;
}

.nav-section-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: #95a5a6;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 0 15px 20px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 400;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
  color: white;
  border-left-color: rgba(255,255,255,0.3);
}

.nav-item.active {
  background: rgba(255,255,255,0.05);
  color: white;
  border-left-color: white;
  font-weight: 700;
}

.nav-icon {
  margin-right: 12px;
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

.nav-item span {
  flex: 1;
}

/* Scrollbar personnalisée */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.3);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255,255,255,0.5);
}
</style> 