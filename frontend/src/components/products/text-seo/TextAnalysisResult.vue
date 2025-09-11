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
      <!-- STATISTIQUES DU TEXTE -->
      <div class="result-section">
        <CollapsibleSection title="📊 Statistiques du texte" :defaultCollapsed="false">
          <div class="text-stats">
            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-icon">📝</span>
                <span class="stat-label">Mots</span>
                <span class="stat-value">{{ getWordCount() }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">🔤</span>
                <span class="stat-label">Caractères</span>
                <span class="stat-value">{{ getCharacterCount() }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">📄</span>
                <span class="stat-label">Phrases</span>
                <span class="stat-value">{{ getSentenceCount() }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-icon">📖</span>
                <span class="stat-label">Paragraphes</span>
                <span class="stat-value">{{ getParagraphCount() }}</span>
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <!-- INFORMATIONS ADMINISTRATEUR -->
      <div class="result-section" v-if="isAdmin">
        <CollapsibleSection title="🔐 Informations administrateur" :defaultCollapsed="true">
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
          :maxScore="70"
          :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids: {{ getJobWeight('keyword-analysis') }} | Status: {{ getJobStatus('keyword-analysis') }}</h4>
            
            <!-- Contenu pour les utilisateurs normaux -->
            <div v-if="!isAdmin" class="user-info">
              <p>📊 Analyse des mots-clés en cours de traitement...</p>
              <p>Cette section analyse la densité et la pertinence des mots-clés dans votre texte.</p>
            </div>
            
            <!-- Contenu pour les admins : informations utilisateur + JSON -->
            <div v-else>
              <!-- Informations utilisateur (visibles aussi pour les admins) -->
              <div class="user-info">
                <p>📊 Analyse des mots-clés en cours de traitement...</p>
                <p>Cette section analyse la densité et la pertinence des mots-clés dans votre texte.</p>
              </div>
              
              <!-- Graphiques d'analyse des mots-clés -->
              <div v-if="getJobStatus('keyword-analysis') === 'completed'" class="keyword-charts">
                <KeywordAnalysisChart 
                  :analysisData="getFullJobData('keyword-analysis')"
                />
              </div>
              
              <!-- Séparateur pour les admins -->
              <div class="admin-separator">
                <span>🔐 Données techniques (Admin uniquement)</span>
              </div>
              
              <!-- JSON détaillé pour les admins -->
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
          </div>
        </CollapsibleSection>
      </div>


      <!-- LISIBILITÉ -->
      <div class="result-section">
        <CollapsibleSection 
          title="📖 Lisibilité" 
          :score="getCombinedReadabilityScore()"
          :maxScore="10"
          :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids combiné: {{ getJobWeight('content-length') + getJobWeight('readability') }} | Status: {{ getCombinedReadabilityStatus() }}</h4>
            
            <!-- Contenu pour les utilisateurs normaux -->
            <div v-if="!isAdmin" class="user-info">
              <p>📖 Analyse de la lisibilité et de la longueur du contenu...</p>
              <p>Cette section évalue la facilité de lecture, la compréhension et la longueur optimale de votre texte pour le SEO.</p>
            </div>
            
            <!-- Contenu pour les admins : informations utilisateur + JSON -->
            <div v-else>
              <!-- Informations utilisateur (visibles aussi pour les admins) -->
              <div class="user-info">
                <p>📖 Analyse de la lisibilité et de la longueur du contenu...</p>
                <p>Cette section évalue la facilité de lecture, la compréhension et la longueur optimale de votre texte pour le SEO.</p>
              </div>
              
              <!-- Sous-sections pour les admins -->
              <div class="readability-subsections">
                <!-- Longueur du contenu -->
                <div class="subsection">
                  <h5>📏 Longueur du contenu</h5>
                  <div class="subsection-content">
                    <p><strong>Poids:</strong> {{ getJobWeight('content-length') }} | <strong>Status:</strong> {{ getJobStatus('content-length') }}</p>
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
                </div>
                
                <!-- Lisibilité -->
                <div class="subsection">
                  <h5>📖 Lisibilité</h5>
                  <div class="subsection-content">
                    <p><strong>Poids:</strong> {{ getJobWeight('readability') }} | <strong>Status:</strong> {{ getJobStatus('readability') }}</p>
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
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>
      </div>

      <!-- ORIGINALITÉ -->
      <div class="result-section">
        <CollapsibleSection 
          title="🔍 Originalité" 
          :score="getJobScore('uniqueness')"
          :maxScore="20"
          :defaultCollapsed="true">
          <div class="json-viewer">
            <h4>Poids: {{ getJobWeight('uniqueness') }} | Status: {{ getJobStatus('uniqueness') }}</h4>
            
            <!-- Affichage des duplications pour tous les utilisateurs -->
            <div v-if="getJobStatus('uniqueness') === 'completed'" class="duplication-analysis">
              <div class="duplication-summary">
                <h4>📊 Analyse des duplications</h4>
                <div class="duplication-stats">
                  <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-content">
                      <div class="stat-value duplication-percentage" :class="getDuplicationPercentage() > 0 ? 'has-duplication' : 'no-duplication'">{{ getDuplicationPercentage() }}%</div>
                      <div class="stat-label">Contenu dupliqué</div>
                    </div>
                  </div>
                  <div class="stat-card">
                    <div class="stat-icon">🔗</div>
                    <div class="stat-content">
                      <div class="stat-value sources-count" :class="getDuplicationSourcesCount() > 0 ? 'has-sources' : 'no-sources'">{{ getDuplicationSourcesCount() }}</div>
                      <div class="stat-label">Sources trouvées</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Liste des sources de duplication -->
              <div v-if="getDuplicationSources().length > 0" class="duplication-sources">
                <h5>🌐 Sources de duplication détectées :</h5>
                <div class="sources-list">
                  <div v-for="(source, index) in getDuplicationSources()" :key="index" class="source-item">
                    <div class="source-header">
                      <span class="source-url">{{ source.url || source.domain || 'URL non disponible' }}</span>
                      <span class="source-percentage">{{ source.percentage || source.similarity || 'N/A' }}%</span>
                    </div>
                    <div v-if="source.title" class="source-title">{{ source.title }}</div>
                    <div v-if="source.description" class="source-description">{{ source.description }}</div>
                    <div v-if="source.sentence" class="duplicated-sentence">
                      <strong>Phrase dupliquée :</strong> "{{ source.sentence }}"
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="no-duplications">
                <div class="no-duplications-icon">✅</div>
                <p>Aucune duplication détectée ! Votre contenu est original.</p>
              </div>
            </div>
            
            <!-- Affichage pendant le traitement -->
            <div v-else-if="getJobStatus('uniqueness') === 'active'" class="job-processing">
              <div class="processing-info">
                <div class="processing-icon">🔄</div>
                <p>Analyse de l'originalité en cours...</p>
                <p>Vérification des duplications sur le web...</p>
              </div>
            </div>
            
            <!-- Affichage en attente -->
            <div v-else class="job-waiting">
              <div class="waiting-info">
                <div class="waiting-icon">⏳</div>
                <p>Analyse de l'originalité en attente...</p>
                <p>Cette section vérifiera l'unicité et l'originalité de votre contenu.</p>
              </div>
            </div>
            
            <!-- Données techniques pour les admins uniquement -->
            <div v-if="isAdmin" class="admin-section">
              <!-- Séparateur pour les admins -->
              <div class="admin-separator">
                <span>🔐 Données techniques (Admin uniquement)</span>
              </div>
              
              <!-- JSON détaillé pour les admins -->
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
import KeywordAnalysisChart from './KeywordAnalysisChart.vue'
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
    'keyword-analysis': 70,
    'content-length': 5,
    'readability': 5,
    'uniqueness': 20
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
const getJobScore = (jobType) => {
  if (props.analysis.jobs && props.analysis.jobs[jobType]) {
    return props.analysis.jobs[jobType].score || 0
  }
  return 0
}

// Fonctions pour la section lisibilité combinée
const getCombinedReadabilityScore = () => {
  return getJobScore('content-length') + getJobScore('readability')
}

const getCombinedReadabilityStatus = () => {
  const contentLengthStatus = getJobStatus('content-length')
  const readabilityStatus = getJobStatus('readability')
  
  // Si les deux sont terminés, retourner 'completed'
  if (contentLengthStatus === 'completed' && readabilityStatus === 'completed') {
    return 'completed'
  }
  // Si au moins un est en cours, retourner 'active'
  if (contentLengthStatus === 'active' || readabilityStatus === 'active') {
    return 'active'
  }
  // Si au moins un a échoué, retourner 'failed'
  if (contentLengthStatus === 'failed' || readabilityStatus === 'failed') {
    return 'failed'
  }
  // Sinon, retourner 'waiting'
  return 'waiting'
}

const getJobsSummary = () => {
  const jobs = [
    { name: 'keyword-analysis', status: getJobStatus('keyword-analysis'), score: getJobScore('keyword-analysis'), poidScoreSEO: 70 },
    { name: 'readability', status: getCombinedReadabilityStatus(), score: getCombinedReadabilityScore(), poidScoreSEO: 10 },
    { name: 'uniqueness', status: getJobStatus('uniqueness'), score: getJobScore('uniqueness'), poidScoreSEO: 20 }
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

// Méthodes pour les statistiques du texte
const getWordCount = () => {
  const text = props.analysis.analysis?.parameter?.text || props.analysis.parameter?.text || props.analysis.text || '';
  return text.split(/\s+/).filter(word => word.length > 0).length;
};

const getCharacterCount = () => {
  const text = props.analysis.analysis?.parameter?.text || props.analysis.parameter?.text || props.analysis.text || '';
  return text.length;
};

const getSentenceCount = () => {
  const text = props.analysis.analysis?.parameter?.text || props.analysis.parameter?.text || props.analysis.text || '';
  return text.split(/[.!?]+/).filter(sentence => sentence.length > 0).length;
};

const getParagraphCount = () => {
  const text = props.analysis.analysis?.parameter?.text || props.analysis.parameter?.text || props.analysis.text || '';
  return text.split(/\n\s*\n/).filter(paragraph => paragraph.length > 0).length;
};

// Fonctions pour l'analyse des duplications
const getDuplicationData = () => {
  if (getJobStatus('uniqueness') !== 'completed') {
    return null;
  }
  
  const jobData = getFullJobData('uniqueness');
  return jobData?.rawData || jobData;
};

const getDuplicationPercentage = () => {
  const data = getDuplicationData();
  if (!data) return 0;
  
  // Calculer le pourcentage de duplication (100 - uniquenessPercentage)
  const uniquenessPercentage = data.analysis?.uniquenessPercentage || 
                              data.metrics?.uniquenessPercentage || 
                              0;
  
  // Convertir en nombre et calculer le pourcentage de duplication
  const uniqueness = parseFloat(uniquenessPercentage);
  return Math.round(100 - uniqueness);
};

const getDuplicationSources = () => {
  const data = getDuplicationData();
  if (!data || !data.uniquenessResults) return [];
  
  // Extraire toutes les sources de duplication des résultats
  const sources = [];
  
  data.uniquenessResults.forEach(result => {
    if (result.isDuplicated && result.duplicateLinks && result.duplicateLinks.length > 0) {
      result.duplicateLinks.forEach(link => {
        sources.push({
          url: link.link,
          title: link.title,
          description: link.snippet,
          percentage: Math.round(parseFloat(link.similarity) * 100),
          similarity: link.similarity,
          matchType: link.matchType,
          sentence: result.sentence
        });
      });
    }
  });
  
  return sources;
};

const getDuplicationSourcesCount = () => {
  return getDuplicationSources().length;
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

/* Styles pour les statistiques du texte */
.text-stats {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  background: #e9ecef;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #343a40;
}

/* S'assurer que les statistiques du texte gardent leur couleur originale */
.text-stats .stat-value {
  color: #343a40 !important; /* Force la couleur originale pour les statistiques du texte */
}

/* Styles pour les informations utilisateur */
.user-info {
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.user-info p {
  margin: 0 0 10px 0;
  color: #495057;
  font-size: 0.95rem;
  line-height: 1.5;
}

.user-info p:last-child {
  margin-bottom: 0;
  font-style: italic;
  color: #6c757d;
  font-size: 0.9rem;
}

/* Styles pour le séparateur des données admin */
.admin-separator {
  margin: 20px 0;
  padding: 10px 0;
  border-top: 1px dashed #eee;
  border-bottom: 1px dashed #eee;
  text-align: center;
  color: #6c757d;
  font-size: 0.9rem;
  font-weight: 600;
}

/* Styles pour les sous-sections de lisibilité */
.readability-subsections {
  margin-top: 20px;
}

.subsection {
  margin-bottom: 25px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

.subsection h5 {
  margin: 0;
  padding: 15px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.subsection-content {
  padding: 20px;
  background: #f8f9fa;
}

.subsection-content p {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 0.9rem;
}

.subsection-content p:last-child {
  margin-bottom: 0;
}

/* Styles pour l'analyse des duplications */
.duplication-analysis {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.duplication-summary h4 {
  margin: 0 0 20px 0;
  color: #495057;
  font-size: 1.2rem;
  font-weight: 600;
}

.duplication-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stat-card .stat-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  color: #dc3545;
  margin-bottom: 5px;
}

/* Classes spécifiques pour les statistiques de duplication */
.duplication-stats .stat-value.has-duplication {
  color: #dc3545; /* Rouge quand il y a des duplications */
}

.duplication-stats .stat-value.no-duplication {
  color: #28a745; /* Vert quand il n'y a pas de duplications */
}

.duplication-stats .stat-value.has-sources {
  color: #dc3545; /* Rouge quand il y a des sources de duplication */
}

.duplication-stats .stat-value.no-sources {
  color: #28a745; /* Vert quand il n'y a pas de sources */
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.duplication-sources h5 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.sources-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.source-item {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.source-url {
  font-weight: 600;
  color: #007bff;
  text-decoration: none;
  font-size: 0.95rem;
  flex: 1;
  margin-right: 10px;
  word-break: break-all;
}

.source-url:hover {
  text-decoration: underline;
}

.source-percentage {
  background: #dc3545;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 50px;
  text-align: center;
}

.source-title {
  font-weight: 600;
  color: #495057;
  font-size: 0.9rem;
  margin-bottom: 5px;
}

.source-description {
  color: #6c757d;
  font-size: 0.85rem;
  line-height: 1.4;
}

.duplicated-sentence {
  margin-top: 10px;
  padding: 10px;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #856404;
  font-style: italic;
}

.no-duplications {
  text-align: center;
  padding: 30px 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #28a745;
}

.no-duplications-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.no-duplications p {
  margin: 0;
  color: #28a745;
  font-weight: 600;
  font-size: 1.1rem;
}

.processing-info, .waiting-info {
  text-align: center;
  padding: 30px 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.processing-icon, .waiting-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.processing-info p, .waiting-info p {
  margin: 5px 0;
  color: #495057;
}

.processing-info p:first-of-type, .waiting-info p:first-of-type {
  font-weight: 600;
  font-size: 1.1rem;
}

.admin-section {
  margin-top: 20px;
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