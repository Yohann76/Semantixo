<template>
  <div class="login">
    <div class="container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">Connexion</h1>
          <p class="login-subtitle">Connectez-vous à votre compte Semantixo</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              id="email"
              v-model="formData.email"
              type="email"
              class="form-input"
              :class="{ 'error': errors.email }"
              placeholder="votre@email.com"
              required
            >
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <input 
              id="password"
              v-model="formData.password"
              type="password"
              class="form-input"
              :class="{ 'error': errors.password }"
              placeholder="Votre mot de passe"
              required
            >
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              :disabled="loading"
              class="login-btn"
            >
              {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
            </button>
          </div>
        </form>
        
        <div class="login-footer">
          <p>Pas encore de compte ? 
            <router-link to="/register" class="register-link">S'inscrire</router-link>
          </p>
        </div>
        
        <div v-if="errorMessage" class="error-alert">
          <h3>❌ Erreur de connexion</h3>
          <p>{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const router = useRouter()
const authStore = useAuthStore()

const formData = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})
const loading = ref(false)
const errorMessage = ref('')

const validateForm = () => {
  errors.email = ''
  errors.password = ''
  
  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    errors.email = 'L\'email est requis'
  } else if (!emailRegex.test(formData.email)) {
    errors.email = 'Veuillez entrer un email valide'
  }
  
  // Validation du mot de passe
  if (!formData.password) {
    errors.password = 'Le mot de passe est requis'
  }
  
  return !errors.email && !errors.password
}

const handleLogin = async () => {
  console.log('🚀 [LOGIN] Début de la connexion...')
  if (!validateForm()) {
    console.log('❌ [LOGIN] Validation échouée')
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  
  try {
    console.log('📡 [LOGIN] Appel du store login...')
    const result = await authStore.login(
      formData.email.toLowerCase().trim(),
      formData.password
    )
    
    console.log('📡 [LOGIN] Résultat du login:', result)
    
    if (result.success) {
      console.log('✅ [LOGIN] Connexion réussie, attente nextTick...')
      await nextTick()
      console.log('✅ [LOGIN] nextTick terminé, redirection...')
      router.push('/')
      console.log('✅ [LOGIN] Redirection effectuée')
    } else {
      console.log('❌ [LOGIN] Connexion échouée:', result.message)
      errorMessage.value = result.message
    }
  } catch (error) {
    console.error('💥 [LOGIN] Erreur connexion:', error)
    errorMessage.value = 'Erreur de connexion au serveur. Veuillez réessayer.'
  } finally {
    loading.value = false
    console.log('🏁 [LOGIN] Processus de connexion terminé')
  }
}
</script>

<script>
// Définir le nom du composant pour ESLint
export default {
  name: 'LoginForm'
}
</script>

<style scoped>
.login {
  padding-top: 90px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.login-subtitle {
  color: #666;
  font-size: 1rem;
}

.login-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

.error-message {
  color: #dc3545;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}

.form-actions {
  margin-top: 30px;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.login-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  color: #666;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.register-link:hover {
  text-decoration: underline;
}

.error-alert {
  background: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin-top: 20px;
  border: 1px solid #f5c6cb;
}

.error-alert h3 {
  margin-bottom: 10px;
  color: #721c24;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }
  
  .login-title {
    font-size: 1.8rem;
  }
  
  .form-input {
    padding: 10px 12px;
  }
  
  .login-btn {
    padding: 12px;
    font-size: 1rem;
  }
}
</style> 