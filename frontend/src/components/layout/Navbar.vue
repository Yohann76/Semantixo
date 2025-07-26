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
        <router-link 
          v-if="isAuthenticated" 
          to="/app" 
          class="nav-link" 
          :class="{ 'active': isAppRoute }"
        >
          Application
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
          <div class="user-dropdown" @click="toggleDropdown" ref="dropdownRef">
            <div class="user-profile">
              <div class="user-avatar">
                {{ getUserInitial(currentUser?.email) }}
              </div>
              <div class="user-info">
                <span class="user-email">{{ currentUser?.email }}</span>
                <span class="user-name">{{ currentUser?.name }}</span>
              </div>
              <div class="dropdown-arrow" :class="{ 'rotated': isDropdownOpen }">
                ▼
              </div>
            </div>
            
            <div class="dropdown-menu" v-if="isDropdownOpen">
              <div class="dropdown-header">
                <span class="dropdown-title">Mon Compte</span>
              </div>
              <div class="dropdown-item" @click="goToProfile">
                <i class="dropdown-icon">👤</i>
                Gérer mon compte
              </div>
              <div class="dropdown-item" @click="goToPayment">
                <i class="dropdown-icon">💳</i>
                Paiement
              </div>
              <div class="dropdown-item" @click="goToPaymentHistory">
                <i class="dropdown-icon">📊</i>
                Historique des paiements
              </div>
              <div class="dropdown-divider"></div>
              <div class="dropdown-item logout-item" @click="handleLogout">
                <i class="dropdown-icon">🚪</i>
                Se déconnecter
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'

const authStore = useAuthStore()
const route = useRoute()

// Computed properties pour la réactivité
const isAuthenticated = computed(() => authStore.isAuthenticated)
const currentUser = computed(() => authStore.user)

// Détecter si nous sommes sur une route d'application
const isAppRoute = computed(() => {
  return route.path.startsWith('/app') || 
         route.path.startsWith('/verify-text') || 
         route.path.startsWith('/verify-page') ||
         route.path.startsWith('/verify-internal-link') ||
         route.path.startsWith('/verify-domains')
})

// Dropdown state
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

// Fermer le dropdown quand on clique à l'extérieur
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleLogout = () => {
  console.log('🚪 [NAVBAR] Déconnexion demandée')
  closeDropdown()
  authStore.logout()
  // Redirection après déconnexion
  window.location.href = '/'
}

const goToProfile = () => {
  closeDropdown()
  // TODO: Implémenter la route vers le profil
  console.log('👤 Navigation vers le profil')
}

const goToPayment = () => {
  closeDropdown()
  // TODO: Implémenter la route vers les paiements
  console.log('💳 Navigation vers les paiements')
}

const goToPaymentHistory = () => {
  closeDropdown()
  // TODO: Implémenter la route vers l'historique des paiements
  console.log('📊 Navigation vers l\'historique des paiements')
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

/* Dropdown styles */
.user-dropdown {
  position: relative;
  cursor: pointer;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  padding: 8px 12px;
  border-radius: 25px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
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

.dropdown-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
  margin-left: 5px;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  overflow: hidden;
  z-index: 1001;
  animation: dropdownSlide 0.2s ease-out;
}

@keyframes dropdownSlide {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-header {
  padding: 15px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.dropdown-title {
  font-size: 0.9rem;
  font-weight: 600;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f8f9fa;
  color: #667eea;
}

.dropdown-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.dropdown-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 5px 0;
}

.logout-item {
  color: #dc3545;
}

.logout-item:hover {
  background: #fff5f5;
  color: #dc3545;
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
  
  .dropdown-menu {
    min-width: 180px;
    right: -10px;
  }
}
</style> 