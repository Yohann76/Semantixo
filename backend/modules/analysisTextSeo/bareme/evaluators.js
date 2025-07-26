/**
 * Évaluateurs pour le barème SEO de texte
 * Fonctions d'analyse et de notation pour chaque critère
 */

const { CRITERES, SEUILS_NOTATION } = require('./constants')

/**
 * Évalue la pertinence et l'intention de recherche
 */
const evaluerPertinenceIntention = (texte, motsCles, intentionRecherche) => {
  const resultats = {
    critere: CRITERES.PERTINENCE_INTENTION,
    score: 0,
    details: {},
    sous_criteres: {}
  }

  // Évaluation de la réponse à l'intention de recherche
  if (CRITERES.PERTINENCE_INTENTION.sous_criteres.REPONSE_INTENTION.enabled) {
    const reponseIntention = evaluerReponseIntention(texte, intentionRecherche)
    resultats.sous_criteres.reponse_intention = reponseIntention
    resultats.score += reponseIntention.points
  }

  // Évaluation de la cohérence du contenu
  if (CRITERES.PERTINENCE_INTENTION.sous_criteres.COHERENCE_CONTENU.enabled) {
    const coherenceContenu = evaluerCohérenceContenu(texte, motsCles)
    resultats.sous_criteres.coherence_contenu = coherenceContenu
    resultats.score += coherenceContenu.points
  }

  return resultats
}

/**
 * Évalue la qualité du contenu
 */
const evaluerQualiteContenu = (texte) => {
  const resultats = {
    critere: CRITERES.QUALITE_CONTENU,
    score: 0,
    details: {},
    sous_criteres: {}
  }

  // Évaluation de la longueur
  if (CRITERES.QUALITE_CONTENU.sous_criteres.LONGUEUR_SUFFISANTE.enabled) {
    const longueur = evaluerLongueurTexte(texte)
    resultats.sous_criteres.longueur_suffisante = longueur
    resultats.score += longueur.points
  }

  // Évaluation de la richesse du contenu
  if (CRITERES.QUALITE_CONTENU.sous_criteres.CONTENU_RICHE.enabled) {
    const richesse = evaluerRichesseContenu(texte)
    resultats.sous_criteres.contenu_riche = richesse
    resultats.score += richesse.points
  }

  return resultats
}

/**
 * Évalue la structure et la lisibilité
 */
const evaluerStructureLisibilite = (texte) => {
  const resultats = {
    critere: CRITERES.STRUCTURE_LISIBILITE,
    score: 0,
    details: {},
    sous_criteres: {}
  }

  // Évaluation des paragraphes
  if (CRITERES.STRUCTURE_LISIBILITE.sous_criteres.PARAGRAPHES_CLAIRS.enabled) {
    const paragraphes = evaluerParagraphesClairs(texte)
    resultats.sous_criteres.paragraphes_clairs = paragraphes
    resultats.score += paragraphes.points
  }

  // Évaluation des listes
  if (CRITERES.STRUCTURE_LISIBILITE.sous_criteres.LISTES_PRESENCE.enabled) {
    const listes = evaluerPresenceListes(texte)
    resultats.sous_criteres.listes_presence = listes
    resultats.score += listes.points
  }

  // Évaluation de la hiérarchie des titres
  if (CRITERES.STRUCTURE_LISIBILITE.sous_criteres.HIERARCHIE_TITRES.enabled) {
    const hierarchie = evaluerHierarchieTitres(texte)
    resultats.sous_criteres.hierarchie_titres = hierarchie
    resultats.score += hierarchie.points
  }

  return resultats
}

/**
 * Évalue l'utilisation des mots-clés
 */
const evaluerUtilisationMotsCles = (texte, motsCles) => {
  const resultats = {
    critere: CRITERES.UTILISATION_MOTS_CLES,
    score: 0,
    details: {},
    sous_criteres: {}
  }

  // Évaluation de la densité naturelle
  if (CRITERES.UTILISATION_MOTS_CLES.sous_criteres.DENSITE_NATURELLE.enabled) {
    const densite = evaluerDensiteMotsCles(texte, motsCles)
    resultats.sous_criteres.densite_naturelle = densite
    resultats.score += densite.points
  }

  // Évaluation des variations et synonymes
  if (CRITERES.UTILISATION_MOTS_CLES.sous_criteres.VARIATIONS_SYNONYMES.enabled) {
    const variations = evaluerVariationsSynonymes(texte, motsCles)
    resultats.sous_criteres.variations_synonymes = variations
    resultats.score += variations.points
  }

  return resultats
}

/**
 * Évalue l'originalité et la valeur ajoutée
 */
const evaluerOriginaliteValeur = (texte) => {
  const resultats = {
    critere: CRITERES.ORIGINALITE_VALEUR,
    score: 0,
    details: {},
    sous_criteres: {}
  }

  // Évaluation de l'unicité du contenu
  if (CRITERES.ORIGINALITE_VALEUR.sous_criteres.CONTENU_UNIQUE.enabled) {
    const unicite = evaluerContenuUnique(texte)
    resultats.sous_criteres.contenu_unique = unicite
    resultats.score += unicite.points
  }

  // Évaluation des informations nouvelles
  if (CRITERES.ORIGINALITE_VALEUR.sous_criteres.INFORMATIONS_NOUVELLES.enabled) {
    const nouvelles = evaluerInformationsNouvelles(texte)
    resultats.sous_criteres.informations_nouvelles = nouvelles
    resultats.score += nouvelles.points
  }

  return resultats
}

