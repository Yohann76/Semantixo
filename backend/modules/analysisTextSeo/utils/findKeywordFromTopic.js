const fs = require('fs');
const path = require('path');

/**
 * Analyse le texte et extrait les mots-clés pertinents
 * @param {string} text - Le texte à analyser
 * @param {Array} targetKeywords - Les mots-clés ciblés fournis par l'utilisateur
 * @returns {Object} Résultats d'analyse des mots-clés
 */
const findKeywordsFromText = async (text, targetKeywords = []) => {
  try {
    // Lire le prompt depuis le fichier
    const promptPath = path.join(__dirname, '../prompts/findKeywordFromTopic.txt');
    let prompt = fs.readFileSync(promptPath, 'utf8');
    
    // Remplacer les variables dans le prompt
    prompt = prompt.replace('{{TEXT}}', text);
    prompt = prompt.replace('{{KEYWORDS}}', targetKeywords.join(', '));
    
    // TODO: Intégrer avec l'API OpenAI ou autre service d'IA
    // Pour l'instant, retourner une structure de base
    console.log('🔍 [KEYWORDS] Analyse des mots-clés:', {
      textLength: text.length,
      targetKeywordsCount: targetKeywords.length
    });
    
    // Simulation de réponse pour le développement
    const mockResponse = {
      keyword: [
        ...targetKeywords,
        ...extractKeywordsFromText(text, targetKeywords)
      ].slice(0, 20),
      moyenne_traine: generateMediumTailKeywords(text, targetKeywords),
      longue_traine: generateLongTailKeywords(text, targetKeywords)
    };
    
    console.log('✅ [KEYWORDS] Mots-clés extraits:', {
      principal: mockResponse.keyword.length,
      moyenne: mockResponse.moyenne_traine.length,
      longue: mockResponse.longue_traine.length
    });
    
    return {
      success: true,
      keywords: mockResponse
    };
    
  } catch (error) {
    console.error('❌ [KEYWORDS] Erreur extraction mots-clés:', error);
    return {
      success: false,
      error: error.message,
      keywords: {
        keyword: [],
        moyenne_traine: [],
        longue_traine: []
      }
    };
  }
};

/**
 * Extrait les mots-clés pertinents du texte
 * @param {string} text - Le texte à analyser
 * @param {Array} targetKeywords - Les mots-clés ciblés
 * @returns {Array} Mots-clés extraits
 */
const extractKeywordsFromText = (text, targetKeywords) => {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  // Compter les occurrences
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  // Filtrer les mots-clés pertinents
  const relevantKeywords = Object.entries(wordCount)
    .filter(([word, count]) => count > 1 && word.length > 4)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word]) => word);
  
  return relevantKeywords;
};

/**
 * Génère des mots-clés moyenne traîne
 * @param {string} text - Le texte analysé
 * @param {Array} targetKeywords - Les mots-clés ciblés
 * @returns {Array} Mots-clés moyenne traîne
 * TODO : not use this, read only gpt request 
 */
const generateMediumTailKeywords = (text, targetKeywords) => {
  const mediumTail = [];
  
  targetKeywords.forEach(keyword => {
    // Ajouter des variations
    mediumTail.push(`${keyword} guide`);
    mediumTail.push(`${keyword} conseils`);
    mediumTail.push(`${keyword} avis`);
    mediumTail.push(`meilleur ${keyword}`);
    mediumTail.push(`${keyword} prix`);
  });
  
  return mediumTail.slice(0, 10);
};

/**
 * Génère des mots-clés longue traîne
 * @param {string} text - Le texte analysé
 * @param {Array} targetKeywords - Les mots-clés ciblés
 * @returns {Array} Mots-clés longue traîne
 * TODO : not use this, read only gpt request 
 */
const generateLongTailKeywords = (text, targetKeywords) => {
  const longTail = [];
  
  targetKeywords.forEach(keyword => {
    // Ajouter des expressions très spécifiques
    longTail.push(`comment choisir ${keyword} 2024`);
    longTail.push(`${keyword} avis utilisateurs`);
    longTail.push(`comparatif ${keyword} prix qualité`);
    longTail.push(`${keyword} conseils experts`);
  });
  
  return longTail.slice(0, 4);
};

module.exports = {
  findKeywordsFromText
};













