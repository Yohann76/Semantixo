# Semantixo Project 

This project is a text SEO analysis application with a complete frontend/backend architecture including user authentication and MongoDB database.

## 🚀 Features

- **Homepage** with "Hello World" message
- **Interactive API tests** from the frontend
- **Modern and responsive interface** with navigation
- **User authentication** (registration/login)
- **Text SEO analysis** with database storage
- **Complete REST API** with JWT
- **MongoDB database** with Mongoose
- **Modular architecture** for different analysis types

## 🛠️ Architecture

### Backend - Node.js (Express + MongoDB)

#### Installation and startup

```bash
cd backend 
npm install
node index.js
```

The API will be available at: http://localhost:3000

### Frontend - Vue.js

Modern user interface with:
- **Fixed navigation** with menu and authentication
- **Homepage** with API tests
- **SEO analysis page** with analysis form
- **Integrated authentication**
- **Responsive and modern design**

#### Installation and startup

```bash
cd frontend
npm install
npm run serve
```

The application will be available at: http://localhost:8081/

## 🗄️ MongoDB Database

### Configuration
- **Local database**: `mongodb://localhost:27017/semantixo`
- **Models**: User, AnalysisTextSeo, AnalysisPageSeo, AnalysisInternalLink, AnalysisDomain
- **ODM**: Mongoose

### Data Models

#### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'member' | 'admin' (default: 'member'),
  subscription: 'free' | 'premium',
  analysesCount: Number,
  lastLogin: Date,
  timestamps
}
```

#### AnalysisTextSeo
```javascript
{
  userId: ObjectId,
  text: String,
  seoScore: Number,
  metrics: {
    wordCount: Number,
    characterCount: Number
  },
  timestamps
}
```

#### AnalysisPageSeo
```javascript
{
  userId: ObjectId,
  url: String,
  pageTitle: String,
  metaDescription: String,
  seoScore: Number,
  metrics: {
    wordCount: Number,
    characterCount: Number,
    headingCount: Number,
    imageCount: Number,
    linkCount: Number
  },
  seoElements: Object,
  timestamps
}
```

#### AnalysisInternalLink
```javascript
{
  userId: ObjectId,
  url: String,
  internalLinks: Array,
  linkStructure: Object,
  seoScore: Number,
  metrics: Object,
  timestamps
}
```

#### AnalysisDomain
```javascript
{
  userId: ObjectId,
  domain: String,
  domainAuthority: Number,
  backlinks: Array,
  seoScore: Number,
  metrics: Object,
  timestamps
}
```

## 🔐 Authentication & Authorization

- **JWT** (JSON Web Tokens) for authentication
- **Bcrypt** for password hashing
- **Role-based access control** (Member/Admin)
- **Protection middleware** for private routes
- **Complete error handling**

## 📁 Project Structure

```
Semantixo/
├── backend/
│   ├── modules/                    # Structure modulaire
│   │   ├── analysisTextSeo/
│   │   │   ├── controllers/
│   │   │   │   └── index.js       # Contrôleurs texte SEO
│   │   │   ├── models/
│   │   │   │   └── index.js       # Modèle texte SEO
│   │   │   ├── routes/
│   │   │   │   └── index.js       # Routes texte SEO
│   │   │   ├── utils/
│   │   │   │   └── index.js       # Utilitaires texte SEO
│   │   │   └── index.js           # Export module
│   │   ├── analysisPageSeo/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── index.js           # Export module
│   │   ├── analysisInternalLink/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── index.js           # Export module
│   │   ├── analysisDomain/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── utils/
│   │   │   └── index.js           # Export module
│   │   └── index.js               # Export tous modules
│   ├── config/
│   │   └── database.js            # MongoDB configuration
│   ├── controllers/
│   │   ├── adminController.js     # Admin controller
│   │   └── authController.js      # Auth controller
│   ├── middleware/
│   │   ├── auth.js                # JWT middleware
│   │   └── roleAuth.js            # Role middleware
│   ├── models/
│   │   └── User.js                # User model
│   ├── routes/
│   │   ├── admin.js               # Admin routes
│   │   ├── auth.js                # Auth routes
│   │   └── modules.js             # Routes modulaires
│   ├── scripts/
│   │   └── createDefaultUsers.js  # Script utilisateurs
│   ├── config.env                 # Environment variables
│   ├── index.js                   # Main server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.vue           # Homepage
│   │   │   ├── Navbar.vue         # Navigation
│   │   │   └── VerifyText.vue     # Analysis page
│   │   ├── router/
│   │   │   └── index.js           # Vue Router configuration
│   │   ├── App.vue                # Main component
│   │   └── main.js                # Entry point
│   └── package.json
└── README.md
```

## 🔧 Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin request handling

### Frontend
- **Vue.js 3** - JavaScript framework
- **Vue Router** - Client-side routing
- **Fetch API** - HTTP requests
- **CSS3** - Styling with gradients and animations

## 🚀 Quick Start

1. **Install MongoDB** locally or use MongoDB Atlas
2. **Configure environment variables** in `backend/config.env`
3. **Create default users**: `cd backend && node scripts/createDefaultUsers.js`
4. **Start the backend**: `cd backend && node index.js`
5. **Start the frontend**: `cd frontend && npm run serve`
6. **Access the application**: http://localhost:8081/

## 🚀 Quick Start with Docker (recommended)

1. **Install Docker Desktop**: https://www.docker.com/products/docker-desktop
2. Open a terminal in the project folder
3. Run the command:

```bash
docker-compose up -d
docker-compose up -d --build
```

- The frontend will be accessible at: http://localhost:8081
- The backend API at: http://localhost:3000
- MongoDB at: localhost:27017

To stop all services:

```bash
docker-compose down
```

## 📝 Development Notes

- Free users are limited to 10 analyses
- SEO analysis includes: word count, keyword density, readability score
- All analysis routes require authentication
- Passwords are hashed with bcrypt (salt: 12)

## 🧪 Tests

Le projet Semantixo dispose d'une suite de tests complète :

### Tests Backend (Jest + Supertest)
```bash
# Tests simples et API (fonctionnent)
make test-backend

# Tests spécifiques
cd backend && npm test -- simple.test.js
cd backend && npm test -- api.test.js
```

### Tests Frontend (Vitest)
```bash
# Tests simples (fonctionnent)
make test-frontend

# Tests spécifiques
cd frontend && npm run test -- simple.test.js
```

### Tests E2E (Playwright)
```bash
# Tests end-to-end
make test-e2e
```

### Installation des Dépendances
```bash
# Installer toutes les dépendances de test
make install-test-deps
```

### État Actuel
- ✅ **Tests Backend** : Jest + Supertest configurés et fonctionnels
- ✅ **Tests Frontend** : Vitest configuré et fonctionnel
- ✅ **Tests E2E** : Playwright configuré
- ⚠️ **Tests MongoDB** : Nécessitent configuration de base de données de test

Pour plus de détails, consultez le [Guide des Tests](TESTING.md).

## Makefile 

```
make dev-kill
make dev-build
make dev-run
```