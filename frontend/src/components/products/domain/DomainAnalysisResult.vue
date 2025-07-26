<template>
  <div class="domain-result">
    <div class="result-header">
      <h2 class="result-title">Résultats de l'analyse du nom de domaine</h2>
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
            <span class="info-label">Domaine analysé :</span>
            <span class="info-value">{{ analysis.domain }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Autorité du domaine :</span>
            <span class="info-value">{{ analysis.metrics?.domainAuthority || 'N/A' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Âge du domaine :</span>
            <span class="info-value">{{ analysis.metrics?.domainAge || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <!-- Métriques détaillées -->
      <div v-if="analysis.metrics" class="result-section">
        <h3 class="section-title">📈 Métriques détaillées</h3>
        <div class="metrics-grid">
          <div class="metric-item">
            <span class="metric-label">Autorité du domaine</span>
            <span class="metric-value">{{ analysis.metrics.domainAuthority || 0 }}/100</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Backlinks totaux</span>
            <span class="metric-value">{{ analysis.metrics.totalBacklinks || 0 }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Domaines référents</span>
            <span class="metric-value">{{ analysis.metrics.referringDomains || 0 }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Pages indexées</span>
            <span class="metric-value">{{ analysis.metrics.indexedPages || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Éléments du domaine -->
      <div v-if="analysis.domainElements" class="result-section">
        <h3 class="section-title">🌐 Éléments du domaine</h3>
        <div class="domain-elements">
          <div v-if="analysis.domainElements.ssl" class="element-item positive">
            <span class="element-icon">🔒</span>
            <span class="element-text">SSL/HTTPS activé</span>
          </div>
          <div v-if="analysis.domainElements.www" class="element-item positive">
            <span class="element-icon">🌐</span>
            <span class="element-text">Redirection www configurée</span>
          </div>
          <div v-if="analysis.domainElements.mobile" class="element-item positive">
            <span class="element-icon">📱</span>
            <span class="element-text">Site mobile-friendly</span>
          </div>
          <div v-if="analysis.domainElements.speed" class="element-item positive">
            <span class="element-icon">⚡</span>
            <span class="element-text">Vitesse de chargement optimale</span>
          </div>
          <div v-if="!analysis.domainElements.ssl" class="element-item negative">
            <span class="element-icon">⚠️</span>
            <span class="element-text">SSL/HTTPS non activé</span>
          </div>
          <div v-if="!analysis.domainElements.www" class="element-item negative">
            <span class="element-icon">⚠️</span>
            <span class="element-text">Redirection www non configurée</span>
          </div>
        </div>
      </div>

      <!-- Analyse détaillée -->
      <div v-if="analysis.analysis" class="result-section">
        <h3 class="section-title">🔍 Analyse détaillée</h3>
        <div class="analysis-details">
          <div v-if="analysis.analysis.technicalScore" class="analysis-item">
            <span class="analysis-label">Score technique :</span>
            <span class="analysis-value">{{ analysis.analysis.technicalScore }}/100</span>
          </div>
          <div v-if="analysis.analysis.authorityScore" class="analysis-item">
            <span class="analysis-label">Score d'autorité :</span>
            <span class="analysis-value">{{ analysis.analysis.authorityScore }}/100</span>
          </div>
          <div v-if="analysis.analysis.trustScore" class="analysis-item">
            <span class="analysis-label">Score de confiance :</span>
            <span class="analysis-value">{{ analysis.analysis.trustScore }}/100</span>
          </div>
        </div>
      </div>

      <!-- Recommandations -->
      <div class="result-section">
        <h3 class="section-title">💡 Recommandations</h3>
        <div class="recommendations-list">
          <div v-if="analysis.seoScore < 60" class="recommendation">
            <span class="rec-icon">🔧</span>
            <span>Améliorez l'autorité du domaine avec des backlinks de qualité</span>
          </div>
          <div v-if="analysis.metrics && analysis.metrics.domainAuthority < 30" class="recommendation">
            <span class="rec-icon">📈</span>
            <span>L'autorité du domaine est faible ({{ analysis.metrics.domainAuthority }}/100)</span>
          </div>
          <div v-if="analysis.metrics && analysis.metrics.totalBacklinks < 100" class="recommendation">
            <span class="rec-icon">🔗</span>
            <span>Augmentez le nombre de backlinks (actuellement {{ analysis.metrics.totalBacklinks }})</span>
          </div>
          <div v-if="analysis.domainElements && !analysis.domainElements.ssl" class="recommendation">
            <span class="rec-icon">🔒</span>
            <span>Activez SSL/HTTPS pour améliorer la sécurité et le SEO</span>
          </div>
          <div v-if="analysis.metrics && analysis.metrics.referringDomains < 20" class="recommendation">
            <span class="rec-icon">🌐</span>
            <span>Augmentez le nombre de domaines référents (actuellement {{ analysis.metrics.referringDomains }})</span>
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
.domain-result {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  overflow: hidden;
}

.result-header {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
  border-left: 4px solid #28a745;
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

.domain-elements {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.element-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border-radius: 8px;
  font-weight: 500;
}

.element-item.positive {
  background: #d4edda;
  border-left: 4px solid #28a745;
  color: #155724;
}

.element-item.negative {
  background: #f8d7da;
  border-left: 4px solid #dc3545;
  color: #721c24;
}

.element-icon {
  font-size: 1.2rem;
}

.analysis-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.analysis-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.analysis-label {
  font-weight: 600;
  color: #333;
}

.analysis-value {
  font-weight: bold;
  font-size: 1.1rem;
  color: #28a745;
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