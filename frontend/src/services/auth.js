// Service d'authentification
class AuthService {
  constructor() {
    this.user = this.getUserFromStorage();
    this.token = this.getTokenFromStorage();
  }

  // Récupérer l'utilisateur depuis le localStorage
  getUserFromStorage() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Récupérer le token depuis le localStorage
  getTokenFromStorage() {
    return localStorage.getItem('token');
  }

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!this.token && !!this.user;
  }

  // Se connecter
  async login(email, password) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        this.token = data.data.token;
        this.user = data.data.user;
        
        localStorage.setItem('token', this.token);
        localStorage.setItem('user', JSON.stringify(this.user));
        
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Erreur connexion:', error);
      return { success: false, message: 'Erreur de connexion au serveur' };
    }
  }

  // S'inscrire
  async register(name, email, password) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message, errors: data.errors };
      }
    } catch (error) {
      console.error('Erreur inscription:', error);
      return { success: false, message: 'Erreur de connexion au serveur' };
    }
  }

  // Se déconnecter
  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Obtenir le token pour les requêtes API
  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    };
  }

  // Rafraîchir les informations utilisateur
  async refreshUser() {
    if (!this.token) return;

    try {
      const response = await fetch('http://localhost:3000/api/auth/me', {
        headers: this.getAuthHeaders()
      });

      if (response.ok) {
        const data = await response.json();
        this.user = data.data.user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        // Token invalide, déconnexion
        this.logout();
      }
    } catch (error) {
      console.error('Erreur rafraîchissement utilisateur:', error);
      this.logout();
    }
  }
}

// Instance singleton
const authService = new AuthService();

export default authService; 