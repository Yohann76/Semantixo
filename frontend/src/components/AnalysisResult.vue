<template>
  <div class="analysis-result-container">
    <div class="result-header">
      <h2 class="result-title">Résultats de l'analyse</h2>
      <div class="result-meta">
        <span class="result-date">{{ formatDate(analysis.createdAt) }}</span>
        <span class="result-score" :class="getScoreClass(analysis.seoScore)">
          Score SEO: {{ analysis.seoScore || '0' }}/100
        </span>
      </div>
    </div>

    <div class="result-content">
      <!-- Texte analysé -->
      <div class="result-section">
        <h3 class="section-title">Texte analysé</h3>
        <div class="text-content">
          {{ analysis.text }}
        </div>
      </div>

      <!-- Statistiques -->
      <div class="result-section">
        <h3 class="section-title">Statistiques</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon">📝</div>
            <div class="stat-info">
              <div class="stat-label">Mots</div>
              <div class="stat-value">{{ analysis.wordCount }}</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🔤</div>
            <div class="stat-info">
              <div class="stat-label">Caractères</div>
              <div class="stat-value">{{ analysis.characterCount }}</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">📊</div>
            <div class="stat-info">
              <div class="stat-label">Score SEO</div>
              <div class="stat-value">{{ analysis.seoScore || '0' }}/100</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Détails de l'analyse -->
      <div class="result-section">
        <h3 class="section-title">Détails de l'analyse</h3>
        <div class="analysis-details">
          <pre class="details-json">{{ JSON.stringify(analysis, null, 2) }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  analysis: {
    type: Object,
    required: true
  }
})

// Formater la date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Obtenir la classe CSS pour le score
const getScoreClass = (score) => {
  if (!score || score === 0) return 'score-poor'
  if (score >= 80) return 'score-excellent'
  if (score >= 60) return 'score-good'
  if (score >= 40) return 'score-average'
  return 'score-poor'
}
</script>

<style scoped>
.analysis-result-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.result-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px 30px;
}

.result-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.result-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  opacity: 0.9;
}

.result-score {
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(255,255,255,0.2);
}

.score-excellent {
  background: rgba(40, 167, 69, 0.8) !important;
}

.score-good {
  background: rgba(23, 162, 184, 0.8) !important;
}

.score-average {
  background: rgba(255, 193, 7, 0.8) !important;
}

.score-poor {
  background: rgba(220, 53, 69, 0.8) !important;
}

.result-content {
  padding: 30px;
}

.result-section {
  margin-bottom: 30px;
}

.result-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 15px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
}

.text-content {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #495057;
  max-height: 200px;
  overflow-y: auto;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.stat-icon {
  font-size: 1.5rem;
  margin-right: 12px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
}

.analysis-details {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.details-json {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 20px;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* Scrollbar personnalisée pour le texte */
.text-content::-webkit-scrollbar {
  width: 6px;
}

.text-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.text-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.text-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style> 