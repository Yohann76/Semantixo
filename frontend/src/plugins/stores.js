import { useAuthStore } from '../stores/auth.js'

// Plugin pour rendre les stores disponibles globalement
export default {
  install(app) {
    // Rendre les stores disponibles globalement
    app.config.globalProperties.$stores = {
      auth: useAuthStore()
    }

    // Méthodes utilitaires globales
    app.config.globalProperties.$isAuthenticated = () => {
      return useAuthStore().isAuthenticated
    }

    app.config.globalProperties.$getAuthHeaders = () => {
      return useAuthStore().getAuthHeaders()
    }

    app.config.globalProperties.$getCurrentUser = () => {
      return useAuthStore().user
    }

    app.config.globalProperties.$getToken = () => {
      return useAuthStore().token
    }

    // Injection pour Composition API
    app.provide('stores', {
      auth: useAuthStore()
    })

    app.provide('isAuthenticated', () => useAuthStore().isAuthenticated)
    app.provide('getAuthHeaders', () => useAuthStore().getAuthHeaders())
    app.provide('getCurrentUser', () => useAuthStore().user)
    app.provide('getToken', () => useAuthStore().token)
  }
} 