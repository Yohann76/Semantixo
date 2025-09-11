const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');
const { ReadabilityJob: ReadabilityJobModel } = require('../models');
const { JobProcessorUtils } = require('../utils');

class ReadabilityJobProcessor {
  static async process(job) {
    const { analysisId, text } = job.data;
    const startTime = Date.now();
    
    try {
      // Valider les données d'entrée
      JobProcessorUtils.validateJobData(job.data, ['analysisId', 'text']);
      
      // Créer l'enregistrement du job en base
      await JobProcessorUtils.createJobRecord(ReadabilityJobModel, analysisId, 'readability');
      
      // Mettre à jour la progression
      await JobProcessorUtils.updateProgress(job, 20);

      // Analyse complète de la lisibilité SEO
      const analysis = await ReadabilityJobProcessor.analyzeSEOReadability(text);
      await JobProcessorUtils.updateProgress(job, 60);

      // Générer des recommandations SEO
      const recommendations = ReadabilityJobProcessor.generateSEORecommendations(analysis);
      await JobProcessorUtils.updateProgress(job, 80);

      // Sauvegarder les résultats
      await JobProcessorUtils.updateJobWithResults(
        ReadabilityJobModel,
        analysisId,
        'readability',
        analysis,
        recommendations,
        startTime,
        { text, analysis }
      );

      // Mettre à jour le score du job explicitement
      await ReadabilityJobModel.findOneAndUpdate(
        { analysisId, jobName: 'readability' },
        { score: analysis.readabilityScore },
        { new: true }
      );

      await JobProcessorUtils.updateProgress(job, 100);

      // Mettre à jour le score global avec retry
      await JobProcessorUtils.updateGlobalScoreWithRetry(analysisId);
      
      return {
        success: true,
        score: analysis.readabilityScore,
        metrics: analysis,
        recommendations: recommendations
      };

    } catch (error) {
      console.error(`❌ [ReadabilityJobProcessor] Erreur pour ${analysisId}:`, error);
      
      // Mettre à jour le job avec l'erreur
      await JobProcessorUtils.updateJobWithError(
        ReadabilityJobModel,
        analysisId,
        'readability',
        error,
        startTime
      );
      
      // Mettre à jour le score global même en cas d'erreur
      try {
        await JobProcessorUtils.updateGlobalScoreWithRetry(analysisId);
      } catch (globalError) {
        console.error('❌ Erreur mise à jour score global:', globalError);
      }
      
      throw error;
    }
  }

  static async analyzeSEOReadability(text) {
    try {
      // Analyser la structure du texte
      const textAnalysis = ReadabilityJobProcessor.analyzeTextStructure(text);
      
      // Calculer les scores de lisibilité
      const readabilityScores = ReadabilityJobProcessor.calculateReadabilityScores(textAnalysis);
      
      // Analyser la longueur du contenu (intégré de content-length)
      const contentLengthAnalysis = ReadabilityJobProcessor.analyzeContentLength(textAnalysis);
      
      // Analyser les phrases et paragraphes
      const sentenceAnalysis = ReadabilityJobProcessor.analyzeSentences(textAnalysis);
      const paragraphAnalysis = ReadabilityJobProcessor.analyzeParagraphs(textAnalysis);
      
      // Calculer le score global SEO
      const seoScore = ReadabilityJobProcessor.calculateSEOScore({
        ...readabilityScores,
        ...contentLengthAnalysis,
        ...sentenceAnalysis,
        ...paragraphAnalysis
      });
      
      return {
        // Scores de lisibilité
        fleschReadingEase: readabilityScores.fleschReadingEase,
        fleschKincaidGrade: readabilityScores.fleschKincaidGrade,
        gunningFogIndex: readabilityScores.gunningFogIndex,
        smogIndex: readabilityScores.smogIndex,
        
        // Métriques de structure
        avgSentenceLength: textAnalysis.avgSentenceLength,
        avgWordsPerParagraph: textAnalysis.avgWordsPerParagraph,
        avgSyllablesPerWord: textAnalysis.avgSyllablesPerWord,
        complexWordsCount: textAnalysis.complexWordsCount,
        complexWordsPercentage: textAnalysis.complexWordsPercentage,
        
        // Métriques de longueur
        wordCount: textAnalysis.wordCount,
        characterCount: textAnalysis.characterCount,
        sentenceCount: textAnalysis.sentenceCount,
        paragraphCount: textAnalysis.paragraphCount,
        contentLengthScore: contentLengthAnalysis.contentLengthScore,
        
        // Score global
        readabilityScore: seoScore.readabilityScore,
        seoReadabilityGrade: seoScore.seoReadabilityGrade,
        
        // Analyses détaillées
        sentenceAnalysis: sentenceAnalysis,
        paragraphAnalysis: paragraphAnalysis,
        
        // Problèmes et forces
        issues: seoScore.issues,
        strengths: seoScore.strengths
      };
    } catch (error) {
      console.error('Erreur dans analyzeSEOReadability:', error);
      throw error;
    }
  }

