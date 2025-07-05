import { useAuthStore } from '../stores/auth.js'
import { computed } from 'vue'

// Composable spécialisé pour l'authentification
export function useAuth() {
  const authStore = useAuthStore()
  
  console.log('🔧 [COMPOSABLE] useAuth appelé, état du store:', {
    user: authStore.user?.value,
    token: authStore.token?.value ? 'Présent' : 'Absent',
    isAuthenticated: authStore.isAuthenticated?.value
  })
  
  const user = computed(() => {
    const value = authStore.user?.value
    console.log('👤 [COMPOSABLE] user computed:', value)
    return value
  })
  
  const token = computed(() => {
    const value = authStore.token?.value
    console.log('🔑 [COMPOSABLE] token computed:', value ? 'Présent' : 'Absent')
    return value
  })
  
  const isAuthenticated = computed(() => {
    const value = authStore.isAuthenticated?.value
    console.log('✅ [COMPOSABLE] isAuthenticated computed:', value)
    return value
  })
  
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
    isAuthenticated: () => authStore.isAuthenticated?.value,
    getAuthHeaders: () => authStore.getAuthHeaders(),
    getCurrentUser: () => authStore.user?.value,
    getToken: () => authStore.token?.value,
    
    // Actions rapides
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register
  }
} 