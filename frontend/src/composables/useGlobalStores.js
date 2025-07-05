import { useAuthStore } from '../stores/auth.js'
import { computed } from 'vue'

// Composable spécialisé pour l'authentification
export function useAuth() {
  const authStore = useAuthStore()
  
  const user = computed(() => authStore.user)
  const token = computed(() => authStore.token)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  
  return {
    // État réactif avec computed
    user,
    token,
    isAuthenticated,
    
    // Actions
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register,
    getAuthHeaders: authStore.getAuthHeaders,
    refreshUser: authStore.refreshUser
  }
}

// Composable pour utiliser les stores globaux
export function useGlobalStores() {
  const authStore = useAuthStore()
  
  return {
    // Stores
    auth: authStore,
    
    // Méthodes utilitaires
    isAuthenticated: () => authStore.isAuthenticated,
    getAuthHeaders: () => authStore.getAuthHeaders(),
    getCurrentUser: () => authStore.user,
    getToken: () => authStore.token,
    
    // Actions rapides
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register
  }
} 