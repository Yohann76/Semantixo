const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Classe AnalyzerPageSeo pour l'analyse SEO de pages web
 */
class AnalyzerPageSeo {
  /**
   * Analyse SEO d'une page web
   * @param {string} url - L'URL de la page à analyser
   * @returns {Object} - Résultats de l'analyse SEO
   */
  static async analyze(url) {
    try {
      // Valider l'URL
      if (!url || !url.trim()) {
        throw new Error('L\'URL ne peut pas être vide');
      }

      // Normaliser l'URL
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }

      console.log('🔍 [PAGE SEO] Analyse de l\'URL:', normalizedUrl);

      // Récupérer le contenu de la page
      const response = await axios.get(normalizedUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Extraire les éléments SEO
      const pageTitle = $('title').text().trim() || 'Sans titre';
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      
      // Extraire le contenu textuel
      const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
      
      // Compter les éléments
      const headings = $('h1, h2, h3, h4, h5, h6');
      const images = $('img');
      const links = $('a');

      // Calculer les métriques de base
      const wordCount = bodyText.split(/\s+/).filter(word => word.length > 0).length;
      const characterCount = bodyText.length;
      const headingCount = headings.length;
      const imageCount = images.length;
      const linkCount = links.length;

      // Calculer le score SEO
      let seoScore = 0;
      const maxScore = 100;

      // Critère 1: Titre de page (15 points)
      if (pageTitle && pageTitle.length > 0) {
        seoScore += 15;
        if (pageTitle.length >= 30 && pageTitle.length <= 60) {
          seoScore += 5; // Longueur optimale
        }
      }

      // Critère 2: Meta description (15 points)
      if (metaDescription && metaDescription.length > 0) {
        seoScore += 15;
        if (metaDescription.length >= 120 && metaDescription.length <= 160) {
          seoScore += 5; // Longueur optimale
        }
      }

      // Critère 3: Contenu textuel (20 points)
      if (wordCount >= 300) {
        seoScore += 20; // Contenu riche
      } else if (wordCount >= 200) {
        seoScore += 15; // Contenu bon
      } else if (wordCount >= 100) {
        seoScore += 10; // Contenu acceptable
      } else if (wordCount >= 50) {
        seoScore += 5; // Contenu minimal
      }

      // Critère 4: Structure des titres (15 points)
      if (headingCount > 0) {
        seoScore += 10;
        const h1Count = $('h1').length;
        if (h1Count === 1) {
          seoScore += 5; // Un seul H1 (bonne pratique)
        }
      }

      // Critère 5: Images (10 points)
      if (imageCount > 0) {
        seoScore += 10;
        const imagesWithAlt = images.filter((i, el) => $(el).attr('alt')).length;
        if (imagesWithAlt === imageCount) {
          seoScore += 5; // Toutes les images ont un alt
        }
      }

      // Critère 6: Liens (10 points)
      if (linkCount > 0) {
        seoScore += 10;
        const internalLinks = links.filter((i, el) => {
          const href = $(el).attr('href');
          return href && (href.startsWith('/') || href.includes(normalizedUrl));
        }).length;
        if (internalLinks > 0) {
          seoScore += 5; // Liens internes présents
        }
      }

      // Critère 7: Responsive et performance (15 points)
      const hasViewport = $('meta[name="viewport"]').length > 0;
      const hasCanonical = $('link[rel="canonical"]').length > 0;
      const hasRobots = $('meta[name="robots"]').length > 0;

      if (hasViewport) seoScore += 5;
      if (hasCanonical) seoScore += 5;
      if (hasRobots) seoScore += 5;

      // S'assurer que le score ne dépasse pas 100
      seoScore = Math.min(Math.round(seoScore), maxScore);

      // Générer des recommandations
      const recommendations = [];

      if (!pageTitle || pageTitle === 'Sans titre') {
        recommendations.push('Ajoutez un titre de page (balise title)');
      } else if (pageTitle.length < 30 || pageTitle.length > 60) {
        recommendations.push('Optimisez la longueur du titre (30-60 caractères)');
      }

      if (!metaDescription) {
        recommendations.push('Ajoutez une meta description');
      } else if (metaDescription.length < 120 || metaDescription.length > 160) {
        recommendations.push('Optimisez la longueur de la meta description (120-160 caractères)');
      }

      if (wordCount < 300) {
        recommendations.push('Ajoutez plus de contenu textuel (minimum 300 mots)');
      }

      if (headingCount === 0) {
        recommendations.push('Ajoutez des titres (H1, H2, H3...) pour structurer le contenu');
      } else {
        const h1Count = $('h1').length;
        if (h1Count === 0) {
          recommendations.push('Ajoutez un titre principal (H1)');
        } else if (h1Count > 1) {
          recommendations.push('Utilisez un seul titre H1 par page');
        }
      }

      if (imageCount > 0) {
        const imagesWithoutAlt = imageCount - images.filter((i, el) => $(el).attr('alt')).length;
        if (imagesWithoutAlt > 0) {
          recommendations.push(`Ajoutez des attributs alt à ${imagesWithoutAlt} image(s)`);
        }
      }

      if (!hasViewport) {
        recommendations.push('Ajoutez une meta viewport pour la responsivité');
      }

      if (!hasCanonical) {
        recommendations.push('Ajoutez une balise canonical pour éviter le contenu dupliqué');
      }

      return {
        seoScore,
        pageTitle,
        metaDescription,
        metrics: {
          wordCount,
          characterCount,
          headingCount,
          imageCount,
          linkCount
        },
        seoElements: {
          hasTitle: pageTitle && pageTitle !== 'Sans titre',
          hasMetaDescription: metaDescription.length > 0,
          hasHeadings: headingCount > 0,
          hasImages: imageCount > 0,
          hasLinks: linkCount > 0
        },
        analysis: {
          contentQuality: wordCount < 100 ? 'Faible' : wordCount < 300 ? 'Moyen' : 'Bon',
          structure: headingCount === 0 ? 'Faible' : headingCount < 3 ? 'Moyen' : 'Bon',
          accessibility: imageCount > 0 && images.filter((i, el) => $(el).attr('alt')).length === imageCount ? 'Bon' : 'À améliorer',
          recommendations
        }
      };

    } catch (error) {
      console.error('Erreur AnalyzerPageSeo.analyze:', error);
      
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Impossible d\'accéder à cette URL. Vérifiez que l\'URL est correcte et accessible.');
      }
      
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Le temps de réponse a expiré. L\'URL peut être trop lente ou inaccessible.');
      }

      throw new Error('Erreur lors de l\'analyse SEO de la page');
    }
  }
}

module.exports = AnalyzerPageSeo; 