/**
 * Analyse SEO d'un texte
 * @param {string} text - Le texte à analyser
 * @returns {Object} - Résultats de l'analyse SEO
 */
const analyzerTextSeo = async (text) => {
  try {
    // Nettoyer le texte
    const cleanText = text.trim();
    
    if (!cleanText) {
      throw new Error('Le texte ne peut pas être vide');
    }

    // Calculer les métriques de base
    const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length;
    const characterCount = cleanText.length;
    const characterCountNoSpaces = cleanText.replace(/\s/g, '').length;
    
    // Calculer le score SEO basé sur plusieurs critères
    let seoScore = 0;
    const maxScore = 100;
    
    // Critère 1: Longueur du texte (20 points)
    if (wordCount >= 300) {
      seoScore += 20; // Texte optimal
    } else if (wordCount >= 200) {
      seoScore += 15; // Texte bon
    } else if (wordCount >= 100) {
      seoScore += 10; // Texte acceptable
    } else if (wordCount >= 50) {
      seoScore += 5; // Texte court
    }
    
    // Critère 2: Densité de mots (15 points)
    const wordDensity = wordCount / Math.max(characterCount / 100, 1);
    if (wordDensity >= 15 && wordDensity <= 25) {
      seoScore += 15; // Densité optimale
    } else if (wordDensity >= 10 && wordDensity <= 30) {
      seoScore += 10; // Densité acceptable
    } else if (wordDensity >= 5 && wordDensity <= 40) {
      seoScore += 5; // Densité faible
    }
    
    // Critère 3: Structure du texte (15 points)
    const paragraphs = cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (paragraphs.length >= 3) {
      seoScore += 5; // Bonne structure paragraphes
    }
    if (sentences.length >= 10) {
      seoScore += 5; // Bonne structure phrases
    }
    if (sentences.some(s => s.length >= 50 && s.length <= 150)) {
      seoScore += 5; // Longueur de phrases optimale
    }
    
    // Critère 4: Mots-clés et répétition (20 points)
    const words = cleanText.toLowerCase().split(/\s+/);
    const wordFrequency = {};
    words.forEach(word => {
      if (word.length > 2) { // Ignorer les mots très courts
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
    
    const repeatedWords = Object.entries(wordFrequency)
      .filter(([word, count]) => count > 1)
      .sort((a, b) => b[1] - a[1]);
    
    if (repeatedWords.length > 0) {
      const topWord = repeatedWords[0];
      const repetitionRate = topWord[1] / wordCount;
      
      if (repetitionRate >= 0.02 && repetitionRate <= 0.05) {
        seoScore += 20; // Répétition optimale
      } else if (repetitionRate >= 0.01 && repetitionRate <= 0.08) {
        seoScore += 15; // Répétition acceptable
      } else if (repetitionRate > 0.08) {
        seoScore += 5; // Trop de répétition
      }
    }
    
    // Critère 5: Caractères spéciaux et ponctuation (10 points)
    const specialChars = (cleanText.match(/[^\w\s]/g) || []).length;
    const punctuationScore = Math.min(specialChars / wordCount * 100, 10);
    seoScore += punctuationScore;
    
    // Critère 6: Lisibilité (20 points)
    const avgWordLength = characterCountNoSpaces / Math.max(wordCount, 1);
    const avgSentenceLength = wordCount / Math.max(sentences.length, 1);
    
    if (avgWordLength >= 4 && avgWordLength <= 6) {
      seoScore += 10; // Longueur de mots optimale
    } else if (avgWordLength >= 3 && avgWordLength <= 7) {
      seoScore += 5; // Longueur de mots acceptable
    }
    
    if (avgSentenceLength >= 15 && avgSentenceLength <= 25) {
      seoScore += 10; // Longueur de phrases optimale
    } else if (avgSentenceLength >= 10 && avgSentenceLength <= 30) {
      seoScore += 5; // Longueur de phrases acceptable
    }
    
    // S'assurer que le score ne dépasse pas 100
    seoScore = Math.min(Math.round(seoScore), maxScore);
    
    // Générer des recommandations
    const recommendations = [];
    
    if (wordCount < 300) {
      recommendations.push('Augmentez la longueur du texte pour améliorer le SEO');
    }
    
    if (paragraphs.length < 3) {
      recommendations.push('Structurez votre texte en plusieurs paragraphes');
    }
    
    if (sentences.length < 10) {
      recommendations.push('Développez vos idées avec plus de phrases');
    }
    
    if (avgSentenceLength > 30) {
      recommendations.push('Raccourcissez vos phrases pour améliorer la lisibilité');
    }
    
    if (avgSentenceLength < 10) {
      recommendations.push('Développez vos phrases pour plus de contexte');
    }
    
    return {
      seoScore,
      metrics: {
        wordCount,
        characterCount,
        characterCountNoSpaces,
        paragraphCount: paragraphs.length,
        sentenceCount: sentences.length,
        avgWordLength: Math.round(avgWordLength * 100) / 100,
        avgSentenceLength: Math.round(avgSentenceLength * 100) / 100,
        wordDensity: Math.round(wordDensity * 100) / 100
      },
      analysis: {
        textLength: wordCount < 100 ? 'Court' : wordCount < 300 ? 'Moyen' : 'Long',
        readability: seoScore >= 80 ? 'Excellent' : seoScore >= 60 ? 'Bon' : seoScore >= 40 ? 'Moyen' : 'Faible',
        recommendations
      }
    };
    
  } catch (error) {
    console.error('Erreur analyzerTextSeo:', error);
    throw new Error('Erreur lors de l\'analyse SEO du texte');
  }
};

module.exports = {
  analyzerTextSeo
}; 