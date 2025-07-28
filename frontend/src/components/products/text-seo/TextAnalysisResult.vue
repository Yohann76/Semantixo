<template>
  <div class="text-analysis-result-container">
    <div class="result-header">
      <h2 class="result-title">Résultats de l'analyse SEO</h2>
      <div class="result-meta">
        <span class="result-date">{{ formatDate(analysis.timestamp || analysis.createdAt) }}</span>
        <div class="score-section">
          <span class="result-score" :class="getScoreClass(analysis.seoScore)">
            Score SEO: {{ analysis.seoScore || '0' }}/100
          </span>
          <span v-if="analysis.notation" class="result-notation" :class="getNotationClass(analysis.notation)">
            {{ analysis.notation }}
          </span>
        </div>
      </div>
    </div>

    <div class="result-content">
      <!-- Informations générales -->
      <div class="result-section">
        <h3 class="section-title">📊 Informations générales</h3>
        <div class="info-grid">
          <div class="info-item">
            <div class="info-label">Mots-clés ciblés</div>
            <div class="info-value">
              <span v-if="analysis.keywords && analysis.keywords.length > 0">
                {{ analysis.keywords.join(', ') }}
              </span>
              <span v-else class="no-data">Aucun mot-clé spécifié</span>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">Version du barème</div>
            <div class="info-value">{{ analysis.baremeResults?.bareme_version || '1.0.0' }}</div>
          </div>
        </div>
      </div>

      <!-- Statistiques de base -->
      <div class="result-section">
        <h3 class="section-title">📈 Statistiques de base</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-icon">📝</div>
            <div class="stat-info">
              <div class="stat-label">Mots</div>
              <div class="stat-value">{{ analysis.metrics?.wordCount || analysis.wordCount || 0 }}</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🔤</div>
            <div class="stat-info">
              <div class="stat-label">Caractères</div>
              <div class="stat-value">{{ analysis.metrics?.characterCount || analysis.characterCount || 0 }}</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">📄</div>
            <div class="stat-info">
              <div class="stat-label">Paragraphes</div>
              <div class="stat-value">{{ analysis.metrics?.paragraphCount || 0 }}</div>
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

      <!-- Détail du barème -->
      <div v-if="analysis.baremeResults" class="result-section">
        <h3 class="section-title">🎯 Détail du barème</h3>
        <div class="bareme-details">
          <div class="bareme-criteres">
            <div 
              v-for="(critere, key) in analysis.baremeResults.criteres" 
              :key="key"
              class="critere-item"
            >
              <div class="critere-header">
                <h4 class="critere-title">{{ getCritereTitle(key) }}</h4>
                <div class="critere-score">
                  <span class="score-value">{{ critere.score || 0 }}</span>
                  <span class="score-max">/{{ getCritereMaxScore(key) }}</span>
                </div>
              </div>
              
              <div class="critere-progress">
                <div 
                  class="progress-bar"
                  :style="{ width: getProgressPercentage(critere.score, getCritereMaxScore(key)) + '%' }"
                  :class="getProgressClass(critere.score, getCritereMaxScore(key))"
                ></div>
              </div>

              <!-- Sous-critères -->
              <div v-if="critere.sous_criteres" class="sous-criteres">
                <div 
                  v-for="(sousCritere, sousKey) in critere.sous_criteres" 
                  :key="sousKey"
                  class="sous-critere-item"
                >
                  <div class="sous-critere-info">
                    <span class="sous-critere-name">{{ getSousCritereTitle(sousKey) }}</span>
                    <span class="sous-critere-score">{{ sousCritere.points || 0 }}/{{ sousCritere.max_points || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Analyse des mots-clés thématiques -->
      <div v-if="analysis.baremeResults?.criteres?.utilisation_champ_lexical?.details" class="result-section">
        <h3 class="section-title">🔍 Analyse des mots-clés thématiques</h3>
        <div class="keywords-analysis">
          <div class="thematic-info">
            <h4>Thématique détectée : <span class="thematic-name">{{ analysis.baremeResults.criteres.utilisation_champ_lexical.details.thematique_detectee }}</span></h4>
          </div>
          
          <!-- Mots-clés thématiques -->
          <div class="keywords-section">
            <h4>📝 Mots-clés thématiques détectés (5-6 mots)</h4>
            <div class="keywords-grid">
              <div 
                v-for="motCle in analysis.baremeResults.criteres.utilisation_champ_lexical.details.mots_cles_thematiques" 
                :key="motCle.mot"
                class="keyword-item"
                :class="{ 'present': motCle.present, 'absent': !motCle.present }"
              >
                <span class="keyword-text">{{ motCle.mot }}</span>
                <span class="keyword-occurrences">{{ motCle.occurrences }} occurrence(s)</span>
              </div>
            </div>
          </div>
          
          <!-- Synonymes importants -->
          <div class="synonyms-section">
            <h4>🔄 Synonymes importants (5-6 mots)</h4>
            <div class="keywords-grid">
              <div 
                v-for="synonyme in analysis.baremeResults.criteres.utilisation_champ_lexical.details.synonymes_importants" 
                :key="synonyme.mot"
                class="keyword-item"
                :class="{ 'present': synonyme.present, 'absent': !synonyme.present }"
              >
                <span class="keyword-text">{{ synonyme.mot }}</span>
                <span class="keyword-occurrences">{{ synonyme.occurrences }} occurrence(s)</span>
              </div>
            </div>
          </div>
          
          <!-- Score de qualité -->
          <div class="quality-score">
            <h4>📊 Score d'utilisation du champ lexical</h4>
            <div class="score-breakdown">
              <div class="score-item">
                <span class="score-label">Déclinaison des mots-clés :</span>
                <span class="score-value">{{ analysis.baremeResults.criteres.utilisation_champ_lexical.sous_criteres?.declinaison_mots_cles?.points || 0 }}/30</span>
              </div>
              <div class="score-item">
                <span class="score-label">Correspondance parfaite :</span>
                <span class="score-value">{{ analysis.baremeResults.criteres.utilisation_champ_lexical.sous_criteres?.correspondance_parfaite?.points || 0 }}/30</span>
              </div>
              <div class="score-item total">
                <span class="score-label">Total champ lexical :</span>
                <span class="score-value">{{ analysis.baremeResults.criteres.utilisation_champ_lexical.score || 0 }}/60</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommandations -->
      <div v-if="analysis.baremeResults?.recommandations && analysis.baremeResults.recommandations.length > 0" class="result-section">
        <h3 class="section-title">💡 Recommandations d'amélioration</h3>
        <div class="recommendations-list">
          <div 
            v-for="(recommandation, index) in analysis.baremeResults.recommandations" 
            :key="index"
            class="recommendation-item"
          >
            <div class="recommendation-header">
              <h4 class="recommendation-critere">{{ recommandation.critere }}</h4>
              <div class="recommendation-score">
                <span class="current-score">{{ recommandation.score_actuel }}</span>
                <span class="score-separator">/</span>
                <span class="max-score">{{ recommandation.score_maximum }}</span>
                <span class="percentage">({{ recommandation.pourcentage }}%)</span>
              </div>
            </div>
            <p class="recommendation-text">{{ recommandation.recommandation }}</p>
          </div>
        </div>
      </div>

      <!-- Métriques détaillées -->
      <div v-if="analysis.baremeResults?.metriques" class="result-section">
        <h3 class="section-title">📊 Métriques détaillées</h3>
        <div class="metrics-details">
          <div class="metrics-section">
            <h4>Statistiques du texte</h4>
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-label">Nombre de mots :</span>
                <span class="metric-value">{{ analysis.baremeResults.metriques.statistiques_texte?.nombre_mots || 0 }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Nombre de caractères :</span>
                <span class="metric-value">{{ analysis.baremeResults.metriques.statistiques_texte?.nombre_caracteres || 0 }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Nombre de paragraphes :</span>
                <span class="metric-value">{{ analysis.baremeResults.metriques.statistiques_texte?.nombre_paragraphes || 0 }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Longueur moyenne paragraphe :</span>
                <span class="metric-value">{{ analysis.baremeResults.metriques.statistiques_texte?.longueur_moyenne_paragraphe || 0 }} mots</span>
              </div>
            </div>
          </div>

          <div class="metrics-section">
            <h4>Performance globale</h4>
            <div class="metrics-grid">
              <div class="metric-item">
                <span class="metric-label">Score moyen :</span>
                <span class="metric-value">{{ analysis.baremeResults.metriques.performance_globale?.score_moyen || 0 }}%</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Critères excellents :</span>
                <span class="metric-value">{{ analysis.baremeResults.metriques.performance_globale?.criteres_excellents || 0 }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">Critères à améliorer :</span>
                <span class="metric-value">{{ analysis.baremeResults.metriques.performance_globale?.criteres_a_ameliorer || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Texte analysé -->
      <div class="result-section">
        <h3 class="section-title">📄 Texte analysé</h3>
        <div class="text-content">
          {{ analysis.text }}
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
  if (score >= 85) return 'score-excellent'
  if (score >= 70) return 'score-good'
  if (score >= 55) return 'score-average'
  return 'score-poor'
}

// Obtenir la classe CSS pour la notation
const getNotationClass = (notation) => {
  switch (notation) {
    case 'Excellent': return 'notation-excellent'
    case 'Très bon': return 'notation-good'
    case 'Bon': return 'notation-average'
    case 'Moyen': return 'notation-poor'
    case 'Insuffisant': return 'notation-poor'
    default: return 'notation-unknown'
  }
}

// Obtenir le titre d'un critère
const getCritereTitle = (key) => {
  const titres = {
    'utilisation_champ_lexical': '1. Utilisation des mots clé et de leurs champ lexical',
    'position_implementation': '2. Position et Implémentation des mots clefs',
    'longueur_suffisante': '3. Longueur suffisante',
    'structure_lisibilite': '4. Structure et lisibilité',
    'contenu_duplique': '5. Contenu dupliqué'
  }
  return titres[key] || key
}

// Obtenir le score maximum d'un critère
const getCritereMaxScore = (key) => {
  const scores = {
    'utilisation_champ_lexical': 60,
    'position_implementation': 10,
    'longueur_suffisante': 5,
    'structure_lisibilite': 10,
    'contenu_duplique': 15
  }
  return scores[key] || 0
}

// Obtenir le titre d'un sous-critère
const getSousCritereTitle = (key) => {
  const titres = {
    'declinaison_mots_cles': 'Décliner les mots clés en plusieurs champ lexical',
    'correspondance_parfaite': 'Correspondance parfaite au mots clé et à l\'intention de recherche',
    'mots_cles_premier_paragraphe': 'Mots clé dans le premier paragraphe',
    'mots_cles_debut_paragraphes': 'Mots clé dans les début de paragraphe',
    'echelle_longueur': 'Échelle de longueur (0 pts si <50 mots, 1 pt si +50, jusqu\'à 2000)',
    'densite_mots': 'Vérifier densité des mots',
    'decoupe_paragraphes': 'Vérifier la découpe en plusieurs paragraphe (avec une moyenne de mots par paragraphe)',
    'pourcentage_duplication': 'Pourcentage de duplication du contenu'
  }
  return titres[key] || key
}

// Calculer le pourcentage de progression
const getProgressPercentage = (score, maxScore) => {
  if (!maxScore) return 0
  return Math.round((score / maxScore) * 100)
}

// Obtenir la classe CSS pour la barre de progression
const getProgressClass = (score, maxScore) => {
  const percentage = getProgressPercentage(score, maxScore)
  if (percentage >= 80) return 'progress-excellent'
  if (percentage >= 60) return 'progress-good'
  if (percentage >= 40) return 'progress-average'
  return 'progress-poor'
}
</script>

<style scoped>
.text-analysis-result-container {
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
  margin: 0 0 15px 0;
}

.result-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  opacity: 0.9;
}

.score-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.result-score {
  font-weight: bold;
  padding: 6px 15px;
  border-radius: 20px;
  background: rgba(255,255,255,0.2);
  font-size: 1.1rem;
}

.result-notation {
  font-weight: bold;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
  text-align: center;
}

.score-excellent, .notation-excellent {
  background: rgba(40, 167, 69, 0.8) !important;
}

.score-good, .notation-good {
  background: rgba(23, 162, 184, 0.8) !important;
}

.score-average, .notation-average {
  background: rgba(255, 193, 7, 0.8) !important;
}

.score-poor, .notation-poor {
  background: rgba(220, 53, 69, 0.8) !important;
}

.notation-unknown {
  background: rgba(108, 117, 125, 0.8) !important;
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
  margin: 0 0 20px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e9ecef;
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
  border: 1px solid #e9ecef;
}

.info-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 5px;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.no-data {
  color: #6c757d;
  font-style: italic;
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

.bareme-details {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.bareme-criteres {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.critere-item {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.critere-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.critere-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.critere-score {
  display: flex;
  align-items: center;
  gap: 5px;
}

.score-value {
  font-weight: bold;
  color: #667eea;
  font-size: 1.1rem;
}

.score-max {
  color: #6c757d;
  font-size: 0.9rem;
}

.critere-progress {
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 15px;
}

.progress-bar {
  height: 100%;
  transition: width 0.3s ease;
}

.progress-excellent {
  background: linear-gradient(90deg, #28a745, #20c997);
}

.progress-good {
  background: linear-gradient(90deg, #17a2b8, #20c997);
}

.progress-average {
  background: linear-gradient(90deg, #ffc107, #fd7e14);
}

.progress-poor {
  background: linear-gradient(90deg, #dc3545, #fd7e14);
}

.sous-criteres {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sous-critere-item {
  background: #f8f9fa;
  padding: 10px 15px;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.sous-critere-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sous-critere-name {
  font-size: 0.9rem;
  color: #495057;
}

.sous-critere-score {
  font-size: 0.8rem;
  color: #6c757d;
  font-weight: 500;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.recommendation-item {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
}

.recommendation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.recommendation-critere {
  font-size: 1rem;
  font-weight: 600;
  color: #856404;
  margin: 0;
}

.recommendation-score {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
}

.current-score {
  color: #dc3545;
  font-weight: bold;
}

.score-separator {
  color: #6c757d;
}

.max-score {
  color: #28a745;
  font-weight: bold;
}

.percentage {
  color: #6c757d;
  font-size: 0.8rem;
}

.recommendation-text {
  color: #856404;
  margin: 0;
  line-height: 1.5;
}

.metrics-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.metrics-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.metrics-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 15px 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.metric-item:last-child {
  border-bottom: none;
}

.metric-label {
  font-size: 0.9rem;
  color: #6c757d;
}

.metric-value {
  font-weight: 600;
  color: #2c3e50;
}

.text-content {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #495057;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
}

/* Scrollbar personnalisée */
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

/* Analyse des mots-clés thématiques */
.keywords-analysis {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e9ecef;
}

.thematic-info {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
}

.thematic-info h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.thematic-name {
  color: #667eea;
  font-weight: bold;
  text-transform: capitalize;
}

.keywords-section, .synonyms-section {
  margin-bottom: 25px;
}

.keywords-section h4, .synonyms-section h4 {
  margin: 0 0 15px 0;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.keywords-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.keyword-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-radius: 6px;
  border: 2px solid;
  transition: all 0.3s ease;
}

.keyword-item.present {
  background: rgba(40, 167, 69, 0.1);
  border-color: #28a745;
  color: #155724;
}

.keyword-item.absent {
  background: rgba(220, 53, 69, 0.1);
  border-color: #dc3545;
  color: #721c24;
}

.keyword-text {
  font-weight: 600;
  text-transform: capitalize;
}

.keyword-occurrences {
  font-size: 0.8rem;
  opacity: 0.8;
  font-weight: 500;
}

.quality-score {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #e9ecef;
}

.quality-score h4 {
  margin: 0 0 15px 0;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.score-breakdown {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e9ecef;
}

.score-item:last-child {
  border-bottom: none;
}

.score-item.total {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.1rem;
  padding-top: 10px;
  border-top: 2px solid #667eea;
}

.score-label {
  color: #6c757d;
  font-weight: 500;
}

.score-value {
  font-weight: bold;
  color: #667eea;
}

/* Responsive */
@media (max-width: 768px) {
  .result-meta {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .score-section {
    align-items: flex-start;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .keywords-grid {
    grid-template-columns: 1fr;
  }
  
  .score-breakdown {
    gap: 8px;
  }
}
</style> 