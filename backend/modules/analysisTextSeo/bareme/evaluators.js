/**
 * Évaluateurs pour le barème SEO de texte
 * Fonctions d'analyse et de notation pour chaque critère
 */

const { CRITERES, SEUILS_NOTATION } = require('./constants')
const { analyserMotsClesThematiques, calculerScoreQualiteContenu } = require('./keywordDetector')

/**
 * Évalue l'utilisation des mots clé et de leurs champ lexical
 */
const evaluerUtilisationChampLexical = (texte, motsCles) => {
  const resultats = {
    critere: CRITERES.UTILISATION_CHAMP_LEXICAL,
    score: 0,
    details: {},
    sous_criteres: {}
  }

  // Analyse automatique des mots-clés thématiques
  const analyse = analyserMotsClesThematiques(texte)

  // Évaluation de la déclinaison des mots clés
  if (CRITERES.UTILISATION_CHAMP_LEXICAL.sous_criteres.DECLINATION_MOTS_CLES.enabled) {
    const declinaison = evaluerDeclinaisonMotsCles(texte, motsCles, analyse)
    resultats.sous_criteres.declinaison_mots_cles = declinaison
    resultats.score += declinaison.points
  }

  // Évaluation de la correspondance parfaite
  if (CRITERES.UTILISATION_CHAMP_LEXICAL.sous_criteres.CORRESPONDANCE_PARFAITE.enabled) {
    const correspondance = evaluerCorrespondanceParfaite(texte, motsCles, analyse)
    resultats.sous_criteres.correspondance_parfaite = correspondance
    resultats.score += correspondance.points
  }

  // Ajouter les détails de l'analyse automatique
  resultats.details = {
    thematique_detectee: analyse.thematique,
    mots_cles_thematiques: analyse.motsClesThematiques,
    synonymes_importants: analyse.synonymesImportants
  }

  return resultats
}

/**
 * Évalue la position et implémentation des mots clefs
 */
const evaluerPositionImplementation = (texte, motsCles) => {
  const resultats = {
    critere: CRITERES.POSITION_IMPLEMENTATION,
    score: 0,
    details: {},
    sous_criteres: {}
  }

  // Évaluation des mots clés dans le premier paragraphe
  if (CRITERES.POSITION_IMPLEMENTATION.sous_criteres.MOTS_CLES_PREMIER_PARAGRAPHE.enabled) {
    const premierParagraphe = evaluerMotsClesPremierParagraphe(texte, motsCles)
    resultats.sous_criteres.mots_cles_premier_paragraphe = premierParagraphe
    resultats.score += premierParagraphe.points
  }

  // Évaluation des mots clés au début des paragraphes
  if (CRITERES.POSITION_IMPLEMENTATION.sous_criteres.MOTS_CLES_DEBUT_PARAGRAPHES.enabled) {
    const debutParagraphes = evaluerMotsClesDebutParagraphes(texte, motsCles)
    resultats.sous_criteres.mots_cles_debut_paragraphes = debutParagraphes
    resultats.score += debutParagraphes.points
  }

  return resultats
}

/**
 * Évalue la longueur suffisante
 */
const evaluerLongueurSuffisante = (texte) => {
  const resultats = {
    critere: CRITERES.LONGUEUR_SUFFISANTE,
    score: 0,
    details: {},
    sous_criteres: {}
  }

  // Évaluation de l'échelle de longueur
  if (CRITERES.LONGUEUR_SUFFISANTE.sous_criteres.ECHELLE_LONGUEUR.enabled) {
    const echelle = evaluerEchelleLongueur(texte)
    resultats.sous_criteres.echelle_longueur = echelle
    resultats.score += echelle.points
  }

  return resultats
}

/**
 * Évalue la structure et lisibilité
 */
const evaluerStructureLisibilite = (texte) => {
  const resultats = {
    critere: CRITERES.STRUCTURE_LISIBILITE,
    score: 0,
    details: {},
    sous_criteres: {}
  }

  // Évaluation de la densité des mots
  if (CRITERES.STRUCTURE_LISIBILITE.sous_criteres.DENSITE_MOTS.enabled) {
    const densite = evaluerDensiteMots(texte)
    resultats.sous_criteres.densite_mots = densite
    resultats.score += densite.points
  }

  // Évaluation de la découpe en paragraphes
  if (CRITERES.STRUCTURE_LISIBILITE.sous_criteres.DECOUPE_PARAGRAPHES.enabled) {
    const decoupe = evaluerDecoupeParagraphes(texte)
    resultats.sous_criteres.decoupe_paragraphes = decoupe
    resultats.score += decoupe.points
  }

  return resultats
}

/**
 * Évalue le contenu dupliqué
 */
