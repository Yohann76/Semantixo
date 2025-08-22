const AnalysisTextSeo = require('../models/AnalysisTextSeo');
const JobUtils = require('./JobUtils');

class KeywordPositionJob {
  static async process(job) {
    const { analysisId, text, keywords } = job.data;
    
    console.log(`📍 [KeywordPositionJob] Début analyse pour ${analysisId}`);
    
    try {
      await JobUtils.updateJobStatus(analysisId, 'keyword-position', 'processing', {
        details: 'Analyse de position des mots-clés en cours...',
        startedAt: new Date()
      });

      await job.progress(30);

      const analysis = await KeywordPositionJob.analyzeKeywordPositions(text, keywords);
      await job.progress(70);

      const recommendations = KeywordPositionJob.generateRecommendations(analysis);
      await job.progress(90);

      await JobUtils.updateJobStatus(analysisId, 'keyword-position', 'completed', {
        score: analysis.score,
        details: `Position analysée: ${analysis.titleScore}% titre, ${analysis.firstParagraphScore}% début`,
        completedAt: new Date(),
        metrics: {
          positionScore: analysis.score,
          titlePresence: analysis.titlePresence,
          firstParagraphPresence: analysis.firstParagraphPresence,
          distributionScore: analysis.distributionScore
        },
        recommendations: recommendations
      });

      await job.progress(100);

      console.log(`✅ [KeywordPositionJob] Terminé pour ${analysisId} - Score: ${analysis.score}`);
      
      return {
        success: true,
        score: analysis.score,
        metrics: analysis,
        recommendations: recommendations
      };

    } catch (error) {
      console.error(`❌ [KeywordPositionJob] Erreur pour ${analysisId}:`, error);
      
      await JobUtils.updateJobStatus(analysisId, 'keyword-position', 'failed', {
        details: 'Erreur lors de l\'analyse de position',
        error: error.message,
        completedAt: new Date()
      });
      
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

    // Calculer le score final
    let finalScore = 0;
    finalScore += titleScore * 0.4;           // 40% pour titre
    finalScore += firstParagraphScore * 0.3;  // 30% pour premier paragraphe
    finalScore += distributionScore * 0.3;    // 30% pour distribution

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

  // Méthode supprimée - utilise JobUtils.updateJobStatus
}

module.exports = KeywordPositionJob;
