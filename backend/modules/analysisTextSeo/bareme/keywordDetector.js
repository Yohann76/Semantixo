/**
 * Détecteur automatique de mots-clés thématiques et synonymes
 * Analyse le contenu pour identifier les mots-clés importants
 */

// Base de données de synonymes par thématique (simplifiée)
const THESAURUS = {
  // Technologie
  'technologie': ['tech', 'innovation', 'digital', 'informatique', 'numérique', 'électronique'],
  'programmation': ['code', 'développement', 'software', 'application', 'logiciel', 'coding'],
  'intelligence artificielle': ['IA', 'AI', 'machine learning', 'deep learning', 'automatisation'],
  
  // Marketing
  'marketing': ['publicité', 'promotion', 'communication', 'stratégie', 'commercialisation'],
  'SEO': ['référencement', 'optimisation', 'moteurs de recherche', 'visibilité', 'trafic'],
  'contenu': ['texte', 'rédaction', 'copywriting', 'communication', 'message'],
  
  // Santé
  'santé': ['médecine', 'bien-être', 'soins', 'hygiène', 'prévention', 'médical'],
  'nutrition': ['alimentation', 'régime', 'diététique', 'vitamines', 'minéraux', 'équilibre'],
  'fitness': ['sport', 'exercice', 'entraînement', 'musculation', 'cardio', 'forme'],
  
  // Finance
  'finance': ['argent', 'investissement', 'épargne', 'trading', 'bourse', 'économie'],
  'cryptomonnaie': ['bitcoin', 'blockchain', 'crypto', 'token', 'wallet', 'mining'],
  
  // Éducation
  'éducation': ['apprentissage', 'formation', 'enseignement', 'pédagogie', 'études', 'cours'],
  'formation': ['apprentissage', 'développement', 'compétences', 'expertise', 'maîtrise'],
  
  // Voyage
  'voyage': ['tourisme', 'découverte', 'destination', 'aventure', 'exploration', 'vacances'],
  'tourisme': ['voyage', 'découverte', 'destination', 'aventure', 'exploration', 'vacances'],
  
  // Cuisine
  'cuisine': ['gastronomie', 'recette', 'cuisson', 'ingrédients', 'chef', 'restaurant'],
  'recette': ['cuisine', 'gastronomie', 'cuisson', 'ingrédients', 'préparation', 'plat'],
  
  // Mode
  'mode': ['fashion', 'style', 'tendance', 'vêtements', 'accessoires', 'look'],
  'fashion': ['mode', 'style', 'tendance', 'vêtements', 'accessoires', 'look'],
  
  // Immobilier
  'immobilier': ['propriété', 'maison', 'appartement', 'investissement', 'achat', 'vente'],
  'maison': ['immobilier', 'propriété', 'appartement', 'logement', 'habitation', 'résidence'],
  
  // Automobile
  'voiture': ['automobile', 'véhicule', 'conduite', 'transport', 'moteur', 'garage'],
  'automobile': ['voiture', 'véhicule', 'conduite', 'transport', 'moteur', 'garage']
}

// Mots-clés génériques par thématique
const THEMATIQUES = {
  'technologie': ['technologie', 'innovation', 'digital', 'informatique', 'numérique', 'électronique', 'programmation', 'développement', 'software', 'application'],
  'marketing': ['marketing', 'publicité', 'promotion', 'communication', 'stratégie', 'commercialisation', 'SEO', 'référencement', 'optimisation', 'contenu'],
  'santé': ['santé', 'médecine', 'bien-être', 'soins', 'hygiène', 'prévention', 'médical', 'nutrition', 'alimentation', 'fitness'],
  'finance': ['finance', 'argent', 'investissement', 'épargne', 'trading', 'bourse', 'économie', 'cryptomonnaie', 'bitcoin', 'blockchain'],
  'éducation': ['éducation', 'apprentissage', 'formation', 'enseignement', 'pédagogie', 'études', 'cours', 'développement', 'compétences'],
  'voyage': ['voyage', 'tourisme', 'découverte', 'destination', 'aventure', 'exploration', 'vacances', 'déplacement', 'expérience'],
  'cuisine': ['cuisine', 'gastronomie', 'recette', 'cuisson', 'ingrédients', 'chef', 'restaurant', 'préparation', 'plat', 'saveur'],
  'mode': ['mode', 'fashion', 'style', 'tendance', 'vêtements', 'accessoires', 'look', 'élégance', 'beauté', 'apparence'],
  'immobilier': ['immobilier', 'propriété', 'maison', 'appartement', 'investissement', 'achat', 'vente', 'logement', 'habitation'],
  'automobile': ['voiture', 'automobile', 'véhicule', 'conduite', 'transport', 'moteur', 'garage', 'entretien', 'performance']
}

/**
 * Détecte automatiquement la thématique principale du texte
 * @param {string} texte - Le texte à analyser
 * @returns {string} La thématique détectée
 */
