import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // État réactif
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)

  // Charger les données depuis localStorage
  const loadFromStorage = () => {
    console.log('🔄 [STORE] Chargement depuis localStorage...')
    try {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      
      console.log('📦 [STORE] Données localStorage:', {
        hasToken: !!storedToken,
        hasUser: !!storedUser,
        tokenLength: storedToken?.length,
        userData: storedUser ? JSON.parse(storedUser) : null
      })
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
        
        console.log('✅ [STORE] Authentification chargée:', {
          user: user.value?.name,
          email: user.value?.email,
          role: user.value?.role,
          tokenLength: token.value?.length,
          isAuthenticated: isAuthenticated.value
        })
        return true
      } else {
        console.log('ℹ️ [STORE] Aucune donnée d\'authentification trouvée')
        // S'assurer que l'état est propre
        token.value = null
        user.value = null
        isAuthenticated.value = false
      }
    } catch (error) {
      console.error('❌ [STORE] Erreur chargement:', error)
      clearAuth()
    }
    return false
  }

  // Sauvegarder dans localStorage
  const saveToStorage = () => {
    console.log('💾 [STORE] Sauvegarde dans localStorage...')
    if (token.value && user.value) {
      localStorage.setItem('token', token.value)
      localStorage.setItem('user', JSON.stringify(user.value))
      console.log('✅ [STORE] Données sauvegardées:', {
        user: user.value?.name,
        role: user.value?.role,
        tokenLength: token.value?.length
      })
    } else {
      console.log('⚠️ [STORE] Impossible de sauvegarder - données manquantes')
    }
  }

  // Nettoyer l'authentification
  const clearAuth = () => {
    console.log('🧹 [STORE] Nettoyage de l\'authentification...')
    token.value = null
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    console.log('✅ [STORE] Authentification nettoyée')
  }

  // Actions
  const login = async (email, password) => {
    console.log('🚀 [STORE] Tentative de connexion pour:', email)
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      console.log('📡 [STORE] Réponse API:', { status: response.status, success: data.success })

      if (response.ok && data.success) {
        console.log('✅ [STORE] Login API réussi, mise à jour du store...')
        
        // Mettre à jour l'état
        token.value = data.data.token
        user.value = data.data.user
        isAuthenticated.value = true
        
        console.log('📝 [STORE] État mis à jour:', { 
          user: user.value?.name, 
          email: user.value?.email,
          role: user.value?.role,
          isAuthenticated: isAuthenticated.value,
          tokenLength: token.value?.length 
        })
        
        // Sauvegarder
        saveToStorage()
        
        console.log('🎉 [STORE] Login terminé avec succès!')
        return { success: true, data: data.data }
      } else {
        console.log('❌ [STORE] Login API échoué:', data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('❌ [STORE] Erreur connexion:', error)
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
      console.error('❌ [STORE] Erreur inscription:', error)
      return { success: false, message: 'Erreur de connexion au serveur' }
    }
  }

  const logout = () => {
    clearAuth()
    console.log('✅ [STORE] Déconnexion réussie')
  }

  const getAuthHeaders = () => {
    console.log('🔑 [STORE] Génération headers avec token:', token.value ? 'Présent' : 'Absent')
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
      console.error('❌ [STORE] Erreur rafraîchissement:', error)
      logout()
    }
  }

  // Initialiser immédiatement
  console.log('🏁 [STORE] Initialisation du store...')
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