/**
 * Évalue l'engagement et l'expérience utilisateur
 */
const evaluerEngagementUX = (texte) => {
  const resultats = {
    critere: CRITERES.ENGAGEMENT_UX,
    score: 0,
    details: {},
    sous_criteres: {}
  }

  // Évaluation de la fluidité de lecture
  if (CRITERES.ENGAGEMENT_UX.sous_criteres.FLUIDITE_LECTURE.enabled) {
    const fluidite = evaluerFluiditeLecture(texte)
    resultats.sous_criteres.fluidite_lecture = fluidite
    resultats.score += fluidite.points
  }

  // Évaluation de l'absence d'erreurs
  if (CRITERES.ENGAGEMENT_UX.sous_criteres.ABSENCE_ERREURS.enabled) {
    const erreurs = evaluerAbsenceErreurs(texte)
    resultats.sous_criteres.absence_erreurs = erreurs
    resultats.score += erreurs.points
  }

  return resultats
}

/**
 * Évalue les techniques SEO de base
 */
const evaluerTechniquesSeoBase = (texte, motsCles) => {
  const resultats = {
    critere: CRITERES.TECHNIQUES_SEO_BASE,
    score: 0,
    details: {},
    sous_criteres: {}
  }

  // Évaluation de l'utilisation des mots-clés dans les premiers paragraphes
  if (CRITERES.TECHNIQUES_SEO_BASE.sous_criteres.MOTS_CLES_PREMIERS_PARAGRAPHES.enabled) {
    const premiersParagraphes = evaluerMotsClesPremiersParagraphes(texte, motsCles)
    resultats.sous_criteres.mots_cles_premiers_paragraphes = premiersParagraphes
    resultats.score += premiersParagraphes.points
  }

  return resultats
}

// Fonctions d'évaluation spécifiques pour chaque sous-critère

const evaluerReponseIntention = (texte, intentionRecherche) => {
  // Logique d'évaluation de la réponse à l'intention
  const points = Math.floor(Math.random() * 11) // 0-10 points pour l'exemple
  return {
    points,
    max_points: 10,
    details: {
      intention_detectee: intentionRecherche,
      pertinence: points / 10
    }
  }
}

const evaluerCohérenceContenu = (texte, motsCles) => {
  // Logique d'évaluation de la cohérence
  const points = Math.floor(Math.random() * 11) // 0-10 points pour l'exemple
  return {
    points,
    max_points: 10,
    details: {
      mots_cles_trouves: motsCles.filter(mc => texte.toLowerCase().includes(mc.toLowerCase())),
      coherence_score: points / 10
    }
  }
}

const evaluerLongueurTexte = (texte) => {
  const mots = texte.split(/\s+/).length
  const seuils = CRITERES.QUALITE_CONTENU.sous_criteres.LONGUEUR_SUFFISANTE.seuils
  
  let points = 0
  if (mots >= seuils.ideal) {
    points = 10
  } else if (mots >= seuils.minimum) {
    points = 7
  } else if (mots >= seuils.minimum * 0.8) {
    points = 4
  } else {
    points = 0
  }

  return {
    points,
    max_points: 10,
    details: {
      nombre_mots: mots,
      seuil_minimum: seuils.minimum,
      seuil_ideal: seuils.ideal,
      statut: mots >= seuils.ideal ? 'idéal' : mots >= seuils.minimum ? 'suffisant' : 'insuffisant'
    }
  }
}

const evaluerRichesseContenu = (texte) => {
  // Logique d'évaluation de la richesse du contenu
  const points = Math.floor(Math.random() * 11) // 0-10 points pour l'exemple
  return {
    points,
    max_points: 10,
    details: {
      diversite_vocabulaire: points / 10,
      digressions_detectees: Math.random() > 0.7
    }
  }
}

const evaluerParagraphesClairs = (texte) => {
  const paragraphes = texte.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const longueurMoyenne = paragraphes.reduce((acc, p) => acc + p.length, 0) / paragraphes.length
  
  let points = 0
  if (paragraphes.length >= 3 && longueurMoyenne >= 100) {
    points = 5
  } else if (paragraphes.length >= 2) {
    points = 3
  } else {
    points = 1
  }

  return {
    points,
    max_points: 5,
    details: {
      nombre_paragraphes: paragraphes.length,
      longueur_moyenne: Math.round(longueurMoyenne),
      structure_claire: points >= 3
    }
  }
}

