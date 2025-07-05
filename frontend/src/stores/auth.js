import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // État réactif
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)

  // Charger les données depuis localStorage
  const loadFromStorage = () => {
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
        return true
      } else {
        // S'assurer que l'état est propre
        token.value = null
        user.value = null
        isAuthenticated.value = false
      }
    } catch (error) {
      console.error('Erreur chargement auth:', error)
      clearAuth()
    }
    return false
  }

  // Sauvegarder dans localStorage
  const saveToStorage = () => {
    if (token.value && user.value) {
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
    }
  }

  // Nettoyer l'authentification
  const clearAuth = () => {
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  // Actions
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Mettre à jour l'état
        token.value = data.data.token
        user.value = data.data.user
        isAuthenticated.value = true
        
        // Sauvegarder
        saveToStorage()
        
        return { success: true, data: data.data }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Erreur connexion:', error)
      return { success: false, message: 'Erreur de connexion au serveur' }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message, errors: data.errors }
      }
    } catch (error) {
      console.error('Erreur inscription:', error)
      return { success: false, message: 'Erreur de connexion au serveur' }
    }
  }

  const logout = () => {
    clearAuth()
  }

  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token.value}`,
      'Content-Type': 'application/json'
    }
  }

  const refreshUser = async () => {
    if (!token.value) return

    try {
      const response = await fetch('http://localhost:3000/api/auth/me', {
        headers: getAuthHeaders()
      })

      if (response.ok) {
        const data = await response.json()
        user.value = data.data.user
        saveToStorage()
      } else {
        logout()
      }
    } catch (error) {
      console.error('Erreur rafraîchissement:', error)
      logout()
    }
  }

  // Initialiser immédiatement
  loadFromStorage()

  return {
    // État
    user,
    token,
    isAuthenticated,
    
    // Actions
    login,
    register,
    logout,
    getAuthHeaders,
    refreshUser,
    loadFromStorage,
    saveToStorage,
    clearAuth
  }
}) 