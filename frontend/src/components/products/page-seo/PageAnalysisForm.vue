<template>
  <div class="page-analysis-form">
    <div class="analysis-form">
      <!-- URL à analyser -->
      <div class="form-group">
        <label for="url-input" class="form-label">URL de la page à analyser :</label>
        <input 
          id="url-input"
          v-model="urlToAnalyze"
          type="url"
          class="url-input"
          placeholder="https://example.com ou example.com"
        />
        <small class="form-help">
          Entrez l'URL complète de la page que vous souhaitez analyser
        </small>
      </div>
      
      <div class="form-actions">
        <button 
          @click="analyzePage" 
          :disabled="!urlToAnalyze.trim() || loading"
          class="analyze-btn"
        >
          <span v-if="loading" class="loading-spinner">⏳</span>
          {{ loading ? 'Analyse en cours...' : 'Analyser la page' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../../../composables/useGlobalStores.js'

// État réactif
const urlToAnalyze = ref('')
const loading = ref(false)

// Utilisation du composable d'authentification
const { isAuthenticated, getAuthHeaders } = useAuth()

// Émettre les événements
const emit = defineEmits(['analysis-complete', 'error'])

// Méthode d'analyse
const analyzePage = async () => {
  if (!urlToAnalyze.value.trim()) {
    emit('error', 'Veuillez entrer une URL à analyser')
    return
  }
  
  loading.value = true
  
  try {
    if (!isAuthenticated.value) {
      emit('error', 'Vous devez être connecté pour analyser une page')
      return
    }

    const headers = getAuthHeaders()
    
    console.log('📊 [PAGE FORM] Envoi analyse:', {
      url: urlToAnalyze.value
    })
    
    const response = await fetch('http://localhost:3000/api/analysis-page-seo', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: urlToAnalyze.value })
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ [PAGE FORM] Analyse réussie:', {
        seoScore: data.data.seoScore,
        pageTitle: data.data.pageTitle
      })
      
      emit('analysis-complete', data.data)
    } else {
      // Gestion des erreurs spécifiques
      let errorMessage = 'Erreur lors de l\'analyse'
      
      if (response.status === 400) {
        errorMessage = data.message || 'URL invalide'
      } else if (response.status === 401) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.'
      } else if (response.status === 500) {
        errorMessage = data.message || 'Erreur serveur lors de l\'analyse'
      } else {
        errorMessage = data.message || `Erreur ${response.status}: ${response.statusText}`
      }
      
      emit('error', errorMessage)
      console.error('❌ [PAGE FORM] Erreur analyse:', data)
    }
  } catch (err) {
    const errorMessage = `Erreur de connexion: ${err.message}`
    emit('error', errorMessage)
    console.error('❌ [PAGE FORM] Erreur réseau:', err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.page-analysis-form {
  margin-bottom: 30px;
}

.analysis-form {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.form-help {
  display: block;
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 4px;
  font-style: italic;
}

.url-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.url-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-actions {
  text-align: center;
  margin-top: 30px;
}

.analyze-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-width: 200px;
  margin: 0 auto;
}

.analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.analyze-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> 