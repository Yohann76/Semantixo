/**
 * Moteur de notation principal pour le barème SEO de texte
 * Orchestre toutes les évaluations et calcule le score final
 */

const { BAREME_CONFIG, CRITERES, SEUILS_NOTATION, MESSAGES_AIDE } = require('./constants')
const {
  evaluerPertinenceIntention,
  evaluerQualiteContenu,
  evaluerStructureLisibilite,
  evaluerUtilisationMotsCles,
  evaluerOriginaliteValeur,
  evaluerEngagementUX,
  evaluerTechniquesSeoBase
} = require('./evaluators')

/**
 * Classe principale pour l'évaluation SEO de texte
 */
class TextSeoScorer {
  constructor() {
    this.version = BAREME_CONFIG.VERSION
    this.totalPoints = BAREME_CONFIG.TOTAL_POINTS
    this.enabled = BAREME_CONFIG.ENABLED
  }

  /**
   * Évalue un texte selon le barème SEO complet
   * @param {string} texte - Le texte à analyser
   * @param {Array} motsCles - Les mots-clés ciblés
   * @param {string} intentionRecherche - L'intention de recherche (optionnel)
   * @returns {Object} Résultats complets de l'évaluation
   */
  evaluerTexte(texte, motsCles = [], intentionRecherche = 'informationnelle') {
    if (!this.enabled) {
      throw new Error('Le barème SEO est désactivé')
    }

    if (!texte || typeof texte !== 'string') {
      throw new Error('Le texte à analyser est requis et doit être une chaîne de caractères')
    }

    const resultats = {
      texte_analyse: texte.substring(0, 100) + '...',
      mots_cles_cibles: motsCles,
      intention_recherche: intentionRecherche,
      bareme_version: this.version,
      score_total: 0,
      score_maximum: this.totalPoints,
      notation: '',
      criteres: {},
      recommandations: [],
      timestamp: new Date().toISOString()
    }

    // Évaluation de chaque critère principal
    const evaluations = []

    // 1. Pertinence et intention de recherche
    if (CRITERES.PERTINENCE_INTENTION.enabled) {
      const pertinence = evaluerPertinenceIntention(texte, motsCles, intentionRecherche)
      evaluations.push(pertinence)
      resultats.criteres.pertinence_intention = pertinence
    }

    // 2. Qualité du contenu
    if (CRITERES.QUALITE_CONTENU.enabled) {
      const qualite = evaluerQualiteContenu(texte)
      evaluations.push(qualite)
      resultats.criteres.qualite_contenu = qualite
    }

    // 3. Structure et lisibilité
    if (CRITERES.STRUCTURE_LISIBILITE.enabled) {
      const structure = evaluerStructureLisibilite(texte)
      evaluations.push(structure)
      resultats.criteres.structure_lisibilite = structure
    }

    // 4. Utilisation des mots-clés
    if (CRITERES.UTILISATION_MOTS_CLES.enabled) {
      const motsClesEval = evaluerUtilisationMotsCles(texte, motsCles)
      evaluations.push(motsClesEval)
      resultats.criteres.utilisation_mots_cles = motsClesEval
    }

    // 5. Originalité et valeur ajoutée
    if (CRITERES.ORIGINALITE_VALEUR.enabled) {
      const originalite = evaluerOriginaliteValeur(texte)
      evaluations.push(originalite)
      resultats.criteres.originalite_valeur = originalite
    }

    // 6. Engagement et expérience utilisateur
    if (CRITERES.ENGAGEMENT_UX.enabled) {
      const engagement = evaluerEngagementUX(texte)
      evaluations.push(engagement)
      resultats.criteres.engagement_ux = engagement
    }

    // 7. Techniques SEO de base
    if (CRITERES.TECHNIQUES_SEO_BASE.enabled) {
      const techniques = evaluerTechniquesSeoBase(texte, motsCles)
      evaluations.push(techniques)
      resultats.criteres.techniques_seo_base = techniques
    }

    // Calcul du score total
    resultats.score_total = evaluations.reduce((total, evaluation) => total + evaluation.score, 0)

    // Détermination de la notation
    resultats.notation = this.determinerNotation(resultats.score_total)

    // Génération des recommandations
    resultats.recommandations = this.genererRecommandations(evaluations)

    // Ajout des métriques détaillées
    resultats.metriques = this.calculerMetriques(texte, evaluations)

    return resultats
  }

  /**
   * Détermine la notation basée sur le score
   * @param {number} score - Le score total
   * @returns {string} La notation (Excellent, Très bon, etc.)
   */
  determinerNotation(score) {
    for (const [niveau, seuil] of Object.entries(SEUILS_NOTATION)) {
      if (score >= seuil.min) {
        return seuil.label
      }
    }
    return 'Insuffisant'
  }