const evaluerContenuDuplique = (texte) => {
  const resultats = {
    critere: CRITERES.CONTENU_DUPLIQUE,
    score: 0,
    details: {},
    sous_criteres: {}
  }

  // Évaluation du pourcentage de duplication
  if (CRITERES.CONTENU_DUPLIQUE.sous_criteres.POURCENTAGE_DUPLICATION.enabled) {
    const duplication = evaluerPourcentageDuplication(texte)
    resultats.sous_criteres.pourcentage_duplication = duplication
    resultats.score += duplication.points
  }

  return resultats
}

// Fonctions d'évaluation spécifiques pour chaque sous-critère

/**
 * Évalue les mots-clés thématiques détectés
 */
const evaluerMotsClesThematiques = (analyse) => {
  const { motsClesThematiques } = analyse
  const tauxPresence = motsClesThematiques.length / 6
  const points = Math.round(tauxPresence * 10)

  return {
    points,
    max_points: 10,
    details: {
      mots_cles_presents: motsClesThematiques.length,
      total_mots_cles: 6,
      taux_presence: Math.round(tauxPresence * 100) / 100,
      mots_cles: motsClesThematiques
    }
  }
}

/**
 * Évalue les synonymes importants
 */
const evaluerSynonymesImportants = (analyse) => {
  const { synonymesImportants } = analyse
  const synonymesPresents = synonymesImportants.filter(s => s.present).length
  const tauxPresence = synonymesPresents / 6
  const points = Math.round(tauxPresence * 10)

  return {
    points,
    max_points: 10,
    details: {
      synonymes_presents: synonymesPresents,
      total_synonymes: 6,
      taux_presence: Math.round(tauxPresence * 100) / 100,
      synonymes: synonymesImportants
    }
  }
}

/**
 * Évalue la déclinaison des mots clés en plusieurs champ lexical
 */
const evaluerDeclinaisonMotsCles = (texte, motsCles, analyse) => {
  const texteLower = texte.toLowerCase()
  let points = 0
  let variationsDetectees = 0
  let totalVariations = 0

  // Analyser les mots-clés fournis par l'utilisateur
  motsCles.forEach(motCle => {
    const motCleLower = motCle.toLowerCase()
    const variations = genererVariationsLexicales(motCleLower)
    totalVariations += variations.length
    
    variations.forEach(variation => {
      if (texteLower.includes(variation)) {
        variationsDetectees++
      }
    })
  })

  // Analyser les mots-clés thématiques détectés automatiquement
  const motsClesThematiques = analyse.motsClesThematiques
  motsClesThematiques.forEach(motCle => {
    const motCleLower = motCle.mot.toLowerCase()
    const variations = genererVariationsLexicales(motCleLower)
    totalVariations += variations.length
    
    variations.forEach(variation => {
      if (texteLower.includes(variation)) {
        variationsDetectees++
      }
    })
  })

  const tauxUtilisation = totalVariations > 0 ? variationsDetectees / totalVariations : 0
  
  if (tauxUtilisation >= 0.8) {
    points = 30
  } else if (tauxUtilisation >= 0.6) {
    points = 25
  } else if (tauxUtilisation >= 0.4) {
    points = 20
  } else if (tauxUtilisation >= 0.2) {
    points = 15
  } else if (tauxUtilisation > 0) {
    points = 10
  } else {
    points = 0
  }

  return {
    points,
    max_points: 30,
    details: {
      variations_detectees: variationsDetectees,
      total_variations: totalVariations,
      taux_utilisation: Math.round(tauxUtilisation * 100) / 100,
      mots_cles_analyses: motsCles.length,
      mots_cles_thematiques: motsClesThematiques.length
    }
  }
}

/**
 * Évalue la correspondance parfaite au mots clé et à l'intention de recherche
 */
