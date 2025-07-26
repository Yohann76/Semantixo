<template>
  <ApplicationLayout ref="layoutRef">
    <template #default="{ selectedAnalysis }">
      <div class="verify-text">
        <div class="container">
          <!-- Affichage du formulaire d'analyse -->
          <div v-if="!selectedAnalysis" class="analysis-form-section">
            <h1 class="page-title">Analyse SEO de Texte</h1>
            <p class="page-description">
              Analysez votre texte pour optimiser son référencement SEO avec notre système de barème avancé
            </p>
          
            <div class="analysis-form">
              <!-- Mots-clés -->
              <div class="form-group">
                <label for="keywords-input" class="form-label">
                  Mots-clés ciblés (optionnel) :
                </label>
                <input 
                  id="keywords-input"
                  v-model="keywordsInput"
                  class="keywords-input"
                  placeholder="Entrez vos mots-clés séparés par des virgules..."
                  type="text"
                />
                <small class="form-help">
                  Exemple : SEO, référencement, optimisation
                </small>
              </div>

              <!-- Intention de recherche -->
              <div class="form-group">
                <label for="search-intent" class="form-label">
                  Intention de recherche :
                </label>
                <select 
                  id="search-intent"
                  v-model="searchIntent"
                  class="search-intent-select"
                >
                  <option value="informationnelle">Informationnelle</option>
                  <option value="transactionnelle">Transactionnelle</option>
                  <option value="navigationnelle">Navigationnelle</option>
                </select>
                <small class="form-help">
                  Définissez l'intention principale de votre contenu
                </small>
              </div>

              <!-- Texte à analyser -->
              <div class="form-group">
                <label for="text-input" class="form-label">Texte à analyser :</label>
                <textarea 
                  id="text-input"
                  v-model="textToAnalyze"
                  class="text-input"
                  placeholder="Collez votre texte ici pour l'analyse SEO..."
                  rows="8"
                ></textarea>
                <small class="form-help">
                  Minimum recommandé : 600 mots pour un contenu optimal
                </small>
              </div>
              
              <div class="form-actions">
                <button 
                  @click="analyzeText" 
                  :disabled="!textToAnalyze.trim() || loading"
                  class="analyze-btn"
                >
                  <span v-if="loading" class="loading-spinner">⏳</span>
                  {{ loading ? 'Analyse en cours...' : 'Analyser le texte' }}
                </button>
              </div>
            </div>
            
            <div v-if="analysisResult" class="analysis-result">
              <AnalysisResult :analysis="analysisResult" />
            </div>
            
            <div v-if="error" class="error-message">
              <h3>Erreur :</h3>
              <p>{{ error }}</p>
            </div>
          </div>

          <!-- Affichage du résultat d'une analyse sélectionnée -->
          <div v-else class="selected-analysis-section">
            <div class="back-button-container">
              <button @click="clearSelection" class="back-btn">
                ← Retour à l'analyse
              </button>
            </div>
            <AnalysisResult :analysis="selectedAnalysis" />
          </div>
        </div>
      </div>
    </template>
  </ApplicationLayout>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useAuth } from '../composables/useGlobalStores.js'
import ApplicationLayout from './common/ApplicationLayout.vue'
import AnalysisResult from './AnalysisResult.vue'

// État réactif
const textToAnalyze = ref('')
const keywordsInput = ref('')
const searchIntent = ref('informationnelle')
const analysisResult = ref(null)
const error = ref(null)
const loading = ref(false)
const layoutRef = ref(null)
const selectedAnalysis = ref(null)

// Utilisation du composable d'authentification
const { isAuthenticated, getAuthHeaders } = useAuth()

// Computed pour parser les mots-clés
const keywords = computed(() => {
  if (!keywordsInput.value.trim()) return []
  return keywordsInput.value
    .split(',')
    .map(keyword => keyword.trim())
    .filter(keyword => keyword.length > 0)
})

