<template>
  <ApplicationLayout ref="layoutRef">
    <template #default>
      <div class="app-dashboard">
        <div class="container">
          <div class="welcome-section">
            <h1 class="welcome-title">Bonjour {{ userGreeting }} !</h1>
            <p class="welcome-subtitle">Que voulez-vous faire aujourd'hui ?</p>
          </div>
          
          <div class="analysis-grid">
            <router-link to="/verify-text" class="analysis-card">
              <div class="card-icon">📝</div>
              <h3 class="card-title">Analyse de texte SEO</h3>
              <p class="card-description">
                Analysez votre contenu textuel pour optimiser son référencement
              </p>
            </router-link>
            
            <router-link to="/verify-page" class="analysis-card">
              <div class="card-icon">🔍</div>
              <h3 class="card-title">Analyse de page SEO</h3>
              <p class="card-description">
                Analysez une page web complète pour optimiser son SEO
              </p>
            </router-link>
            
            <router-link to="/verify-internal-link" class="analysis-card">
              <div class="card-icon">🔗</div>
              <h3 class="card-title">Analyse du maillage interne</h3>
              <p class="card-description">
                Optimisez la structure de liens internes de votre site
              </p>
            </router-link>
            
            <router-link to="/verify-domains" class="analysis-card">
              <div class="card-icon">🌐</div>
              <h3 class="card-title">Analyse de nom de domaine</h3>
              <p class="card-description">
                Évaluez la qualité SEO de vos noms de domaine
              </p>
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </ApplicationLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '../composables/useGlobalStores.js'
import ApplicationLayout from './ApplicationLayout.vue'

const { user } = useAuth()

const userGreeting = computed(() => {
  if (user.value?.name) {
    return user.value.name
  }
  if (user.value?.email) {
    return user.value.email.split('@')[0]
  }
  return 'utilisateur'
})
</script>

<style scoped>
.app-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.welcome-section {
  text-align: center;
  margin-bottom: 50px;
}

.welcome-title {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.welcome-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 0;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.analysis-card {
  background: white;
  border-radius: 15px;
  padding: 30px;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.analysis-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  border-color: #667eea;
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.card-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
}

.card-description {
  font-size: 1rem;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .analysis-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .welcome-title {
    font-size: 2rem;
  }
  
  .welcome-subtitle {
    font-size: 1.1rem;
  }
}
</style> 