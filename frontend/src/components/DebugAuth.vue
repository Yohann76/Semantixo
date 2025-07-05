<template>
  <div class="debug-auth">
    <h3>🔍 Debug Authentification</h3>
    
    <div class="debug-section">
      <h4>LocalStorage</h4>
      <div class="debug-item">
        <strong>Token:</strong>
        <span :class="{ 'present': !!localStorageToken, 'absent': !localStorageToken }">
          {{ localStorageToken ? `${localStorageToken.substring(0, 20)}...` : 'Absent' }}
        </span>
      </div>
      <div class="debug-item">
        <strong>User:</strong>
        <span :class="{ 'present': !!localStorageUser, 'absent': !localStorageUser }">
          {{ localStorageUser ? JSON.stringify(localStorageUser, null, 2) : 'Absent' }}
        </span>
      </div>
    </div>
    
    <div class="debug-section">
      <h4>Store State</h4>
      <div class="debug-item">
        <strong>isAuthenticated:</strong>
        <span :class="{ 'true': storeIsAuthenticated, 'false': !storeIsAuthenticated }">
          {{ storeIsAuthenticated }}
        </span>
      </div>
      <div class="debug-item">
        <strong>Token:</strong>
        <span :class="{ 'present': !!storeToken, 'absent': !storeToken }">
          {{ storeToken ? `${storeToken.substring(0, 20)}...` : 'Absent' }}
        </span>
      </div>
      <div class="debug-item">
        <strong>User:</strong>
        <span :class="{ 'present': !!storeUser, 'absent': !storeUser }">
          {{ storeUser ? JSON.stringify(storeUser, null, 2) : 'Absent' }}
        </span>
      </div>
    </div>
    
    <div class="debug-actions">
      <button @click="checkLocalStorage" class="btn-debug">
        🔍 Vérifier localStorage
      </button>
      <button @click="reloadStore" class="btn-debug">
        🔄 Recharger Store
      </button>
      <button @click="clearAll" class="btn-debug">
        🧹 Nettoyer tout
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../composables/useGlobalStores.js'

const { user, token, isAuthenticated } = useAuth()

// État réactif pour localStorage
const localStorageToken = ref(null)
const localStorageUser = ref(null)

// Computed pour le store
const storeIsAuthenticated = computed(() => isAuthenticated.value)
const storeToken = computed(() => token.value)
const storeUser = computed(() => user.value)

// Fonctions de débogage
const checkLocalStorage = () => {
  console.log('🔍 [Debug] Vérification localStorage...')
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')
  
  localStorageToken.value = storedToken
  localStorageUser.value = storedUser ? JSON.parse(storedUser) : null
  
  console.log('📦 [Debug] localStorage:', {
    token: storedToken ? `${storedToken.substring(0, 20)}...` : 'Absent',
    user: storedUser ? JSON.parse(storedUser) : 'Absent'
  })
}

const reloadStore = () => {
  console.log('🔄 [Debug] Rechargement du store...')
  // Forcer le rechargement
  window.location.reload()
}

const clearAll = () => {
  console.log('🧹 [Debug] Nettoyage complet...')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorageToken.value = null
  localStorageUser.value = null
  console.log('✅ [Debug] localStorage nettoyé')
}

// Charger les données au montage
onMounted(() => {
  checkLocalStorage()
})
</script>

<style scoped>
.debug-auth {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  border: 2px solid #dee2e6;
  margin: 20px 0;
}

.debug-auth h3 {
  color: #495057;
  margin-bottom: 15px;
  font-size: 1.1rem;
}

.debug-section {
  background: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 1px solid #e9ecef;
}

.debug-section h4 {
  color: #495057;
  margin-bottom: 10px;
  font-size: 1rem;
}

.debug-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 5px 0;
  border-bottom: 1px solid #f1f3f4;
}

.debug-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.debug-item strong {
  color: #495057;
  font-weight: 600;
}

.present {
  color: #28a745;
  font-weight: bold;
}

.absent {
  color: #dc3545;
  font-weight: bold;
}

.true {
  color: #28a745;
  font-weight: bold;
}

.false {
  color: #dc3545;
  font-weight: bold;
}

.debug-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-debug {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  background: #6c757d;
  color: white;
}

.btn-debug:hover {
  background: #5a6268;
  transform: translateY(-1px);
}
</style> 