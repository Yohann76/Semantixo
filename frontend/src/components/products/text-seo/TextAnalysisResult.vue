<template>
  <div class="text-analysis-result-container">
    <div class="result-header">
      <h2 class="result-title">📊 Résultats de l'analyse SEO</h2>
              <div class="result-meta">
        <span class="result-date">{{ formatDate(props.analysis.analysis?.createdAt || props.analysis.createdAt) }}</span>
        <div class="score-section">
                     <span class="result-score" :class="getScoreClass(props.analysis.analysis?.scoreSeo || props.analysis.scoreSeo || 0)">
             Score SEO: {{ props.analysis.analysis?.scoreSeo || props.analysis.scoreSeo || '0' }}/100
           </span>
          <span v-if="props.analysis.analysis?.notation || props.analysis.notation" class="result-notation" :class="getNotationClass(props.analysis.analysis?.notation || props.analysis.notation)">
            {{ props.analysis.analysis?.notation || props.analysis.notation }}
          </span>
        </div>
      </div>
    </div>

    <div class="result-content">
      <!-- INFORMATIONS ADMINISTRATEUR -->
      <div class="result-section" v-if="isAdmin">
        <CollapsibleSection title="🔐 Informations administrateur" :defaultCollapsed="false">
          <div class="json-viewer">
            <h4>Métadonnées de la requête :</h4>
            <pre>{{
              JSON.stringify({
                id: props.analysis.analysis?.id || props.analysis.id,
                user_id: props.analysis.analysis?.user_id || props.analysis.user_id,
                status: props.analysis.analysis?.status || props.analysis.status,
                createdAt: props.analysis.analysis?.createdAt || props.analysis.createdAt,
                parameter: props.analysis.analysis?.parameter || props.analysis.parameter,
                scoreSeo: props.analysis.analysis?.scoreSeo || props.analysis.scoreSeo,
                scoreSeoPercentage: props.analysis.analysis?.scoreSeoPercentage || props.analysis.scoreSeoPercentage
              }, null, 2)
            }}</pre>
            
            <h4>Résumé des jobs d'analyse :</h4>
            <div class="jobs-summary">
              <div v-for="job in getJobsSummary()" :key="job.name" class="job-summary-item">
                <span class="job-name">{{ job.name }}</span>
                <span class="job-status" :class="'status-' + job.status">
                  {{ getStatusIcon(job.status) }} {{ getStatusText(job.status) }}
                </span>
                <span class="job-score">{{ job.score || 0 }}/{{ job.poidScoreSEO || 0 }}</span>
              </div>
            </div>
            
            <h4>Données complètes de l'analyse :</h4>
            <pre>{{ JSON.stringify(props.analysis, null, 2) }}</pre>
          </div>
        </CollapsibleSection>
      </div>

      <!-- ANALYSE DES MOTS-CLÉS -->
      <div class="result-section">
        <CollapsibleSection 
          title="📊 Analyse des mots-clés" 
          :score="getJobScore('keyword-analysis')"
          :maxScore="40"
          :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids: {{ getJobWeight('keyword-analysis') }} | Status: {{ getJobStatus('keyword-analysis') }}</h4>
            <div v-if="getJobStatus('keyword-analysis') === 'completed'" class="job-completed">
              <pre>{{ JSON.stringify(getFullJobData('keyword-analysis'), null, 2) }}</pre>
            </div>
            <div v-else-if="getJobStatus('keyword-analysis') === 'active'" class="job-processing">
              <p>🔄 Job en cours de traitement...</p>
              <pre>{{ JSON.stringify(getJobProgress('keyword-analysis'), null, 2) }}</pre>
            </div>
            <div v-else class="job-waiting">
              <p>⏳ Job en attente de démarrage...</p>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <!-- POSITION DES MOTS-CLÉS -->
      <div class="result-section">
        <CollapsibleSection 
          title="📍 Position des mots-clés" 
          :score="getJobScore('keyword-position')"
          :maxScore="15"
          :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids: {{ getJobWeight('keyword-position') }} | Status: {{ getJobStatus('keyword-position') }}</h4>
            <div v-if="getJobStatus('keyword-position') === 'completed'" class="job-completed">
              <pre>{{ JSON.stringify(getFullJobData('keyword-position'), null, 2) }}</pre>
            </div>
            <div v-else-if="getJobStatus('keyword-position') === 'active'" class="job-processing">
              <p>🔄 Job en cours de traitement...</p>
              <pre>{{ JSON.stringify(getJobProgress('keyword-position'), null, 2) }}</pre>
            </div>
            <div v-else class="job-waiting">
              <p>⏳ Job en attente de démarrage...</p>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <!-- LONGUEUR DU CONTENU -->
      <div class="result-section">
        <CollapsibleSection 
          title="📏 Longueur du contenu" 
          :score="getJobScore('content-length')"
          :maxScore="15"
          :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids: {{ getJobWeight('content-length') }} | Status: {{ getJobStatus('content-length') }}</h4>
            <div v-if="getJobStatus('content-length') === 'completed'" class="job-completed">
              <pre>{{ JSON.stringify(getFullJobData('content-length'), null, 2) }}</pre>
            </div>
            <div v-else-if="getJobStatus('content-length') === 'active'" class="job-processing">
              <p>🔄 Job en cours de traitement...</p>
              <pre>{{ JSON.stringify(getJobProgress('content-length'), null, 2) }}</pre>
            </div>
            <div v-else class="job-waiting">
              <p>⏳ Job en attente de démarrage...</p>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <!-- LISIBILITÉ -->
      <div class="result-section">
        <CollapsibleSection 
          title="📖 Lisibilité" 
          :score="getJobScore('readability')"
          :maxScore="15"
          :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids: {{ getJobWeight('readability') }} | Status: {{ getJobStatus('readability') }}</h4>
            <div v-if="getJobStatus('readability') === 'completed'" class="job-completed">
              <pre>{{ JSON.stringify(getFullJobData('readability'), null, 2) }}</pre>
            </div>
            <div v-else-if="getJobStatus('readability') === 'active'" class="job-processing">
              <p>🔄 Job en cours de traitement...</p>
              <pre>{{ JSON.stringify(getJobProgress('readability'), null, 2) }}</pre>
            </div>
            <div v-else class="job-waiting">
              <p>⏳ Job en attente de démarrage...</p>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <!-- ORIGINALITÉ -->
      <div class="result-section">
        <CollapsibleSection 
          title="🔍 Originalité" 
          :score="getJobScore('uniqueness')"
          :maxScore="15"
          :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids: {{ getJobWeight('uniqueness') }} | Status: {{ getJobStatus('uniqueness') }}</h4>
            <div v-if="getJobStatus('uniqueness') === 'completed'" class="job-completed">
              <pre>{{ JSON.stringify(getFullJobData('uniqueness'), null, 2) }}</pre>
            </div>
            <div v-else-if="getJobStatus('uniqueness') === 'active'" class="job-processing">
              <p>🔄 Job en cours de traitement...</p>
              <pre>{{ JSON.stringify(getJobProgress('uniqueness'), null, 2) }}</pre>
            </div>
            <div v-else class="job-waiting">
              <p>⏳ Job en attente de démarrage...</p>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <!-- TEXTE ANALYSÉ -->
      <div class="result-section">
        <CollapsibleSection title="📄 Texte analysé" :defaultCollapsed="false">
          <div class="text-content">
            {{ props.analysis.analysis?.parameter?.text || props.analysis.parameter?.text || props.analysis.text || 'Aucun texte trouvé' }}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import CollapsibleSection from '@/components/common/CollapsibleSection.vue'
