<template>
  <div class="keyword-analysis-chart">
    <!-- MODE DÉBOGAGE TEMPORAIRE -->
    <div class="debug-section" v-if="debugMode">
      <h4>🔍 DÉBOGAGE - Données reçues</h4>
      <div class="debug-info">
        <p><strong>Données complètes :</strong></p>
        <pre>{{ JSON.stringify(analysisData, null, 2) }}</pre>
        
        <p><strong>Structure des données :</strong></p>
        <ul>
          <li>seoScores: {{ analysisData?.metrics?.seoScores ? '✅ Présent' : '❌ Manquant' }}</li>
          <li>visualizationData: {{ analysisData?.metrics?.visualizationData ? '✅ Présent' : '❌ Manquant' }}</li>
          <li>densityChart: {{ analysisData?.metrics?.visualizationData?.densityChart?.length || 0 }} éléments</li>
          <li>keywordComparison: {{ analysisData?.metrics?.visualizationData?.keywordComparison?.length || 0 }} éléments</li>
          <li>targetAnalysis: {{ analysisData?.rawData?.analysis?.targetAnalysis ? '✅ Présent' : '❌ Manquant' }}</li>
          <li>lexicalAnalysis.topKeywords: {{ analysisData?.rawData?.analysis?.lexicalAnalysis?.topKeywords?.length || 0 }} mots-clés SERP</li>
        </ul>
        
        <p><strong>Mots-clés SERP détectés :</strong></p>
        <div v-if="analysisData?.rawData?.analysis?.lexicalAnalysis?.topKeywords?.length > 0">
          <div v-for="item in analysisData.rawData.analysis.lexicalAnalysis.topKeywords.slice(0, 10)" :key="item.keyword" class="keyword-debug">
            <span class="keyword-name">{{ item.keyword }}</span>
            <span class="keyword-frequency">Fréquence SERP: {{ item.frequency }}</span>
          </div>
        </div>
        <div v-else>
          <p class="no-data">❌ Aucun mot-clé SERP trouvé</p>
        </div>
        
        <p><strong>Mots-clés de votre texte :</strong></p>
        <div v-if="analysisData?.rawData?.analysis?.targetAnalysis?.targetWordFrequencies">
          <div v-for="keyword in filteredTargetKeywords" :key="keyword" class="keyword-debug">
            <span class="keyword-name">{{ keyword }}</span>
            <span class="keyword-frequency">Fréquence: {{ analysisData.rawData.analysis.targetAnalysis.targetWordFrequencies[keyword] }}</span>
          </div>
        </div>
        <div v-else>
          <p class="no-data">❌ Aucune fréquence de mot-clé trouvée</p>
        </div>
      </div>
      
      <button @click="debugMode = false" class="debug-toggle">Masquer le débogage</button>
    </div>
    
    <!-- BOUTON DÉBOGAGE -->
    <div class="debug-toggle-section">
      <button @click="debugMode = !debugMode" class="debug-toggle">
        {{ debugMode ? '🔒' : '🔍' }} Mode Débogage
      </button>
    </div>

    <div class="chart-container">
      <!-- Graphique de densité des mots-clés -->
      <div class="chart-section">
        <h4>📊 Densité des mots-clés vs Fréquence optimale</h4>
        <div class="chart-wrapper">
          <canvas ref="densityChart" width="400" height="200"></canvas>
        </div>
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color optimal"></span>
            <span>Fréquence optimale</span>
          </div>
          <div class="legend-item">
            <span class="legend-color actual"></span>
            <span>Votre fréquence</span>
          </div>
        </div>
      </div>

      <!-- Graphique de comparaison des mots-clés -->
      <div class="chart-section">
        <h4>🎯 Analyse comparative des mots-clés</h4>
        <div class="chart-wrapper">
          <canvas ref="comparisonChart" width="400" height="200"></canvas>
        </div>
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color target"></span>
            <span>Plage optimale</span>
          </div>
          <div class="legend-item">
            <span class="legend-color current"></span>
            <span>Votre utilisation</span>
          </div>
        </div>
      </div>

      <!-- Résumé des scores SEO -->
      <div class="seo-scores-summary">
        <h4>📈 Scores SEO détaillés</h4>
        <div class="scores-grid">
          <div class="score-card">
            <div class="score-value">{{ seoScores.sosScore }}/100</div>
            <div class="score-label">SOS Score</div>
            <div class="score-description">Proximité avec la fréquence optimale</div>
          </div>
          <div class="score-card">
            <div class="score-value">{{ seoScores.dseoScore }}/100</div>
            <div class="score-label">DSEO Score</div>
            <div class="score-description">Équilibre d'utilisation</div>
          </div>
          <div class="score-card">
            <div class="score-value">{{ seoScores.overallRelevance }}/100</div>
            <div class="score-label">Pertinence globale</div>
            <div class="score-description">Score de qualité SEO</div>
          </div>
        </div>
      </div>

      <!-- Recommandations d'amélioration -->
      <div class="improvement-recommendations">
        <h4>🚀 Recommandations d'amélioration SEO</h4>
        <div class="recommendations-grid">
          <div class="recommendation-category">
            <h5>📝 Mots-clés à ajouter</h5>
            <div class="keyword-list">
              <span 
                v-for="keyword in missingKeywords.slice(0, 5)" 
                :key="keyword"
                class="keyword-tag missing"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
          <div class="recommendation-category">
            <h5>⚠️ Mots-clés sur-utilisés</h5>
            <div class="keyword-list">
              <span 
                v-for="keyword in overusedKeywords.slice(0, 5)" 
                :key="keyword"
                class="keyword-tag overused"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
          <div class="recommendation-category">
            <h5>✅ Mots-clés optimaux</h5>
            <div class="keyword-list">
              <span 
                v-for="keyword in optimalKeywords.slice(0, 5)" 
                :key="keyword"
                class="keyword-tag optimal"
              >
                {{ keyword }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import Chart from 'chart.js/auto'

// Définir les props avec defineProps
const props = defineProps({
  analysisData: {
    type: Object,
    required: true
  }
})

const densityChart = ref(null)
const comparisonChart = ref(null)
let densityChartInstance = null
let comparisonChartInstance = null
const debugMode = ref(false)

// Computed property pour filtrer les mots-clés cibles
const filteredTargetKeywords = computed(() => {
  if (!props.analysisData?.rawData?.analysis?.targetAnalysis?.targetWordFrequencies) {
    return []
  }
  
  const frequencies = props.analysisData.rawData.analysis.targetAnalysis.targetWordFrequencies
  return Object.keys(frequencies)
    .filter(keyword => frequencies[keyword] > 0)
    .slice(0, 10) // Limiter à 10 mots-clés pour l'affichage
})

// Extraire les données des props
const seoScores = ref({
  sosScore: 0,
  dseoScore: 0,
  overallRelevance: 0
})
const missingKeywords = ref([])
const overusedKeywords = ref([])
const optimalKeywords = ref([])
const densityData = ref([])
const comparisonData = ref([])

// Données de démonstration par défaut si aucune donnée n'est disponible
const getDefaultData = () => {
  return {
    densityChart: [
      { keyword: 'jardin', density: 2.1, optimalDensity: 2.4 },
      { keyword: 'entretien', density: 3.9, optimalDensity: 1.6 },
      { keyword: 'bénévolat', density: 0.5, optimalDensity: 1.3 },
      { keyword: 'associations', density: 1.3, optimalDensity: 1.7 },
      { keyword: 'services', density: 1.6, optimalDensity: 2.0 }
    ],
    keywordComparison: [
      { keyword: 'jardin', actualFrequency: 8, optimalRange: { min: 6, max: 12 } },
      { keyword: 'entretien', actualFrequency: 15, optimalRange: { min: 4, max: 8 } },
      { keyword: 'bénévolat', actualFrequency: 2, optimalRange: { min: 3, max: 7 } },
      { keyword: 'associations', actualFrequency: 5, optimalRange: { min: 4, max: 9 } },
      { keyword: 'services', actualFrequency: 6, optimalRange: { min: 5, max: 10 } }
    ]
  }
}

// Extraire et traiter les données
const extractData = () => {
  if (!props.analysisData) {
    console.log('⚠️ [KeywordAnalysisChart] Aucune donnée d\'analyse reçue')
    return
  }

  try {
    console.log('🔍 [KeywordAnalysisChart] Données reçues:', props.analysisData)
    
    // Scores SEO - chercher dans metrics.seoScores
    if (props.analysisData.metrics?.seoScores) {
      seoScores.value = props.analysisData.metrics.seoScores
      console.log('✅ [KeywordAnalysisChart] Scores SEO trouvés:', seoScores.value)
    }

    // Extraire les vrais mots-clés de la SERP depuis rawData.analysis.lexicalAnalysis.topKeywords
    const serpKeywords = props.analysisData.rawData?.analysis?.lexicalAnalysis?.topKeywords || []
    const targetWordFrequencies = props.analysisData.rawData?.analysis?.targetAnalysis?.targetWordFrequencies || {}
    
    console.log('🔍 [KeywordAnalysisChart] Mots-clés SERP trouvés:', serpKeywords)
    console.log('🔍 [KeywordAnalysisChart] Fréquences cibles trouvées:', targetWordFrequencies)
    
    // DEBUG: Vérifier la structure complète
    console.log('🔍 [KeywordAnalysisChart] Structure complète rawData:', props.analysisData.rawData)
    console.log('🔍 [KeywordAnalysisChart] lexicalAnalysis:', props.analysisData.rawData?.analysis?.lexicalAnalysis)
    console.log('🔍 [KeywordAnalysisChart] topKeywords brut:', props.analysisData.rawData?.analysis?.lexicalAnalysis?.topKeywords)
    console.log('🔍 [KeywordAnalysisChart] Type topKeywords:', typeof props.analysisData.rawData?.analysis?.lexicalAnalysis?.topKeywords)
    console.log('🔍 [KeywordAnalysisChart] Longueur topKeywords:', props.analysisData.rawData?.analysis?.lexicalAnalysis?.topKeywords?.length)
    
    if (serpKeywords.length > 0) {
      console.log('✅ [KeywordAnalysisChart] Mots-clés SERP trouvés:', serpKeywords)
      
      // Créer des données de densité basées sur les vrais mots-clés
      const densityDataFromSerp = serpKeywords.slice(0, 10).map(item => {
        const keyword = item.keyword
        const serpFrequency = item.frequency
        const targetFrequency = targetWordFrequencies[keyword] || 0
        const totalWordsInTargetText = props.analysisData.rawData?.text?.split(/\s+/).filter(word => word.length > 0).length || 1
        const averageWordCountSerp = props.analysisData.rawData?.analysis?.serpAnalysis?.averageWordCount || 1
        
        const targetDensity = targetFrequency > 0 ? (targetFrequency / totalWordsInTargetText) * 100 : 0
        const optimalDensity = (serpFrequency / averageWordCountSerp) * 100
        
        return {
          keyword,
          density: targetDensity,
          optimalDensity: optimalDensity
        }
      })
      
      // Créer des données de comparaison
      const comparisonDataFromSerp = serpKeywords.slice(0, 10).map(item => {
        const keyword = item.keyword
        const serpFrequency = item.frequency
        const targetFrequency = targetWordFrequencies[keyword] || 0
        
        return {
          keyword,
          actualFrequency: targetFrequency,
          optimalRange: {
            min: Math.max(0, serpFrequency - 1),
            max: serpFrequency + 1
          }
        }
      })
      
      console.log('DEBUG: densityDataFromSerp before assignment:', densityDataFromSerp)
      console.log('DEBUG: comparisonDataFromSerp before assignment:', comparisonDataFromSerp)
      
      // Mettre à jour les données
      densityData.value = densityDataFromSerp
      comparisonData.value = comparisonDataFromSerp
      
      console.log('✅ [KeywordAnalysisChart] Données de densité créées:', densityDataFromSerp)
      console.log('✅ [KeywordAnalysisChart] Données de comparaison créées:', comparisonDataFromSerp)
    } else {
      console.log('⚠️ [KeywordAnalysisChart] Aucun mot-clé SERP trouvé, utilisant le fallback.')
      // Fallback : utiliser les données de visualisation existantes
      if (props.analysisData.metrics?.visualizationData) {
        const viz = props.analysisData.metrics.visualizationData
        
        if (viz.densityChart && viz.densityChart.length > 0) {
          densityData.value = viz.densityChart
          console.log('✅ [KeywordAnalysisChart] Données de densité trouvées:', viz.densityChart)
        }
        
        if (viz.keywordComparison && viz.keywordComparison.length > 0) {
          comparisonData.value = viz.keywordComparison
          console.log('✅ [KeywordAnalysisChart] Données de comparaison trouvées:', viz.keywordComparison)
        }
      }
    }
    
    // Extraire les mots-clés manquants et optimaux
    if (props.analysisData.rawData?.analysis?.targetAnalysis) {
      missingKeywords.value = props.analysisData.rawData.analysis.targetAnalysis.missingKeywords || []
      overusedKeywords.value = props.analysisData.rawData.analysis.targetAnalysis.overusedKeywords || []
      
      // Créer une liste de mots-clés optimaux basée sur la SERP
      const optimalSerpKeywords = serpKeywords
        .filter(item => targetWordFrequencies[item.keyword] > 0)
        .slice(0, 5)
        .map(item => item.keyword)
      
      optimalKeywords.value = optimalSerpKeywords
      
      console.log('✅ [KeywordAnalysisChart] Mots-clés manquants:', missingKeywords.value)
      console.log('✅ [KeywordAnalysisChart] Mots-clés optimaux:', optimalKeywords.value)
    }

    // Si pas de données, utiliser les données par défaut
    if (densityData.value.length === 0) {
      console.log('⚠️ [KeywordAnalysisChart] Utilisation des données par défaut')
      const defaultData = getDefaultData()
      densityData.value = defaultData.densityChart
      comparisonData.value = defaultData.keywordComparison
    }

    console.log('📊 [KeywordAnalysisChart] Données extraites:', {
      densityData: densityData.value,
      comparisonData: comparisonData.value,
      seoScores: seoScores.value,
      missingKeywords: missingKeywords.value,
      optimalKeywords: optimalKeywords.value
    })

  } catch (error) {
    console.error('❌ [KeywordAnalysisChart] Erreur lors de l\'extraction des données:', error)
    // Utiliser les données par défaut en cas d'erreur
    const defaultData = getDefaultData()
    densityData.value = defaultData.densityChart
    comparisonData.value = defaultData.keywordComparison
  }
}

// Créer le graphique de densité
const createDensityChart = () => {
  if (!densityChart.value) {
    console.log('⚠️ [KeywordAnalysisChart] Canvas densityChart non trouvé')
    return
  }

  if (densityData.value.length === 0) {
    console.log('⚠️ [KeywordAnalysisChart] Pas de données pour le graphique de densité')
    return
  }

  try {
    const ctx = densityChart.value.getContext('2d')
    
    if (densityChartInstance) {
      densityChartInstance.destroy()
    }

    console.log('📊 [KeywordAnalysisChart] Création du graphique de densité avec:', densityData.value)

    densityChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: densityData.value.map(item => item.keyword),
        datasets: [
          {
            label: 'Votre densité (%)',
            data: densityData.value.map(item => item.density),
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          },
          {
            label: 'Densité optimale (%)',
            data: densityData.value.map(item => item.optimalDensity),
            backgroundColor: 'rgba(75, 192, 192, 0.8)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Comparaison densité actuelle vs optimale'
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Densité (%)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mots-clés'
            }
          }
        }
      }
    })

    console.log('✅ [KeywordAnalysisChart] Graphique de densité créé avec succès')
  } catch (error) {
    console.error('❌ [KeywordAnalysisChart] Erreur lors de la création du graphique de densité:', error)
  }
}