const evaluerPresenceListes = (texte) => {
  const listesPuces = (texte.match(/^\s*[-•*]\s/gm) || []).length
  const listesNumerotees = (texte.match(/^\s*\d+\.\s/gm) || []).length
  
  let points = 0
  if (listesPuces + listesNumerotees >= 2) {
    points = 5
  } else if (listesPuces + listesNumerotees >= 1) {
    points = 3
  } else {
    points = 0
  }

  return {
    points,
    max_points: 5,
    details: {
      listes_puces: listesPuces,
      listes_numerotees: listesNumerotees,
      total_listes: listesPuces + listesNumerotees
    }
  }
}

const evaluerHierarchieTitres = (texte) => {
  const titresH2 = (texte.match(/^##\s+/gm) || []).length
  const titresH3 = (texte.match(/^###\s+/gm) || []).length
  
  let points = 0
  if (titresH2 >= 2 && titresH3 >= 1) {
    points = 5
  } else if (titresH2 >= 1) {
    points = 3
  } else {
    points = 0
  }

  return {
    points,
    max_points: 5,
    details: {
      titres_h2: titresH2,
      titres_h3: titresH3,
      hierarchie_presente: points >= 3
    }
  }
}

const evaluerDensiteMotsCles = (texte, motsCles) => {
  const texteLower = texte.toLowerCase()
  const motsTexte = texteLower.split(/\s+/)
  const totalMots = motsTexte.length
  
  let points = 0
  let densiteTotale = 0
  
  motsCles.forEach(motCle => {
    const occurrences = (texteLower.match(new RegExp(motCle.toLowerCase(), 'g')) || []).length
    const densite = (occurrences / totalMots) * 100
    densiteTotale += densite
  })
  
  const densiteMoyenne = densiteTotale / motsCles.length
  const seuils = CRITERES.UTILISATION_MOTS_CLES.sous_criteres.DENSITE_NATURELLE.seuils
  
  if (densiteMoyenne >= seuils.densite_min && densiteMoyenne <= seuils.densite_max) {
    points = 10
  } else if (densiteMoyenne > 0) {
    points = 5
  } else {
    points = 0
  }

  return {
    points,
    max_points: 10,
    details: {
      densite_moyenne: Math.round(densiteMoyenne * 100) / 100,
      seuil_min: seuils.densite_min,
      seuil_max: seuils.densite_max,
      densite_optimale: points >= 8
    }
  }
}

const evaluerVariationsSynonymes = (texte, motsCles) => {
  // Logique simplifiée pour détecter les variations
  const points = Math.floor(Math.random() * 6) // 0-5 points pour l'exemple
  return {
    points,
    max_points: 5,
    details: {
      variations_detectees: points > 0,
      nombre_variations: points
    }
  }
}

const evaluerContenuUnique = (texte) => {
  // Logique d'évaluation de l'unicité
  const points = Math.floor(Math.random() * 6) // 0-5 points pour l'exemple
  return {
    points,
    max_points: 5,
    details: {
      unicite_detectee: points > 0,
      score_originalite: points / 5
    }
  }
}

const evaluerInformationsNouvelles = (texte) => {
  // Logique d'évaluation des informations nouvelles
  const points = Math.floor(Math.random() * 6) // 0-5 points pour l'exemple
  return {
    points,
    max_points: 5,
    details: {
      valeur_ajoutee: points > 0,
      perspectives_nouvelles: points >= 3
    }
  }
}

const evaluerFluiditeLecture = (texte) => {
  // Logique d'évaluation de la fluidité
  const points = Math.floor(Math.random() * 6) // 0-5 points pour l'exemple
  return {
    points,
    max_points: 5,
    details: {
      fluidite_detectee: points > 0,
      ton_adapte: points >= 3
    }
  }
}

const evaluerAbsenceErreurs = (texte) => {
  // Logique d'évaluation des erreurs (simplifiée)
  const points = Math.floor(Math.random() * 6) // 0-5 points pour l'exemple
  return {
    points,
    max_points: 5,
    details: {
      erreurs_detectees: points < 3,
      qualite_redactionnelle: points / 5
    }
  }
}

const evaluerMotsClesPremiersParagraphes = (texte, motsCles) => {
  const paragraphes = texte.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const premiersParagraphes = paragraphes.slice(0, 2).join(' ').toLowerCase()
  
  let points = 0
  let motsClesTrouves = 0
  
  motsCles.forEach(motCle => {
    if (premiersParagraphes.includes(motCle.toLowerCase())) {
      motsClesTrouves++
    }
  })
  
  if (motsClesTrouves >= motsCles.length * 0.7) {
    points = 10
  } else if (motsClesTrouves >= motsCles.length * 0.5) {
    points = 7
  } else if (motsClesTrouves > 0) {
    points = 4
  } else {
    points = 0
  }

  return {
    points,
    max_points: 10,
    details: {
      mots_cles_premiers_paragraphes: motsClesTrouves,
      total_mots_cles: motsCles.length,
      taux_presence: Math.round((motsClesTrouves / motsCles.length) * 100)
    }
  }
}

module.exports = {
  evaluerPertinenceIntention,
  evaluerQualiteContenu,
  evaluerStructureLisibilite,
  evaluerUtilisationMotsCles,
  evaluerOriginaliteValeur,
  evaluerEngagementUX,
  evaluerTechniquesSeoBase
} 