<template>
  <div v-if="error" class="error-message" :class="type">
    <div class="error-header">
      <span class="error-icon">⚠️</span>
      <h3 class="error-title">{{ title }}</h3>
    </div>
    <p class="error-text">{{ error }}</p>
    <button v-if="showRetry" @click="$emit('retry')" class="retry-btn">
      Réessayer
    </button>
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'Erreur'
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info'].includes(value)
  },
  showRetry: {
    type: Boolean,
    default: false
  }
})

defineEmits(['retry'])
</script>

<style scoped>
.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 20px;
  border-radius: 10px;
  border-left: 4px solid #dc3545;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin: 20px 0;
}

.error-message.warning {
  background: #fff3cd;
  color: #856404;
  border-left-color: #ffc107;
}

.error-message.info {
  background: #d1ecf1;
  color: #0c5460;
  border-left-color: #17a2b8;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.error-icon {
  font-size: 1.2rem;
}

.error-title {
  color: inherit;
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.error-text {
  margin: 0 0 15px 0;
  font-size: 1rem;
  line-height: 1.5;
}

.retry-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background: #c82333;
}

.error-message.warning .retry-btn {
  background: #ffc107;
  color: #212529;
}

.error-message.warning .retry-btn:hover {
  background: #e0a800;
}

.error-message.info .retry-btn {
  background: #17a2b8;
  color: white;
}

.error-message.info .retry-btn:hover {
  background: #138496;
}
</style> 