# 🧪 Tests E2E - Semantixo

Ce dossier contient les tests end-to-end (E2E) pour l'application Semantixo utilisant Playwright.

## 📁 Structure

```
e2e/
├── tests/
│   ├── auth.spec.js          # Tests d'authentification
│   ├── seo-analysis.spec.js  # Tests des fonctionnalités SEO
│   └── navigation.spec.js    # Tests de navigation et UI
├── playwright.config.js       # Configuration Playwright
├── package.json              # Dépendances
└── README.md                 # Ce fichier
```

## 🚀 Commandes

```bash
# Installer les dépendances
npm install

# Installer les navigateurs
npx playwright install

# Lancer tous les tests
npm test

# Lancer les tests en mode headed (voir le navigateur)
npm run test:headed

# Lancer les tests en mode debug
npm run test:debug

# Lancer l'interface UI
npm run test:ui

# Lancer un test spécifique
npx playwright test auth.spec.js
```

## 🎯 Types de Tests

### 1. Tests d'Authentification (`auth.spec.js`)
- Connexion utilisateur
- Inscription utilisateur
- Validation des formulaires
- Gestion des erreurs

### 2. Tests d'Analyse SEO (`seo-analysis.spec.js`)
- Analyse de texte SEO
- Analyse de page web
- Analyse de domaine
- Analyse des liens internes

### 3. Tests de Navigation (`navigation.spec.js`)
- Navigation entre les pages
- Interface responsive
- Menu utilisateur
- Déconnexion

## 🔧 Configuration

### Navigateurs Supportés
- **Chromium** : Chrome/Edge
- **Firefox** : Mozilla Firefox
- **WebKit** : Safari

### Environnements
- **Développement** : `http://localhost:8080`
- **Test** : Configurable via variables d'environnement

## 📊 Rapports

Les rapports de test sont générés automatiquement :
- **HTML** : `playwright-report/index.html`
- **Screenshots** : `test-results/` (en cas d'échec)
- **Vidéos** : `test-results/` (en cas d'échec)

## 🐛 Dépannage

### Problèmes Courants

1. **Tests qui échouent aléatoirement**
   ```bash
   # Augmenter les timeouts
   npx playwright test --timeout=30000
   ```

2. **Problèmes de navigation**
   ```bash
   # Mode debug pour voir ce qui se passe
   npx playwright test --debug
   ```

3. **Problèmes de responsive**
   ```bash
   # Tester sur différentes tailles d'écran
   npx playwright test --project=chromium
   ```

### Variables d'Environnement

Créez un fichier `.env` :
```env
# URL de l'application
BASE_URL=http://localhost:8080

# Credentials de test
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=password123

# Timeouts
TIMEOUT=30000
```

## 📋 Bonnes Pratiques

### 1. Sélecteurs Robustes
```javascript
// ✅ Bon - Utiliser des sélecteurs accessibles
await page.getByRole('button', { name: /analyser/i }).click()

// ❌ Éviter - Sélecteurs fragiles
await page.click('.btn-analyze')
```

### 2. Assertions Claires
```javascript
// ✅ Bon - Assertions descriptives
await expect(page.getByText(/résultats de l'analyse/i)).toBeVisible()

// ❌ Éviter - Assertions vagues
await expect(page.locator('.results')).toBeVisible()
```

### 3. Gestion des Timeouts
```javascript
// ✅ Bon - Attendre les éléments
await expect(page.getByText(/analyse en cours/i)).toBeVisible()

// ❌ Éviter - Délais fixes
await page.waitForTimeout(2000)
```

## 🔄 CI/CD

### GitHub Actions
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd e2e && npm install
      - run: cd e2e && npx playwright install
      - run: cd e2e && npm test
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: e2e/playwright-report/
```

## 📚 Ressources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging](https://playwright.dev/docs/debug)
- [CI/CD](https://playwright.dev/docs/ci) 