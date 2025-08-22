import authService from './auth'

// TODO : manage this in the .env file for production
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

/**
 * Récupère la configuration des jobs depuis le backend
 * Get config only for analysis-text-seo module
 */
export const getJobsConfig = async () => {
  try {
    const response = await fetch(`${API_URL}/analysis-text-seo/jobs/config`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authService.getAuthHeaders()
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.success) {
      return data.data
    } else {
      throw new Error(data.message || 'Erreur lors de la récupération de la configuration')
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration des jobs:', error)
    // Retourner une configuration par défaut en cas d'erreur
    return getDefaultJobsConfig()
  }
}

// Garde l'ancien nom pour compatibilité
export const getBaremeConfig = getJobsConfig

/**
 * Configuration par défaut en cas d'erreur de récupération
 */
const getDefaultJobsConfig = () => {
  return {
    jobs: [
      { name: 'keyword-analysis', displayName: 'Analyse des mots-clés', weight: 40, description: 'Analyse la présence et la fréquence des mots-clés' },
      { name: 'keyword-position', displayName: 'Position des mots-clés', weight: 15, description: 'Vérifie la position stratégique des mots-clés' },
      { name: 'content-length', displayName: 'Longueur du contenu', weight: 15, description: 'Évalue la longueur optimale du contenu' },
      { name: 'readability', displayName: 'Lisibilité', weight: 15, description: 'Analyse la facilité de lecture du texte' },
      { name: 'uniqueness', displayName: 'Originalité', weight: 15, description: 'Vérifie l\'originalité et l\'unicité du contenu' }
    ],
    totalWeight: 100,
    version: '1.0.0'
  }
}