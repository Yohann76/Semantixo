<template>
  <div class="demo-container">
    <h2>🎯 Démonstration des Graphiques d'Analyse des Mots-clés</h2>
    
    <div class="demo-controls">
      <button @click="loadDemoData" class="demo-btn">📊 Charger Données de Démo</button>
      <button @click="clearData" class="demo-btn">🗑️ Effacer Données</button>
    </div>

    <div v-if="demoData" class="demo-info">
      <p>✅ Données de démonstration chargées !</p>
      <p>📝 Score global: {{ demoData.score }}/40</p>
      <p>🔍 Mots-clés analysés: {{ demoData.targetAnalysis?.keywordAnalysis?.length || 0 }}</p>
    </div>

    <!-- Notre composant de graphique -->
    <KeywordAnalysisChart 
      v-if="demoData"
      :analysisData="demoData"
    />

    <div v-else class="demo-placeholder">
      <p>🚀 Cliquez sur "Charger Données de Démo" pour voir les graphiques en action !</p>
      <p>📊 Les graphiques afficheront :</p>
      <ul>
        <li>📈 Densité des mots-clés vs Fréquence optimale</li>
        <li>🎯 Analyse comparative des mots-clés</li>
        <li>📊 Scores SEO détaillés (SOS, DSEO, Pertinence)</li>
        <li>🚀 Recommandations d'amélioration SEO</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import KeywordAnalysisChart from './KeywordAnalysisChart.vue'

const demoData = ref(null)

// Données de démonstration réalistes
const loadDemoData = () => {
  demoData.value = {
    score: 32,
    seoScores: {
      sosScore: 78,
      dseoScore: 85,
      overallRelevance: 82
    },
    targetAnalysis: {
      keywordAnalysis: [
        {
          keyword: 'jardin',
          frequency: 8,
          density: 2.1,
          optimalRange: { min: 6, max: 12 },
          isOptimal: true,
          isOverused: false,
          isUnderused: false
        },
        {
          keyword: 'entretien',
          frequency: 15,
          density: 3.9,
          optimalRange: { min: 4, max: 8 },
          isOptimal: false,
          isOverused: true,
          isUnderused: false
        },
        {
          keyword: 'bénévolat',
          frequency: 2,
          density: 0.5,
          optimalRange: { min: 3, max: 7 },
          isOptimal: false,
          isOverused: false,
          isUnderused: true
        },
        {
          keyword: 'associations',
          frequency: 5,
          density: 1.3,
          optimalRange: { min: 4, max: 9 },
          isOptimal: true,
          isOverused: false,
          isUnderused: false
        },
        {
          keyword: 'services',
          frequency: 6,
          density: 1.6,
          optimalRange: { min: 5, max: 10 },
          isOptimal: true,
          isOverused: false,
          isUnderused: false
        }
      ],
      missingKeywords: ['aide', 'gratuit', 'particulier', 'local', 'programme'],
      overusedKeywords: ['entretien'],
      totalWords: 380
    },
    visualizationData: {
      densityChart: [
        { keyword: 'jardin', density: 2.1, optimalDensity: 2.4 },
        { keyword: 'entretien', density: 3.9, optimalDensity: 1.6 },
        { keyword: 'bénévolat', density: 0.5, optimalDensity: 1.3 },
        { keyword: 'associations', density: 1.3, optimalDensity: 1.7 },
        { keyword: 'services', density: 1.6, optimalDensity: 2.0 }
      ],
      keywordComparison: [
        { keyword: 'jardin', targetFrequency: 8, actualFrequency: 8, optimalRange: { min: 6, max: 12 } },
        { keyword: 'entretien', targetFrequency: 15, actualFrequency: 15, optimalRange: { min: 4, max: 8 } },
        { keyword: 'bénévolat', targetFrequency: 2, actualFrequency: 2, optimalRange: { min: 3, max: 7 } },
        { keyword: 'associations', targetFrequency: 5, actualFrequency: 5, optimalRange: { min: 4, max: 9 } },
        { keyword: 'services', targetFrequency: 6, actualFrequency: 6, optimalRange: { min: 5, max: 10 } }
      ],
      summary: {
        totalKeywords: 5,
        optimalKeywords: 3,
        overusedKeywords: 1,
        missingKeywords: 5
      }
    }
  }
}

const clearData = () => {
  demoData.value = null
}
</script>

<style scoped>
.demo-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-container h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
}

.demo-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.demo-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.demo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}

.demo-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  text-align: center;
}

.demo-info p {
  margin: 8px 0;
  font-size: 16px;
}

.demo-placeholder {
  background: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: #6c757d;
}

.demo-placeholder p {
  margin: 15px 0;
  font-size: 18px;
}

.demo-placeholder ul {
  text-align: left;
  max-width: 500px;
  margin: 20px auto;
  padding-left: 20px;
}

.demo-placeholder li {
  margin: 10px 0;
  font-size: 16px;
  color: #495057;
}
</style>