const detecterThematique = (texte) => {
  const texteLower = texte.toLowerCase()
  const scores = {}
  
  // Calculer un score pour chaque thématique
  Object.entries(THEMATIQUES).forEach(([thematique, motsCles]) => {
    let score = 0
    motsCles.forEach(motCle => {
      const regex = new RegExp(`\\b${motCle}\\b`, 'gi')
      const matches = texteLower.match(regex) || []
      score += matches.length
    })
    scores[thematique] = score
  })
  
  // Retourner la thématique avec le score le plus élevé
  const thematiquePrincipale = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )[0]
  
  return thematiquePrincipale
}

/**
 * Extrait les mots-clés thématiques du texte
 * @param {string} texte - Le texte à analyser
 * @param {string} thematique - La thématique détectée
 * @returns {Array} Liste des mots-clés thématiques détectés
 */
const extraireMotsClesThematiques = (texte, thematique) => {
  const texteLower = texte.toLowerCase()
  const motsClesThematiques = THEMATIQUES[thematique] || []
  const motsClesDetectes = []
  
  motsClesThematiques.forEach(motCle => {
    const regex = new RegExp(`\\b${motCle}\\b`, 'gi')
    const matches = texteLower.match(regex) || []
    if (matches.length > 0) {
      motsClesDetectes.push({
        mot: motCle,
        occurrences: matches.length,
        present: true
      })
    }
  })
  
  // Trier par nombre d'occurrences et prendre les 5-6 plus fréquents
  return motsClesDetectes
    .sort((a, b) => b.occurrences - a.occurrences)
    .slice(0, 6)
}

/**
 * Génère les synonymes importants pour une thématique
 * @param {string} thematique - La thématique détectée
 * @returns {Array} Liste des synonymes importants
 */
const genererSynonymesImportants = (thematique) => {
  const synonymes = []
  
  // Récupérer les mots-clés de la thématique
  const motsClesThematiques = THEMATIQUES[thematique] || []
  
  // Pour chaque mot-clé, récupérer ses synonymes
  motsClesThematiques.forEach(motCle => {
    const synonymesMot = THESAURUS[motCle] || []
    synonymes.push(...synonymesMot)
  })
  
  // Supprimer les doublons et retourner les 5-6 plus pertinents
  return [...new Set(synonymes)].slice(0, 6)
}

/**
 * Analyse complète des mots-clés thématiques et synonymes
 * @param {string} texte - Le texte à analyser
 * @returns {Object} Résultats de l'analyse
 */
const analyserMotsClesThematiques = (texte) => {
  // Détecter la thématique
  const thematique = detecterThematique(texte)
  
  // Extraire les mots-clés thématiques présents
  const motsClesThematiques = extraireMotsClesThematiques(texte, thematique)
  
  // Générer les synonymes importants
  const synonymesImportants = genererSynonymesImportants(thematique)
  
  // Vérifier quels synonymes sont présents dans le texte
  const texteLower = texte.toLowerCase()
  const synonymesAnalyses = synonymesImportants.map(synonyme => {
    const regex = new RegExp(`\\b${synonyme}\\b`, 'gi')
    const matches = texteLower.match(regex) || []
    return {
      mot: synonyme,
      occurrences: matches.length,
      present: matches.length > 0
    }
  })
  
  return {
    thematique,
    motsClesThematiques,
    synonymesImportants: synonymesAnalyses,
    score: {
      motsClesPresents: motsClesThematiques.length,
      synonymesPresents: synonymesAnalyses.filter(s => s.present).length,
      totalMotsCles: 6,
      totalSynonymes: 6
    }
  }
}

/**
 * Calcule le score de qualité du contenu
 * @param {Object} analyse - Résultats de l'analyse des mots-clés
 * @returns {Object} Score et détails
 */
const calculerScoreQualiteContenu = (analyse) => {
  const { motsClesThematiques, synonymesImportants } = analyse
  
  // Score pour les mots-clés thématiques (10 points max)
  const tauxMotsCles = motsClesThematiques.length / 6
  const scoreMotsCles = Math.round(tauxMotsCles * 10)
  
  // Score pour les synonymes importants (10 points max)
  const synonymesPresents = synonymesImportants.filter(s => s.present).length
  const tauxSynonymes = synonymesPresents / 6
  const scoreSynonymes = Math.round(tauxSynonymes * 10)
  
  const scoreTotal = scoreMotsCles + scoreSynonymes
  
  return {
    score: scoreTotal,
    max_points: 20,
    details: {
      mots_cles_thematiques: {
        presents: motsClesThematiques.length,
        total: 6,
        score: scoreMotsCles,
        mots: motsClesThematiques
      },
      synonymes_importants: {
        presents: synonymesPresents,
        total: 6,
        score: scoreSynonymes,
        synonymes: synonymesImportants
      },
      thematique_detectee: analyse.thematique
    }
  }
}

module.exports = {
  detecterThematique,
  extraireMotsClesThematiques,
  genererSynonymesImportants,
  analyserMotsClesThematiques,
  calculerScoreQualiteContenu,
  THESAURUS,
  THEMATIQUES
} 