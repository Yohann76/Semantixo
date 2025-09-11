/**
 * Service d'analyse des mots-clés pour SEO
 * Implémente la stratégie complète : SERP → Lexical → Référentiel → Évaluation → Visualisation
 */

const GoogleSearchService = require('./GoogleSearchService');

class KeywordAnalysisService {
  constructor() {
    this.googleSearchService = new GoogleSearchService();
    this.stopWords = new Set([
      'le', 'la', 'les', 'un', 'une', 'des', 'ce', 'cette', 'ces', 'mon', 'ma', 'mes',
      'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'votre', 'leur', 'leurs',
      'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'me', 'te', 'se',
      'lui', 'leur', 'y', 'en', 'ceci', 'cela', 'ça', 'qui', 'que', 'quoi', 'où',
      'quand', 'comment', 'pourquoi', 'combien', 'est', 'sont', 'était', 'étaient',
      'avoir', 'être', 'faire', 'aller', 'venir', 'voir', 'dire', 'savoir', 'pouvoir',
      'vouloir', 'devoir', 'falloir', 'valoir', 'paraître', 'sembler', 'devenir',
      'rester', 'passer', 'sortir', 'entrer', 'monter', 'descendre', 'partir',
      'arriver', 'revenir', 'rentrer', 'sortir', 'entrer', 'monter', 'descendre',
      'et', 'ou', 'mais', 'donc', 'car', 'ni', 'or', 'puis', 'ensuite', 'alors',
      'ainsi', 'donc', 'par conséquent', 'c\'est pourquoi', 'en effet', 'en fait',
      'd\'ailleurs', 'par ailleurs', 'de plus', 'en outre', 'de même', 'également',
      'aussi', 'encore', 'déjà', 'toujours', 'jamais', 'souvent', 'rarement',
      'parfois', 'quelquefois', 'toujours', 'encore', 'déjà', 'bientôt', 'maintenant',
      'aujourd\'hui', 'hier', 'demain', 'ici', 'là', 'ailleurs', 'partout', 'nulle part',
      'très', 'trop', 'assez', 'peu', 'beaucoup', 'plus', 'moins', 'autant', 'tellement',
      'si', 'tant', 'tel', 'telle', 'tels', 'telles', 'quel', 'quelle', 'quels', 'quelles'
    ]);
  }

  /**
   * Analyse complète des mots-clés selon la stratégie définie
   */
  async analyzeKeywords(text, keywords, targetKeywords = []) {
    console.log('🔍 [KeywordAnalysisService] Début de l\'analyse des mots-clés');
    
    try {
      // Étape 1 : Analyse des SERP
      console.log('📊 [KeywordAnalysisService] Étape 1 : Analyse des SERP');
      const serpAnalysis = await this.analyzeSERP(keywords);
      
      // Étape 2 : Extraction du champ lexical
      console.log('📝 [KeywordAnalysisService] Étape 2 : Extraction lexicale');
      const lexicalAnalysis = this.extractLexicalField(serpAnalysis.content);
      
      // Étape 3 : Création du référentiel
      console.log('📚 [KeywordAnalysisService] Étape 3 : Création du référentiel');
      const referenceData = this.createReference(lexicalAnalysis);
      
      // Étape 4 : Évaluation du texte cible
      console.log('🎯 [KeywordAnalysisService] Étape 4 : Évaluation du texte');
      const targetAnalysis = this.evaluateTargetText(text, targetKeywords, referenceData);
      
      // Étape 5 : Calcul des scores SEO
      console.log('📈 [KeywordAnalysisService] Étape 5 : Calcul des scores SEO');
      const seoScores = this.calculateSEOScores(targetAnalysis, referenceData);
      
      // Étape 6 : Préparation des données de visualisation
      console.log('📊 [KeywordAnalysisService] Étape 6 : Préparation des visualisations');
      const visualizationData = this.prepareVisualizationData(targetAnalysis, referenceData, seoScores);
      
      // Calcul du score final sur 40 points
      const finalScore = this.calculateFinalScore(seoScores, targetAnalysis);
      
      return {
        score: finalScore,
        serpAnalysis,
        lexicalAnalysis,
        referenceData,
        targetAnalysis,
        seoScores,
        visualizationData
      };
      
    } catch (error) {
      console.error('❌ [KeywordAnalysisService] Erreur lors de l\'analyse:', error);
      throw error;
    }
  }