const evaluerCorrespondanceParfaite = (texte, motsCles, analyse) => {
  const texteLower = texte.toLowerCase()
  let points = 0
  let motsClesTrouves = 0
  let correspondanceParfaite = 0

  // Analyser les mots-clés fournis par l'utilisateur
  motsCles.forEach(motCle => {
    const motCleLower = motCle.toLowerCase()
    const occurrences = (texteLower.match(new RegExp(motCleLower, 'g')) || []).length
    
    if (occurrences > 0) {
      motsClesTrouves++
      // Vérifier si le mot-clé est utilisé dans un contexte approprié
      if (verifierContexteApproprie(texte, motCle)) {
        correspondanceParfaite++
      }
    }
  })

  // Analyser les mots-clés thématiques détectés automatiquement
  const motsClesThematiques = analyse.motsClesThematiques
  motsClesThematiques.forEach(motCle => {
    const motCleLower = motCle.mot.toLowerCase()
    const occurrences = (texteLower.match(new RegExp(motCleLower, 'g')) || []).length
    
    if (occurrences > 0) {
      motsClesTrouves++
      // Vérifier si le mot-clé est utilisé dans un contexte approprié
      if (verifierContexteApproprie(texte, motCle.mot)) {
        correspondanceParfaite++
      }
    }
  })

  const totalMotsCles = motsCles.length + motsClesThematiques.length
  const tauxCorrespondance = totalMotsCles > 0 ? correspondanceParfaite / totalMotsCles : 0
  
  if (tauxCorrespondance >= 0.9) {
    points = 30
  } else if (tauxCorrespondance >= 0.7) {
    points = 25
  } else if (tauxCorrespondance >= 0.5) {
    points = 20
  } else if (tauxCorrespondance >= 0.3) {
    points = 15
  } else if (tauxCorrespondance > 0) {
    points = 10
  } else {
    points = 0
  }

  return {
    points,
    max_points: 30,
    details: {
      mots_cles_trouves: motsClesTrouves,
      correspondance_parfaite: correspondanceParfaite,
      total_mots_cles: totalMotsCles,
      taux_correspondance: Math.round(tauxCorrespondance * 100) / 100,
      mots_cles_utilisateur: motsCles.length,
      mots_cles_thematiques: motsClesThematiques.length
    }
  }
}

/**
 * Évalue les mots clés dans le premier paragraphe
 */
const evaluerMotsClesPremierParagraphe = (texte, motsCles) => {
  const paragraphes = texte.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const premierParagraphe = paragraphes.length > 0 ? paragraphes[0].toLowerCase() : ''
  
  let points = 0
  let motsClesTrouves = 0

  motsCles.forEach(motCle => {
    if (premierParagraphe.includes(motCle.toLowerCase())) {
      motsClesTrouves++
    }
  })

  const tauxPresence = motsCles.length > 0 ? motsClesTrouves / motsCles.length : 0
  
  if (tauxPresence >= 0.8) {
    points = 5
  } else if (tauxPresence >= 0.6) {
    points = 4
  } else if (tauxPresence >= 0.4) {
    points = 3
  } else if (tauxPresence >= 0.2) {
    points = 2
  } else if (tauxPresence > 0) {
    points = 1
  } else {
    points = 0
  }

  return {
    points,
    max_points: 5,
    details: {
      mots_cles_premier_paragraphe: motsClesTrouves,
      total_mots_cles: motsCles.length,
      taux_presence: Math.round(tauxPresence * 100) / 100
    }
  }
}

/**
 * Évalue les mots clés au début des paragraphes
 */
const evaluerMotsClesDebutParagraphes = (texte, motsCles) => {
  const paragraphes = texte.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  let points = 0
  let paragraphesAvecMotsCles = 0

  paragraphes.forEach(paragraphe => {
    const debutParagraphe = paragraphe.substring(0, Math.min(100, paragraphe.length)).toLowerCase()
    let motCleTrouve = false
    
    motsCles.forEach(motCle => {
      if (debutParagraphe.includes(motCle.toLowerCase())) {
        motCleTrouve = true
      }
    })
    
    if (motCleTrouve) {
      paragraphesAvecMotsCles++
    }
  })

  const tauxParagraphes = paragraphes.length > 0 ? paragraphesAvecMotsCles / paragraphes.length : 0
  
  if (tauxParagraphes >= 0.7) {
    points = 5
  } else if (tauxParagraphes >= 0.5) {
    points = 4
  } else if (tauxParagraphes >= 0.3) {
    points = 3
  } else if (tauxParagraphes >= 0.2) {
    points = 2
  } else if (tauxParagraphes > 0) {
    points = 1
  } else {
    points = 0
  }

  return {
    points,
    max_points: 5,
    details: {
      paragraphes_avec_mots_cles: paragraphesAvecMotsCles,
      total_paragraphes: paragraphes.length,
      taux_paragraphes: Math.round(tauxParagraphes * 100) / 100
    }
  }
}

/**
 * Évalue l'échelle de longueur du texte
 */
const evaluerEchelleLongueur = (texte) => {
  const mots = texte.split(/\s+/).length
  const seuils = CRITERES.LONGUEUR_SUFFISANTE.sous_criteres.ECHELLE_LONGUEUR.seuils
  
  let points = 0
  
  if (mots < seuils.minimum) {
    points = 0
  } else if (mots >= seuils.maximum) {
    points = 5
  } else {
    // Trouver le bon niveau dans l'échelle
    for (let i = seuils.echelle.length - 1; i >= 0; i--) {
      if (mots >= seuils.echelle[i].mots) {
        points = seuils.echelle[i].points
        break
      }
    }
  }

  return {
    points,
    max_points: 5,
    details: {
      nombre_mots: mots,
      seuil_minimum: seuils.minimum,
      seuil_maximum: seuils.maximum,
      niveau_atteint: points
    }
  }
}

