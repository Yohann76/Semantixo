# Backend - Node.JS 

## 🚀 Démarrage du serveur

```bash
cd backend 
node index.js
```

Le serveur sera disponible sur : http://localhost:3000

## 🔐 Système d'authentification et de rôles

### Rôles utilisateurs
- **Member** : Utilisateur standard (rôle par défaut)
- **Admin** : Administrateur avec accès complet

### Création du premier administrateur

```bash
cd backend
node scripts/createAdmin.js
```

Cela créera un compte admin avec :
- Email : admin@semantixo.com
- Mot de passe : admin123456

⚠️ **Important** : Changez le mot de passe après la première connexion !

## 📊 API Endpoints

### Authentification (`/api/auth`)
- `POST /register` - Inscription d'un utilisateur (rôle: member par défaut)
- `POST /login` - Connexion utilisateur
- `GET /me` - Profil utilisateur connecté
- `PUT /me` - Mise à jour du profil

### Analyse SEO (`/api/analysis`)
- `POST /` - Créer une analyse SEO
- `GET /` - Liste des analyses de l'utilisateur
- `GET /:id` - Détails d'une analyse
- `DELETE /:id` - Supprimer une analyse

### Administration (`/api/admin`) - Admin seulement
- `GET /users` - Liste de tous les utilisateurs
- `GET /users/:id` - Détails d'un utilisateur
- `PUT /users/:id/role` - Modifier le rôle d'un utilisateur
- `DELETE /users/:id` - Supprimer un utilisateur
- `GET /stats` - Statistiques des utilisateurs

## 🔧 Middleware de rôles

Le système utilise des middlewares pour vérifier les permissions :

```javascript
const { requireAdmin, requireMember, requireAnyRole } = require('./middleware/roleAuth');

// Route admin seulement
router.get('/admin-only', requireAdmin, controllerFunction);

// Route member seulement
router.get('/member-only', requireMember, controllerFunction);

// Route pour admin ou member
router.get('/any-role', requireAnyRole(['admin', 'member']), controllerFunction);
```