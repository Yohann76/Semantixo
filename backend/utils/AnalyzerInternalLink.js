const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

/**
 * Classe AnalyzerInternalLink pour l'analyse du maillage interne
 */
class AnalyzerInternalLink {
  /**
   * Analyse du maillage interne d'un site web
   * @param {string} url - L'URL de la page à analyser
   * @returns {Object} - Résultats de l'analyse du maillage interne
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

      console.log('🔍 [INTERNAL LINK] Analyse du maillage interne pour:', normalizedUrl);

      const baseUrl = new URL(normalizedUrl);
      const domain = baseUrl.hostname;

      // Récupérer le contenu de la page principale
      const response = await axios.get(normalizedUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });

      const html = response.data;
      const $ = cheerio.load(html);

      // Extraire tous les liens
      const allLinks = $('a[href]');
      const internalLinks = [];
      const externalLinks = [];
      const brokenLinks = [];
      const internalPages = new Map();

      // Analyser chaque lien
      for (let i = 0; i < allLinks.length; i++) {
        const link = allLinks.eq(i);
        const href = link.attr('href');
        const anchorText = link.text().trim();

        if (!href) continue;

        try {
          let fullUrl;
          if (href.startsWith('http')) {
            fullUrl = href;
          } else if (href.startsWith('//')) {
            fullUrl = 'https:' + href;
          } else if (href.startsWith('/')) {
            fullUrl = `${baseUrl.protocol}//${domain}${href}`;
          } else {
            fullUrl = `${baseUrl.protocol}//${domain}/${href}`;
          }

          const linkUrl = new URL(fullUrl);

          // Vérifier si c'est un lien interne
          if (linkUrl.hostname === domain) {
            internalLinks.push({
              url: fullUrl,
              anchorText,
              isBroken: false
            });

            // Compter les liens par page interne
            if (!internalPages.has(fullUrl)) {
              internalPages.set(fullUrl, {
                url: fullUrl,
                title: '',
                internalLinksCount: 0,
                externalLinksCount: 0
              });
            }
            internalPages.get(fullUrl).internalLinksCount++;
          } else {
            externalLinks.push({
              url: fullUrl,
              anchorText
            });
          }

          // Vérifier si le lien est cassé (pour les liens internes)
          if (linkUrl.hostname === domain) {
            try {
              const linkResponse = await axios.head(fullUrl, {
                timeout: 5000,
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
              });

              if (linkResponse.status >= 400) {
                brokenLinks.push({
                  url: fullUrl,
                  anchorText,
                  statusCode: linkResponse.status
                });
              }
            } catch (error) {
              brokenLinks.push({
                url: fullUrl,
                anchorText,
                statusCode: error.response?.status || 0
              });
            }
          }
        } catch (error) {
          // Lien malformé
          brokenLinks.push({
            url: href,
            anchorText,
            statusCode: 0
          });
        }
      }

      // Récupérer les titres des pages internes
      const uniqueInternalUrls = [...new Set(internalLinks.map(link => link.url))];
      for (const pageUrl of uniqueInternalUrls.slice(0, 10)) { // Limiter à 10 pages pour les performances
        try {
          const pageResponse = await axios.get(pageUrl, {
            timeout: 5000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
          });
          const pageHtml = pageResponse.data;
          const page$ = cheerio.load(pageHtml);
          const pageTitle = page$('title').text().trim() || 'Sans titre';
          
          if (internalPages.has(pageUrl)) {
            internalPages.get(pageUrl).title = pageTitle;
          }
        } catch (error) {
          // Page inaccessible
        }
      }

      // Calculer les métriques
      const totalInternalLinks = internalLinks.length;
      const totalExternalLinks = externalLinks.length;
      const brokenLinksCount = brokenLinks.length;
      const uniqueInternalPagesCount = internalPages.size;
      const averageInternalLinksPerPage = uniqueInternalPagesCount > 0 ? 
        Math.round(totalInternalLinks / uniqueInternalPagesCount) : 0;

      // Calculer le score du maillage interne
      let internalLinkScore = 0;
      const maxScore = 100;

      // Critère 1: Présence de liens internes (20 points)
      if (totalInternalLinks > 0) {
        internalLinkScore += 20;
      }

      // Critère 2: Distribution des liens (25 points)
      if (uniqueInternalPagesCount >= 3) {
        internalLinkScore += 15;
        if (averageInternalLinksPerPage >= 2 && averageInternalLinksPerPage <= 10) {
          internalLinkScore += 10; // Distribution optimale
        }
      }

      // Critère 3: Qualité des liens (absence de liens cassés) (25 points)
      const brokenLinksRatio = totalInternalLinks > 0 ? brokenLinksCount / totalInternalLinks : 0;
      if (brokenLinksRatio === 0) {
        internalLinkScore += 25;
      } else if (brokenLinksRatio < 0.1) {
        internalLinkScore += 20;
      } else if (brokenLinksRatio < 0.2) {
        internalLinkScore += 15;
      } else if (brokenLinksRatio < 0.3) {
        internalLinkScore += 10;
      }

      // Critère 4: Textes d'ancrage descriptifs (20 points)
      const descriptiveAnchors = internalLinks.filter(link => 
        link.anchorText && link.anchorText.length >= 3 && link.anchorText.length <= 60
      ).length;
      const descriptiveRatio = totalInternalLinks > 0 ? descriptiveAnchors / totalInternalLinks : 0;
      
      if (descriptiveRatio >= 0.8) {
        internalLinkScore += 20;
      } else if (descriptiveRatio >= 0.6) {
        internalLinkScore += 15;
      } else if (descriptiveRatio >= 0.4) {
        internalLinkScore += 10;
      } else if (descriptiveRatio >= 0.2) {
        internalLinkScore += 5;
      }

      // Critère 5: Structure du site (10 points)
      if (uniqueInternalPagesCount >= 5) {
        internalLinkScore += 10;
      } else if (uniqueInternalPagesCount >= 3) {
        internalLinkScore += 7;
      } else if (uniqueInternalPagesCount >= 1) {
        internalLinkScore += 5;
      }

      // S'assurer que le score ne dépasse pas 100
      internalLinkScore = Math.min(Math.round(internalLinkScore), maxScore);

      // Générer des recommandations
      const recommendations = [];

      if (totalInternalLinks === 0) {
        recommendations.push('Ajoutez des liens internes pour améliorer la navigation et le SEO');
      } else if (totalInternalLinks < 5) {
        recommendations.push('Augmentez le nombre de liens internes pour une meilleure structure');
      }

      if (brokenLinksCount > 0) {
        recommendations.push(`Corrigez ${brokenLinksCount} lien(s) cassé(s) détecté(s)`);
      }

      if (uniqueInternalPagesCount < 3) {
        recommendations.push('Développez votre site avec plus de pages pour un meilleur maillage interne');
      }

      if (averageInternalLinksPerPage < 2) {
        recommendations.push('Ajoutez plus de liens internes par page pour une meilleure navigation');
      } else if (averageInternalLinksPerPage > 10) {
        recommendations.push('Réduisez le nombre de liens par page pour éviter la sur-optimisation');
      }

      const descriptiveAnchorsCount = internalLinks.filter(link => 
        link.anchorText && link.anchorText.length >= 3 && link.anchorText.length <= 60
      ).length;
      if (descriptiveAnchorsCount < totalInternalLinks * 0.8) {
        recommendations.push('Utilisez des textes d\'ancrage plus descriptifs pour vos liens internes');
      }

      return {
        internalLinkScore,
        metrics: {
          totalInternalLinks,
          totalExternalLinks,
          brokenLinks: brokenLinksCount,
          uniqueInternalPages: uniqueInternalPagesCount,
          averageInternalLinksPerPage
        },
        internalLinkElements: {
          hasInternalLinks: totalInternalLinks > 0,
          hasBrokenLinks: brokenLinksCount > 0,
          hasOptimalDistribution: averageInternalLinksPerPage >= 2 && averageInternalLinksPerPage <= 10,
          hasDescriptiveAnchorText: descriptiveAnchorsCount >= totalInternalLinks * 0.8
        },
        internalPages: Array.from(internalPages.values()),
        brokenLinks,
        analysis: {
          linkQuality: brokenLinksRatio === 0 ? 'Excellent' : brokenLinksRatio < 0.1 ? 'Bon' : 'À améliorer',
          siteStructure: uniqueInternalPagesCount >= 5 ? 'Bon' : uniqueInternalPagesCount >= 3 ? 'Moyen' : 'Faible',
          navigation: averageInternalLinksPerPage >= 2 ? 'Bon' : 'À améliorer',
          recommendations
        }
      };

    } catch (error) {
      console.error('Erreur AnalyzerInternalLink.analyze:', error);
      
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        throw new Error('Impossible d\'accéder à cette URL. Vérifiez que l\'URL est correcte et accessible.');
      }
      
      if (error.code === 'ETIMEDOUT') {
        throw new Error('Le temps de réponse a expiré. L\'URL peut être trop lente ou inaccessible.');
      }

      throw new Error('Erreur lors de l\'analyse du maillage interne');
    }
  }
}

module.exports = AnalyzerInternalLink; 