const User = require('../models/User');

// Middleware pour vérifier si l'utilisateur a un rôle spécifique
const requireRole = (role) => {
  return async (req, res, next) => {
    try {
      // Vérifier si l'utilisateur est connecté
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Accès non autorisé. Connexion requise.'
        });
      }

      // Vérifier si l'utilisateur a le rôle requis
      if (req.user.role !== role) {
        return res.status(403).json({
          success: false,
          message: `Accès refusé. Rôle ${role} requis.`
        });
      }

      next();
    } catch (error) {
      console.error('Erreur dans requireRole middleware:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la vérification des permissions'
      });
    }
  };
};

// Middleware pour vérifier si l'utilisateur est admin
const requireAdmin = requireRole('admin');

// Middleware pour vérifier si l'utilisateur est member
const requireMember = requireRole('member');

// Middleware pour vérifier si l'utilisateur a au moins un des rôles spécifiés
const requireAnyRole = (roles) => {
  return async (req, res, next) => {
    try {
      // Vérifier si l'utilisateur est connecté
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Accès non autorisé. Connexion requise.'
        });
      }

      // Vérifier si l'utilisateur a au moins un des rôles requis
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: `Accès refusé. Rôles autorisés: ${roles.join(', ')}`
        });
      }

      next();
    } catch (error) {
      console.error('Erreur dans requireAnyRole middleware:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la vérification des permissions'
      });
    }
  };
};

module.exports = {
  requireRole,
  requireAdmin,
  requireMember,
  requireAnyRole
}; 