  /**
   * Étape 1 : Analyse des SERP via Google Custom Search API
   */
  async analyzeSERP(keywords) {
    const allContent = [];
    const keywordResults = {};
    
    for (const keyword of keywords) {
      console.log(`🔍 [KeywordAnalysisService] Recherche SERP pour: "${keyword}"`);
      
      try {
        // Recherche Google avec le mot-clé
        const searchResults = await this.googleSearchService.performGoogleSearch(keyword);
        
        if (searchResults.items && searchResults.items.length > 0) {
          // Analyser les 10 premières pages
          const pagesToAnalyze = searchResults.items.slice(0, 10);
          
          for (const page of pagesToAnalyze) {
            const pageContent = {
              title: page.title || '',
              snippet: page.snippet || '',
              link: page.link || '',
              keyword: keyword
            };
            
            allContent.push(pageContent);
            
            // Extraire le contenu textuel (titre + snippet)
            const textContent = `${pageContent.title} ${pageContent.snippet}`;
            allContent.push({ content: textContent, keyword: keyword });
          }
          
          keywordResults[keyword] = {
            totalResults: searchResults.items.length,
            pagesAnalyzed: pagesToAnalyze.length,
            searchQuery: `"${keyword}"`
          };
        }
        
      } catch (error) {
        console.warn(`⚠️ [KeywordAnalysisService] Erreur SERP pour "${keyword}":`, error.message);
        keywordResults[keyword] = {
          totalResults: 0,
          pagesAnalyzed: 0,
          error: error.message
        };
      }
    }
    
    return {
      totalPagesAnalyzed: allContent.length,
      keywordResults,
      content: allContent,
      averageWordCount: this.calculateAverageWordCount(allContent)
    };
  }

  /**
   * Étape 2 : Extraction du champ lexical
   */
  extractLexicalField(content) {
    console.log('📝 [KeywordAnalysisService] Extraction lexicale en cours...');
    
    // Concaténer tout le contenu
    const fullText = content
      .map(item => item.content || `${item.title || ''} ${item.snippet || ''}`)
      .join(' ')
      .toLowerCase();
    
    // Nettoyage et normalisation
    const cleanedText = this.cleanText(fullText);
    
    // Tokenisation
    const tokens = this.tokenize(cleanedText);
    
    // Filtrage des stop words et calcul des fréquences
    const wordFrequencies = this.calculateWordFrequencies(tokens);
    
    // Sélection des mots significatifs
    const significantWords = this.selectSignificantWords(wordFrequencies);
    
    return {
      totalWords: tokens.length,
      uniqueWords: Object.keys(wordFrequencies).length,
      wordFrequencies,
      significantWords,
      topKeywords: this.getTopKeywords(wordFrequencies, 20)
    };
  }

  /**
   * Étape 3 : Création du référentiel
   */
  createReference(lexicalAnalysis) {
    console.log('📚 [KeywordAnalysisService] Création du référentiel...');
    
    const { wordFrequencies, significantWords } = lexicalAnalysis;
    
    // Calcul des statistiques de fréquence
    const frequencies = Object.values(wordFrequencies);
    const mean = frequencies.reduce((sum, freq) => sum + freq, 0) / frequencies.length;
    const variance = frequencies.reduce((sum, freq) => sum + Math.pow(freq - mean, 2), 0) / frequencies.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Calcul TF-IDF pour chaque mot significatif
    const tfidfScores = this.calculateTFIDF(wordFrequencies, significantWords);
    
    // Classement par importance
    const rankedKeywords = Object.entries(tfidfScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 50)
      .map(([keyword, score]) => ({
        keyword,
        frequency: wordFrequencies[keyword] || 0,
        tfidf: score,
        importance: this.calculateImportance(wordFrequencies[keyword] || 0, score, mean, standardDeviation)
      }));
    
    return {
      meanFrequency: mean,
      standardDeviation: standardDeviation,
      totalDocuments: 1, // Pour l'instant, on analyse un seul corpus
      tfidfScores,
      rankedKeywords,
      optimalRanges: this.calculateOptimalRanges(rankedKeywords, mean, standardDeviation)
    };
  }

