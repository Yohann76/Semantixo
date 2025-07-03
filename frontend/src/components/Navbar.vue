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
      </div>
      
      <div class="navbar-auth">
        <script>
          console.log('🎨 [NAVBAR] Rendu template, état:', {
            isAuthenticated: authStore.isAuthenticated,
            user: authStore.user
          })
        </script>
        
        <template v-if="!authStore.isAuthenticated">
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
              {{ getUserInitial(authStore.user?.email) }}
            </div>
            <div class="user-info">
              <span class="user-email">{{ authStore.user?.email }}</span>
              <span class="user-name">{{ authStore.user?.name }}</span>
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
import { useAuthStore } from '../stores/auth.js'
import { watch, onMounted } from 'vue'

const authStore = useAuthStore()

// Debug: surveiller les changements d'état
watch(() => authStore.isAuthenticated, (newVal, oldVal) => {
  console.log('👁️ [NAVBAR] État d\'authentification changé:', { old: oldVal, new: newVal })
}, { immediate: true })

watch(() => authStore.user, (newVal, oldVal) => {
  console.log('👁️ [NAVBAR] Utilisateur changé:', { old: oldVal, new: newVal })
}, { immediate: true })

onMounted(() => {
  console.log('🎯 [NAVBAR] Composant monté, état actuel:', {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user
  })
})

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
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  background: #f8f9fa;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-right: 15px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.user-email {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
}

.user-name {
  color: white;
  font-size: 0.8rem;
  font-weight: 400;
  opacity: 0.7;
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
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

/* Responsive design */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 15px;
  }
  
  .brand-text {
    font-size: 1.5rem;
  }
  
  .navbar-menu {
    gap: 15px;
  }
  
  .nav-link {
    font-size: 0.9rem;
    padding: 6px 12px;
  }
  
  .register-btn,
  .login-btn,
  .logout-btn {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
  
  .user-profile {
    gap: 8px;
    margin-right: 10px;
  }
  
  .user-avatar {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .user-email {
    font-size: 0.8rem;
  }
  
  .user-name {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .navbar-menu {
    gap: 10px;
  }
  
  .nav-link {
    font-size: 0.8rem;
    padding: 5px 8px;
  }
  
  .brand-text {
    font-size: 1.3rem;
  }
}
</style> 