import { useAuthStore } from '@/stores/auth.js'

const props = defineProps({
  analysis: {
    type: Object,
    required: true
  }
})

// Store d'authentification
const authStore = useAuthStore()

// Vérifier si l'utilisateur est admin
const isAdmin = computed(() => {
  return authStore.user?.role === 'admin'
})

// Debug : afficher la structure des données reçues
console.log('🔍 [DEBUG] TextAnalysisResult - Data received:', props.analysis)
console.log('🔍 [DEBUG] Jobs structure:', props.analysis?.jobs)
console.log('🔍 [DEBUG] Jobs length:', props.analysis?.jobs?.length || 0)
console.log('🔍 [DEBUG] Score global analysis:', props.analysis?.analysis?.scoreSeo)
console.log('🔍 [DEBUG] Score global direct:', props.analysis?.scoreSeo)

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

// Fonctions adaptées pour la nouvelle architecture
const getJobWeight = (jobName) => {
  // Configuration statique des poids
  const weights = {
    'keyword-analysis': 40,
    'keyword-position': 15,
    'content-length': 15,
    'readability': 15,
    'uniqueness': 15
  }
  return weights[jobName] || 0
}

const getJobStatus = (jobName) => {
  if (props.analysis.jobs && props.analysis.jobs[jobName]) {
    return props.analysis.jobs[jobName].status || 'waiting'
  }
  return 'waiting'
}

const getFullJobData = (jobName) => {
  if (props.analysis.jobs && props.analysis.jobs[jobName]) {
    return props.analysis.jobs[jobName]
  }
  return { 
    error: `Job '${jobName}' non trouvé`,
    status: 'waiting',
    message: 'Ce job n\'a pas encore été traité ou les données détaillées ne sont pas disponibles.'
  }
}

