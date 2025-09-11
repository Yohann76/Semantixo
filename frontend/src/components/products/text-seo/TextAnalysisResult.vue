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
          :score="getJobScore('readability')"
          :maxScore="10"
          :defaultCollapsed="true">
          <div class="json-viewer">
            
            
            <!-- Affichage de la lisibilité pour tous les utilisateurs -->
            <div v-if="getJobStatus('readability') === 'completed'" class="readability-analysis">
              <div class="readability-summary">
                <h4>📊 Analyse de la lisibilité SEO</h4>
                <div class="readability-stats">
                  <div class="stat-card half-width">
                    <div class="stat-icon">📈</div>
                    <div class="stat-content">
                      <div class="stat-value readability-score" :class="getReadabilityGradeClass()">{{ getReadabilityScoreOutOf8() }}/8</div>
                      <div class="stat-label">Score de lisibilité</div>
                    </div>
                  </div>
                  <div class="stat-card half-width">
                    <div class="stat-icon">📏</div>
                    <div class="stat-content">
                      <div class="stat-value length-score" :class="getLengthScoreClass()">{{ getLengthScoreOutOf2() }}/2</div>
                      <div class="stat-label">Score de longueur</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Métriques détaillées -->
              <div class="readability-metrics">
                <div class="metrics-grid">
                  <div class="metric-card">
                    <h5>📖 Scores de lisibilité</h5>
                    <div class="metric-item">
                      <span class="metric-label">Flesch Reading Ease:</span>
                      <span class="metric-value">{{ getFleschScore() }}</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-label">Niveau scolaire:</span>
                      <span class="metric-value">{{ getFleschKincaidGrade() }}</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-label">Indice Gunning Fog:</span>
                      <span class="metric-value">{{ getGunningFogIndex() }}</span>
                    </div>
                  </div>
                  
                  <div class="metric-card">
                    <h5>📊 Structure du contenu</h5>
                    <div class="metric-item">
                      <span class="metric-label">Mots par phrase:</span>
                      <span class="metric-value">{{ getAvgSentenceLength() }}</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-label">Mots par paragraphe:</span>
                      <span class="metric-value">{{ getAvgWordsPerParagraph() }}</span>
                    </div>
                    <div class="metric-item">
                      <span class="metric-label">Mots complexes:</span>
                      <span class="metric-value">{{ getComplexWordsPercentage() }}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Graphiques de structure -->
              <div class="structure-charts">
                <div class="chart-container">
                  <h5>📝 Répartition des phrases</h5>
                  <div class="chart-bars">
                    <div class="bar-item">
                      <span class="bar-label">Court (&lt; 15 mots)</span>
                      <div class="bar">
                        <div class="bar-fill" :style="{ width: getSentencePercentage('short') + '%' }"></div>
                      </div>
                      <span class="bar-value">{{ getReadabilitySentenceCount('short') }}</span>
                    </div>
                    <div class="bar-item">
                      <span class="bar-label">Moyen (15-25 mots)</span>
                      <div class="bar">
                        <div class="bar-fill" :style="{ width: getSentencePercentage('medium') + '%' }"></div>
                      </div>
                      <span class="bar-value">{{ getReadabilitySentenceCount('medium') }}</span>
                    </div>
                    <div class="bar-item">
                      <span class="bar-label">Long (25-40 mots)</span>
                      <div class="bar">
                        <div class="bar-fill" :style="{ width: getSentencePercentage('long') + '%' }"></div>
                      </div>
                      <span class="bar-value">{{ getReadabilitySentenceCount('long') }}</span>
                    </div>
                    <div class="bar-item">
                      <span class="bar-label">Très long (> 40 mots)</span>
                      <div class="bar">
                        <div class="bar-fill" :style="{ width: getSentencePercentage('veryLong') + '%' }"></div>
                      </div>
                      <span class="bar-value">{{ getReadabilitySentenceCount('veryLong') }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="chart-container">
                  <h5>📄 Répartition des paragraphes</h5>
                  <div class="chart-bars">
                    <div class="bar-item">
                      <span class="bar-label">Court (&lt; 50 mots)</span>
                      <div class="bar">
                        <div class="bar-fill" :style="{ width: getParagraphPercentage('short') + '%' }"></div>
                      </div>
                      <span class="bar-value">{{ getReadabilityParagraphCount('short') }}</span>
                    </div>
                    <div class="bar-item">
                      <span class="bar-label">Moyen (50-100 mots)</span>
                      <div class="bar">
                        <div class="bar-fill" :style="{ width: getParagraphPercentage('medium') + '%' }"></div>
                      </div>
                      <span class="bar-value">{{ getReadabilityParagraphCount('medium') }}</span>
                    </div>
                    <div class="bar-item">
                      <span class="bar-label">Optimal (100-150 mots)</span>
                      <div class="bar">
                        <div class="bar-fill optimal" :style="{ width: getParagraphPercentage('optimal') + '%' }"></div>
                      </div>
                      <span class="bar-value">{{ getReadabilityParagraphCount('optimal') }}</span>
                    </div>
                    <div class="bar-item">
                      <span class="bar-label">Long (> 150 mots)</span>
                      <div class="bar">
                        <div class="bar-fill" :style="{ width: getParagraphPercentage('long') + '%' }"></div>
                      </div>
                      <span class="bar-value">{{ getReadabilityParagraphCount('long') }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Recommandations -->
              <div v-if="getReadabilityRecommendations().length > 0" class="readability-recommendations">
                <h5>💡 Recommandations</h5>
                <ul class="recommendations-list">
                  <li v-for="(recommendation, index) in getReadabilityRecommendations()" :key="index" class="recommendation-item">
                    {{ recommendation }}
                  </li>
                </ul>
              </div>
              
              <!-- Score total sur 10 -->
              <div class="readability-total-score">
                <h5>📊 Score total de lisibilité</h5>
                <div class="total-score-display">
                  <span class="score-label">Score final :</span>
                  <span class="score-value total">{{ getTotalReadabilityScore() }}/10</span>
                </div>
              </div>
            </div>
            
            <!-- Affichage pendant le traitement -->
            <div v-else-if="getJobStatus('readability') === 'active'" class="job-processing">
              <div class="processing-info">
                <div class="processing-icon">🔄</div>
                <p>Analyse de la lisibilité en cours...</p>
                <p>Calcul des métriques SEO et de la structure du contenu...</p>
              </div>
            </div>
            
            <!-- Affichage en attente -->
            <div v-else class="job-waiting">
              <div class="waiting-info">
                <div class="waiting-icon">⏳</div>
                <p>Analyse de la lisibilité en attente...</p>
                <p>Cette section analysera la lisibilité et la structure de votre contenu pour le SEO.</p>
              </div>
            </div>
            
            <!-- Données techniques pour les admins uniquement -->
            <div v-if="isAdmin" class="admin-section">
              <!-- Séparateur pour les admins -->
              <div class="admin-separator">
                <span>🔐 Données techniques (Admin uniquement)</span>
              </div>
              
              <!-- JSON détaillé pour les admins -->
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
                <p>Vérification des duplications de contenu...</p>
              </div>
            </div>
            
            <!-- Affichage en attente -->
            <div v-else class="job-waiting">
              <div class="waiting-info">
                <div class="waiting-icon">⏳</div>
                <p>Analyse de l'originalité en attente...</p>
                <p>Cette section analysera l'originalité de votre contenu et détectera les duplications.</p>
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
    'readability': 10,
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
    // Pour la lisibilité, utiliser notre score calculé sur 10
    if (jobType === 'readability') {
      return getTotalReadabilityScore();
    }
    return props.analysis.jobs[jobType].score || 0
  }
  return 0
}