  /**
   * Étape 4 : Évaluation du texte cible
   */
  evaluateTargetText(text, targetKeywords, referenceData) {
    console.log('🎯 [KeywordAnalysisService] Évaluation du texte cible...');
    
    // Nettoyer et analyser le texte cible
    const cleanedTargetText = this.cleanText(text.toLowerCase());
    const targetTokens = this.tokenize(cleanedTargetText);
    const targetWordFrequencies = this.calculateWordFrequencies(targetTokens);
    
    // Analyser les mots-clés cibles
    const keywordAnalysis = targetKeywords.map(keyword => {
      const frequency = targetWordFrequencies[keyword.toLowerCase()] || 0;
      const density = (frequency / targetTokens.length) * 100;
      
      // Trouver la fréquence optimale dans le référentiel
      const referenceKeyword = referenceData.rankedKeywords.find(k => 
        k.keyword.toLowerCase() === keyword.toLowerCase()
      );
      
      const optimalRange = referenceKeyword ? 
        referenceData.optimalRanges[referenceKeyword.keyword] : 
        { min: 0, max: 0 };
      
      return {
        keyword,
        frequency,
        density,
        optimalRange,
        isOptimal: frequency >= optimalRange.min && frequency <= optimalRange.max,
        isOverused: frequency > optimalRange.max,
        isUnderused: frequency < optimalRange.min
      };
    });
    
    // Mots-clés manquants (mots importants du référentiel absents du texte)
    const missingKeywords = referenceData.rankedKeywords
      .slice(0, 20) // Top 20 mots-clés
      .filter(refKeyword => !targetWordFrequencies[refKeyword.keyword.toLowerCase()])
      .map(refKeyword => refKeyword.keyword);
    
    // Mots-clés sur-utilisés
    const overusedKeywords = keywordAnalysis
      .filter(k => k.isOverused)
      .map(k => k.keyword);
    
    return {
      totalWords: targetTokens.length,
      uniqueWords: Object.keys(targetWordFrequencies).length,
      keywordAnalysis,
      missingKeywords,
      overusedKeywords,
      targetWordFrequencies
    };
  }

  /**
   * Étape 5 : Calcul des scores SEO
   */
  calculateSEOScores(targetAnalysis, referenceData) {
    console.log('📈 [KeywordAnalysisService] Calcul des scores SEO...');
    
    const { keywordAnalysis, missingKeywords, overusedKeywords } = targetAnalysis;
    
    // SOS Score (proximité avec la fréquence optimale)
    let sosScore = 0;
    let totalKeywords = keywordAnalysis.length;
    
    for (const keyword of keywordAnalysis) {
      if (keyword.isOptimal) {
        sosScore += 1; // Score parfait
      } else if (keyword.isOverused) {
        // Pénalité pour sur-utilisation
        const overuseRatio = keyword.frequency / keyword.optimalRange.max;
        sosScore += Math.max(0, 1 - (overuseRatio - 1) * 0.5);
      } else if (keyword.isUnderused) {
        // Pénalité pour sous-utilisation
        const underuseRatio = keyword.frequency / keyword.optimalRange.min;
        sosScore += underuseRatio * 0.8;
      }
    }
    
    sosScore = (sosScore / totalKeywords) * 100;
    
    // DSEO Score (mesure de la sur-utilisation)
    const overusePenalty = overusedKeywords.length * 10;
    const dseoScore = Math.max(0, 100 - overusePenalty);
    
    // Score global de pertinence
    const overallRelevance = (sosScore + dseoScore) / 2;
    
    return {
      sosScore: Math.round(sosScore),
      dseoScore: Math.round(dseoScore),
      overallRelevance: Math.round(overallRelevance)
    };
  }