  /**
   * Génère des recommandations basées sur les évaluations
   * @param {Array} evaluations - Les évaluations de chaque critère
   * @returns {Array} Liste des recommandations
   */
  genererRecommandations(evaluations) {
    const recommandations = []

    evaluations.forEach(evaluation => {
      const critere = evaluation.critere
      const score = evaluation.score
      const maxScore = critere.poids

      // Si le score est inférieur à 70% du maximum, ajouter une recommandation
      if (score < maxScore * 0.7) {
        const messageAide = MESSAGES_AIDE[critere.id.toUpperCase()]
        if (messageAide) {
          recommandations.push({
            critere: critere.nom,
            score_actuel: score,
            score_maximum: maxScore,
            pourcentage: Math.round((score / maxScore) * 100),
            recommandation: messageAide
          })
        }
      }
    })

    return recommandations
  }

  /**
   * Calcule des métriques détaillées
   * @param {string} texte - Le texte analysé
   * @param {Array} evaluations - Les évaluations
   * @returns {Object} Métriques détaillées
   */
  calculerMetriques(texte, evaluations) {
    const mots = texte.split(/\s+/).length
    const caracteres = texte.length
    const paragraphes = texte.split(/\n\s*\n/).filter(p => p.trim().length > 0).length

    return {
      statistiques_texte: {
        nombre_mots: mots,
        nombre_caracteres: caracteres,
        nombre_paragraphes: paragraphes,
        longueur_moyenne_paragraphe: Math.round(mots / paragraphes)
      },
      repartition_scores: evaluations.map(evaluation => ({
        critere: evaluation.critere.nom,
        score: evaluation.score,
        poids: evaluation.critere.poids,
        pourcentage: Math.round((evaluation.score / evaluation.critere.poids) * 100)
      })),
      performance_globale: {
        score_moyen: Math.round(evaluations.reduce((acc, evaluation) => acc + (evaluation.score / evaluation.critere.poids), 0) / evaluations.length * 100),
        criteres_excellents: evaluations.filter(evaluation => (evaluation.score / evaluation.critere.poids) >= 0.8).length,
        criteres_a_ameliorer: evaluations.filter(evaluation => (evaluation.score / evaluation.critere.poids) < 0.6).length
      }
    }
  }

  /**
   * Active ou désactive un critère spécifique
   * @param {string} critereId - L'ID du critère
   * @param {boolean} enabled - Activer ou désactiver
   */
  toggleCritere(critereId, enabled = true) {
    const critere = Object.values(CRITERES).find(c => c.id === critereId)
    if (critere) {
      critere.enabled = enabled
      console.log(`Critère "${critere.nom}" ${enabled ? 'activé' : 'désactivé'}`)
    } else {
      throw new Error(`Critère "${critereId}" non trouvé`)
    }
  }

  /**
   * Active ou désactive un sous-critère spécifique
   * @param {string} critereId - L'ID du critère parent
   * @param {string} sousCritereId - L'ID du sous-critère
   * @param {boolean} enabled - Activer ou désactiver
   */
  toggleSousCritere(critereId, sousCritereId, enabled = true) {
    const critere = Object.values(CRITERES).find(c => c.id === critereId)
    if (critere) {
      const sousCritere = Object.values(critere.sous_criteres).find(sc => sc.id === sousCritereId)
      if (sousCritere) {
        sousCritere.enabled = enabled
        console.log(`Sous-critère "${sousCritere.nom}" ${enabled ? 'activé' : 'désactivé'}`)
      } else {
        throw new Error(`Sous-critère "${sousCritereId}" non trouvé dans le critère "${critereId}"`)
      }
    } else {
      throw new Error(`Critère "${critereId}" non trouvé`)
    }
  }

  /**
   * Obtient la configuration actuelle du barème
   * @returns {Object} Configuration complète
   */
  getConfiguration() {
    return {
      version: this.version,
      total_points: this.totalPoints,
      enabled: this.enabled,
      criteres: CRITERES,
      seuils_notation: SEUILS_NOTATION
    }
  }

  /**
   * Valide la configuration du barème
   * @returns {Object} Résultat de la validation
   */
  validerConfiguration() {
    const erreurs = []
    const avertissements = []

    // Vérifier que la somme des poids est égale au total
    const poidsTotal = Object.values(CRITERES).reduce((total, critere) => {
      return total + (critere.enabled ? critere.poids : 0)
    }, 0)

    if (poidsTotal !== this.totalPoints) {
      erreurs.push(`La somme des poids (${poidsTotal}) ne correspond pas au total (${this.totalPoints})`)
    }

    // Vérifier les critères désactivés
    const criteresDesactives = Object.values(CRITERES).filter(c => !c.enabled)
    if (criteresDesactives.length > 0) {
      avertissements.push(`${criteresDesactives.length} critère(s) désactivé(s)`)
    }

    return {
      valide: erreurs.length === 0,
      erreurs,
      avertissements,
      poids_total: poidsTotal,
      poids_attendu: this.totalPoints
    }
  }
}

module.exports = TextSeoScorer 