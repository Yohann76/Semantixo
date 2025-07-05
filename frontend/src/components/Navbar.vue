<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-text">Semantixo</span>
        </router-link>
      </div>
      
      <div class="navbar-menu">
        <router-link to="/" class="nav-link" active-class="active">
          Accueil
        </router-link>
        <router-link to="/verify-text" class="nav-link" active-class="active">
          Application
        </router-link>
        <router-link 
          v-if="isAuthenticated && currentUser?.role === 'admin'" 
          to="/admin" 
          class="nav-link" 
          active-class="active"
        >
          Administration
        </router-link>
      </div>
      
      <div class="navbar-auth">
        <template v-if="!isAuthenticated">
          <router-link to="/register" class="register-btn">
            S'inscrire
          </router-link>
          <router-link to="/login" class="login-btn">
            Connexion
          </router-link>
        </template>
        <template v-else>
          <div class="user-profile">
            <div class="user-avatar">
              {{ getUserInitial(currentUser?.email) }}
            </div>
            <div class="user-info">
              <span class="user-email">{{ currentUser?.email }}</span>
              <span class="user-name">{{ currentUser?.name }}</span>
            </div>
          </div>
          <button @click="handleLogout" class="logout-btn">
            Déconnexion
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

// Computed properties pour la réactivité
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)

const handleLogout = () => {
  console.log('🚪 [NAVBAR] Déconnexion demandée')
  authStore.logout()
  // Redirection après déconnexion
  window.location.href = '/'
}

const getUserInitial = (email) => {
  return email ? email.charAt(0).toUpperCase() : 'U'
}
</script>

<script>
// Définir le nom du composant pour ESLint
export default {
  name: 'MainNavbar'
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  height: 70px;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.navbar-brand {
  flex-shrink: 0;
}

.brand-link {
  text-decoration: none;
  color: white;
}

.brand-text {
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.navbar-menu {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 5px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: white;
  border-radius: 1px;
}

.navbar-auth {
  flex-shrink: 0;
  display: flex;
  gap: 10px;
  align-items: center;
}

.register-btn {
  background: transparent;
  color: white;
  border: 2px solid white;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.register-btn:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.login-btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.user-avatar {
  width: 35px;
  height: 35px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-email {
  font-size: 0.8rem;
  opacity: 0.9;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 0 15px;
  }
  
  .navbar-menu {
    gap: 15px;
  }
  
  .nav-link {
    font-size: 0.9rem;
    padding: 6px 12px;
  }
  
  .brand-text {
    font-size: 1.5rem;
  }
  
  .user-info {
    display: none;
  }
  
  .user-avatar {
    width: 30px;
    height: 30px;
    font-size: 0.8rem;
  }
}
</style> 