<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <router-link to="/" class="brand-link">
          <span class="brand-text">Semantixo</span>
        </router-link>
      </div>
      
      <div class="navbar-menu">
        <router-link to="/" class="nav-link" active-class="active">
          Accueil
        </router-link>
        <router-link to="/verify-text" class="nav-link" active-class="active">
          Application
        </router-link>
      </div>
      
      <div class="navbar-auth">
        <button class="login-btn" @click="handleLogin">
          Connexion
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavbarComponent',
  methods: {
    handleLogin() {
      // TODO: Implémenter la logique de connexion
      console.log('Bouton connexion cliqué');
      // Ici vous pourrez ajouter la logique d'authentification
    }
  }
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  height: 70px;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.navbar-brand {
  flex-shrink: 0;
}

.brand-link {
  text-decoration: none;
  color: white;
}

.brand-text {
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: 1px;
}

.navbar-menu {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 5px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: white;
  border-radius: 1px;
}

.navbar-auth {
  flex-shrink: 0;
}

.login-btn {
  background: white;
  color: #667eea;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  background: #f8f9fa;
}

/* Responsive design */
@media (max-width: 768px) {
  .navbar-container {
    padding: 0 15px;
  }
  
  .brand-text {
    font-size: 1.5rem;
  }
  
  .navbar-menu {
    gap: 15px;
  }
  
  .nav-link {
    font-size: 0.9rem;
    padding: 6px 12px;
  }
  
  .login-btn {
    padding: 8px 16px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .navbar-menu {
    gap: 10px;
  }
  
  .nav-link {
    font-size: 0.8rem;
    padding: 5px 8px;
  }
  
  .brand-text {
    font-size: 1.3rem;
  }
}
</style> 