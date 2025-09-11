/**
 * Composable pour l'extraction et la gestion des scores SEO
 * Principe SOLID : Single Responsibility - Responsabilité unique de gestion des scores
 */



/**
 * Extrait le score SEO d'une analyse selon différents formats de données
 * Principe SOLID : Open/Closed - Extensible pour nouveaux formats
 * @param {Object} analysis - L'objet d'analyse
 * @returns {number} Le score SEO (0-100)
 */
export const extractSeoScore = (analysis) => {
  if (!analysis || typeof analysis !== 'object') {
    return 0
  }

  // Pour les analyses de texte, calculer le score total avec les nouveaux calculs
  if (analysis.type === 'text' || analysis.analysis?.type === 'text') {
    return calculateTextAnalysisScore(analysis)
  }

  // Vérifier d'abord la structure directe (nouvelle architecture)
  if (analysis.scoreSeo !== undefined && analysis.scoreSeo !== null) {
    return Number(analysis.scoreSeo) || 0
  }
  
  // Vérifier la structure imbriquée (ancienne architecture)
  if (analysis.analysis?.scoreSeo !== undefined && analysis.analysis.scoreSeo !== null) {
    return Number(analysis.analysis.scoreSeo) || 0
  }
  
  // Vérifier les autres propriétés possibles
  if (analysis.seoScore !== undefined && analysis.seoScore !== null) {
    return Number(analysis.seoScore) || 0
  }
  
  // Vérifier si c'est une analyse de page avec seoScore
  if (analysis.type === 'page' && analysis.seoScore !== undefined) {
    return Number(analysis.seoScore) || 0
  }
  
  // Vérifier si c'est une analyse de domaine avec domainScore
  if (analysis.type === 'domain' && analysis.domainScore !== undefined) {
    return Number(analysis.domainScore) || 0
  }
  
  // Valeur par défaut si aucun score n'est trouvé
  console.warn('⚠️ [SCORE] Aucun score SEO trouvé pour l\'analyse:', analysis.id || analysis._id, 'Type:', analysis.type)
  return 0
}

/**
 * Calcule le score total pour une analyse de texte avec les nouveaux calculs
 * @param {Object} analysis - L'objet d'analyse
 * @returns {number} Le score SEO total (0-100)
 */
const calculateTextAnalysisScore = (analysis) => {
  try {
    console.log('📊 [SCORE] Calcul pour analyse:', {
      id: analysis.id || analysis._id,
      scoreSeo: analysis.scoreSeo,
      hasJobs: !!(analysis.jobs || analysis.analysis?.jobs),
      jobsKeys: analysis.jobs ? Object.keys(analysis.jobs) : 'none'
    })
    
    // Pour l'historique, utiliser directement le score du backend
    if (analysis.scoreSeo !== undefined && analysis.scoreSeo !== null) {
      const backendScore = Number(analysis.scoreSeo) || 0
      console.log('📊 [SCORE] Utilisation du score backend (historique):', backendScore)
      return backendScore
    }
    
    // Pour les analyses complètes, essayer de calculer à partir des jobs
    const jobs = analysis.jobs || analysis.analysis?.jobs || {}
    
    if (Object.keys(jobs).length > 0) {
      const keywordScore = jobs['keyword-analysis']?.score || 0
      const uniquenessScore = jobs['uniqueness']?.score || 0
      const readabilityScore = calculateReadabilityScore(jobs['readability'])
      
      const totalScore = keywordScore + readabilityScore + uniquenessScore
      console.log('📊 [SCORE] Calcul détaillé avec jobs:', {
        keyword: keywordScore,
        readability: readabilityScore,
        uniqueness: uniquenessScore,
        total: totalScore
      })
      
      return totalScore
    }
    
    console.log('📊 [SCORE] Aucune donnée disponible, retour 0')
    return 0
  } catch (error) {
    console.error('❌ [SCORE] Erreur calcul score texte:', error)
    return 0
  }
}

/**
 * Calcule le score de lisibilité sur 10 points
 * @param {Object} readabilityJob - Les données du job de lisibilité
 * @returns {number} Le score de lisibilité (0-10)
 */
const calculateReadabilityScore = (readabilityJob) => {
  if (!readabilityJob || readabilityJob.status !== 'completed') {
    return 0
  }
  
  const data = readabilityJob.metrics || readabilityJob.rawData?.analysis || readabilityJob.rawData || {}
  
  // Score de lisibilité sur 8 points
  const fleschScore = data.fleschReadingEase || 0
  const avgSentenceLength = data.avgSentenceLength || 0
  const complexWordsPercentage = data.complexWordsPercentage || 0
  
  let readabilityScore = 0
  
  // Score Flesch (0-3 points)
  if (fleschScore >= 80) readabilityScore += 3
  else if (fleschScore >= 60) readabilityScore += 2
  else if (fleschScore >= 40) readabilityScore += 1
  
  // Score longueur des phrases (0-2 points)
  if (avgSentenceLength >= 15 && avgSentenceLength <= 25) readabilityScore += 2
  else if (avgSentenceLength >= 10 && avgSentenceLength <= 30) readabilityScore += 1
  
  // Score mots complexes (0-2 points)
  if (complexWordsPercentage <= 10) readabilityScore += 2
  else if (complexWordsPercentage <= 20) readabilityScore += 1
  
  // Score structure des phrases (0-1 point)
  const sentenceAnalysis = data.sentenceAnalysis || {}
  const totalSentences = (sentenceAnalysis.shortSentences || 0) + (sentenceAnalysis.mediumSentences || 0) + (sentenceAnalysis.longSentences || 0) + (sentenceAnalysis.veryLongSentences || 0)
  const optimalSentences = (sentenceAnalysis.shortSentences || 0) + (sentenceAnalysis.mediumSentences || 0)
  
  if (totalSentences > 0 && (optimalSentences / totalSentences) >= 0.7) {
    readabilityScore += 1
  }
  
  const readabilityScoreOutOf8 = Math.min(8, Math.max(0, readabilityScore))
  
  // Score de longueur sur 2 points
  const contentLengthScore = data.contentLengthScore || 0
  let lengthScoreOutOf2 = 0
  if (contentLengthScore >= 5) lengthScoreOutOf2 = 2
  else if (contentLengthScore >= 4) lengthScoreOutOf2 = 2
  else if (contentLengthScore >= 3) lengthScoreOutOf2 = 1
  
  return readabilityScoreOutOf8 + lengthScoreOutOf2
}

/**
 * Obtient la classe CSS pour le score
 * @param {number} score - Le score SEO (0-100)
 * @returns {string} La classe CSS
 */
export const getScoreClass = (score) => {
  const numScore = Number(score) || 0
  if (numScore === 0) return 'score-poor'
  if (numScore >= 85) return 'score-excellent'
  if (numScore >= 70) return 'score-good'
  if (numScore >= 55) return 'score-average'
  return 'score-poor'
}

/**
 * Calcule le pourcentage de progression pour la barre de progression
 * @param {number} score - Le score SEO (0-100)
 * @returns {number} Le pourcentage (0-100)
 */
export const getProgressPercentage = (score) => {
  const numScore = Number(score) || 0
  return Math.min(Math.max(numScore, 0), 100)
}

/**
 * Composable principal pour la gestion des scores
 */
export const useAnalysisScore = () => {
  return {
    extractSeoScore,
    getScoreClass,
    getProgressPercentage
  }
}
