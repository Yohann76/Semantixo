const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roleAuth');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserStats
} = require('../controllers/adminController');

// Toutes les routes d'administration nécessitent une authentification et le rôle admin
router.use(protect);
router.use(requireAdmin);

// Routes pour la gestion des utilisateurs
router.route('/users')
  .get(getAllUsers);

router.route('/users/:id')
  .get(getUserById)
  .delete(deleteUser);

router.route('/users/:id/role')
  .put(updateUserRole);

// Route pour les statistiques
router.route('/stats')
  .get(getUserStats);

module.exports = router; 