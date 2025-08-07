/**
 * Utilitaire de validation de blacklist pour les domaines
 */

const { BLACKLISTED_KEYWORDS } = require('../config/blacklist_domain');

/**
 * Vérifie si un domaine ou une URL contient des mots-clés blacklistés
 * @param {string} domainOrUrl - Le domaine ou l'URL à vérifier
 * @returns {Object} - Résultat de la validation avec les mots blacklistés trouvés
 */
function validateDomainBlacklist(domainOrUrl) {
  if (!domainOrUrl || typeof domainOrUrl !== 'string') {
    return {
      isValid: false,
      blacklistedKeywords: [],
      message: 'Le domaine ou l\'URL est requis'
    };
  }

  // Normaliser l'entrée
  const normalizedInput = domainOrUrl.toLowerCase().trim();
  
  // Supprimer le protocole si présent
  const cleanInput = normalizedInput.replace(/^https?:\/\//, '');
  
  // Supprimer le www si présent
  const domainOnly = cleanInput.replace(/^www\./, '');

  // Vérifier chaque mot-clé blacklisté
  const foundBlacklistedKeywords = [];
  
  for (const keyword of BLACKLISTED_KEYWORDS) {
    if (domainOnly.includes(keyword.toLowerCase())) {
      foundBlacklistedKeywords.push(keyword);
    }
  }

  return {
    isValid: foundBlacklistedKeywords.length === 0,
    blacklistedKeywords: foundBlacklistedKeywords,
    message: foundBlacklistedKeywords.length > 0 
      ? `L'analyse de ${foundBlacklistedKeywords.join(', ')} n'est pas autorisée`
      : null
  };
}

module.exports = {
  validateDomainBlacklist,
  BLACKLISTED_KEYWORDS
}; 