// Créer le graphique de comparaison
const createComparisonChart = () => {
  if (!comparisonChart.value) {
    console.log('⚠️ [KeywordAnalysisChart] Canvas comparisonChart non trouvé')
    return
  }

  if (comparisonData.value.length === 0) {
    console.log('⚠️ [KeywordAnalysisChart] Pas de données pour le graphique de comparaison')
    return
  }

  try {
    const ctx = comparisonChart.value.getContext('2d')
    
    if (comparisonChartInstance) {
      comparisonChartInstance.destroy()
    }

    console.log('📊 [KeywordAnalysisChart] Création du graphique de comparaison avec:', comparisonData.value)

    comparisonChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: comparisonData.value.map(item => item.keyword),
        datasets: [
          {
            label: 'Votre fréquence',
            data: comparisonData.value.map(item => item.actualFrequency),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.1,
            pointRadius: 4
          },
          {
            label: 'Plage optimale (min)',
            data: comparisonData.value.map(item => item.optimalRange.min),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderDash: [5, 5],
            tension: 0.1,
            pointRadius: 2
          },
          {
            label: 'Plage optimale (max)',
            data: comparisonData.value.map(item => item.optimalRange.max),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderDash: [5, 5],
            tension: 0.1,
            pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Fréquence des mots-clés vs Plages optimales'
          },
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Fréquence'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Mots-clés'
            }
          }
        }
      }
    })

    console.log('✅ [KeywordAnalysisChart] Graphique de comparaison créé avec succès')
  } catch (error) {
    console.error('❌ [KeywordAnalysisChart] Erreur lors de la création du graphique de comparaison:', error)
  }
}

