const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');
const { KeywordAnalysisJob: KeywordAnalysisJobModel } = require('../models');

class KeywordAnalysisJobProcessor {
  static async process(job) {
    const { analysisId, text, keywords } = job.data;
    const startTime = Date.now();
    
    try {
      // Créer l'enregistrement du job en base avec tous les champs requis
      const jobRecord = new KeywordAnalysisJobModel({
        analysisId,
        jobName: 'keyword-analysis',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await jobRecord.save();
      console.log(`✅ [KeywordAnalysisJobProcessor] Job créé en base pour ${analysisId}`);

      // Mettre à jour le statut du job
      // Plus besoin d'appeler updateJobStatus - on met à jour directement notre propre collection

      // Simulation de progression
      await job.progress(20);

      // Analyse des mots-clés
      const analysis = await KeywordAnalysisJobProcessor.analyzeKeywords(text, keywords);
      await job.progress(60);

      // Générer des recommandations
      const recommendations = KeywordAnalysisJobProcessor.generateRecommendations(analysis);
      await job.progress(80);

      // Sauvegarder les résultats
      // Mettre à jour l'enregistrement du job en base
      await KeywordAnalysisJobModel.findOneAndUpdate(
        { analysisId, jobName: 'keyword-analysis' },
        {
          status: 'completed',
          score: analysis.score,
          details: `Analyse terminée: densité ${analysis.keywordDensity}%, ${analysis.keywordCount} mots-clés trouvés`,
          metrics: {
            keywordDensity: analysis.keywordDensity,
            keywordCount: analysis.keywordCount,
            wordCount: analysis.wordCount,
            relevanceScore: analysis.relevanceScore
          },
          recommendations: recommendations,
          processingTime: Date.now() - startTime,
          rawData: { text, keywords, analysis }
        },
        { upsert: true, new: true }
      );

      await job.progress(100);

      // Mettre à jour le score global APRÈS la sauvegarde réussie
      await JobUtils.updateGlobalScore(analysisId);
      
      return {
        success: true,
        score: analysis.score,
        metrics: analysis,
        recommendations: recommendations
      };

    } catch (error) {
      console.error(`❌ [KeywordAnalysisJobProcessor] Erreur pour ${analysisId}:`, error);
      
      // Mettre à jour l'enregistrement du job en base (erreur)
      await KeywordAnalysisJobModel.findOneAndUpdate(
        { analysisId, jobName: 'keyword-analysis' },
        {
          status: 'failed',
          error: {
            message: error.message,
            stack: error.stack
          },
          processingTime: Date.now() - startTime
        },
        { upsert: true, new: true }
      );
      
      // Mettre à jour le score global même en cas d'erreur
      try {
        await JobUtils.updateGlobalScore(analysisId);
      } catch (globalError) {
        console.error('❌ Erreur mise à jour score global:', globalError);
      }
      
      throw error;
    }
  }

  static async analyzeKeywords(text, keywords) {
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
    const words = cleanText.split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    
    let totalKeywordCount = 0;
    let relevanceScore = 0;
    
    if (keywords && keywords.length > 0) {

      keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        const keywordCount = (cleanText.match(new RegExp(`\\b${keywordLower}\\b`, 'g')) || []).length;
        totalKeywordCount += keywordCount;
        
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
    
    // Calculer le score final (0-40 car poids = 40)
    let score = 0;
    
    // Score basé sur la densité (optimale: 1-3%)
    if (keywordDensity >= 1 && keywordDensity <= 3) {
      score += 16; // Densité parfaite (40% du poids)
    } else if (keywordDensity >= 0.5 && keywordDensity < 1) {
      score += 12; // Densité correcte (30% du poids)
    } else if (keywordDensity > 3 && keywordDensity <= 5) {
      score += 8; // Légèrement sur-optimisé (20% du poids)
    } else if (keywordDensity > 5) {
      score += 4; // Sur-optimisation (10% du poids)
    }
    
    // Ajouter le score de pertinence (60% du poids restant)
    score += Math.round(relevanceScore * 0.6 * 0.4);
    
    return {
      score: Math.min(Math.round(score), 40), // Score sur 40 (poids du job)
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

module.exports = KeywordAnalysisJobProcessor;