  /**
   * Étape 6 : Préparation des données de visualisation
   */
  prepareVisualizationData(targetAnalysis, referenceData, seoScores) {
    console.log('📊 [KeywordAnalysisService] Préparation des données de visualisation...');
    
    const { keywordAnalysis } = targetAnalysis;
    
    // Données pour la comparaison des mots-clés
    const keywordComparison = keywordAnalysis.map(k => ({
      keyword: k.keyword,
      targetFrequency: k.frequency,
      actualFrequency: k.frequency,
      optimalRange: k.optimalRange
    }));
    
    // Données pour le graphique de densité
    const densityChart = keywordAnalysis.map(k => ({
      keyword: k.keyword,
      density: k.density,
      optimalDensity: ((k.optimalRange.min + k.optimalRange.max) / 2) * 100
    }));
    
    return {
      keywordComparison,
      densityChart,
      seoScores,
      summary: {
        totalKeywords: keywordAnalysis.length,
        optimalKeywords: keywordAnalysis.filter(k => k.isOptimal).length,
        overusedKeywords: targetAnalysis.overusedKeywords.length,
        missingKeywords: targetAnalysis.missingKeywords.length
      }
    };
  }

  /**
   * Calcul du score final sur 40 points
   */
  calculateFinalScore(seoScores, targetAnalysis) {
    const { overallRelevance } = seoScores;
    const { keywordAnalysis, missingKeywords, overusedKeywords } = targetAnalysis;
    
    // Score de base basé sur la pertinence globale
    let score = (overallRelevance / 100) * 30; // 30 points max
    
    // Bonus pour l'utilisation optimale des mots-clés
    const optimalKeywords = keywordAnalysis.filter(k => k.isOptimal).length;
    const optimalBonus = (optimalKeywords / keywordAnalysis.length) * 5; // 5 points max
    
    // Pénalité pour les mots-clés manquants
    const missingPenalty = Math.min(missingKeywords.length * 0.5, 3); // 3 points max de pénalité
    
    // Pénalité pour la sur-utilisation
    const overusePenalty = Math.min(overusedKeywords.length * 0.3, 2); // 2 points max de pénalité
    
    const finalScore = Math.max(0, Math.min(40, score + optimalBonus - missingPenalty - overusePenalty));
    
    return Math.round(finalScore);
  }

  // Méthodes utilitaires
  cleanText(text) {
    return text
      .replace(/[^\w\sàâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  tokenize(text) {
    return text.split(/\s+/).filter(word => 
      word.length > 2 && !this.stopWords.has(word)
    );
  }

  calculateWordFrequencies(tokens) {
    const frequencies = {};
    tokens.forEach(token => {
      frequencies[token] = (frequencies[token] || 0) + 1;
    });
    return frequencies;
  }

  selectSignificantWords(wordFrequencies) {
    const minFrequency = 2; // Mot doit apparaître au moins 2 fois
    return Object.keys(wordFrequencies).filter(word => 
      wordFrequencies[word] >= minFrequency
    );
  }

  getTopKeywords(wordFrequencies, limit = 20) {
    return Object.entries(wordFrequencies)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([keyword, frequency]) => ({ keyword, frequency }));
  }

  calculateTFIDF(wordFrequencies, significantWords) {
    const tfidf = {};
    const totalWords = Object.values(wordFrequencies).reduce((sum, freq) => sum + freq, 0);
    
    significantWords.forEach(word => {
      const tf = wordFrequencies[word] / totalWords;
      const idf = Math.log(1 / 1); // Pour l'instant, on a un seul document
      tfidf[word] = tf * idf;
    });
    
    return tfidf;
  }

  calculateImportance(frequency, tfidf, mean, standardDeviation) {
    const frequencyScore = frequency / (mean + standardDeviation);
    const tfidfScore = tfidf;
    return (frequencyScore + tfidfScore) / 2;
  }

  calculateOptimalRanges(rankedKeywords, mean, standardDeviation) {
    const ranges = {};
    
    rankedKeywords.forEach(keyword => {
      const optimalMin = Math.max(1, Math.floor(mean - standardDeviation));
      const optimalMax = Math.ceil(mean + standardDeviation);
      
      ranges[keyword.keyword] = {
        min: optimalMin,
        max: optimalMax
      };
    });
    
    return ranges;
  }

  calculateAverageWordCount(content) {
    if (content.length === 0) return 0;
    
    const totalWords = content.reduce((sum, item) => {
      const text = item.content || `${item.title || ''} ${item.snippet || ''}`;
      return sum + text.split(/\s+/).length;
    }, 0);
    
    return Math.round(totalWords / content.length);
  }
}

module.exports = KeywordAnalysisService;
