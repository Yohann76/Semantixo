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