// Fonction pour nettoyer le formulaire
const clearForm = () => {
  textToAnalyze.value = ''
  keywordsInput.value = ''
  searchIntent.value = 'informationnelle'
  analysisResult.value = null
  error.value = null
  loading.value = false
  console.log('🧹 [VERIFY] Formulaire nettoyé')
}

// Surveiller les changements de selectedAnalysis depuis le layout
watch(() => layoutRef.value?.selectedAnalysis?.value, (newAnalysis) => {
  selectedAnalysis.value = newAnalysis
  
  // Si aucune analyse n'est sélectionnée, nettoyer le formulaire
  if (!newAnalysis) {
    clearForm()
  }
}, { immediate: true })

// Surveiller aussi les changements de selectedAnalysis dans le template
watch(selectedAnalysis, (newAnalysis) => {
  if (!newAnalysis) {
    clearForm()
  }
})

// Méthode d'analyse
const analyzeText = async () => {
  if (!textToAnalyze.value.trim()) {
    error.value = 'Veuillez entrer un texte à analyser'
    return
  }
  
  loading.value = true
  error.value = null
  analysisResult.value = null
  
  try {
    if (!isAuthenticated.value) {
      error.value = 'Vous devez être connecté pour analyser un texte'
      return
    }

    const headers = getAuthHeaders()
    
    const requestBody = {
      text: textToAnalyze.value,
      keywords: keywords.value,
      searchIntent: searchIntent.value
    }

    console.log('📊 [VERIFY] Envoi analyse:', {
      textLength: textToAnalyze.value.length,
      keywordsCount: keywords.value.length,
      searchIntent: searchIntent.value
    })
    
    const response = await fetch('http://localhost:3000/api/analysis-text-seo', {
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      analysisResult.value = data.data
      console.log('✅ [VERIFY] Analyse réussie:', {
        seoScore: data.data.seoScore,
        notation: data.data.notation
      })
      
      // Rafraîchir l'historique après une analyse réussie
      if (layoutRef.value) {
        layoutRef.value.refreshAnalyses()
      }
    } else {
      // Gestion des erreurs spécifiques
      if (response.status === 400) {
        error.value = data.message || 'Données invalides'
      } else if (response.status === 401) {
        error.value = 'Session expirée. Veuillez vous reconnecter.'
      } else if (response.status === 500) {
        error.value = data.message || 'Erreur serveur lors de l\'analyse'
      } else {
        error.value = data.message || `Erreur ${response.status}: ${response.statusText}`
      }
      console.error('❌ [VERIFY] Erreur analyse:', data)
    }
  } catch (err) {
    error.value = `Erreur de connexion: ${err.message}`
    console.error('❌ [VERIFY] Erreur réseau:', err)
  } finally {
    loading.value = false
  }
}

// Effacer la sélection pour revenir au formulaire
const clearSelection = () => {
  if (layoutRef.value) {
    layoutRef.value.selectedAnalysis = null
  }
  // Nettoyer complètement le formulaire
  clearForm()
}
</script>

<style scoped>
.verify-text {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
  font-weight: bold;
}

.page-description {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 40px;
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

.keywords-input {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.keywords-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-intent-select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.3s;
}

.search-intent-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.text-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
}

.text-input:focus {
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

.analysis-result {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.analysis-result h3 {
  color: #28a745;
  margin-bottom: 15px;
  font-size: 1.3rem;
}

.analysis-result pre {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 0.9rem;
  border: 1px solid #e9ecef;
  line-height: 1.5;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #dc3545;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.error-message h3 {
  color: #721c24;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.error-message p {
  margin: 0;
  font-size: 1rem;
}

.back-button-container {
  margin-bottom: 20px;
}

.back-btn {
  background: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  background: #5a6268;
  transform: translateY(-1px);
}

.selected-analysis-section {
  padding: 20px 0;
}

.analysis-form-section {
  padding: 20px 0;
}
</style> 