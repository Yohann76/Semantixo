const User = require('../models/User');

// @desc    Obtenir tous les utilisateurs (Admin seulement)
// @route   GET /api/admin/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Erreur getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des utilisateurs.'
    });
  }
};

// @desc    Obtenir un utilisateur par ID (Admin seulement)
// @route   GET /api/admin/users/:id
// @access  Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erreur getUserById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'utilisateur.'
    });
  }
};

// @desc    Mettre à jour le rôle d'un utilisateur (Admin seulement)
// @route   PUT /api/admin/users/:id/role
// @access  Admin
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Vérifier que le rôle est valide
    if (!['member', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rôle invalide. Les rôles autorisés sont: member, admin'
      });
    }

    // Empêcher l'admin de changer son propre rôle
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas modifier votre propre rôle.'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
    }

    res.json({
      success: true,
      message: `Rôle de l'utilisateur mis à jour vers ${role}`,
      data: user
    });
  } catch (error) {
    console.error('Erreur updateUserRole:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du rôle.'
    });
  }
};

// @desc    Supprimer un utilisateur (Admin seulement)
// @route   DELETE /api/admin/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    // Empêcher l'admin de se supprimer lui-même
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte.'
      });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé.'
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès.'
    });
  } catch (error) {
    console.error('Erreur deleteUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression de l\'utilisateur.'
    });
  }
};

// @desc    Obtenir les statistiques des utilisateurs (Admin seulement)
// @route   GET /api/admin/stats
// @access  Admin
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const memberUsers = await User.countDocuments({ role: 'member' });
    const premiumUsers = await User.countDocuments({ subscription: 'premium' });
    const freeUsers = await User.countDocuments({ subscription: 'free' });

    // Utilisateurs créés ce mois
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thisMonth }
    });

    res.json({
      success: true,
      data: {
        total: totalUsers,
        admins: adminUsers,
        members: memberUsers,
        premium: premiumUsers,
        free: freeUsers,
        newThisMonth: newUsersThisMonth
      }
    });
  } catch (error) {
    console.error('Erreur getUserStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques.'
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserStats
}; 