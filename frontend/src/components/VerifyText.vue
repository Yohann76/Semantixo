<template>
  <div class="verify-text">
    <div class="container">
      <h1 class="page-title">Analyse SEO de Texte</h1>
      <p class="page-description">
        Analysez votre texte pour optimiser son référencement SEO
      </p>
      
      <div class="analysis-form">
        <div class="form-group">
          <label for="text-input" class="form-label">Texte à analyser :</label>
          <textarea 
            id="text-input"
            v-model="textToAnalyze"
            class="text-input"
            placeholder="Collez votre texte ici pour l'analyse SEO..."
            rows="8"
          ></textarea>
        </div>
        
        <div class="form-actions">
          <button 
            @click="analyzeText" 
            :disabled="!textToAnalyze.trim() || loading"
            class="analyze-btn"
          >
            {{ loading ? 'Analyse en cours...' : 'Analyser le texte' }}
          </button>
        </div>
      </div>
      
      <div v-if="analysisResult" class="analysis-result">
        <h3>Résultats de l'analyse :</h3>
        <pre>{{ JSON.stringify(analysisResult, null, 2) }}</pre>
      </div>
      
      <div v-if="error" class="error-message">
        <h3>Erreur :</h3>
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth.js'

export default {
  name: 'VerifyTextComponent',
  data() {
    return {
      textToAnalyze: '',
      analysisResult: null,
      error: null,
      loading: false
    }
  },
  methods: {
    async analyzeText() {
      if (!this.textToAnalyze.trim()) {
        this.error = 'Veuillez entrer un texte à analyser';
        return;
      }
      
      this.loading = true;
      this.error = null;
      this.analysisResult = null;
      
      try {
        const authStore = useAuthStore();
        if (!authStore.getToken) {
          this.error = 'Vous devez être connecté pour analyser un texte';
          return;
        }

        const response = await fetch('http://localhost:3000/api/analysis', {
          method: 'POST',
          headers: authStore.getAuthHeaders(),
          body: JSON.stringify({
            text: this.textToAnalyze
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          this.analysisResult = data.data.analysis;
        } else {
          this.error = data.message || 'Erreur lors de l\'analyse';
        }
      } catch (err) {
        this.error = `Erreur lors de l'analyse: ${err.message}`;
        console.error('Erreur analyse:', err);
      } finally {
        this.loading = false;
      }
    }
  }
}
</script>

<style scoped>
.verify-text {
  padding-top: 90px;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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
  margin-bottom: 10px;
  font-size: 1.1rem;
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
}

@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
  
  .page-title {
    font-size: 2rem;
  }
  
  .analysis-form {
    padding: 20px;
  }
  
  .analyze-btn {
    padding: 12px 24px;
    font-size: 1rem;
  }
}
</style> 