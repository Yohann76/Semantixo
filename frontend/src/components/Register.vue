<template>
  <div class="register">
    <div class="container">
      <div class="register-card">
        <div class="register-header">
          <h1 class="register-title">Créer un compte</h1>
          <p class="register-subtitle">Rejoignez Semantixo pour analyser vos textes SEO</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="form-group">
            <label for="name" class="form-label">Nom complet *</label>
            <input 
              id="name"
              v-model="formData.name"
              type="text"
              class="form-input"
              :class="{ 'error': errors.name }"
              placeholder="Votre nom complet"
              required
            >
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>
          
          <div class="form-group">
            <label for="email" class="form-label">Email *</label>
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
            <label for="password" class="form-label">Mot de passe *</label>
            <input 
              id="password"
              v-model="formData.password"
              type="password"
              class="form-input"
              :class="{ 'error': errors.password }"
              placeholder="Minimum 6 caractères"
              required
            >
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirmer le mot de passe *</label>
            <input 
              id="confirmPassword"
              v-model="formData.confirmPassword"
              type="password"
              class="form-input"
              :class="{ 'error': errors.confirmPassword }"
              placeholder="Répétez votre mot de passe"
              required
            >
            <span v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</span>
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              :disabled="loading"
              class="register-btn"
            >
              {{ loading ? 'Création en cours...' : 'Créer mon compte' }}
            </button>
          </div>
        </form>
        
        <div class="register-footer">
          <p>Déjà un compte ? 
            <router-link to="/login" class="login-link">Se connecter</router-link>
          </p>
        </div>
        
        <div v-if="successMessage" class="success-message">
          <h3>✅ Inscription réussie !</h3>
          <p>{{ successMessage }}</p>
          <router-link to="/login" class="btn-secondary">Aller à la connexion</router-link>
        </div>
        
        <div v-if="errorMessage" class="error-alert">
          <h3>❌ Erreur</h3>
          <p>{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

const formData = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const validateForm = () => {
  errors.name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  
  // Validation du nom
  if (!formData.name.trim()) {
    errors.name = 'Le nom est requis'
  } else if (formData.name.length < 2) {
    errors.name = 'Le nom doit contenir au moins 2 caractères'
  }
  
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
  } else if (formData.password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
  }
  
  // Validation de la confirmation
  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Veuillez confirmer votre mot de passe'
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
  }
  
  return !errors.name && !errors.email && !errors.password && !errors.confirmPassword
}

const handleRegister = async () => {
  if (!validateForm()) {
    return
  }
  
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  
  try {
    const result = await authStore.register(
      formData.name.trim(),
      formData.email.toLowerCase().trim(),
      formData.password
    )
    
    if (result.success) {
      successMessage.value = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.'
      formData.name = ''
      formData.email = ''
      formData.password = ''
      formData.confirmPassword = ''
    } else {
      errorMessage.value = result.message
      if (result.errors) {
        // Afficher les erreurs de validation du serveur
        result.errors.forEach(error => {
          if (error.includes('email')) {
            errors.email = error
          } else if (error.includes('mot de passe')) {
            errors.password = error
          } else if (error.includes('nom')) {
            errors.name = error
          }
        })
      }
    }
  } catch (error) {
    console.error('Erreur inscription:', error)
    errorMessage.value = 'Erreur de connexion au serveur. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>

<script>
// Définir le nom du composant pour ESLint
export default {
  name: 'UserRegister'
}
</script>

<style scoped>
.register {
  padding-top: 90px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  width: 100%;
  max-width: 450px;
  padding: 20px;
}

.register-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  padding: 40px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-title {
  font-size: 2rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.register-subtitle {
  color: #666;
  font-size: 1rem;
}

.register-form {
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

.register-btn {
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

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.register-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.register-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  color: #666;
}

.login-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  margin-top: 20px;
  border: 1px solid #c3e6cb;
}

.success-message h3 {
  margin-bottom: 10px;
  color: #155724;
}

.btn-secondary {
  display: inline-block;
  background: #667eea;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
  margin-top: 15px;
  font-weight: 600;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background: #5a6fd8;
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
  .register-card {
    padding: 30px 20px;
  }
  
  .register-title {
    font-size: 1.8rem;
  }
  
  .form-input {
    padding: 10px 12px;
  }
  
  .register-btn {
    padding: 12px;
    font-size: 1rem;
  }
}
</style> 