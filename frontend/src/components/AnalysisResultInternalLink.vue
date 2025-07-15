<template>
  <div class="analysis-result">
    <div class="result-header">
      <h3 class="result-title">Résultats de l'analyse</h3>
      <div class="result-score" :class="getScoreClass(analysis.internalLinkScore)">
        Score: {{ analysis.internalLinkScore }}/100
      </div>
    </div>

    <div class="result-content">
      <!-- Métriques principales -->
      <div class="metrics-section">
        <h4 class="section-title">Métriques principales</h4>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">🔗</div>
            <div class="metric-info">
              <div class="metric-value">{{ analysis.metrics?.totalInternalLinks || analysis.totalInternalLinks || 0 }}</div>
              <div class="metric-label">Liens internes</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">🌐</div>
            <div class="metric-info">
              <div class="metric-value">{{ analysis.metrics?.totalExternalLinks || analysis.totalExternalLinks || 0 }}</div>
              <div class="metric-label">Liens externes</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">❌</div>
            <div class="metric-info">
              <div class="metric-value">{{ analysis.metrics?.brokenLinks || analysis.brokenLinks || 0 }}</div>
              <div class="metric-label">Liens cassés</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">📄</div>
            <div class="metric-info">
              <div class="metric-value">{{ analysis.metrics?.uniqueInternalPages || analysis.uniqueInternalPages || 0 }}</div>
              <div class="metric-label">Pages internes</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pages internes -->
      <div v-if="analysis.internalPages && analysis.internalPages.length > 0" class="pages-section">
        <h4 class="section-title">Pages internes détectées ({{ analysis.internalPages.length }})</h4>
        <div class="pages-list">
          <div 
            v-for="page in displayedPages" 
            :key="page.url"
            class="page-item"
          >
            <div class="page-info">
              <div class="page-title">{{ page.title || 'Sans titre' }}</div>
              <div class="page-url">{{ page.url }}</div>
            </div>
            <div class="page-stats">
              <span class="stat-badge">
                {{ page.internalLinksCount }} liens internes
              </span>
            </div>
          </div>
        </div>
        <div v-if="analysis.internalPages.length > pagesToShow" class="show-more-container">
          <button @click="showMorePages" class="show-more-btn">
            Voir plus de pages ({{ analysis.internalPages.length - pagesToShow }} restantes)
          </button>
        </div>
      </div>

      <!-- Liens cassés -->
      <div v-if="analysis.brokenLinks && analysis.brokenLinks.length > 0" class="broken-links-section">
        <h4 class="section-title">Liens cassés détectés ({{ analysis.brokenLinks.length }})</h4>
        <div class="broken-links-list">
          <div 
            v-for="link in displayedBrokenLinks" 
            :key="link.url"
            class="broken-link-item"
          >
            <div class="link-info">
              <div class="link-url">{{ link.url }}</div>
              <div class="link-anchor">{{ link.anchorText || 'Sans texte' }}</div>
            </div>
            <div class="link-status">
              <span class="status-badge error">
                Erreur {{ link.statusCode || 'N/A' }}
              </span>
            </div>
          </div>
        </div>
        <div v-if="analysis.brokenLinks.length > brokenLinksToShow" class="show-more-container">
          <button @click="showMoreBrokenLinks" class="show-more-btn">
            Voir plus de liens cassés ({{ analysis.brokenLinks.length - brokenLinksToShow }} restants)
          </button>
        </div>
      </div>

      <!-- Recommandations -->
      <div v-if="analysis.analysis && analysis.analysis.recommendations && analysis.analysis.recommendations.length > 0" class="recommendations-section">
        <h4 class="section-title">Recommandations</h4>
        <div class="recommendations-list">
          <div 
            v-for="(recommendation, index) in analysis.analysis.recommendations" 
            :key="index"
            class="recommendation-item"
          >
            <div class="recommendation-icon">💡</div>
            <div class="recommendation-text">{{ recommendation }}</div>
          </div>
        </div>
      </div>

      <!-- Message si données incomplètes -->
      <div v-if="!analysis.metrics && !analysis.internalPages && !analysis.brokenLinks" class="incomplete-data-section">
        <h4 class="section-title">Données incomplètes</h4>
        <div class="incomplete-data-message">
          <div class="message-icon">⚠️</div>
          <div class="message-text">
            Les détails complets de cette analyse ne sont pas disponibles. 
            Cliquez sur "Retour à l'analyse" pour effectuer une nouvelle analyse.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// eslint-disable-next-line no-undef
const props = defineProps({
  analysis: {
    type: Object,
    required: true
  }
})

const pagesToShow = ref(10)
const brokenLinksToShow = ref(10)

const displayedPages = computed(() => {
  return props.analysis.internalPages?.slice(0, pagesToShow.value) || []
})

const displayedBrokenLinks = computed(() => {
  return props.analysis.brokenLinks?.slice(0, brokenLinksToShow.value) || []
})

const showMorePages = () => {
  pagesToShow.value += 20
}

const showMoreBrokenLinks = () => {
  brokenLinksToShow.value += 20
}

const getScoreClass = (score) => {
  if (!score || score === 0) return 'score-poor'
  if (score >= 80) return 'score-excellent'
  if (score >= 60) return 'score-good'
  if (score >= 40) return 'score-average'
  return 'score-poor'
}
</script>

<style scoped>
.analysis-result {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.result-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.result-score {
  font-weight: bold;
  padding: 8px 16px;
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

.metrics-section,
.pages-section,
.broken-links-section,
.recommendations-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.metric-card {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.metric-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.metric-info {
  flex: 1;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.metric-label {
  color: #6c757d;
  font-size: 0.9rem;
}

.pages-list,
.broken-links-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.page-item,
.broken-link-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.page-info,
.link-info {
  flex: 1;
}

.page-title,
.link-url {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

.page-url,
.link-anchor {
  color: #6c757d;
  font-size: 0.9rem;
}

.stat-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.error {
  background: #ffebee;
  color: #c62828;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recommendation-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 15px;
  background: #fff3cd;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.recommendation-icon {
  font-size: 1.2rem;
  margin-top: 2px;
}

.recommendation-text {
  color: #856404;
  line-height: 1.5;
}

.incomplete-data-section {
  margin-top: 30px;
}

.incomplete-data-message {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px;
  background: #fff3cd;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
}

.message-icon {
  font-size: 1.5rem;
  margin-top: 2px;
}

.message-text {
  color: #856404;
  line-height: 1.5;
  font-size: 1rem;
}

.show-more-container {
  text-align: center;
  margin-top: 20px;
}

.show-more-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.show-more-btn:hover {
  transform: translateY(-2px);
}
</style> 