import authService from './auth'

// TODO : manage this in the .env file for production
const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api'

/**
 * Récupère la configuration du barème depuis le backend
 * Get config only for analysis-text-seo module
 */
export const getBaremeConfig = async () => {
  try {
    const response = await fetch(`${API_URL}/analysis-text-seo/bareme/config`, {
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
      return data.data.configuration
    } else {
      throw new Error(data.message || 'Erreur lors de la récupération de la configuration')
    }
  } catch (error) {
    console.error('Erreur lors de la récupération de la configuration du barème:', error)
    // Retourner une configuration par défaut en cas d'erreur
    return getDefaultConfig()
  }
}

/**
 * Configuration par défaut en cas d'erreur de récupération
 */
const getDefaultConfig = () => {
  return {
    version: '2.3.0',
    totalPoints: 100,
    enabled: true,
    criteria: {
      keywordUsage: {
        id: 'keyword_usage',
        name: 'Utilisation des mots-clés',
        weight: 60,
        enabled: true,
        description: 'Analyse de l\'utilisation des mots-clés et de leur champ lexical'
      },
      keywordPosition: {
        id: 'keyword_position',
        name: 'Position des mots-clés',
        weight: 10,
        enabled: true,
        description: 'Analyse de la position des mots-clés dans le texte'
      },
      contentLength: {
        id: 'content_length',
        name: 'Longueur du contenu',
        weight: 10,
        enabled: true,
        description: 'Évaluation de la longueur du contenu'
      },
      readability: {
        id: 'readability',
        name: 'Lisibilité',
        weight: 10,
        enabled: true,
        description: 'Analyse de la structure et de la lisibilité'
      },
      uniqueness: {
        id: 'uniqueness',
        name: 'Originalité',
        weight: 10,
        enabled: true,
        description: 'Évaluation de l\'originalité du contenu'
      }
    },
    grading: {
      excellent: { min: 85, label: 'Excellent' },
      veryGood: { min: 70, label: 'Très bon' },
      good: { min: 55, label: 'Bon' },
      average: { min: 40, label: 'Moyen' },
      poor: { min: 0, label: 'Insuffisant' }
    },
    thresholds: {
      minWords: 50,
      maxWords: 2000,
      minParagraphs: 2,
      maxWordsPerParagraph: 200,
      minKeywordDensity: 0.5,
      maxKeywordDensity: 3.0
    }
  }
} 