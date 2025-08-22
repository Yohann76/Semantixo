const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');

class KeywordAnalysisJob {
  static async process(job) {
    const { analysisId, text, keywords } = job.data;
    
    console.log(`🔍 [KeywordAnalysisJob] Début analyse pour ${analysisId}`);
    
    try {
      // Mettre à jour le statut du job
      await JobUtils.updateJobStatus(analysisId, 'keyword-analysis', 'processing', {
        details: 'Analyse des mots-clés en cours...',
        startedAt: new Date()
      });

      // Simulation de progression
      await job.progress(20);

      // Analyse des mots-clés
      const analysis = await KeywordAnalysisJob.analyzeKeywords(text, keywords);
      await job.progress(60);

      // Générer des recommandations
      const recommendations = KeywordAnalysisJob.generateRecommendations(analysis);
      await job.progress(80);

      // Sauvegarder les résultats
      await JobUtils.updateJobStatus(analysisId, 'keyword-analysis', 'completed', {
        score: analysis.score,
        details: `Analyse terminée: densité ${analysis.keywordDensity}%, ${analysis.keywordCount} mots-clés trouvés`,
        completedAt: new Date(),
        metrics: {
          keywordDensity: analysis.keywordDensity,
          keywordCount: analysis.keywordCount,
          wordCount: analysis.wordCount,
          relevanceScore: analysis.relevanceScore
        },
        recommendations: recommendations
      });

      await job.progress(100);

      console.log(`✅ [KeywordAnalysisJob] Terminé pour ${analysisId} - Score: ${analysis.score}`);
      
      return {
        success: true,
        score: analysis.score,
        metrics: analysis,
        recommendations: recommendations
      };

    } catch (error) {
      console.error(`❌ [KeywordAnalysisJob] Erreur pour ${analysisId}:`, error);
      
      await JobUtils.updateJobStatus(analysisId, 'keyword-analysis', 'failed', {
        details: 'Erreur lors de l\'analyse des mots-clés',
        error: error.message,
        completedAt: new Date()
      });
      
      throw error;
    }
  }

  static async analyzeKeywords(text, keywords) {
    // Nettoyer et préparer le texte
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    let totalKeywordCount = 0;
    let relevanceScore = 0;
    
    if (keywords && keywords.length > 0) {
      // Analyser chaque mot-clé
      keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        const keywordCount = (cleanText.match(new RegExp(`\\b${keywordLower}\\b`, 'g')) || []).length;
        totalKeywordCount += keywordCount;
        
        // Calculer le score de pertinence basé sur la position et la fréquence
        if (keywordCount > 0) {
          const firstPosition = cleanText.indexOf(keywordLower);
          const positionBonus = firstPosition < 100 ? 20 : firstPosition < 300 ? 10 : 0;
          const frequencyScore = Math.min(keywordCount * 5, 30);
          relevanceScore += frequencyScore + positionBonus;
        }
      });
      
      relevanceScore = Math.min(relevanceScore / keywords.length, 100);
    }
    
    // Calculer la densité de mots-clés
    const keywordDensity = wordCount > 0 ? (totalKeywordCount / wordCount) * 100 : 0;
    
    // Calculer le score final (0-100)
    let score = 0;
    
    // Score basé sur la densité (optimale: 1-3%)
    if (keywordDensity >= 1 && keywordDensity <= 3) {
      score += 40; // Densité parfaite
    } else if (keywordDensity >= 0.5 && keywordDensity < 1) {
      score += 30; // Densité correcte
    } else if (keywordDensity > 3 && keywordDensity <= 5) {
      score += 20; // Légèrement sur-optimisé
    } else if (keywordDensity > 5) {
      score += 10; // Sur-optimisation
    }
    
    // Ajouter le score de pertinence
    score += Math.round(relevanceScore * 0.6);
    
    return {
      score: Math.min(Math.round(score), 100),
      keywordDensity: Math.round(keywordDensity * 100) / 100,
      keywordCount: totalKeywordCount,
      wordCount: wordCount,
      relevanceScore: Math.round(relevanceScore)
    };
  }

  static generateRecommendations(analysis) {
    const recommendations = [];
    
    if (analysis.keywordDensity < 0.5) {
      recommendations.push("Augmentez la densité de mots-clés dans votre contenu (objectif: 1-3%)");
    } else if (analysis.keywordDensity > 5) {
      recommendations.push("Réduisez la densité de mots-clés pour éviter la sur-optimisation");
    }
    
    if (analysis.keywordCount === 0) {
      recommendations.push("Intégrez vos mots-clés cibles dans le contenu");
    }
    
    if (analysis.wordCount < 300) {
      recommendations.push("Augmentez la longueur du contenu (minimum 300 mots recommandé)");
    }
    
    if (analysis.relevanceScore < 50) {
      recommendations.push("Améliorez la pertinence en plaçant les mots-clés en début de contenu");
    }
    
    return recommendations;
  }


}

module.exports = KeywordAnalysisJob;
