<template>
  <div class="text-analysis-form">
    <div class="analysis-form">
      <!-- Mots-clés -->
      <div class="form-group">
        <label for="keywords-input" class="form-label">
          Mots-clés ciblés <span class="required">*</span> :
        </label>
        <div class="keywords-container">
          <!-- Tags existants -->
          <div class="keyword-tags">
            <div 
              v-for="(keyword, index) in keywords" 
              :key="index"
              class="keyword-tag"
            >
              <span class="keyword-text">{{ keyword }}</span>
              <button 
                @click="removeKeyword(index)"
                class="remove-keyword"
                type="button"
              >
                ×
              </button>
            </div>
          </div>
          
          <!-- Input pour nouveau mot-clé -->
          <input 
            v-if="keywords.length < 5"
            id="keywords-input"
            v-model="keywordInput"
            @keydown="handleKeydown"
            class="keywords-input"
            placeholder="Tapez un mot-clé et appuyez sur Entrée ou virgule pour valider..."
            type="text"
          />
        </div>
        <small class="form-help">
          Maximum 5 mots-clés. Appuyez sur Entrée ou virgule (,) pour ajouter.
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
          :disabled="!textToAnalyze.trim() || keywords.length === 0 || loading"
          class="analyze-btn"
        >
          <span v-if="loading" class="loading-spinner">⏳</span>
          {{ loading ? 'Analyse en cours...' : 'Analyser le texte' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../../../composables/useGlobalStores.js'
import AnalysisTextSeoService from '../../../services/analysisTextSeo.js'

// État réactif
const textToAnalyze = ref('')
const keywords = ref([])
const keywordInput = ref('')
const loading = ref(false)

// Utilisation du composable d'authentification
const { isAuthenticated } = useAuth()

// Émettre les événements
const emit = defineEmits(['analysis-complete', 'error'])

// Gérer les touches du clavier
const handleKeydown = (event) => {
  // Entrée ou virgule pour valider
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addKeyword()
  }
}

// Ajouter un mot-clé
const addKeyword = () => {
  const keyword = keywordInput.value.trim()
  
  if (keyword && keywords.value.length < 5) {
    // Vérifier si le mot-clé n'existe pas déjà
    if (!keywords.value.includes(keyword)) {
      keywords.value.push(keyword)
      keywordInput.value = ''
    }
  }
}

// Supprimer un mot-clé
const removeKeyword = (index) => {
  keywords.value.splice(index, 1)
}

// Méthode d'analyse
const analyzeText = async () => {
  console.log('🔥 [FORM] analyzeText function called!')
  console.log('🔥 [FORM] Text length:', textToAnalyze.value.length)
  console.log('🔥 [FORM] Keywords count:', keywords.value.length)
  
  if (!textToAnalyze.value.trim()) {
    emit('error', 'Veuillez entrer un texte à analyser')
    return
  }
  
  if (keywords.value.length === 0) {
    emit('error', 'Veuillez ajouter au moins un mot-clé')
    return
  }
  
  loading.value = true
  
  try {
    if (!isAuthenticated.value) {
      emit('error', 'Vous devez être connecté pour analyser un texte')
      return
    }

    // Nettoyer les données avant l'envoi
    // eslint-disable-next-line no-control-regex
    const cleanText = textToAnalyze.value.trim().replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    const cleanKeywords = keywords.value.map(k => k.trim()).filter(k => k.length > 0)

    console.log('📊 [TEXT FORM] Envoi analyse:', {
      textLength: cleanText.length,
      keywordsCount: cleanKeywords.length,
      keywords: cleanKeywords
    })
    
    // Utiliser le nouveau service
    const result = await AnalysisTextSeoService.createAnalysis(cleanText, cleanKeywords)
    
    console.log('✅ [TEXT FORM] Analyse réussie:', result)
    
    // Réinitialiser le formulaire
    textToAnalyze.value = ''
    keywords.value = []
    
    // Émettre l'événement avec les données reçues
    emit('analysis-complete', result)
    
  } catch (error) {
    console.error('❌ [TEXT FORM] Erreur:', error)
    emit('error', error.message || 'Une erreur est survenue lors de l\'analyse')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.text-analysis-form {
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

.required {
  color: #dc3545;
  font-weight: bold;
}

.form-help {
  display: block;
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 4px;
  font-style: italic;
}

.keywords-container {
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 8px;
  min-height: 50px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  transition: border-color 0.3s;
}

.keywords-container:focus-within {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  animation: tagAppear 0.3s ease-out;
}

@keyframes tagAppear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.keyword-text {
  white-space: nowrap;
}

.remove-keyword {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.remove-keyword:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.keywords-input {
  border: none;
  outline: none;
  font-size: 1rem;
  padding: 8px 0;
  flex: 1;
  min-width: 200px;
}

.keywords-input::placeholder {
  color: #6c757d;
  font-style: italic;
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
</style> 