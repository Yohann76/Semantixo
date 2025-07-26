const dns = require('dns').promises;
const { promisify } = require('util');

/**
 * Classe AnalyzerDomain pour l'analyse de noms de domaine
 */
class AnalyzerDomain {
  /**
   * Analyse d'un nom de domaine
   * @param {string} domain - Le nom de domaine à analyser
   * @returns {Object} - Résultats de l'analyse du domaine
   */
  static async analyze(domain) {
    try {
      // Valider le domaine
      if (!domain || !domain.trim()) {
        throw new Error('Le nom de domaine ne peut pas être vide');
      }

      // Normaliser le domaine
      let normalizedDomain = domain.trim().toLowerCase();
      
      // Supprimer le protocole si présent
      normalizedDomain = normalizedDomain.replace(/^https?:\/\//, '');
      
      // Supprimer le www si présent
      normalizedDomain = normalizedDomain.replace(/^www\./, '');

      console.log('🔍 [DOMAIN] Analyse du domaine:', normalizedDomain);

      // Extraire les composants du domaine
      const domainParts = normalizedDomain.split('.');
      const domainName = domainParts[0];
      const extension = domainParts.length > 1 ? domainParts.slice(1).join('.') : '';

      // Calculer les métriques
      const metrics = {
        domainAge: await this.getDomainAge(normalizedDomain),
        domainAuthority: await this.getDomainAuthority(normalizedDomain),
        domainLength: domainName.length,
        domainExtension: extension,
        domainKeywords: this.countKeywords(domainName),
        domainReadability: this.calculateReadability(domainName)
      };

      // Analyser les éléments du domaine
      const domainElements = {
        hasGoodLength: domainName.length >= 3 && domainName.length <= 15,
        hasGoodExtension: this.isGoodExtension(extension),
        hasKeywords: metrics.domainKeywords > 0,
        isMemorable: this.isMemorable(domainName),
        isBrandable: this.isBrandable(domainName),
        isAvailable: await this.isDomainAvailable(normalizedDomain)
      };

      // Calculer le score du domaine
      const domainScore = this.calculateDomainScore(metrics, domainElements);

      // Générer l'analyse
      const analysis = this.generateAnalysis(metrics, domainElements, domainScore);

      return {
        domainScore,
        metrics,
        domainElements,
        analysis
      };

    } catch (error) {
      console.error('Erreur AnalyzerDomain.analyze:', error);
      
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Impossible d\'accéder à ce domaine. Vérifiez que le nom de domaine est correct.');
      }

      throw new Error('Erreur lors de l\'analyse du domaine: ' + error.message);
    }
  }

  /**
   * Obtenir l'âge du domaine (simulation)
   */
  static async getDomainAge(domain) {
    // Simulation - en réalité, il faudrait interroger une API WHOIS
    return Math.floor(Math.random() * 10) + 1; // 1-10 ans
  }

  /**
   * Obtenir l'autorité du domaine (simulation)
   */
  static async getDomainAuthority(domain) {
    // Simulation - en réalité, il faudrait interroger une API SEO
    return Math.floor(Math.random() * 100) + 1; // 1-100
  }

  /**
   * Compter les mots-clés dans le nom de domaine
   */
  static countKeywords(domainName) {
    const keywords = ['shop', 'store', 'buy', 'online', 'web', 'site', 'blog', 'news', 'info', 'tech', 'digital', 'smart', 'fast', 'best', 'top', 'pro', 'expert', 'guide', 'help', 'support'];
    const domainLower = domainName.toLowerCase();
    return keywords.filter(keyword => domainLower.includes(keyword)).length;
  }

  /**
   * Calculer la lisibilité du nom de domaine
   */
  static calculateReadability(domainName) {
    const vowels = 'aeiouy';
    const consonants = 'bcdfghjklmnpqrstvwxz';
    let vowelCount = 0;
    let consonantCount = 0;

    for (let char of domainName.toLowerCase()) {
      if (vowels.includes(char)) vowelCount++;
      else if (consonants.includes(char)) consonantCount++;
    }

    const total = vowelCount + consonantCount;
    return total > 0 ? Math.round((vowelCount / total) * 100) : 0;
  }

  /**
   * Vérifier si l'extension est bonne
   */
  static isGoodExtension(extension) {
    const goodExtensions = ['com', 'org', 'net', 'io', 'co', 'me', 'app', 'dev', 'tech', 'ai', 'cloud', 'digital'];
    return goodExtensions.includes(extension.toLowerCase());
  }

  /**
   * Vérifier si le nom est mémorable
   */
  static isMemorable(domainName) {
    // Logique simple : nom court et avec des voyelles
    return domainName.length <= 10 && this.calculateReadability(domainName) >= 30;
  }

  /**
   * Vérifier si le nom est brandable
   */
  static isBrandable(domainName) {
    // Logique simple : nom unique et court
    return domainName.length <= 8 && !this.countKeywords(domainName);
  }

  /**
   * Vérifier si le domaine est disponible (simulation)
   */
  static async isDomainAvailable(domain) {
    try {
      await dns.resolve4(domain);
      return false; // Le domaine existe
    } catch (error) {
      return true; // Le domaine n'existe pas (disponible)
    }
  }

  /**
   * Calculer le score du domaine
   */
  static calculateDomainScore(metrics, domainElements) {
    let score = 0;

    // Critère 1: Longueur du domaine (20 points)
    if (metrics.domainLength >= 3 && metrics.domainLength <= 8) {
      score += 20;
    } else if (metrics.domainLength >= 9 && metrics.domainLength <= 12) {
      score += 15;
    } else if (metrics.domainLength >= 13 && metrics.domainLength <= 15) {
      score += 10;
    }

    // Critère 2: Extension (15 points)
    if (domainElements.hasGoodExtension) {
      score += 15;
    }

    // Critère 3: Lisibilité (20 points)
    if (metrics.domainReadability >= 40) {
      score += 20;
    } else if (metrics.domainReadability >= 30) {
      score += 15;
    } else if (metrics.domainReadability >= 20) {
      score += 10;
    }

    // Critère 4: Mémorabilité (15 points)
    if (domainElements.isMemorable) {
      score += 15;
    }

    // Critère 5: Brandabilité (15 points)
    if (domainElements.isBrandable) {
      score += 15;
    }

    // Critère 6: Disponibilité (15 points)
    if (domainElements.isAvailable) {
      score += 15;
    }

    return Math.min(Math.round(score), 100);
  }

  /**
   * Générer l'analyse et les recommandations
   */
  static generateAnalysis(metrics, domainElements, domainScore) {
    const recommendations = [];

    if (metrics.domainLength < 3) {
      recommendations.push('Le nom de domaine est trop court. Choisissez un nom d\'au moins 3 caractères.');
    } else if (metrics.domainLength > 15) {
      recommendations.push('Le nom de domaine est trop long. Choisissez un nom de 15 caractères maximum.');
    }

    if (!domainElements.hasGoodExtension) {
      recommendations.push('Choisissez une extension plus populaire (.com, .org, .net) pour une meilleure crédibilité.');
    }

    if (metrics.domainReadability < 30) {
      recommendations.push('Le nom de domaine contient trop de consonnes. Ajoutez des voyelles pour améliorer la lisibilité.');
    }

    if (!domainElements.isMemorable) {
      recommendations.push('Le nom de domaine n\'est pas assez mémorable. Choisissez un nom plus court et plus simple.');
    }

    if (!domainElements.isBrandable) {
      recommendations.push('Le nom de domaine n\'est pas assez brandable. Évitez les mots génériques et choisissez un nom unique.');
    }

    if (!domainElements.isAvailable) {
      recommendations.push('Ce nom de domaine n\'est pas disponible. Choisissez un autre nom ou une autre extension.');
    }

    if (domainScore < 50) {
      recommendations.push('Le score global du domaine est faible. Considérez choisir un autre nom de domaine.');
    }

    return {
      domainQuality: domainScore >= 80 ? 'Excellent' : domainScore >= 60 ? 'Bon' : domainScore >= 40 ? 'Moyen' : 'Faible',
      domainStrength: this.getDomainStrength(domainElements),
      domainWeakness: this.getDomainWeakness(domainElements),
      recommendations
    };
  }

  /**
   * Obtenir les forces du domaine
   */
  static getDomainStrength(domainElements) {
    const strengths = [];
    if (domainElements.hasGoodLength) strengths.push('Longueur optimale');
    if (domainElements.hasGoodExtension) strengths.push('Extension populaire');
    if (domainElements.isMemorable) strengths.push('Facile à mémoriser');
    if (domainElements.isBrandable) strengths.push('Nom brandable');
    if (domainElements.isAvailable) strengths.push('Disponible');
    return strengths.length > 0 ? strengths.join(', ') : 'Aucune force particulière';
  }

  /**
   * Obtenir les faiblesses du domaine
   */
  static getDomainWeakness(domainElements) {
    const weaknesses = [];
    if (!domainElements.hasGoodLength) weaknesses.push('Longueur non optimale');
    if (!domainElements.hasGoodExtension) weaknesses.push('Extension peu populaire');
    if (!domainElements.isMemorable) weaknesses.push('Difficile à mémoriser');
    if (!domainElements.isBrandable) weaknesses.push('Nom peu brandable');
    if (!domainElements.isAvailable) weaknesses.push('Non disponible');
    return weaknesses.length > 0 ? weaknesses.join(', ') : 'Aucune faiblesse majeure';
  }
}

module.exports = AnalyzerDomain; 