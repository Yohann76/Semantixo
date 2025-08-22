<template>
  <div class="text-analysis-result-container">
    <div class="result-header">
      <h2 class="result-title">📊 Résultats de l'analyse SEO</h2>
      <div class="result-meta">
        <span class="result-date">{{ formatDate(props.analysis.timestamp || props.analysis.createdAt) }}</span>
        <div class="score-section">
          <span class="result-score" :class="getScoreClass(props.analysis.seoScore)">
            Score SEO: {{ props.analysis.seoScore || '0' }}/100
          </span>
          <span v-if="props.analysis.notation" class="result-notation" :class="getNotationClass(props.analysis.notation)">
            {{ props.analysis.notation }}
          </span>
        </div>
      </div>
    </div>

    <div class="result-content">
      <!-- INFORMATIONS GÉNÉRALES -->
      <div class="result-section">
        <CollapsibleSection title="📋 Informations générales de l'analyse" :defaultCollapsed="false">
          <div class="json-viewer">
            <h4>Métadonnées de la requête :</h4>
            <pre>{{
              JSON.stringify({
                id: props.analysis.id,
                user_id: props.analysis.user_id,
                status: props.analysis.status,
                createdAt: props.analysis.createdAt,
                parameter: props.analysis.parameter,
                seoScore: props.analysis.seoScore,
                notation: props.analysis.notation,
                progress: props.analysis.progress
              }, null, 2)
            }}</pre>
          </div>
        </CollapsibleSection>
      </div>

      <!-- ANALYSE DES MOTS-CLÉS -->
      <div class="result-section">
        <CollapsibleSection title="📊 Analyse des mots-clés" :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids: {{ getJobWeight('keyword-analysis') }} | Status: {{ getJobStatus('keyword-analysis') }}</h4>
            <pre>{{ JSON.stringify(getFullJobData('keyword-analysis'), null, 2) }}</pre>
          </div>
        </CollapsibleSection>
      </div>

      <!-- POSITION DES MOTS-CLÉS -->
      <div class="result-section">
        <CollapsibleSection title="📍 Position des mots-clés" :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids: {{ getJobWeight('keyword-position') }} | Status: {{ getJobStatus('keyword-position') }}</h4>
            <pre>{{ JSON.stringify(getFullJobData('keyword-position'), null, 2) }}</pre>
          </div>
        </CollapsibleSection>
      </div>

      <!-- LONGUEUR DU CONTENU -->
      <div class="result-section">
        <CollapsibleSection title="📏 Longueur du contenu" :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids: {{ getJobWeight('content-length') }} | Status: {{ getJobStatus('content-length') }}</h4>
            <pre>{{ JSON.stringify(getFullJobData('content-length'), null, 2) }}</pre>
          </div>
        </CollapsibleSection>
      </div>

      <!-- LISIBILITÉ -->
      <div class="result-section">
        <CollapsibleSection title="📖 Lisibilité" :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids: {{ getJobWeight('readability') }} | Status: {{ getJobStatus('readability') }}</h4>
            <pre>{{ JSON.stringify(getFullJobData('readability'), null, 2) }}</pre>
          </div>
        </CollapsibleSection>
      </div>

      <!-- ORIGINALITÉ -->
      <div class="result-section">
        <CollapsibleSection title="🔍 Originalité" :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids: {{ getJobWeight('uniqueness') }} | Status: {{ getJobStatus('uniqueness') }}</h4>
            <pre>{{ JSON.stringify(getFullJobData('uniqueness'), null, 2) }}</pre>
          </div>
        </CollapsibleSection>
      </div>

      <!-- DONNÉES COMPLÈTES DE L'ANALYSE -->
      <div class="result-section">
        <CollapsibleSection title="🔧 Données complètes de l'analyse" :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Structure JSON complète reçue du backend :</h4>
            <pre>{{ JSON.stringify(props.analysis, null, 2) }}</pre>
          </div>
        </CollapsibleSection>
      </div>

      <!-- TEXTE ANALYSÉ -->
      <div class="result-section">
        <CollapsibleSection title="📄 Texte analysé" :defaultCollapsed="true">
          <div class="text-content">
            {{ props.analysis.text || props.analysis.parameter?.text || 'Aucun texte trouvé' }}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import CollapsibleSection from '@/components/common/CollapsibleSection.vue'

const props = defineProps({
  analysis: {
    type: Object,
    required: true
  }
})

// Debug : afficher la structure des données reçues
console.log('🔍 [DEBUG] TextAnalysisResult - Data received:', props.analysis)
console.log('🔍 [DEBUG] Jobs structure:', props.analysis?.jobs)
console.log('🔍 [DEBUG] Jobs length:', props.analysis?.jobs?.length || 0)

// Formater la date
const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue'
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

// Récupérer les informations d'un job spécifique
const getJobInfo = (jobName) => {
  if (!props.analysis.jobs) return null
  const job = props.analysis.jobs.find(j => j.name === jobName)
  return job?.info || null
}

// Récupérer le poids d'un job spécifique
const getJobWeight = (jobName) => {
  if (!props.analysis.jobs) return 0
  const job = props.analysis.jobs.find(j => j.name === jobName)
  return job?.poidScoreSEO || 0
}

// Récupérer le status d'un job spécifique
const getJobStatus = (jobName) => {
  if (!props.analysis.jobs) return 'Non trouvé'
  const job = props.analysis.jobs.find(j => j.name === jobName)
  return job?.status || 'Non trouvé'
}

// Récupérer toutes les données d'un job (pour JSON)
const getFullJobData = (jobName) => {
  if (!props.analysis.jobs) return { error: 'Aucun job trouvé' }
  const job = props.analysis.jobs.find(j => j.name === jobName)
  return job || { error: `Job '${jobName}' non trouvé` }
}

// Debug test des fonctions helper
console.log('🔍 [DEBUG] Test getJobInfo("keyword-analysis"):', getJobInfo('keyword-analysis'))
console.log('🔍 [DEBUG] Test getFullJobData("keyword-analysis"):', getFullJobData('keyword-analysis'))
</script>

<style scoped>
.text-analysis-result-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 20px;
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
  margin-bottom: 20px;
}

.result-section:last-child {
  margin-bottom: 0;
}

.json-viewer {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  max-height: 500px;
  overflow: auto;
}

.json-viewer h4 {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 14px;
  font-weight: 600;
}

.json-viewer pre {
  margin: 0;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
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
.json-viewer::-webkit-scrollbar,
.text-content::-webkit-scrollbar {
  width: 6px;
}

.json-viewer::-webkit-scrollbar-track,
.text-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.json-viewer::-webkit-scrollbar-thumb,
.text-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.json-viewer::-webkit-scrollbar-thumb:hover,
.text-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
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
  
  .result-content {
    padding: 20px;
  }
}
</style>