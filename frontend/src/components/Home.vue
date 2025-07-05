<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Optimisez votre SEO avec Semantixo</h1>
        <p class="hero-subtitle">
          Analysez et améliorez vos textes pour un référencement optimal. 
          Découvrez les secrets d'un contenu qui se classe en première position.
        </p>
        <div class="hero-buttons">
          <router-link to="/verify-text" class="cta-button primary">
            Commencer l'analyse
          </router-link>
          <router-link to="/register" class="cta-button secondary">
            Créer un compte
          </router-link>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">Pourquoi choisir Semantixo ?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>Placer vos articles en haut des recherches</h3>
            <p>Optimisez vos mots-clés et votre structure pour atteindre la première page de Google et augmenter votre visibilité.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>Avoir un texte performant</h3>
            <p>Analysez la lisibilité, la densité de mots-clés et la structure de vos contenus pour maximiser leur impact.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>Vérifier les correspondances IA</h3>
            <p>Détectez et évitez le contenu dupliqué grâce à notre technologie d'analyse intelligente et de vérification d'originalité.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials-section">
      <div class="container">
        <h2 class="section-title">Ce que disent nos utilisateurs</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"Semantixo m'a permis d'améliorer drastiquement le référencement de mes articles. Mes pages se classent maintenant dans le top 3 !"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">M</div>
              <div class="author-info">
                <h4>Marie Dubois</h4>
                <span>Rédactrice web freelance</span>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"L'outil d'analyse est incroyablement précis. J'ai pu identifier et corriger les problèmes de contenu dupliqué en quelques clics."</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">T</div>
              <div class="author-info">
                <h4>Thomas Martin</h4>
                <span>SEO Manager</span>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"Interface intuitive et résultats rapides. Semantixo est devenu indispensable dans ma routine de création de contenu."</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">S</div>
              <div class="author-info">
                <h4>Sophie Bernard</h4>
                <span>Content Manager</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing-section">
      <div class="container">
        <h2 class="section-title">Choisissez votre plan</h2>
        <div class="pricing-grid">
          <div class="pricing-card">
            <div class="pricing-header">
              <h3>Gratuit</h3>
              <div class="price">
                <span class="currency">€</span>
                <span class="amount">0</span>
                <span class="period">/mois</span>
              </div>
            </div>
            <ul class="pricing-features">
              <li>✓ 10 analyses par mois</li>
              <li>✓ Analyse SEO de base</li>
              <li>✓ Suggestions d'amélioration</li>
              <li>✓ Support communautaire</li>
            </ul>
            <router-link to="/register" class="pricing-button">
              Commencer gratuitement
            </router-link>
          </div>
          
          <div class="pricing-card featured">
            <div class="pricing-header">
              <h3>Pro</h3>
              <div class="price">
                <span class="currency">€</span>
                <span class="amount">29</span>
                <span class="period">/mois</span>
              </div>
            </div>
            <ul class="pricing-features">
              <li>✓ Analyses illimitées</li>
              <li>✓ Analyse SEO avancée</li>
              <li>✓ Détection de contenu dupliqué</li>
              <li>✓ Rapports détaillés</li>
              <li>✓ Support prioritaire</li>
            </ul>
            <router-link to="/register" class="pricing-button featured">
              Choisir Pro
            </router-link>
          </div>
          
          <div class="pricing-card">
            <div class="pricing-header">
              <h3>Entreprise</h3>
              <div class="price">
                <span class="currency">€</span>
                <span class="amount">99</span>
                <span class="period">/mois</span>
              </div>
            </div>
            <ul class="pricing-features">
              <li>✓ Tout du plan Pro</li>
              <li>✓ API d'intégration</li>
              <li>✓ Gestion d'équipe</li>
              <li>✓ Support dédié</li>
              <li>✓ Formation personnalisée</li>
            </ul>
            <router-link to="/register" class="pricing-button">
              Contacter l'équipe
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">Questions fréquentes</h2>
        <div class="faq-grid">
          <div class="faq-item">
            <h3 class="faq-question">Comment fonctionne l'analyse SEO ?</h3>
            <p class="faq-answer">
              Notre outil analyse votre texte en temps réel pour évaluer la densité de mots-clés, 
              la lisibilité, la structure et d'autres facteurs SEO importants. Vous recevez des 
              suggestions concrètes pour améliorer votre contenu.
            </p>
          </div>
          
          <div class="faq-item">
            <h3 class="faq-question">Puis-je analyser des textes en plusieurs langues ?</h3>
            <p class="faq-answer">
              Oui, Semantixo supporte actuellement le français et l'anglais. Nous travaillons 
              sur l'ajout d'autres langues pour étendre notre service.
            </p>
          </div>
          
          <div class="faq-item">
            <h3 class="faq-question">Mes données sont-elles sécurisées ?</h3>
            <p class="faq-answer">
              Absolument. Nous utilisons un chiffrement de bout en bout et ne stockons jamais 
              vos textes de manière permanente. Votre confidentialité est notre priorité.
            </p>
          </div>
          
          <div class="faq-item">
            <h3 class="faq-question">Comment améliorer mon score SEO ?</h3>
            <p class="faq-answer">
              Suivez nos recommandations : optimisez vos mots-clés, améliorez la structure de 
              vos textes, évitez le contenu dupliqué et créez du contenu de qualité. 
              Notre outil vous guide à chaque étape.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 120px 20px 80px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 40px;
  opacity: 0.95;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 15px 30px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.cta-button.primary {
  background: white;
  color: #667eea;
}

.cta-button.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.cta-button.secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.cta-button.secondary:hover {
  background: white;
  color: #667eea;
  transform: translateY(-3px);
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Section Titles */
.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 60px;
  color: #333;
}

/* Features Section */
.features-section {
  background: white;
  padding: 80px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
}

.feature-card {
  text-align: center;
  padding: 40px 30px;
  background: #f8f9fa;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 1.4rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* Testimonials Section */
.testimonials-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
}

.testimonials-section .section-title {
  color: white;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.testimonial-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.testimonial-content p {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 20px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 15px;
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.author-info h4 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.author-info span {
  opacity: 0.8;
  font-size: 0.9rem;
}

/* Pricing Section */
.pricing-section {
  background: white;
  padding: 80px 0;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.pricing-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 40px 30px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
}

.pricing-card.featured {
  border-color: #667eea;
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
}

.pricing-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.1);
}

.pricing-card.featured:hover {
  transform: scale(1.05) translateY(-5px);
}

.pricing-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

.price {
  margin-bottom: 30px;
}

.currency {
  font-size: 1.2rem;
  color: #667eea;
  font-weight: 600;
}

.amount {
  font-size: 3rem;
  font-weight: bold;
  color: #333;
}

.period {
  font-size: 1rem;
  color: #666;
}

.pricing-features {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.pricing-features li {
  padding: 8px 0;
  color: #666;
}

.pricing-button {
  display: inline-block;
  padding: 12px 30px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.pricing-button:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.pricing-button.featured {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* FAQ Section */
.faq-section {
  background: #f8f9fa;
  padding: 80px 0;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-top: 60px;
}

.faq-item {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.faq-question {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.faq-answer {
  color: #666;
  line-height: 1.6;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .features-grid,
  .testimonials-grid,
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
  }
}
</style> 