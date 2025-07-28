/**
 * Barème de notation SEO pour l'analyse de texte
 * Système modulaire et configurable sur 100 points
 */

// Configuration générale du barème
const BAREME_CONFIG = {
  TOTAL_POINTS: 100,
  VERSION: '2.2.0',
  ENABLED: true
}

// Critères principaux avec leurs poids et sous-critères
const CRITERES = {
  UTILISATION_CHAMP_LEXICAL: {
    id: 'utilisation_champ_lexical',
    nom: 'Utilisation des mots clé et de leurs champ lexical',
    poids: 60,
    enabled: true,
    description: 'Analyse du champ lexical des mots clé présent dans le texte avec détection automatique des mots-clés thématiques',
    sous_criteres: {
      DECLINATION_MOTS_CLES: {
        id: 'declination_mots_cles',
        nom: 'Décliner les mots clés en plusieurs champ lexical',
        points: 30,
        enabled: true,
        description: 'Décliner les mots clés en plusieurs champ lexical, et verification de l\'utilisation dans le texte'
      },
      CORRESPONDANCE_PARFAITE: {
        id: 'correspondance_parfaite',
        nom: 'Correspondance parfaite au mots clé et à l\'intention de recherche',
        points: 30,
        enabled: true,
        description: 'Doit correspondre parfaitement au mots clé et à l\'intention de recherche'
      }
    }
  },

  POSITION_IMPLEMENTATION: {
    id: 'position_implementation',
    nom: 'Position et Implémentation des mots clefs',
    poids: 10,
    enabled: true,
    sous_criteres: {
      MOTS_CLES_PREMIER_PARAGRAPHE: {
        id: 'mots_cles_premier_paragraphe',
        nom: 'Mots clé dans le premier paragraphe',
        points: 5,
        enabled: true,
        description: 'Les mots-clés sont-ils présents dans le premier paragraphe ?'
      },
      MOTS_CLES_DEBUT_PARAGRAPHES: {
        id: 'mots_cles_debut_paragraphes',
        nom: 'Mots clé dans les début de paragraphe',
        points: 5,
        enabled: true,
        description: 'Les mots-clés sont-ils présents au début des paragraphes ?'
      }
    }
  },

  LONGUEUR_SUFFISANTE: {
    id: 'longueur_suffisante',
    nom: 'Longueur suffisante',
    poids: 5,
    enabled: true,
    description: 'Longueur du texte avec échelle progressive jusqu\'à 2000 mots',
    sous_criteres: {
      ECHELLE_LONGUEUR: {
        id: 'echelle_longueur',
        nom: 'Échelle de longueur (0 pts si <50 mots, 1 pt si +50, jusqu\'à 2000)',
        points: 5,
        enabled: true,
        description: 'Échelle progressive de notation selon la longueur du texte',
        seuils: {
          minimum: 50,
          maximum: 2000,
          echelle: [
            { mots: 50, points: 1 },
            { mots: 100, points: 2 },
            { mots: 200, points: 3 },
            { mots: 500, points: 4 },
            { mots: 2000, points: 5 }
          ]
        }
      }
    }
  },

  STRUCTURE_LISIBILITE: {
    id: 'structure_lisibilite',
    nom: 'Structure et lisibilité',
    poids: 10,
    enabled: true,
    sous_criteres: {
      DENSITE_MOTS: {
        id: 'densite_mots',
        nom: 'Vérifier densité des mots',
        points: 5,
        enabled: true,
        description: 'La densité des mots est-elle appropriée ?'
      },
      DECOUPE_PARAGRAPHES: {
        id: 'decoupe_paragraphes',
        nom: 'Vérifier la découpe en plusieurs paragraphe (avec une moyenne de mots par paragraphe)',
        points: 5,
        enabled: true,
        description: 'Le texte est-il bien découpé en paragraphes avec une moyenne appropriée ?'
      }
    }
  },

  CONTENU_DUPLIQUE: {
    id: 'contenu_duplique',
    nom: 'Contenu dupliqué',
    poids: 15,
    enabled: true,
    description: 'Évaluation du contenu dupliqué avec échelle spécifique',
    sous_criteres: {
      POURCENTAGE_DUPLICATION: {
        id: 'pourcentage_duplication',
        nom: 'Pourcentage de duplication du contenu',
        points: 15,
        enabled: true,
        description: 'Évaluation du pourcentage de contenu dupliqué',
        seuils: {
          '100%': 0,
          '75%': 1,
          '50%': 3,
          '40%': 4,
          '30%': 5,
          '20%': 7,
          '10%': 9,
          '5%': 12,
          '3%': 13,
          '2%': 14,
          '0%': 15
        }
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
  UTILISATION_CHAMP_LEXICAL: 'Développez le champ lexical de vos mots-clés en utilisant des synonymes, variations et termes associés. Enrichissez votre contenu avec les mots-clés thématiques et leurs synonymes détectés automatiquement.',
  POSITION_IMPLEMENTATION: 'Placez vos mots-clés dans le premier paragraphe et au début des paragraphes suivants.',
  LONGUEUR_SUFFISANTE: 'Rédigez un contenu suffisamment long (minimum 50 mots, idéalement plus de 500 mots).',
  STRUCTURE_LISIBILITE: 'Structurez votre contenu avec une densité appropriée et une découpe en paragraphes claire.',
  CONTENU_DUPLIQUE: 'Évitez la duplication de contenu pour maintenir l\'originalité de votre texte.'
}

module.exports = {
  BAREME_CONFIG,
  CRITERES,
  SEUILS_NOTATION,
  MESSAGES_AIDE
} 