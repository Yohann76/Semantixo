const UniquenessJobModel = require('../models/UniquenessJob');
const JobProcessorUtils = require('../utils/JobProcessorUtils');
const GoogleSearchService = require('../utils/GoogleSearchService');

class UniquenessJobProcessor {
  static async process(job) {
    const { analysisId, text } = job.data;
    const startTime = Date.now();
    
    try {
      JobProcessorUtils.validateJobData(job.data, ['analysisId', 'text']);
      await JobProcessorUtils.createJobRecord(UniquenessJobModel, analysisId, 'uniqueness');
      await JobProcessorUtils.updateProgress(job, 20);
      
      // Diviser le texte en phrases
      const sentences = UniquenessJobProcessor.extractSentences(text);
      const sentencesToTest = UniquenessJobProcessor.selectSentencesToTest(sentences);
      
      await JobProcessorUtils.updateProgress(job, 40);
      
      // Tester chaque phrase pour la duplication
      const uniquenessResults = await UniquenessJobProcessor.testSentencesUniqueness(sentencesToTest);
      
      await JobProcessorUtils.updateProgress(job, 80);
      
      // Calculer le score basé sur l'originalité
      const score = UniquenessJobProcessor.calculateUniquenessScore(uniquenessResults);
      const analysis = {
        score,
        totalSentences: sentences.length,
        testedSentences: sentencesToTest.length,
        uniqueSentences: uniquenessResults.filter(r => !r.isDuplicated).length,
        duplicatedSentences: uniquenessResults.filter(r => r.isDuplicated).length,
        uniquenessPercentage: ((uniquenessResults.filter(r => !r.isDuplicated).length / sentencesToTest.length) * 100).toFixed(2)
      };
      
      const recommendations = UniquenessJobProcessor.generateRecommendations(score, uniquenessResults);
      
      await JobProcessorUtils.updateProgress(job, 90);
      await JobProcessorUtils.updateJobWithResults(
        UniquenessJobModel, analysisId, 'uniqueness', analysis, recommendations, startTime, {
          text,
          analysis,
          uniquenessResults,
          sentencesToTest
        }
      );
      await JobProcessorUtils.updateProgress(job, 100);
      await JobProcessorUtils.updateGlobalScoreWithRetry(analysisId);
      
      return { 
        success: true, 
        score, 
        metrics: { 
          score, 
          totalSentences: sentences.length,
          testedSentences: sentencesToTest.length,
          uniqueSentences: uniquenessResults.filter(r => !r.isDuplicated).length,
          duplicatedSentences: uniquenessResults.filter(r => r.isDuplicated).length,
          uniquenessPercentage: analysis.uniquenessPercentage
        }, 
        recommendations 
      };
      
    } catch (error) {
      console.error('❌ [UniquenessJob] Error:', error);
      await JobProcessorUtils.updateJobWithError(UniquenessJobModel, analysisId, 'uniqueness', error, startTime);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Extrait les phrases du texte
   */
  static extractSentences(text) {
    if (!text || typeof text !== 'string') return [];
    
    // Diviser par ponctuation de fin de phrase
    const sentences = text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 10) // Filtrer les phrases trop courtes
      .filter(sentence => sentence.length > 0);
    
    return sentences;
  }
  
  /**
   * Sélectionne les phrases à tester (1 à 10 maximum)
   */
  static selectSentencesToTest(sentences) {
    if (!sentences || sentences.length === 0) return [];
    
    if (sentences.length <= 10) {
      return sentences;
    }
    
    // Pour les longs textes, sélectionner 10 phrases stratégiquement
    const step = Math.floor(sentences.length / 10);
    const selectedSentences = [];
    
    for (let i = 0; i < 10; i++) {
      const index = i * step;
      if (index < sentences.length) {
        selectedSentences.push(sentences[index]);
      }
    }
    
    return selectedSentences;
  }
  
  /**
   * Teste l'unicité de chaque phrase via recherche Google
   */
  static async testSentencesUniqueness(sentences) {
    const results = [];
    const googleService = new GoogleSearchService();
    
    for (const sentence of sentences) {
      try {
        // Utiliser le service Google Search
        const duplicationResult = await googleService.checkDuplication(sentence);
        
        results.push({
          sentence: sentence.substring(0, 100) + (sentence.length > 100 ? '...' : ''),
          isDuplicated: duplicationResult.isDuplicated,
          duplicateLink: duplicationResult.firstDuplicateLink,
          duplicateCount: duplicationResult.duplicateCount,
          searchQuery: duplicationResult.searchQuery,
          confidence: duplicationResult.confidence,
          duplicateLinks: duplicationResult.duplicateLinks || []
        });
        
        // Délai pour éviter d'être bloqué par Google
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.warn(`⚠️ [UniquenessJob] Error testing sentence:`, error.message);
        
        // Fallback vers la simulation si le service Google échoue
        const fallbackResult = googleService.simulateSearch(sentence);
        
        results.push({
          sentence: sentence.substring(0, 100) + (sentence.length > 100 ? '...' : ''),
          isDuplicated: fallbackResult.isDuplicated,
          duplicateLink: fallbackResult.firstDuplicateLink,
          duplicateCount: fallbackResult.duplicateCount || 0,
          searchQuery: `"${sentence.substring(0, 50)}..."`,
          confidence: 'low',
          duplicateLinks: fallbackResult.duplicateLinks || [],
          error: error.message,
          fallback: true
        });
      }
    }
    
    return results;
  }
  
  /**
   * Calcule le score d'originalité (0-15)
   */
  static calculateUniquenessScore(results) {
    if (!results || results.length === 0) return 0;
    
    const totalSentences = results.length;
    const uniqueSentences = results.filter(r => !r.isDuplicated).length;
    const uniquePercentage = (uniqueSentences / totalSentences) * 100;
    
    // Scoring progressif basé sur le pourcentage d'originalité
    if (uniquePercentage === 100) return 15;        // 100% unique = score max
    if (uniquePercentage >= 90) return 14;          // 90-99% = 14 points
    if (uniquePercentage >= 80) return 13;          // 80-89% = 13 points
    if (uniquePercentage >= 70) return 12;          // 70-79% = 12 points
    if (uniquePercentage >= 60) return 11;          // 60-69% = 11 points
    if (uniquePercentage >= 50) return 10;          // 50-59% = 10 points
    if (uniquePercentage >= 40) return 9;           // 40-49% = 9 points
    if (uniquePercentage >= 30) return 8;           // 30-39% = 8 points
    if (uniquePercentage >= 20) return 7;           // 20-29% = 7 points
    if (uniquePercentage >= 10) return 6;           // 10-19% = 6 points
    if (uniquePercentage >= 5) return 5;            // 5-9% = 5 points
    if (uniquePercentage >= 1) return 3;            // 1-4% = 3 points
    return 0;                                       // 0% = 0 point
  }
  
  /**
   * Génère des recommandations basées sur le score
   */
  static generateRecommendations(score, results) {
    const duplicatedSentences = results.filter(r => r.isDuplicated);
    
    if (score === 15) {
      return ['🎉 Excellent ! Votre contenu est 100% original.'];
    }
    
    if (score >= 12) {
      return ['✅ Très bien ! Votre contenu est majoritairement original.'];
    }
    
    if (score >= 8) {
      return [
        '⚠️ Attention : Certaines phrases semblent dupliquées.',
        'Vérifiez l\'originalité de votre contenu pour améliorer votre SEO.'
      ];
    }
    
    if (score >= 4) {
      return [
        '❌ Votre contenu contient plusieurs phrases dupliquées.',
        'Cela peut nuire à votre référencement.',
        'Reformulez les phrases problématiques.'
      ];
    }
    
    return [
      '🚨 Votre contenu présente un taux de duplication élevé.',
      'Cela peut entraîner des pénalités SEO.',
      'Recommandé : Rédiger un contenu entièrement original.'
    ];
  }
}

module.exports = UniquenessJobProcessor;
