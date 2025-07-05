// Export centralisé de tous les stores
export { useAuthStore } from './auth.js'

// Fonction utilitaire pour accéder aux stores depuis n'importe où
export const getStores = () => {
  return {
    auth: useAuthStore()
  }
}

// Fonction pour vérifier l'authentification rapidement
export const isAuthenticated = () => {
  const authStore = useAuthStore()
  return authStore.isAuthenticated
}

// Fonction pour obtenir les headers d'authentification
export const getAuthHeaders = () => {
  const authStore = useAuthStore()
  return authStore.getAuthHeaders()
}

// Fonction pour obtenir l'utilisateur connecté
export const getCurrentUser = () => {
  const authStore = useAuthStore()
  return authStore.user
}

// Fonction pour obtenir le token
export const getToken = () => {
  const authStore = useAuthStore()
  return authStore.token
} 