const getJobsSummary = () => {
  const jobs = [
    { name: 'keyword-analysis', status: getJobStatus('keyword-analysis'), score: getJobScore('keyword-analysis'), poidScoreSEO: 70 },
    { name: 'readability', status: getJobStatus('readability'), score: getJobScore('readability'), poidScoreSEO: 10 },
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

// Fonctions pour l'analyse de lisibilité
const getReadabilityData = () => {
  if (getJobStatus('readability') !== 'completed') {
    return null;
  }
  
  const jobData = getFullJobData('readability');
  // Les données peuvent être dans metrics, rawData.analysis, ou rawData
  return jobData?.metrics || jobData?.rawData?.analysis || jobData?.rawData || jobData;
};

const getReadabilityScore = () => {
  const data = getReadabilityData();
  if (!data) return 0;
  return data.readabilityScore || 0;
};

const getReadabilityGrade = () => {
  const data = getReadabilityData();
  if (!data) return 'N/A';
  return data.seoReadabilityGrade || 'N/A';
};

const getReadabilityGradeClass = () => {
  const grade = getReadabilityGrade();
  if (grade === 'A+' || grade === 'A') return 'grade-excellent';
  if (grade === 'B+' || grade === 'B') return 'grade-good';
  if (grade === 'C+' || grade === 'C') return 'grade-average';
  return 'grade-poor';
};

const getContentLengthScore = () => {
  const data = getReadabilityData();
  if (!data) return 0;
  return data.contentLengthScore || 0;
};

const getLengthScoreClass = () => {
  const score = getContentLengthScore();
  if (score >= 4) return 'length-excellent';
  if (score >= 3) return 'length-good';
  if (score >= 2) return 'length-average';
  return 'length-poor';
};

const getFleschScore = () => {
  const data = getReadabilityData();
  if (!data) return 0;
  return Math.round(data.fleschReadingEase || 0);
};

const getFleschKincaidGrade = () => {
  const data = getReadabilityData();
  if (!data) return 0;
  return Math.round(data.fleschKincaidGrade || 0);
};

const getGunningFogIndex = () => {
  const data = getReadabilityData();
  if (!data) return 0;
  return Math.round(data.gunningFogIndex || 0);
};

const getAvgSentenceLength = () => {
  const data = getReadabilityData();
  if (!data) return 0;
  return Math.round(data.avgSentenceLength || 0);
};

const getAvgWordsPerParagraph = () => {
  const data = getReadabilityData();
  if (!data) return 0;
  return Math.round(data.avgWordsPerParagraph || 0);
};

const getComplexWordsPercentage = () => {
  const data = getReadabilityData();
  if (!data) return 0;
  return Math.round(data.complexWordsPercentage || 0);
};

const getReadabilitySentenceCount = (type) => {
  const data = getReadabilityData();
  if (!data || !data.sentenceAnalysis) return 0;
  
  switch (type) {
    case 'short': return data.sentenceAnalysis.shortSentences || 0;
    case 'medium': return data.sentenceAnalysis.mediumSentences || 0;
    case 'long': return data.sentenceAnalysis.longSentences || 0;
    case 'veryLong': return data.sentenceAnalysis.veryLongSentences || 0;
    default: return 0;
  }
};

const getSentencePercentage = (type) => {
  const total = getReadabilitySentenceCount('short') + getReadabilitySentenceCount('medium') + getReadabilitySentenceCount('long') + getReadabilitySentenceCount('veryLong');
  if (total === 0) return 0;
  return Math.round((getReadabilitySentenceCount(type) / total) * 100);
};

const getReadabilityParagraphCount = (type) => {
  const data = getReadabilityData();
  if (!data || !data.paragraphAnalysis) return 0;
  
  switch (type) {
    case 'short': return data.paragraphAnalysis.shortParagraphs || 0;
    case 'medium': return data.paragraphAnalysis.mediumParagraphs || 0;
    case 'optimal': return data.paragraphAnalysis.optimalParagraphs || 0;
    case 'long': return data.paragraphAnalysis.longParagraphs || 0;
    default: return 0;
  }
};

const getParagraphPercentage = (type) => {
  const total = getReadabilityParagraphCount('short') + getReadabilityParagraphCount('medium') + getReadabilityParagraphCount('optimal') + getReadabilityParagraphCount('long');
  if (total === 0) return 0;
  return Math.round((getReadabilityParagraphCount(type) / total) * 100);
};

const getReadabilityRecommendations = () => {
  const data = getReadabilityData();
  if (!data) return [];
  return data.recommendations || [];
};

// Fonctions pour le calcul du score sur 10
const getReadabilityScoreOutOf8 = () => {
  const data = getReadabilityData();
  if (!data) return 0;
  
  const fleschScore = data.fleschReadingEase || 0;
  const avgSentenceLength = data.avgSentenceLength || 0;
  const complexWordsPercentage = data.complexWordsPercentage || 0;
  
  let score = 0;
  
  // Score Flesch (0-3 points)
  if (fleschScore >= 80) score += 3;
  else if (fleschScore >= 60) score += 2;
  else if (fleschScore >= 40) score += 1;
  
  // Score longueur des phrases (0-2 points)
  if (avgSentenceLength >= 15 && avgSentenceLength <= 25) score += 2;
  else if (avgSentenceLength >= 10 && avgSentenceLength <= 30) score += 1;
  
  // Score mots complexes (0-2 points)
  if (complexWordsPercentage <= 10) score += 2;
  else if (complexWordsPercentage <= 20) score += 1;
  
  // Score structure des phrases (0-1 point)
  const sentenceAnalysis = data.sentenceAnalysis || {};
  const totalSentences = (sentenceAnalysis.shortSentences || 0) + (sentenceAnalysis.mediumSentences || 0) + (sentenceAnalysis.longSentences || 0) + (sentenceAnalysis.veryLongSentences || 0);
  const optimalSentences = (sentenceAnalysis.shortSentences || 0) + (sentenceAnalysis.mediumSentences || 0);
  
  if (totalSentences > 0 && (optimalSentences / totalSentences) >= 0.7) {
    score += 1;
  }
  
  return Math.min(8, Math.max(0, score));
};

const getLengthScoreOutOf2 = () => {
  const data = getReadabilityData();
  if (!data) return 0;
  
  const contentLengthScore = data.contentLengthScore || 0;
  
  // Convertir le score de longueur (0-5) en score sur 2
  if (contentLengthScore >= 5) return 2;
  if (contentLengthScore >= 4) return 2;
  if (contentLengthScore >= 3) return 1;
  return 0;
};

const getTotalReadabilityScore = () => {
  return getReadabilityScoreOutOf8() + getLengthScoreOutOf2();
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

/* Styles pour l'analyse de lisibilité */
.readability-analysis {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.readability-summary h4 {
  margin: 0 0 20px 0;
  color: #495057;
  font-size: 1.2rem;
  font-weight: 600;
}

.readability-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

@media (min-width: 768px) {
  .readability-stats {
    grid-template-columns: 1fr 1fr;
  }
}

.readability-stats .stat-card {
  display: flex;
  align-items: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.readability-stats .stat-icon {
  font-size: 2rem;
  margin-right: 15px;
}

.readability-stats .stat-content {
  flex: 1;
}

.readability-stats .stat-value {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.readability-stats .stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

/* Classes de couleur pour les scores de lisibilité */
.grade-excellent, .length-excellent {
  color: #28a745 !important;
}

.grade-good, .length-good {
  color: #17a2b8 !important;
}

.grade-average, .length-average {
  color: #ffc107 !important;
}

.grade-poor, .length-poor {
  color: #dc3545 !important;
}

/* Métriques détaillées */
.readability-metrics {
  margin-bottom: 25px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.metric-card {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.metric-card h5 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f9fa;
}

.metric-item:last-child {
  border-bottom: none;
}

.metric-label {
  color: #6c757d;
  font-size: 0.9rem;
}

.metric-value {
  color: #495057;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Graphiques de structure */
.structure-charts {
  margin-bottom: 25px;
}

.chart-container {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.chart-container h5 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.chart-bars {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bar-item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.bar-label {
  min-width: 150px;
  font-size: 0.85rem;
  color: #6c757d;
}

.bar {
  flex: 1;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  transition: width 0.3s ease;
}

.bar-fill.optimal {
  background: linear-gradient(90deg, #28a745 0%, #20c997 100%);
}

.bar-value {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #495057;
  font-size: 0.85rem;
}

/* Recommandations */
.readability-recommendations {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.readability-recommendations h5 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 1rem;
  font-weight: 600;
}

.recommendations-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.recommendation-item {
  padding: 10px 0;
  border-bottom: 1px solid #f8f9fa;
  color: #495057;
  font-size: 0.9rem;
  line-height: 1.5;
}

.recommendation-item:last-child {
  border-bottom: none;
}

.recommendation-item:before {
  content: "💡";
  margin-right: 8px;
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
.readability-total-score {
  margin-top: 20px;
  padding: 15px;
  background: #e3f2fd;
  border-radius: 8px;
  border: 1px solid #2196f3;
}

.readability-total-score h5 {
  margin: 0 0 10px 0;
  color: #1976d2;
  font-size: 16px;
  font-weight: 600;
}

.total-score-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-score-display .score-label {
  font-size: 14px;
  color: #1976d2;
  font-weight: 500;
}

.total-score-display .score-value.total {
  font-size: 20px;
  font-weight: 700;
  color: #1976d2;
}

</style>