// Initialiser les graphiques
const initCharts = async () => {
  console.log('🔄 [KeywordAnalysisChart] Initialisation des graphiques...')
  
  try {
    await nextTick()
    console.log('⏳ [KeywordAnalysisChart] nextTick terminé')
    
    // Attendre un peu plus pour s'assurer que les canvas sont rendus
    setTimeout(() => {
      createDensityChart()
      createComparisonChart()
    }, 100)
    
  } catch (error) {
    console.error('❌ [KeywordAnalysisChart] Erreur lors de l\'initialisation:', error)
  }
}

// Surveiller les changements de données
watch(() => props.analysisData, () => {
  console.log('👀 [KeywordAnalysisChart] Changement de données détecté')
  extractData()
  initCharts()
}, { deep: true })

onMounted(() => {
  console.log('🚀 [KeywordAnalysisChart] Composant monté')
  extractData()
  initCharts()
})
</script>

<style scoped>
.keyword-analysis-chart {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 20px 0;
}

/* Styles pour le mode débogage */
.debug-section {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.debug-section h4 {
  color: #856404;
  margin: 0 0 15px 0;
  font-size: 16px;
}

.debug-info {
  background: white;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 15px;
}

.debug-info pre {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  font-size: 12px;
  max-height: 300px;
  overflow: auto;
}

.debug-info ul {
  margin: 10px 0;
  padding-left: 20px;
}

.debug-info li {
  margin: 5px 0;
  font-size: 14px;
}

.keyword-debug {
  display: flex;
  gap: 15px;
  margin: 5px 0;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
}

.keyword-name {
  font-weight: bold;
  color: #495057;
}

.keyword-density, .keyword-optimal {
  color: #6c757d;
}

.no-data {
  color: #dc3545;
  font-style: italic;
}

.debug-toggle-section {
  text-align: center;
  margin-bottom: 20px;
}

.debug-toggle {
  background: #6c757d;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.debug-toggle:hover {
  background: #5a6268;
}

.chart-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chart-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-section h4 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.chart-wrapper {
  position: relative;
  height: 300px;
  margin-bottom: 15px;
}

.chart-wrapper canvas {
  max-height: 100% !important;
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

.legend-color.optimal { background-color: rgba(75, 192, 192, 0.8); }
.legend-color.actual { background-color: rgba(54, 162, 235, 0.8); }
.legend-color.target { background-color: rgba(75, 192, 192, 0.8); }
.legend-color.current { background-color: rgba(255, 99, 132, 0.8); }

.seo-scores-summary {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.seo-scores-summary h4 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.scores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.score-card {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.score-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.score-label {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  opacity: 0.9;
}

.score-description {
  font-size: 14px;
  opacity: 0.8;
  line-height: 1.4;
}

.improvement-recommendations {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.improvement-recommendations h4 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.recommendation-category h5 {
  margin: 0 0 15px 0;
  color: #34495e;
  font-size: 16px;
  font-weight: 600;
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.keyword-tag {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.keyword-tag.missing {
  background-color: #e74c3c;
}

.keyword-tag.overused {
  background-color: #f39c12;
}

.keyword-tag.optimal {
  background-color: #27ae60;
}

@media (max-width: 768px) {
  .scores-grid {
    grid-template-columns: 1fr;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
  
  .chart-section {
    padding: 15px;
  }
  
  .chart-wrapper {
    height: 250px;
  }
}
</style>
