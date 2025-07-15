<template>
  <div class="analysis-result">
    <div class="result-header">
      <h3 class="result-title">Résultats de l'analyse</h3>
      <div class="result-score" :class="getScoreClass(analysis.domainScore)">
        Score: {{ analysis.domainScore }}/100
      </div>
    </div>

    <div class="result-content">
      <!-- Métriques principales -->
      <div class="metrics-section">
        <h4 class="section-title">Métriques principales</h4>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">📏</div>
            <div class="metric-info">
              <div class="metric-value">{{ analysis.metrics?.domainLength || 0 }}</div>
              <div class="metric-label">Longueur</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">📅</div>
            <div class="metric-info">
              <div class="metric-value">{{ analysis.metrics?.domainAge || 0 }} ans</div>
              <div class="metric-label">Âge du domaine</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">⭐</div>
            <div class="metric-info">
              <div class="metric-value">{{ analysis.metrics?.domainAuthority || 0 }}/100</div>
              <div class="metric-label">Autorité</div>
            </div>
          </div>
          <div class="metric-card">
            <div class="metric-icon">📖</div>
            <div class="metric-info">
              <div class="metric-value">{{ analysis.metrics?.domainReadability || 0 }}%</div>
              <div class="metric-label">Lisibilité</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Éléments du domaine -->
      <div class="domain-elements-section">
        <h4 class="section-title">Éléments du domaine</h4>
        <div class="elements-grid">
          <div class="element-card" :class="{ 'positive': analysis.domainElements?.hasGoodLength, 'negative': !analysis.domainElements?.hasGoodLength }">
            <div class="element-icon">{{ analysis.domainElements?.hasGoodLength ? '✅' : '❌' }}</div>
            <div class="element-info">
              <div class="element-label">Longueur optimale</div>
              <div class="element-description">{{ analysis.domainElements?.hasGoodLength ? 'Longueur appropriée' : 'Longueur non optimale' }}</div>
            </div>
          </div>
          <div class="element-card" :class="{ 'positive': analysis.domainElements?.hasGoodExtension, 'negative': !analysis.domainElements?.hasGoodExtension }">
            <div class="element-icon">{{ analysis.domainElements?.hasGoodExtension ? '✅' : '❌' }}</div>
            <div class="element-info">
              <div class="element-label">Extension populaire</div>
              <div class="element-description">{{ analysis.domainElements?.hasGoodExtension ? 'Extension reconnue' : 'Extension peu populaire' }}</div>
            </div>
          </div>
          <div class="element-card" :class="{ 'positive': analysis.domainElements?.isMemorable, 'negative': !analysis.domainElements?.isMemorable }">
            <div class="element-icon">{{ analysis.domainElements?.isMemorable ? '✅' : '❌' }}</div>
            <div class="element-info">
              <div class="element-label">Facile à mémoriser</div>
              <div class="element-description">{{ analysis.domainElements?.isMemorable ? 'Nom mémorable' : 'Nom difficile à retenir' }}</div>
            </div>
          </div>
          <div class="element-card" :class="{ 'positive': analysis.domainElements?.isBrandable, 'negative': !analysis.domainElements?.isBrandable }">
            <div class="element-icon">{{ analysis.domainElements?.isBrandable ? '✅' : '❌' }}</div>
            <div class="element-info">
              <div class="element-label">Nom brandable</div>
              <div class="element-description">{{ analysis.domainElements?.isBrandable ? 'Nom unique et brandable' : 'Nom peu brandable' }}</div>
            </div>
          </div>
          <div class="element-card" :class="{ 'positive': analysis.domainElements?.isAvailable, 'negative': !analysis.domainElements?.isAvailable }">
            <div class="element-icon">{{ analysis.domainElements?.isAvailable ? '✅' : '❌' }}</div>
            <div class="element-info">
              <div class="element-label">Disponible</div>
              <div class="element-description">{{ analysis.domainElements?.isAvailable ? 'Domaine disponible' : 'Domaine déjà pris' }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analyse détaillée -->
      <div v-if="analysis.analysis" class="analysis-details-section">
        <h4 class="section-title">Analyse détaillée</h4>
        <div class="analysis-details">
          <div class="detail-item">
            <div class="detail-label">Qualité du domaine:</div>
            <div class="detail-value">{{ analysis.analysis.domainQuality }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Forces:</div>
            <div class="detail-value">{{ analysis.analysis.domainStrength }}</div>
          </div>
          <div class="detail-item">
            <div class="detail-label">Faiblesses:</div>
            <div class="detail-value">{{ analysis.analysis.domainWeakness }}</div>
          </div>
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
    </div>
  </div>
</template>

<script setup>
// eslint-disable-next-line no-undef
defineProps({
  analysis: {
    type: Object,
    required: true
  }
})

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
.domain-elements-section,
.analysis-details-section,
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

.elements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.element-card {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.element-card.positive {
  background: #d4edda;
  border-color: #c3e6cb;
}

.element-card.negative {
  background: #f8d7da;
  border-color: #f5c6cb;
}

.element-icon {
  font-size: 1.5rem;
  margin-right: 15px;
}

.element-info {
  flex: 1;
}

.element-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

.element-description {
  font-size: 0.9rem;
  color: #6c757d;
}

.analysis-details {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e9ecef;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #2c3e50;
}

.detail-value {
  color: #6c757d;
  text-align: right;
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
</style> 