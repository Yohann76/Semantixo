<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-content">
        <!-- Colonne 1: Description et Logo -->
        <div class="footer-column">
          <div class="footer-logo">
            <span class="logo-text">Semantixo</span>
          </div>
          <p class="footer-description">
            Optimisez votre SEO avec notre outil d'analyse intelligent. 
            Analysez vos textes, améliorez votre référencement et atteignez 
            la première page de Google.
          </p>
        </div>

        <!-- Colonne 2: Fonctionnalités -->
        <div class="footer-column">
          <h3 class="footer-title">Fonctionnalités</h3>
          <ul class="footer-links">
            <li><router-link to="/verify-text">Analyse SEO</router-link></li>
            <li><router-link to="/verify-text">Détection de contenu dupliqué</router-link></li>
            <li><router-link to="/verify-text">Optimisation des mots-clés</router-link></li>
            <li><router-link to="/verify-text">Rapports détaillés</router-link></li>
          </ul>
        </div>

        <!-- Colonne 3: Liens légaux -->
        <div class="footer-column">
          <h3 class="footer-title">Informations</h3>
          <ul class="footer-links">
            <li><a href="#" @click.prevent="showPage('tarifs')">Tarifs</a></li>
            <li><a href="#" @click.prevent="showPage('mentions')">Mentions légales</a></li>
            <li><a href="#" @click.prevent="showPage('cgv')">Conditions générales de vente</a></li>
            <li><a href="#" @click.prevent="showPage('utilisation')">Conditions d'utilisation</a></li>
            <li><a href="#" @click.prevent="showPage('vocabulaire')">Vocabulaire</a></li>
          </ul>
        </div>

        <!-- Colonne 4: Réseaux sociaux -->
        <div class="footer-column">
          <h3 class="footer-title">Suivez-nous</h3>
          <div class="social-links">
            <a href="https://twitter.com/semantixo" target="_blank" rel="noopener" class="social-link">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Twitter
            </a>
            <a href="https://facebook.com/semantixo" target="_blank" rel="noopener" class="social-link">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </a>
            <a href="https://discord.gg/semantixo" target="_blank" rel="noopener" class="social-link">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.019 1.3332-.9559 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9559 2.4189-2.1568 2.4189Z"/>
              </svg>
              Discord
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p>&copy; 2024 Semantixo. Tous droits réservés.</p>
          <div class="footer-bottom-links">
            <a href="#" @click.prevent="showPage('privacy')">Confidentialité</a>
            <a href="#" @click.prevent="showPage('cookies')">Cookies</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'MainFooter',
  methods: {
    showPage(page) {
      // Pour l'instant, on affiche juste un message
      // Plus tard, on pourra implémenter des pages dédiées
      console.log(`Page ${page} demandée`)
      alert(`Page ${page} - Fonctionnalité à venir`)
    }
  }
}
</script>

<style scoped>
.footer {
  background-color: rgba(12, 100, 165, 0.6);
  color: white;
  padding: 60px 0 20px;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  margin-bottom: 20px;
}

.logo-text {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
}

.footer-description {
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 20px;
}

.footer-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: white;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.95rem;
}

.footer-links a:hover {
  color: white;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
  font-size: 0.95rem;
}

.social-link:hover {
  color: white;
}

.social-icon {
  width: 20px;
  height: 20px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 20px;
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.footer-bottom p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

.footer-bottom-links {
  display: flex;
  gap: 20px;
}

.footer-bottom-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.footer-bottom-links a:hover {
  color: white;
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-bottom-links {
    justify-content: center;
  }
  
  .social-links {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 40px 0 20px;
  }
  
  .footer-container {
    padding: 0 15px;
  }
  
  .logo-text {
    font-size: 1.5rem;
  }
}
</style> 