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
    
    // Mots génériques non pertinents pour l'analyse SEO (indépendants du domaine)
    this.genericWords = new Set([
      // Temps et dates
      'semaine', 'semaines', 'jour', 'jours', 'heure', 'heures', 'minute', 'minutes',
      '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h',
      'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche',
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août',
      'septembre', 'octobre', 'novembre', 'décembre',
      'matin', 'midi', 'après-midi', 'soir', 'nuit',
      'premier', 'deuxième', 'troisième', 'dernier', 'prochain',
      
      // Adjectifs génériques
      'petit', 'grand', 'gros', 'petite', 'grande', 'grosse',
      'bon', 'mauvais', 'bien', 'mal', 'meilleur', 'pire',
      'nouveau', 'ancien', 'vieux', 'jeune', 'récent',
      'gratuit', 'payant', 'cher', 'pas cher', 'bon marché',
      
      // Éléments d'interface web
      'avis', 'commentaire', 'commentaires', 'note', 'étoile', 'étoiles',
      'lien', 'liens', 'site', 'sites', 'page', 'pages', 'article', 'articles',
      'photo', 'photos', 'image', 'images', 'vidéo', 'vidéos',
      'télécharger', 'téléchargement', 'pdf', 'document', 'documents',
      'contact', 'email', 'téléphone', 'adresse', 'localisation',
      'accueil', 'menu', 'navigation', 'footer', 'header',
      'cookie', 'cookies', 'politique', 'confidentialité', 'mentions', 'légales',
      
      // Mots techniques génériques
      'système', 'systèmes', 'technologie', 'technologies', 'solution', 'solutions',
      'service', 'services', 'produit', 'produits', 'marque', 'marques',
      'entreprise', 'entreprises', 'société', 'sociétés', 'compagnie', 'compagnies',
      
      // Mots de mesure génériques
      'prix', 'coût', 'coûts', 'argent', 'euro', 'euros', 'dollar', 'dollars',
      'centime', 'centimes', 'pourcent', 'pourcentage', 'pourcentages',
      'kilogramme', 'kilogrammes', 'kg', 'gramme', 'grammes', 'g',
      'mètre', 'mètres', 'm', 'centimètre', 'centimètres', 'cm',
      'litre', 'litres', 'l', 'millilitre', 'millilitres', 'ml'
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
    
    // Sélection des mots significatifs avec filtrage intelligent
    const significantWords = this.selectSignificantWords(wordFrequencies);
    
    // Détection du contexte pour améliorer la pertinence
    const contextKeywords = this.detectContextKeywords(wordFrequencies, fullText);
    
    return {
      totalWords: tokens.length,
      uniqueWords: Object.keys(wordFrequencies).length,
      wordFrequencies,
      significantWords,
      topKeywords: this.getTopKeywords(wordFrequencies, 20),
      contextKeywords
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
    
    // Utiliser les mots-clés du référentiel (extraits des SERP) au lieu des mots-clés utilisateur
    const keywordsToAnalyze = referenceData.rankedKeywords.slice(0, 20); // Top 20 mots-clés des SERP
    
    console.log(`🔍 [KeywordAnalysisService] Analyse de ${keywordsToAnalyze.length} mots-clés des SERP`);
    console.log('🔍 [KeywordAnalysisService] Mots-clés à analyser:', keywordsToAnalyze.map(k => k.keyword));
    
    // Analyser les mots-clés des SERP
    const keywordAnalysis = keywordsToAnalyze.map(referenceKeyword => {
      const keyword = referenceKeyword.keyword;
      const frequency = targetWordFrequencies[keyword.toLowerCase()] || 0;
      const density = (frequency / targetTokens.length) * 100;
      
      const optimalRange = referenceData.optimalRanges[keyword] || { min: 0, max: 0 };
      
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
    
    // Vérifier qu'il y a des mots-clés à analyser
    if (!keywordAnalysis || keywordAnalysis.length === 0) {
      console.log('⚠️ [KeywordAnalysisService] Aucun mot-clé à analyser, scores par défaut');
      return {
        sosScore: 0,
        dseoScore: 0,
        overallRelevance: 0
      };
    }
    
    // SOS Score (proximité avec la fréquence optimale)
    let sosScore = 0;
    let totalKeywords = keywordAnalysis.length;
    
    console.log(`🔍 [KeywordAnalysisService] Analyse de ${totalKeywords} mots-clés`);
    
    for (const keyword of keywordAnalysis) {
      if (keyword.isOptimal) {
        sosScore += 1; // Score parfait
        console.log(`✅ [KeywordAnalysisService] Mot-clé optimal: ${keyword.keyword}`);
      } else if (keyword.isOverused) {
        // Pénalité pour sur-utilisation
        const overuseRatio = keyword.frequency / keyword.optimalRange.max;
        const score = Math.max(0, 1 - (overuseRatio - 1) * 0.5);
        sosScore += score;
        console.log(`⚠️ [KeywordAnalysisService] Mot-clé sur-utilisé: ${keyword.keyword} (ratio: ${overuseRatio.toFixed(2)}, score: ${score.toFixed(2)})`);
      } else if (keyword.isUnderused) {
        // Pénalité pour sous-utilisation
        const underuseRatio = keyword.frequency / keyword.optimalRange.min;
        const score = underuseRatio * 0.8;
        sosScore += score;
        console.log(`⚠️ [KeywordAnalysisService] Mot-clé sous-utilisé: ${keyword.keyword} (ratio: ${underuseRatio.toFixed(2)}, score: ${score.toFixed(2)})`);
      }
    }
    
    // Éviter la division par zéro
    sosScore = totalKeywords > 0 ? (sosScore / totalKeywords) * 100 : 0;
    
    // DSEO Score (mesure de la sur-utilisation)
    const overusePenalty = overusedKeywords.length * 10;
    const dseoScore = Math.max(0, 100 - overusePenalty);
    
    // Score global de pertinence
    const overallRelevance = (sosScore + dseoScore) / 2;
    
    const finalScores = {
      sosScore: Math.round(sosScore),
      dseoScore: Math.round(dseoScore),
      overallRelevance: Math.round(overallRelevance)
    };
    
    console.log('📊 [KeywordAnalysisService] Scores calculés:', finalScores);
    console.log(`📊 [KeywordAnalysisService] Détail: ${totalKeywords} mots-clés, ${overusedKeywords.length} sur-utilisés, ${missingKeywords.length} manquants`);
    
    return finalScores;
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
    const minLength = 3; // Mot doit faire au moins 3 caractères
    
    return Object.keys(wordFrequencies).filter(word => {
      // Filtres de base
      if (wordFrequencies[word] < minFrequency) return false;
      if (word.length < minLength) return false;
      
      // Exclure les mots génériques non pertinents
      if (this.genericWords.has(word.toLowerCase())) return false;
      
      // Exclure les mots qui sont des nombres purs
      if (/^\d+$/.test(word)) return false;
      
      // Exclure les mots qui sont des heures (format 12h, 13h, etc.)
      if (/^\d{1,2}h$/.test(word)) return false;
      
      // Exclure les mots qui sont des dates (format 2023, 2024, etc.)
      if (/^(19|20)\d{2}$/.test(word)) return false;
      
      return true;
    });
  }

  getTopKeywords(wordFrequencies, limit = 20) {
    // Calculer un score de pertinence pour chaque mot
    const totalWords = Object.values(wordFrequencies).reduce((sum, freq) => sum + freq, 0);
    
    return Object.entries(wordFrequencies)
      .map(([keyword, frequency]) => {
        // Score de fréquence normalisé
        const frequencyScore = frequency / totalWords;
        
        // Bonus pour les mots plus longs (plus spécifiques)
        const lengthBonus = Math.min(keyword.length / 10, 0.5);
        
        // Bonus pour les mots qui ne sont pas génériques
        const specificityBonus = this.genericWords.has(keyword.toLowerCase()) ? 0 : 0.3;
        
        // Score final de pertinence
        const relevanceScore = frequencyScore + lengthBonus + specificityBonus;
        
        return {
          keyword,
          frequency,
          relevanceScore
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore) // Trier par score de pertinence
      .slice(0, limit)
      .map(({ keyword, frequency }) => ({ keyword, frequency }));
  }

  calculateTFIDF(wordFrequencies, significantWords) {
    const tfidf = {};
    const totalWords = Object.values(wordFrequencies).reduce((sum, freq) => sum + freq, 0);
    
    significantWords.forEach(word => {
      const tf = wordFrequencies[word] / totalWords;
      
      // IDF amélioré : pénaliser les mots trop fréquents dans le corpus
      const wordFrequency = wordFrequencies[word];
      const averageFrequency = totalWords / Object.keys(wordFrequencies).length;
      const frequencyRatio = wordFrequency / averageFrequency;
      
      // IDF basé sur la rareté relative du mot
      const idf = Math.log(1 + (1 / Math.max(frequencyRatio, 0.1)));
      
      // Bonus pour les mots plus longs (plus spécifiques)
      const lengthBonus = Math.min(word.length / 15, 0.2);
      
      // Pénalité pour les mots génériques
      const genericPenalty = this.genericWords.has(word.toLowerCase()) ? 0.5 : 1;
      
      tfidf[word] = (tf * idf + lengthBonus) * genericPenalty;
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
      // Calculer une plage optimale basée sur la fréquence réelle du mot dans les SERP
      const serpFrequency = keyword.frequency;
      
      // Plage optimale : 70% à 130% de la fréquence SERP
      const optimalMin = Math.max(1, Math.floor(serpFrequency * 0.7));
      const optimalMax = Math.ceil(serpFrequency * 1.3);
      
      // Ajuster selon la longueur du mot (mots plus longs = plage plus large)
      const lengthFactor = Math.min(keyword.keyword.length / 10, 0.5);
      const adjustedMin = Math.max(1, Math.floor(optimalMin * (1 - lengthFactor)));
      const adjustedMax = Math.ceil(optimalMax * (1 + lengthFactor));
      
      ranges[keyword.keyword] = {
        min: adjustedMin,
        max: adjustedMax
      };
      
      console.log(`📊 [KeywordAnalysisService] Plage optimale pour "${keyword.keyword}": ${adjustedMin}-${adjustedMax} (fréquence SERP: ${serpFrequency})`);
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

  /**
   * Détection intelligente des mots-clés de contexte
   * Identifie les mots les plus pertinents en analysant les co-occurrences
   */
  detectContextKeywords(wordFrequencies, fullText) {
    console.log('🔍 [KeywordAnalysisService] Détection du contexte...');
    
    // Mots-clés potentiels (fréquence > 1, longueur > 3, pas génériques)
    const candidateWords = Object.keys(wordFrequencies).filter(word => {
      return wordFrequencies[word] > 1 && 
             word.length > 3 && 
             !this.genericWords.has(word.toLowerCase()) &&
             !this.stopWords.has(word.toLowerCase());
    });
    
    // Analyser les co-occurrences pour identifier les mots-clés liés
    const contextScores = {};
    
    candidateWords.forEach(word => {
      let contextScore = 0;
      
      // Bonus pour les mots qui apparaissent dans des phrases importantes
      const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = fullText.match(wordRegex);
      if (matches) {
        contextScore += matches.length * 0.5;
      }
      
      // Bonus pour les mots plus longs (plus spécifiques)
      contextScore += word.length * 0.1;
      
      // Bonus pour les mots qui ne sont pas des nombres ou des heures
      if (!/^\d+$/.test(word) && !/^\d{1,2}h$/.test(word)) {
        contextScore += 0.3;
      }
      
      // Bonus pour les mots qui apparaissent dans des contextes variés
      const contextVariations = this.findContextVariations(word, fullText);
      contextScore += contextVariations * 0.2;
      
      contextScores[word] = contextScore;
    });
    
    // Retourner les mots-clés triés par score de contexte
    return Object.entries(contextScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 15) // Top 15 mots-clés de contexte
      .map(([word, score]) => ({
        keyword: word,
        frequency: wordFrequencies[word],
        contextScore: score
      }));
  }

  /**
   * Trouve les variations de contexte pour un mot
   */
  findContextVariations(word, text) {
    const variations = new Set();
    const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
    let match;
    
    while ((match = wordRegex.exec(text)) !== null) {
      const start = Math.max(0, match.index - 20);
      const end = Math.min(text.length, match.index + word.length + 20);
      const context = text.substring(start, end);
      
      // Extraire des mots-clés du contexte
      const contextWords = context.split(/\s+/)
        .filter(w => w.length > 3 && !this.stopWords.has(w.toLowerCase()))
        .slice(0, 3); // Prendre les 3 premiers mots du contexte
      
      contextWords.forEach(cw => variations.add(cw));
    }
    
    return variations.size;
  }
}

module.exports = KeywordAnalysisService;