  static analyzeTextStructure(text) {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    const paragraphs = text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0);
    
    // Compter les syllabes (approximation simple)
    const totalSyllables = words.reduce((count, word) => {
      return count + ReadabilityJobProcessor.countSyllables(word);
    }, 0);
    
    // Identifier les mots complexes (3+ syllabes)
    const complexWords = words.filter(word => ReadabilityJobProcessor.countSyllables(word) >= 3);
    
    return {
      wordCount: words.length,
      characterCount: text.length,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      totalSyllables: totalSyllables,
      complexWordsCount: complexWords.length,
      complexWordsPercentage: (complexWords.length / words.length) * 100,
      avgSentenceLength: words.length / sentences.length,
      avgWordsPerParagraph: words.length / paragraphs.length,
      avgSyllablesPerWord: totalSyllables / words.length,
      sentences: sentences,
      paragraphs: paragraphs
    };
  }

  static countSyllables(word) {
    // Approximation simple du comptage de syllabes
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    
    const vowels = 'aeiouy';
    let count = 0;
    let previousWasVowel = false;
    
    for (let i = 0; i < word.length; i++) {
      const isVowel = vowels.includes(word[i]);
      if (isVowel && !previousWasVowel) {
        count++;
      }
      previousWasVowel = isVowel;
    }
    
    // Ajustement pour les mots se terminant par 'e'
    if (word.endsWith('e') && count > 1) {
      count--;
    }
    
    return Math.max(1, count);
  }

  static calculateReadabilityScores(textAnalysis) {
    const { wordCount, sentenceCount, totalSyllables, complexWordsCount } = textAnalysis;
    
    // Score Flesch Reading Ease (0-100, plus haut = plus facile)
    const fleschReadingEase = 206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (totalSyllables / wordCount));
    
    // Grade Level Flesch-Kincaid (niveau scolaire US)
    const fleschKincaidGrade = 0.39 * (wordCount / sentenceCount) + 11.8 * (totalSyllables / wordCount) - 15.59;
    
    // Indice Gunning Fog
    const gunningFogIndex = 0.4 * ((wordCount / sentenceCount) + (100 * complexWordsCount / wordCount));
    
    // Indice SMOG
    const smogIndex = 1.043 * Math.sqrt(complexWordsCount * (30 / sentenceCount)) + 3.1291;
    
    return {
      fleschReadingEase: Math.round(fleschReadingEase * 100) / 100,
      fleschKincaidGrade: Math.round(fleschKincaidGrade * 100) / 100,
      gunningFogIndex: Math.round(gunningFogIndex * 100) / 100,
      smogIndex: Math.round(smogIndex * 100) / 100
    };
  }

  static analyzeContentLength(textAnalysis) {
    const { wordCount } = textAnalysis;
    
    // Score de longueur basé sur les recommandations SEO
    let contentLengthScore = 0;
    
    if (wordCount >= 300 && wordCount <= 2000) {
      contentLengthScore = 5; // Optimal
    } else if (wordCount >= 200 && wordCount < 300) {
      contentLengthScore = 3; // Acceptable
    } else if (wordCount >= 100 && wordCount < 200) {
      contentLengthScore = 2; // Court
    } else if (wordCount > 2000 && wordCount <= 3000) {
      contentLengthScore = 4; // Long mais acceptable
    } else {
      contentLengthScore = 1; // Trop court ou trop long
    }
    
    return { contentLengthScore };
  }

  static analyzeSentences(textAnalysis) {
    const { sentences } = textAnalysis;
    
    let shortSentences = 0;
    let mediumSentences = 0;
    let longSentences = 0;
    let veryLongSentences = 0;
    
    sentences.forEach(sentence => {
      const wordCount = sentence.split(/\s+/).filter(word => word.length > 0).length;
      
      if (wordCount < 15) {
        shortSentences++;
      } else if (wordCount <= 25) {
        mediumSentences++;
      } else if (wordCount <= 40) {
        longSentences++;
      } else {
        veryLongSentences++;
      }
    });
    
    return {
      shortSentences,
      mediumSentences,
      longSentences,
      veryLongSentences
    };
  }

  static analyzeParagraphs(textAnalysis) {
    const { paragraphs } = textAnalysis;
    
    let shortParagraphs = 0;
    let mediumParagraphs = 0;
    let longParagraphs = 0;
    let optimalParagraphs = 0;
    
    paragraphs.forEach(paragraph => {
      const wordCount = paragraph.split(/\s+/).filter(word => word.length > 0).length;
      
      if (wordCount < 50) {
        shortParagraphs++;
      } else if (wordCount <= 100) {
        mediumParagraphs++;
      } else if (wordCount <= 150) {
        optimalParagraphs++;
      } else {
        longParagraphs++;
      }
    });
    
    return {
      shortParagraphs,
      mediumParagraphs,
      longParagraphs,
      optimalParagraphs
    };
  }

  static calculateSEOScore(metrics) {
    let totalScore = 0;
    const issues = [];
    const strengths = [];
    
    // Score Flesch Reading Ease (0-3 points)
    if (metrics.fleschReadingEase >= 80) {
      totalScore += 3;
      strengths.push('Excellent score de lisibilité Flesch');
    } else if (metrics.fleschReadingEase >= 60) {
      totalScore += 2;
      strengths.push('Bon score de lisibilité Flesch');
    } else if (metrics.fleschReadingEase >= 40) {
      totalScore += 1;
    } else {
      totalScore += 0;
      issues.push('Score de lisibilité Flesch trop faible');
    }
    
    // Score de longueur de contenu (0-2 points)
    if (metrics.contentLengthScore >= 4) {
      totalScore += 2;
      strengths.push('Longueur de contenu optimale pour le SEO');
    } else if (metrics.contentLengthScore >= 3) {
      totalScore += 1;
    } else {
      totalScore += 0;
      issues.push('Longueur de contenu non optimale pour le SEO');
    }
    
    // Score des phrases (0-2 points)
    const optimalSentences = metrics.mediumSentences + metrics.shortSentences;
    const totalSentences = metrics.shortSentences + metrics.mediumSentences + metrics.longSentences + metrics.veryLongSentences;
    const sentenceRatio = optimalSentences / totalSentences;
    
    if (sentenceRatio >= 0.7) {
      totalScore += 2;
      strengths.push('Structure des phrases optimale');
    } else if (sentenceRatio >= 0.5) {
      totalScore += 1;
    } else {
      totalScore += 0;
      issues.push('Trop de phrases longues détectées');
    }
    
    // Score des paragraphes (0-1 point)
    const optimalParagraphs = metrics.optimalParagraphs + metrics.mediumParagraphs;
    const totalParagraphs = metrics.shortParagraphs + metrics.mediumParagraphs + metrics.longParagraphs + metrics.optimalParagraphs;
    const paragraphRatio = optimalParagraphs / totalParagraphs;
    
    if (paragraphRatio >= 0.6) {
      totalScore += 1;
      strengths.push('Structure des paragraphes optimale');
    } else {
      totalScore += 0;
      issues.push('Structure des paragraphes à améliorer');
    }
    
    // Score des mots complexes (0-2 points)
    if (metrics.complexWordsPercentage <= 10) {
      totalScore += 2;
      strengths.push('Utilisation appropriée des mots complexes');
    } else if (metrics.complexWordsPercentage <= 20) {
      totalScore += 1;
    } else {
      totalScore += 0;
      issues.push('Trop de mots complexes');
    }
    
    // Déterminer la note SEO
    let seoReadabilityGrade;
    if (totalScore >= 9) seoReadabilityGrade = 'A+';
    else if (totalScore >= 8) seoReadabilityGrade = 'A';
    else if (totalScore >= 7) seoReadabilityGrade = 'B+';
    else if (totalScore >= 6) seoReadabilityGrade = 'B';
    else if (totalScore >= 5) seoReadabilityGrade = 'C+';
    else if (totalScore >= 4) seoReadabilityGrade = 'C';
    else if (totalScore >= 3) seoReadabilityGrade = 'D';
    else seoReadabilityGrade = 'F';
    
    return {
      readabilityScore: Math.min(10, Math.max(0, totalScore)), // Score sur 10 points max
      seoReadabilityGrade,
      issues,
      strengths
    };
  }

  static generateSEORecommendations(analysis) {
    const recommendations = [];
    
    // Recommandations basées sur le score Flesch
    if (analysis.fleschReadingEase < 60) {
      recommendations.push('📝 Simplifiez vos phrases pour améliorer la lisibilité');
      recommendations.push('🔤 Utilisez des mots plus courts et courants');
    }
    
    // Recommandations basées sur la longueur
    if (analysis.contentLengthScore < 3) {
      if (analysis.wordCount < 300) {
        recommendations.push('📏 Augmentez la longueur de votre contenu (minimum 300 mots recommandé)');
      } else if (analysis.wordCount > 2000) {
        recommendations.push('✂️ Considérez diviser votre contenu en plusieurs pages');
      }
    }
    
    // Recommandations basées sur les phrases
    if (analysis.sentenceAnalysis.veryLongSentences > 0) {
      recommendations.push('⚡ Divisez vos phrases très longues (>40 mots) en phrases plus courtes');
    }
    
    // Recommandations basées sur les paragraphes
    if (analysis.paragraphAnalysis.shortParagraphs > analysis.paragraphAnalysis.optimalParagraphs) {
      recommendations.push('📄 Développez vos paragraphes courts pour une meilleure structure');
    }
    
    // Recommandations basées sur les mots complexes
    if (analysis.complexWordsPercentage > 15) {
      recommendations.push('🎯 Réduisez le pourcentage de mots complexes (actuellement ' + Math.round(analysis.complexWordsPercentage) + '%)');
    }
    
    // Ajouter les forces détectées
    if (analysis.strengths.length > 0) {
      recommendations.push('✅ Points forts: ' + analysis.strengths.join(', '));
    }
    
    return recommendations;
  }
}

module.exports = ReadabilityJobProcessor;
