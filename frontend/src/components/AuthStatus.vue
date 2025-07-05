<template>
  <div class="auth-status">
    <h3>État d'authentification</h3>
    
    <div class="status-card">
      <div class="status-item">
        <strong>Connecté :</strong>
        <span :class="{ 'connected': isAuthenticated, 'disconnected': !isAuthenticated }">
          {{ isAuthenticated ? 'Oui' : 'Non' }}
        </span>
      </div>
      
      <div class="status-item" v-if="currentUser">
        <strong>Utilisateur :</strong>
        <span>{{ currentUser.name }} ({{ currentUser.email }})</span>
      </div>
      
      <div class="status-item">
        <strong>Token :</strong>
        <span :class="{ 'present': !!currentToken, 'absent': !currentToken }">
          {{ currentToken ? 'Présent' : 'Absent' }}
        </span>
      </div>
      
      <div class="status-item">
        <strong>Rôle :</strong>
        <span>{{ currentUser?.role || 'Non défini' }}</span>
      </div>
    </div>
    
    <div class="actions">
      <button @click="refreshAuth" class="btn-refresh">
        🔄 Rafraîchir
      </button>
      <button @click="testAuth" class="btn-test">
        🧪 Tester Auth
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '../composables/useGlobalStores.js'

const { user, token, isAuthenticated, refreshUser } = useAuth()

// Computed properties pour la réactivité
const currentUser = computed(() => user.value)
const currentToken = computed(() => token.value)
const isUserAuthenticated = computed(() => isAuthenticated.value)

const refreshAuth = () => {
  console.log('🔄 [AuthStatus] Rafraîchissement manuel...')
  refreshUser()
}

const testAuth = () => {
  console.log('🧪 [AuthStatus] Test d\'authentification:', {
    isAuthenticated: isUserAuthenticated.value,
    hasUser: !!currentUser.value,
    hasToken: !!currentToken.value,
    user: currentUser.value,
    tokenLength: currentToken.value?.length
  })
}
</script>

<style scoped>
.auth-status {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin: 20px 0;
}

.auth-status h3 {
  color: #333;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.status-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding: 5px 0;
  border-bottom: 1px solid #e9ecef;
}

.status-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.connected {
  color: #28a745;
  font-weight: bold;
}

.disconnected {
  color: #dc3545;
  font-weight: bold;
}

.present {
  color: #28a745;
  font-weight: bold;
}

.absent {
  color: #dc3545;
  font-weight: bold;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-refresh, .btn-test {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-refresh {
  background: #17a2b8;
  color: white;
}

.btn-refresh:hover {
  background: #138496;
}

.btn-test {
  background: #6f42c1;
  color: white;
}

.btn-test:hover {
  background: #5a32a3;
}
</style> 