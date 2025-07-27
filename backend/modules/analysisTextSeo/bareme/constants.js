/**
 * Barème de notation SEO pour l'analyse de texte
 * Système modulaire et configurable sur 100 points
 */

// Configuration générale du barème
const BAREME_CONFIG = {
  TOTAL_POINTS: 100,
  VERSION: '1.0.0',
  ENABLED: true
}

// Critères principaux avec leurs poids et sous-critères
const CRITERES = {
  QUALITE_CONTENU: {
    id: 'qualite_contenu',
    nom: 'Qualité du contenu',
    poids: 30,
    enabled: true,
    sous_criteres: {
      LONGUEUR_SUFFISANTE: {
        id: 'longueur_suffisante',
        nom: 'Longueur suffisante (minimum 600 mots, idéal >1000)',
        points: 10,
        enabled: true,
        description: 'Le texte fait-il au moins 600 mots ? Idéalement plus de 1000 mots ?',
        seuils: {
          minimum: 600,
          ideal: 1000
        }
      },
      CONTENU_RICHE: {
        id: 'contenu_riche',
        nom: 'Contenu riche, sans digressions inutiles',
        points: 10,
        enabled: true,
        description: 'Le contenu est-il riche et pertinent, sans digressions inutiles ?'
      }
    }
  },

  STRUCTURE_LISIBILITE: {
    id: 'structure_lisibilite',
    nom: 'Structure et lisibilité',
    poids: 20,
    enabled: true,
    sous_criteres: {
      PARAGRAPHES_CLAIRS: {
        id: 'paragraphes_clairs',
        nom: 'Textes bien segmentés en paragraphes clairs',
        points: 5,
        enabled: true,
        description: 'Le texte est-il bien segmenté en paragraphes clairs et lisibles ?'
      },
      LISTES_PRESENCE: {
        id: 'listes_presence',
        nom: 'Présence de listes à puces ou numérotées',
        points: 5,
        enabled: true,
        description: 'Le texte contient-il des listes à puces ou numérotées pour améliorer la lisibilité ?'
      },
      HIERARCHIE_TITRES: {
        id: 'hierarchie_titres',
        nom: 'Hiérarchie logique des titres (H2, H3, pyramide inversée)',
        points: 5,
        enabled: true,
        description: 'Y a-t-il une hiérarchie logique des titres avec une structure en pyramide inversée ?'
      }
    }
  },

  UTILISATION_MOTS_CLES: {
    id: 'utilisation_mots_cles',
    nom: 'Utilisation des mots-clés',
    poids: 20,
    enabled: true,
    sous_criteres: {
      DENSITE_NATURELLE: {
        id: 'densite_naturelle',
        nom: 'Densité naturelle et équilibrée des mots-clés principaux',
        points: 10,
        enabled: true,
        description: 'Les mots-clés principaux sont-ils utilisés de manière naturelle et équilibrée ?',
        seuils: {
          densite_min: 0.5,
          densite_max: 2.5
        }
      },
      VARIATIONS_SYNONYMES: {
        id: 'variations_synonymes',
        nom: 'Variations et synonymes utilisés',
        points: 5,
        enabled: true,
        description: 'Y a-t-il des variations et synonymes des mots-clés principaux ?'
      }
    }
  },

  ORIGINALITE_VALEUR: {
    id: 'originalite_valeur',
    nom: 'Originalité et valeur ajoutée',
    poids: 10,
    enabled: true,
    sous_criteres: {
      CONTENU_UNIQUE: {
        id: 'contenu_unique',
        nom: 'Contenu unique, sans duplication',
        points: 5,
        enabled: true,
        description: 'Le contenu est-il unique et original, sans duplication ?'
      },
      INFORMATIONS_NOUVELLES: {
        id: 'informations_nouvelles',
        nom: 'Apport d\'informations ou perspectives nouvelles',
        points: 5,
        enabled: true,
        description: 'Le contenu apporte-t-il des informations ou perspectives nouvelles ?'
      }
    }
  },

  ENGAGEMENT_UX: {
    id: 'engagement_ux',
    nom: 'Engagement et expérience utilisateur (UX)',
    poids: 10,
    enabled: true,
    sous_criteres: {
      FLUIDITE_LECTURE: {
        id: 'fluidite_lecture',
        nom: 'Fluidité de lecture et ton adapté au public cible',
        points: 5,
        enabled: true,
        description: 'La lecture est-elle fluide avec un ton adapté au public cible ?'
      },
      ABSENCE_ERREURS: {
        id: 'absence_erreurs',
        nom: 'Absence d\'erreurs grammaticales et orthographiques',
        points: 5,
        enabled: true,
        description: 'Y a-t-il une absence d\'erreurs grammaticales et orthographiques ?'
      }
    }
  },

  TECHNIQUES_SEO_BASE: {
    id: 'techniques_seo_base',
    nom: 'Techniques SEO de base',
    poids: 10,
    enabled: true,
    sous_criteres: {
      MOTS_CLES_PREMIERS_PARAGRAPHES: {
        id: 'mots_cles_premiers_paragraphes',
        nom: 'Utilisation correcte et pertinente des mots-clés dans les premiers paragraphes',
        points: 10,
        enabled: true,
        description: 'Les mots-clés sont-ils utilisés de manière pertinente dans les premiers paragraphes ?'
      }
    }
  }
}

// Seuils de notation
const SEUILS_NOTATION = {
  EXCELLENT: { min: 85, label: 'Excellent' },
  TRES_BON: { min: 70, label: 'Très bon' },
  BON: { min: 55, label: 'Bon' },
  MOYEN: { min: 40, label: 'Moyen' },
  INSUFFISANT: { min: 0, label: 'Insuffisant' }
}

// Messages d'aide pour chaque critère
const MESSAGES_AIDE = {
  PERTINENCE_INTENTION: 'Assurez-vous que votre contenu répond clairement à l\'intention de recherche de l\'utilisateur.',
  QUALITE_CONTENU: 'Privilégiez un contenu long et riche (minimum 600 mots, idéalement plus de 1000 mots).',
  STRUCTURE_LISIBILITE: 'Structurez votre contenu avec des paragraphes clairs, des listes et une hiérarchie logique.',
  UTILISATION_MOTS_CLES: 'Utilisez vos mots-clés de manière naturelle et équilibrée, avec des variations.',
  ORIGINALITE_VALEUR: 'Apportez une valeur unique et des informations nouvelles à votre audience.',
  ENGAGEMENT_UX: 'Rédigez de manière fluide et sans erreurs pour une meilleure expérience utilisateur.',
  TECHNIQUES_SEO_BASE: 'Placez vos mots-clés principaux dans les premiers paragraphes de manière pertinente.'
}

module.exports = {
  BAREME_CONFIG,
  CRITERES,
  SEUILS_NOTATION,
  MESSAGES_AIDE
} 