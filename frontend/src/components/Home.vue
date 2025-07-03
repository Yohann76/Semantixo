<template>
  <div class="home">
    <div class="hero-section">
      <h1 class="title">Hello World !</h1>
      <p class="subtitle">Bienvenue dans votre application Semantixo</p>
    </div>
    
    <div class="api-test-section">
      <h2>Tests de l'API Backend</h2>
      
      <div class="api-buttons">
        <button @click="testMainApi" :disabled="loading" class="test-button">
          {{ loading && currentTest === 'main' ? 'Test en cours...' : 'Test API Principale' }}
        </button>
        
        <button @click="testApiEndpoint" :disabled="loading" class="test-button">
          {{ loading && currentTest === 'test' ? 'Test en cours...' : 'Test Endpoint /api/test' }}
        </button>
        
        <button @click="testHelloApi" :disabled="loading" class="test-button">
          {{ loading && currentTest === 'hello' ? 'Test en cours...' : 'Test Hello API' }}
        </button>
      </div>
      
      <div class="name-input" v-if="showNameInput">
        <input 
          v-model="userName" 
          placeholder="Entrez votre nom" 
          class="name-field"
          @keyup.enter="testHelloApi"
        >
      </div>
      
      <div v-if="apiResponse" class="api-response">
        <h3>Réponse de l'API :</h3>
        <pre>{{ JSON.stringify(apiResponse, null, 2) }}</pre>
      </div>
      
      <div v-if="error" class="error-message">
        <h3>Erreur :</h3>
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      apiResponse: null,
      error: null,
      loading: false,
      currentTest: null,
      userName: 'Développeur',
      showNameInput: false
    }
  },
  methods: {
    async testMainApi() {
      await this.makeApiCall('http://localhost:3000/', 'main');
    },
    
    async testApiEndpoint() {
      await this.makeApiCall('http://localhost:3000/api/test', 'test');
    },
    
    async testHelloApi() {
      if (!this.userName.trim()) {
        this.error = 'Veuillez entrer un nom';
        return;
      }
      await this.makeApiCall(`http://localhost:3000/api/hello/${encodeURIComponent(this.userName)}`, 'hello');
    },
    
    async makeApiCall(url, testType) {
      this.loading = true;
      this.currentTest = testType;
      this.error = null;
      this.apiResponse = null;
      
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        this.apiResponse = data;
      } catch (err) {
        this.error = `Erreur lors du test de l'API: ${err.message}`;
        console.error('Erreur API:', err);
      } finally {
        this.loading = false;
        this.currentTest = null;
      }
    }
  },
  
  mounted() {
    // Test automatique de l'API principale au chargement
    this.testMainApi();
  }
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.hero-section {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.title {
  font-size: 3rem;
  margin-bottom: 10px;
  font-weight: bold;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.api-test-section {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.api-test-section h2 {
  color: #333;
  margin-bottom: 20px;
}

.api-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.test-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 150px;
}

.test-button:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.test-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.name-input {
  margin: 20px 0;
}

.name-field {
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  width: 250px;
  transition: border-color 0.3s;
}

.name-field:focus {
  outline: none;
  border-color: #007bff;
}

.api-response {
  margin-top: 20px;
  text-align: left;
  background: white;
  padding: 20px;
  border-radius: 5px;
  border-left: 4px solid #28a745;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.api-response h3 {
  color: #28a745;
  margin-bottom: 10px;
}

.api-response pre {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  font-size: 0.9rem;
  border: 1px solid #e9ecef;
}

.error-message {
  margin-top: 20px;
  text-align: left;
  background: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 5px;
  border-left: 4px solid #dc3545;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.error-message h3 {
  color: #721c24;
  margin-bottom: 10px;
}

@media (max-width: 600px) {
  .api-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .test-button {
    width: 100%;
    max-width: 250px;
  }
  
  .name-field {
    width: 100%;
    max-width: 250px;
  }
}
</style> 