const getJobProgress = (jobName) => {
  if (props.analysis.jobs && props.analysis.jobs[jobName]) {
    const job = props.analysis.jobs[jobName]
    return {
      status: job.status,
      message: job.status === 'active' ? 'Job en cours de traitement...' : 'Job en attente',
      timestamp: job.updatedAt || job.createdAt || new Date().toISOString()
    }
  }
  return {
    status: 'waiting',
    message: 'Job pas encore démarré',
    timestamp: new Date().toISOString()
  }
}

// Méthodes pour le résumé des jobs
const getJobDisplayName = (jobType) => {
  const names = {
    'keyword-analysis': 'Analyse des mots-clés',
    'keyword-position': 'Position des mots-clés',
    'content-length': 'Longueur du contenu',
    'readability': 'Lisibilité',
    'uniqueness': 'Originalité'
  }
  return names[jobType] || jobType
}

const getJobStatusDisplay = (jobType) => {
  const status = getJobStatus(jobType)
  switch (status) {
    case 'completed': return '✅ Terminé'
    case 'active': return '🔄 En cours'
    case 'failed': return '❌ Échoué'
    default: return '⏳ En attente'
  }
}

const getJobStatusClass = (jobType) => {
  const status = getJobStatus(jobType)
  switch (status) {
    case 'completed': return 'job-completed'
    case 'active': return 'job-processing'
    case 'failed': return 'job-failed'
    default: return 'job-waiting'
  }
}

const getJobScore = (jobType) => {
  if (props.analysis.jobs && props.analysis.jobs[jobType]) {
    return props.analysis.jobs[jobType].score || 0
  }
  return 0
}

const getJobScoreDisplay = (jobType) => {
  const score = getJobScore(jobType)
  
  // Score maximum selon le type de job
  const maxScores = {
    'keyword-analysis': 40,    // Score sur 40
    'keyword-position': 15,    // Score sur 15  
    'content-length': 15,      // Score sur 15 (nouveau système)
    'readability': 15,         // Score sur 15
    'uniqueness': 15           // Score sur 15
  }
  
  const maxScore = maxScores[jobType] || 0
  return `${score}/${maxScore}`
}

const getJobsSummary = () => {
  const jobs = [
    { name: 'keyword-analysis', status: getJobStatus('keyword-analysis'), score: getJobScore('keyword-analysis'), poidScoreSEO: 40 },
    { name: 'keyword-position', status: getJobStatus('keyword-position'), score: getJobScore('keyword-position'), poidScoreSEO: 15 },
    { name: 'content-length', status: getJobStatus('content-length'), score: getJobScore('content-length'), poidScoreSEO: 15 },
    { name: 'readability', status: getJobStatus('readability'), score: getJobScore('readability'), poidScoreSEO: 15 },
    { name: 'uniqueness', status: getJobStatus('uniqueness'), score: getJobScore('uniqueness'), poidScoreSEO: 15 }
  ];
  return jobs;
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed': return '✅';
    case 'active': return '🔄';
    case 'failed': return '❌';
    default: return '⏳';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'completed': return 'Terminé';
    case 'active': return 'En cours';
    case 'failed': return 'Échoué';
    default: return 'En attente';
  }
};


// Debug test des fonctions helper
console.log('🔍 [DEBUG] Analysis structure:', props.analysis)
console.log('🔍 [DEBUG] Jobs available:', props.analysis?.jobs ? Object.keys(props.analysis.jobs) : 'No jobs')
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

/* Styles pour les différents états des jobs */
.job-completed {
  border-left: 4px solid #28a745;
  padding-left: 15px;
}

.job-processing {
  border-left: 4px solid #ffc107;
  padding-left: 15px;
}

.job-waiting {
  border-left: 4px solid #6c757d;
  padding-left: 15px;
}

.job-processing p {
  color: #856404;
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}

.job-waiting p {
  color: #6c757d;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 10px;
  font-weight: 600;
}

/* Styles pour le résumé des jobs */
.jobs-summary {
  margin-top: 20px;
}

.job-summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed #eee;
}

.job-summary-item:last-child {
  border-bottom: none;
}

.job-name {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.job-status {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 15px;
  color: white;
}

.job-status.status-completed {
  background-color: #28a745;
}

.job-status.status-active {
  background-color: #ffc107;
}

.job-status.status-failed {
  background-color: #dc3545;
}

.job-status.status-waiting {
  background-color: #6c757d;
}

.job-score {
  font-size: 14px;
  font-weight: bold;
  color: #495057;
  text-align: right;
  padding: 8px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 6px;
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