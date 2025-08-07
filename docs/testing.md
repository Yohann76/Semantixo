# 🧪 Testing - Semantixo

## 📋 Types de Tests

### 1. Tests Backend (Jest + Supertest)
- **Localisation** : `backend/tests/`
- **Framework** : Jest + Supertest
- **Base de données** : MongoDB de test

### 2. Tests Frontend (Vitest + Vue Test Utils)
- **Localisation** : `frontend/tests/`
- **Framework** : Vitest + @vue/test-utils
- **Environnement** : jsdom

### 3. Tests E2E (Playwright)
- **Localisation** : `e2e/tests/`
- **Framework** : Playwright
- **Navigateurs** : Chrome, Firefox, Safari

## 🚀 Commandes Rapides

```bash
# Installer toutes les dépendances de test
make install-test-deps

# Exécuter tous les tests
make test-all

# Tests backend uniquement
make test-backend

# Tests frontend uniquement
make test-frontend

# Tests E2E uniquement
make test-e2e

# Tests avec couverture
make test-coverage

# Tests en mode watch
make test-watch
```


## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.test` pour les tests :

```env
# Backend
MONGODB_TEST_URI=mongodb://localhost:27017/semantixo-test
JWT_SECRET=test-secret

# Frontend
VITE_API_URL=http://localhost:3000

# E2E
BASE_URL=http://localhost:8080
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123
```

### Base de Données de Test

```bash
# Démarrer MongoDB de test
docker run -d -p 27017:27017 --name mongodb-test mongo:latest

# Ou utiliser MongoDB local
mongod --dbpath ./test-data
```

## 📊 Couverture de Code

### Backend
```bash
cd backend
npm run test:coverage
# Résultats dans : coverage/lcov-report/index.html
```

### Frontend
```bash
cd frontend
npm run test:coverage
# Résultats dans : coverage/index.html
```

## 🐛 Debug des Tests

### Backend
```bash
# Mode debug
cd backend && npm run test:watch

# Test spécifique
npm test -- --testNamePattern="Auth Routes"
```

### Frontend
```bash
# Interface UI
cd frontend && npm run test:ui

# Mode debug
npm run test:run -- --reporter=verbose
```

### E2E
```bash
# Mode headed (voir le navigateur)
cd e2e && npm run test:headed

# Mode debug
npm run test:debug

# Interface UI
npm run test:ui
```

## 📋 Bonnes Pratiques

### 1. Structure des Tests
```
tests/
├── unit/           # Tests unitaires
├── integration/    # Tests d'intégration
├── e2e/           # Tests end-to-end
└── fixtures/      # Données de test
```

### 2. Nommage
- **Backend** : `*.test.js`
- **Frontend** : `*.test.js`
- **E2E** : `*.spec.js`

### 3. Organisation
- Un fichier de test par module/component
- Tests isolés et indépendants
- Nettoyage des données après chaque test

### 4. Assertions
- Utiliser des assertions descriptives
- Tester les cas d'erreur
- Vérifier les effets de bord

## 🔄 CI/CD (TODO)

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: make install-test-deps
      - name: Run tests
        run: make test-all
```

## 📚 Ressources

- [Jest Documentation](https://jestjs.io/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://testing-library.com/docs/guiding-principles)

