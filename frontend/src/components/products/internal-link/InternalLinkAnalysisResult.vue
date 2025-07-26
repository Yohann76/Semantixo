<template>
  <div class="internal-link-result">
    <div class="result-header">
      <h2 class="result-title">Résultats de l'analyse du maillage interne</h2>
      <div class="result-meta">
        <span class="result-date">{{ formatDate(analysis.createdAt) }}</span>
        <div class="score-section">
          <span class="result-score" :class="getScoreClass(analysis.seoScore)">Score SEO: {{ analysis.seoScore || '0' }}/100</span>
        </div>
      </div>
    </div>

    <div class="result-content">
      <!-- Informations générales -->
      <div class="result-section">
        <h3 class="section-title">📊 Informations générales</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">URL analysée :</span>
            <span class="info-value">{{ analysis.url }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Pages internes trouvées :</span>
            <span class="info-value">{{ analysis.internalPages?.length || 0 }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Liens cassés :</span>
            <span class="info-value">{{ analysis.brokenLinks?.length || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Métriques détaillées -->
      <div v-if="analysis.metrics" class="result-section">
        <h3 class="section-title">📈 Métriques détaillées</h3>
        <div class="metrics-grid">
          <div class="metric-item">
            <span class="metric-label">Liens internes totaux</span>
            <span class="metric-value">{{ analysis.metrics.totalInternalLinks || 0 }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Pages uniques</span>
            <span class="metric-value">{{ analysis.metrics.uniquePages || 0 }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Profondeur moyenne</span>
            <span class="metric-value">{{ analysis.metrics.averageDepth || 0 }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Taux de liens cassés</span>
            <span class="metric-value">{{ analysis.metrics.brokenLinkRate || 0 }}%</span>
          </div>
        </div>
      </div>

      <!-- Pages internes -->
      <div v-if="analysis.internalPages && analysis.internalPages.length > 0" class="result-section">
        <h3 class="section-title">🔗 Pages internes trouvées</h3>
        <div class="pages-list">
          <div v-for="page in analysis.internalPages.slice(0, 10)" :key="page.url" class="page-item">
            <span class="page-url">{{ page.url }}</span>
            <span class="page-links">{{ page.internalLinks || 0 }} liens</span>
          </div>
          <div v-if="analysis.internalPages.length > 10" class="more-pages">
            ... et {{ analysis.internalPages.length - 10 }} autres pages
          </div>
        </div>
      </div>

      <!-- Liens cassés -->
      <div v-if="analysis.brokenLinks && analysis.brokenLinks.length > 0" class="result-section">
        <h3 class="section-title">⚠️ Liens cassés détectés</h3>
        <div class="broken-links-list">
          <div v-for="link in analysis.brokenLinks.slice(0, 5)" :key="link.url" class="broken-link-item">
            <span class="broken-url">{{ link.url }}</span>
            <span class="broken-status">{{ link.status || 'Erreur' }}</span>
          </div>
          <div v-if="analysis.brokenLinks.length > 5" class="more-broken">
            ... et {{ analysis.brokenLinks.length - 5 }} autres liens cassés
          </div>
        </div>
      </div>

      <!-- Recommandations -->
      <div class="result-section">
        <h3 class="section-title">💡 Recommandations</h3>
        <div class="recommendations-list">
          <div v-if="analysis.seoScore < 60" class="recommendation">
            <span class="rec-icon">🔧</span>
            <span>Améliorez la structure de navigation interne</span>
          </div>
          <div v-if="analysis.brokenLinks && analysis.brokenLinks.length > 0" class="recommendation">
            <span class="rec-icon">🔗</span>
            <span>Corrigez les {{ analysis.brokenLinks.length }} liens cassés détectés</span>
          </div>
          <div v-if="analysis.metrics && analysis.metrics.averageDepth > 3" class="recommendation">
            <span class="rec-icon">📁</span>
            <span>Réduisez la profondeur de navigation (actuellement {{ analysis.metrics.averageDepth }})</span>
          </div>
          <div v-if="analysis.metrics && analysis.metrics.totalInternalLinks < 50" class="recommendation">
            <span class="rec-icon">➕</span>
            <span>Ajoutez plus de liens internes pour améliorer la navigation</span>
          </div>
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

const formatDate = (date) => {
  if (!date) return 'Date inconnue'
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getScoreClass = (score) => {
  if (score >= 85) return 'score-excellent'
  if (score >= 70) return 'score-good'
  if (score >= 55) return 'score-average'
  return 'score-poor'
}
</script>

<style scoped>
.internal-link-result {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  overflow: hidden;
}

.result-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px;
  text-align: center;
}

.result-title {
  font-size: 1.8rem;
  margin: 0 0 15px 0;
  font-weight: bold;
}

.result-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.result-date {
  font-size: 0.9rem;
  opacity: 0.9;
}

.score-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result-score {
  background: rgba(255,255,255,0.2);
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 1.1rem;
}

.result-content {
  padding: 30px;
}

.result-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.info-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.info-label {
  display: block;
  font-weight: 600;
  color: #666;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.info-value {
  font-size: 1.1rem;
  font-weight: bold;
  color: #333;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.metric-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.metric-label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.pages-list, .broken-links-list {
  max-height: 300px;
  overflow-y: auto;
}

.page-item, .broken-link-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
  margin-bottom: 5px;
  border-radius: 5px;
}

.page-url, .broken-url {
  font-family: monospace;
  font-size: 0.9rem;
  color: #333;
  word-break: break-all;
}

.page-links, .broken-status {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.more-pages, .more-broken {
  text-align: center;
  padding: 10px;
  color: #666;
  font-style: italic;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recommendation {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 5px;
}

.rec-icon {
  font-size: 1.2rem;
}

/* Score classes */
.score-excellent { background: rgba(40, 167, 69, 0.2); }
.score-good { background: rgba(23, 162, 184, 0.2); }
.score-average { background: rgba(255, 193, 7, 0.2); }
.score-poor { background: rgba(220, 53, 69, 0.2); }
</style> 