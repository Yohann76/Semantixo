import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  // État réactif
  const user = ref(null)
  const token = ref(null)
  const isAuthenticated = ref(false)

  // Initialiser depuis le localStorage
  const initializeAuth = () => {
    console.log('🔄 [STORE] Initialisation du store...')
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    console.log('🔄 [STORE] Données localStorage:', { storedToken: !!storedToken, storedUser: !!storedUser })
    
    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true
        console.log('✅ [STORE] Auth initialisé avec succès:', { 
          user: user.value, 
          isAuthenticated: isAuthenticated.value,
          tokenLength: token.value?.length 
        })
      } catch (error) {
        console.error('❌ [STORE] Erreur parsing user:', error)
        logout()
      }
    } else {
      console.log('ℹ️ [STORE] Aucune donnée d\'auth trouvée dans localStorage')
    }
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
      console.log('📡 [STORE] Réponse API:', { status: response.status, data })

      if (response.ok) {
        console.log('✅ [STORE] Login API réussi, mise à jour du store...')
        
        // Mettre à jour l'état de manière synchrone
        token.value = data.data.token
        user.value = data.data.user
        isAuthenticated.value = true
        
        console.log('📝 [STORE] État mis à jour:', { 
          user: user.value, 
          isAuthenticated: isAuthenticated.value,
          tokenLength: token.value?.length 
        })
        
        // Sauvegarder dans localStorage
        localStorage.setItem('token', token.value)
        localStorage.setItem('user', JSON.stringify(user.value))
        
        console.log('💾 [STORE] Données sauvegardées dans localStorage')
        console.log('🎉 [STORE] Login terminé avec succès!')
        
        return { success: true, data: data.data }
      } else {
        console.log('❌ [STORE] Login API échoué:', data.message)
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('💥 [STORE] Erreur connexion:', error)
      return { success: false, message: 'Erreur de connexion au serveur' }
    }
  }

  const register = async (name, email, password) => {
    console.log('🚀 [STORE] Tentative d\'inscription pour:', email)
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()
      console.log('📡 [STORE] Réponse inscription:', { status: response.status, data })

      if (response.ok) {
        console.log('✅ [STORE] Inscription réussie')
        return { success: true, message: data.message }
      } else {
        console.log('❌ [STORE] Inscription échouée:', data.message)
        return { success: false, message: data.message, errors: data.errors }
      }
    } catch (error) {
      console.error('💥 [STORE] Erreur inscription:', error)
      return { success: false, message: 'Erreur de connexion au serveur' }
    }
  }

  const logout = () => {
    console.log('🚪 [STORE] Déconnexion en cours...')
    token.value = null
    user.value = null
    isAuthenticated.value = false
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    console.log('✅ [STORE] Déconnexion terminée, état:', { 
      user: user.value, 
      isAuthenticated: isAuthenticated.value 
    })
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
        localStorage.setItem('user', JSON.stringify(user.value))
      } else {
        logout()
      }
    } catch (error) {
      console.error('Erreur rafraîchissement utilisateur:', error)
      logout()
    }
  }

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
    initializeAuth
  }
}) 