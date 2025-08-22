const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');
const { KeywordPositionJob: KeywordPositionJobModel } = require('../models');

class KeywordPositionJobProcessor {
  static async process(job) {
    const { analysisId, text, keywords } = job.data;
    const startTime = Date.now();
    
    try {
      // Créer l'enregistrement du job en base avec tous les champs requis
      const jobRecord = new KeywordPositionJobModel({
        analysisId,
        jobName: 'keyword-position',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await jobRecord.save();
      console.log(`✅ [KeywordPositionJobProcessor] Job créé en base pour ${analysisId}`);

      // Plus besoin d'appeler updateJobStatus - on met à jour directement notre propre collection

      await job.progress(30);

      const analysis = await KeywordPositionJobProcessor.analyzeKeywordPositions(text, keywords);
      await job.progress(70);

      const recommendations = KeywordPositionJobProcessor.generateRecommendations(analysis);
      await job.progress(90);

      // Mettre à jour l'enregistrement du job en base
      await KeywordPositionJobModel.findOneAndUpdate(
        { analysisId, jobName: 'keyword-position' },
        {
          status: 'completed',
          score: analysis.score,
          details: `Position analysée: ${analysis.titleScore}% titre, ${analysis.firstParagraphScore}% début`,
          metrics: {
            positionScore: analysis.score,
            titlePresence: analysis.titlePresence,
            firstParagraphPresence: analysis.firstParagraphPresence,
            distributionScore: analysis.distributionScore
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
      console.error(`❌ [KeywordPositionJobProcessor] Erreur pour ${analysisId}:`, error);
      
      // Mettre à jour l'enregistrement du job en base (erreur)
      await KeywordPositionJobModel.findOneAndUpdate(
        { analysisId, jobName: 'keyword-position' },
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

  static async analyzeKeywordPositions(text, keywords) {
    if (!keywords || keywords.length === 0) {
      return {
        score: 0,
        titleScore: 0,
        firstParagraphScore: 0,
        distributionScore: 0,
        titlePresence: false,
        firstParagraphPresence: false
      };
    }

    const cleanText = text.toLowerCase();
    const paragraphs = text.split(/\n\s*\n/);
    const firstParagraph = paragraphs[0] ? paragraphs[0].toLowerCase() : '';
    
    // Extraire le titre (première ligne ou premiers 100 caractères)
    const title = text.split('\n')[0] || text.substring(0, 100);
    const titleLower = title.toLowerCase();

    let titleScore = 0;
    let firstParagraphScore = 0;
    let distributionScore = 0;

    keywords.forEach(keyword => {
      const keywordLower = keyword.toLowerCase();
      
      // Vérifier présence dans le titre
      if (titleLower.includes(keywordLower)) {
        titleScore += 100 / keywords.length;
      }
      
      // Vérifier présence dans le premier paragraphe
      if (firstParagraph.includes(keywordLower)) {
        firstParagraphScore += 100 / keywords.length;
      }
      
      // Analyser la distribution dans le texte
      const matches = [...cleanText.matchAll(new RegExp(`\\b${keywordLower}\\b`, 'g'))];
      if (matches.length > 0) {
        // Calculer la distribution (bonus si réparti uniformément)
        const textLength = cleanText.length;
        const positions = matches.map(match => match.index / textLength);
        
        // Bonus pour distribution équilibrée
        const hasBeginning = positions.some(pos => pos < 0.2);
        const hasMiddle = positions.some(pos => pos >= 0.2 && pos <= 0.8);
        const hasEnd = positions.some(pos => pos > 0.8);
        
        let distributionBonus = 0;
        if (hasBeginning) distributionBonus += 33;
        if (hasMiddle) distributionBonus += 33;
        if (hasEnd) distributionBonus += 34;
        
        distributionScore += distributionBonus / keywords.length;
      }
    });

    // Calculer le score final (sur 15 car poids = 15)
    let finalScore = 0;
    finalScore += titleScore * 0.4 * 0.15;           // 40% pour titre (sur 15)
    finalScore += firstParagraphScore * 0.3 * 0.15;  // 30% pour premier paragraphe (sur 15)
    finalScore += distributionScore * 0.3 * 0.15;    // 30% pour distribution (sur 15)

    return {
      score: Math.round(finalScore),
      titleScore: Math.round(titleScore),
      firstParagraphScore: Math.round(firstParagraphScore),
      distributionScore: Math.round(distributionScore),
      titlePresence: titleScore > 0,
      firstParagraphPresence: firstParagraphScore > 0
    };
  }

  static generateRecommendations(analysis) {
    const recommendations = [];
    
    if (!analysis.titlePresence) {
      recommendations.push("Incluez vos mots-clés principaux dans le titre");
    }
    
    if (!analysis.firstParagraphPresence) {
      recommendations.push("Intégrez vos mots-clés dans le premier paragraphe");
    }
    
    if (analysis.distributionScore < 50) {
      recommendations.push("Répartissez vos mots-clés de manière plus équilibrée dans le texte");
    }
    
    if (analysis.score < 30) {
      recommendations.push("Optimisez la position de vos mots-clés pour améliorer le référencement");
    }
    
    return recommendations;
  }
}

module.exports = KeywordPositionJobProcessor;