/**
 * Évalue la densité des mots
 */
const evaluerDensiteMots = (texte) => {
  const mots = texte.split(/\s+/)
  const motsUniques = new Set(mots.map(mot => mot.toLowerCase()))
  const densite = motsUniques.size / mots.length
  
  let points = 0
  
  if (densite >= 0.8) {
    points = 5
  } else if (densite >= 0.6) {
    points = 4
  } else if (densite >= 0.4) {
    points = 3
  } else if (densite >= 0.2) {
    points = 2
  } else {
    points = 1
  }

  return {
    points,
    max_points: 5,
    details: {
      densite_vocabulaire: Math.round(densite * 100) / 100,
      mots_uniques: motsUniques.size,
      total_mots: mots.length
    }
  }
}

/**
 * Évalue la découpe en paragraphes
 */
const evaluerDecoupeParagraphes = (texte) => {
  const paragraphes = texte.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const mots = texte.split(/\s+/).length
  const motsParParagraphe = paragraphes.length > 0 ? mots / paragraphes.length : 0
  
  let points = 0
  
  if (paragraphes.length >= 4 && motsParParagraphe >= 50 && motsParParagraphe <= 200) {
    points = 5
  } else if (paragraphes.length >= 3 && motsParParagraphe >= 30 && motsParParagraphe <= 300) {
    points = 4
  } else if (paragraphes.length >= 2 && motsParParagraphe >= 20) {
    points = 3
  } else if (paragraphes.length >= 1) {
    points = 2
  } else {
    points = 0
  }

  return {
    points,
    max_points: 5,
    details: {
      nombre_paragraphes: paragraphes.length,
      mots_par_paragraphe: Math.round(motsParParagraphe),
      structure_optimale: points >= 4
    }
  }
}

/**
 * Évalue le pourcentage de duplication du contenu
 */
const evaluerPourcentageDuplication = (texte) => {
  // Simulation du calcul de duplication (dans un vrai système, on comparerait avec une base de données)
  const tauxDuplication = Math.random() * 0.3 // 0-30% pour l'exemple
  const seuils = CRITERES.CONTENU_DUPLIQUE.sous_criteres.POURCENTAGE_DUPLICATION.seuils
  
  let points = 0
  
  if (tauxDuplication <= 0.02) {
    points = 5
  } else if (tauxDuplication <= 0.05) {
    points = 4
  } else if (tauxDuplication <= 0.10) {
    points = 3
  } else if (tauxDuplication <= 0.20) {
    points = 2
  } else if (tauxDuplication <= 0.30) {
    points = 1
  } else {
    points = 0
  }

  return {
    points,
    max_points: 5,
    details: {
      taux_duplication: Math.round(tauxDuplication * 100) / 100,
      originalite: Math.round((1 - tauxDuplication) * 100) / 100
    }
  }
}

// Fonctions utilitaires

/**
 * Génère des variations lexicales d'un mot-clé
 */
const genererVariationsLexicales = (motCle) => {
  const variations = [motCle]
  
  // Ajouter des variations simples (dans un vrai système, on utiliserait un dictionnaire)
  if (motCle.endsWith('s')) {
    variations.push(motCle.slice(0, -1))
  }
  if (motCle.endsWith('e')) {
    variations.push(motCle.slice(0, -1))
  }
  
  // Ajouter des variations avec accents
  const variationsAccents = {
    'e': ['é', 'è', 'ê'],
    'a': ['à', 'â'],
    'i': ['î', 'ï'],
    'o': ['ô'],
    'u': ['ù', 'û', 'ü']
  }
  
  Object.entries(variationsAccents).forEach(([lettre, accents]) => {
    if (motCle.includes(lettre)) {
      accents.forEach(accent => {
        variations.push(motCle.replace(new RegExp(lettre, 'g'), accent))
      })
    }
  })
  
  return [...new Set(variations)] // Supprimer les doublons
}

/**
 * Vérifie si un mot-clé est utilisé dans un contexte approprié
 */
const verifierContexteApproprie = (texte, motCle) => {
  // Logique simplifiée pour vérifier le contexte
  const contexte = texte.toLowerCase()
  const motCleLower = motCle.toLowerCase()
  
  // Vérifier si le mot-clé n'est pas isolé
  const regex = new RegExp(`\\b${motCleLower}\\b`, 'g')
  const matches = contexte.match(regex) || []
  
  return matches.length > 0
}

module.exports = {
  evaluerUtilisationChampLexical,
  evaluerPositionImplementation,
  evaluerLongueurSuffisante,
  evaluerStructureLisibilite,
  evaluerContenuDuplique
} 