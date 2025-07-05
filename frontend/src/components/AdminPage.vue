<template>
  <div class="admin-page">
    <div class="container">
      <h1 class="page-title">Administration</h1>
      <p class="page-description">
        Interface d'administration pour tester l'API backend
      </p>
      
      <div class="admin-content">
        <div class="api-tests">
          <h2>Tests API Backend</h2>
          <div class="test-section">
            <h3>Test de base</h3>
            <button @click="testBasicAPI" class="test-btn">Test API de base</button>
            <div v-if="basicResult" class="result">
              <pre>{{ basicResult }}</pre>
            </div>
          </div>
          
          <div class="test-section">
            <h3>Test avec paramètre</h3>
            <input v-model="testName" placeholder="Entrez un nom" class="test-input" />
            <button @click="testWithParam" class="test-btn">Test avec paramètre</button>
            <div v-if="paramResult" class="result">
              <pre>{{ paramResult }}</pre>
            </div>
          </div>
          
          <div class="test-section">
            <h3>Test d'authentification</h3>
            <button @click="testAuth" class="test-btn">Test auth</button>
            <div v-if="authResult" class="result">
              <pre>{{ authResult }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPage',
  data() {
    return {
      basicResult: null,
      paramResult: null,
      authResult: null,
      testName: ''
    }
  },
  methods: {
    async testBasicAPI() {
      try {
        const response = await fetch('http://localhost:3000/api/test')
        const data = await response.json()
        this.basicResult = data
      } catch (error) {
        this.basicResult = { error: error.message }
      }
    },
    
    async testWithParam() {
      if (!this.testName.trim()) {
        this.paramResult = { error: 'Veuillez entrer un nom' }
        return
      }
      
      try {
        const response = await fetch(`http://localhost:3000/api/hello/${this.testName}`)
        const data = await response.json()
        this.paramResult = data
      } catch (error) {
        this.paramResult = { error: error.message }
      }
    },
    
    async testAuth() {
      try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        const data = await response.json()
        this.authResult = data
      } catch (error) {
        this.authResult = { error: error.message }
      }
    }
  }
}
</script>

<style scoped>
.admin-page {
  padding-top: 90px;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  text-align: center;
  font-size: 2.5rem;
  color: white;
  margin-bottom: 10px;
  font-weight: bold;
}

.page-description {
  text-align: center;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 40px;
}

.admin-content {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.api-tests h2 {
  color: #333;
  margin-bottom: 30px;
  font-size: 1.8rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.test-section h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.test-input {
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 1rem;
  margin-right: 10px;
  width: 200px;
}

.test-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.test-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.test-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.result {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.result pre {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #333;
  white-space: pre-wrap;
  word-break: break-word;
}
</style> 