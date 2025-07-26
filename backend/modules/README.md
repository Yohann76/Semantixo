# Structure Modulaire - API Semantixo

Cette nouvelle structure modulaire organise chaque type d'analyse dans son propre module avec une séparation claire des responsabilités.

## 📁 Structure des Modules

```
modules/
├── analysisTextSeo/
│   ├── controllers/
│   │   └── index.js          # Contrôleurs pour l'analyse de texte SEO
│   ├── models/
│   │   └── index.js          # Modèle Mongoose pour l'analyse de texte SEO
│   ├── routes/
│   │   └── index.js          # Routes Express pour l'analyse de texte SEO
│   ├── utils/
│   │   └── index.js          # Utilitaires d'analyse de texte SEO
│   └── index.js              # Export principal du module
├── analysisPageSeo/
│   ├── controllers/
│   │   └── index.js          # Contrôleurs pour l'analyse de page SEO
│   ├── models/
│   │   └── index.js          # Modèle Mongoose pour l'analyse de page SEO
│   ├── routes/
│   │   └── index.js          # Routes Express pour l'analyse de page SEO
│   ├── utils/
│   │   └── index.js          # Utilitaires d'analyse de page SEO
│   └── index.js              # Export principal du module
├── analysisInternalLink/
│   ├── controllers/
│   │   └── index.js          # Contrôleurs pour l'analyse de liens internes
│   ├── models/
│   │   └── index.js          # Modèle Mongoose pour l'analyse de liens internes
│   ├── routes/
│   │   └── index.js          # Routes Express pour l'analyse de liens internes
│   ├── utils/
│   │   └── index.js          # Utilitaires d'analyse de liens internes
│   └── index.js              # Export principal du module
├── analysisDomain/
│   ├── controllers/
│   │   └── index.js          # Contrôleurs pour l'analyse de domaine
│   ├── models/
│   │   └── index.js          # Modèle Mongoose pour l'analyse de domaine
│   ├── routes/
│   │   └── index.js          # Routes Express pour l'analyse de domaine
│   ├── utils/
│   │   └── index.js          # Utilitaires d'analyse de domaine
│   └── index.js              # Export principal du module
└── index.js                  # Export principal de tous les modules
```

## 🚀 Avantages de cette Structure

### 1. **Séparation des Responsabilités**
- Chaque module est autonome et contient sa propre logique
- Les contrôleurs, modèles, routes et utilitaires sont organisés par fonctionnalité

### 2. **Maintenabilité**
- Facile d'ajouter de nouveaux types d'analyse
- Modification d'un module n'affecte pas les autres
- Code plus lisible et organisé

### 3. **Réutilisabilité**
- Les utilitaires peuvent être partagés entre modules
- Structure cohérente pour tous les modules

### 4. **Scalabilité**
- Ajout facile de nouveaux modules
- Tests unitaires par module
- Déploiement modulaire possible

## 📋 Modules Disponibles

### 1. **analysisTextSeo**
- **Fonctionnalité** : Analyse SEO de textes
- **Routes** : `/api/analysis-text-seo`
- **Fonctionnalités** :
  - Analyse de la longueur du texte
  - Calcul de la densité de mots
  - Évaluation de la lisibilité
  - Recommandations SEO

### 2. **analysisPageSeo**
- **Fonctionnalité** : Analyse SEO de pages web
- **Routes** : `/api/analysis-page-seo`
- **Fonctionnalités** :
  - Analyse des balises meta
  - Évaluation de la structure HTML
  - Analyse des images et liens
  - Score SEO global

### 3. **analysisInternalLink**
- **Fonctionnalité** : Analyse des liens internes
- **Routes** : `/api/analysis-internal-link`
- **Fonctionnalités** :
  - Cartographie des liens internes
  - Analyse de la structure de navigation
  - Détection des liens cassés
  - Optimisation de la navigation

### 4. **analysisDomain**
- **Fonctionnalité** : Analyse de domaines
- **Routes** : `/api/analysis-domain`
- **Fonctionnalités** :
  - Analyse de la réputation du domaine
  - Évaluation de l'autorité
  - Analyse des backlinks
  - Score de confiance

## 🔧 Utilisation

### Import d'un Module
```javascript
const modules = require('./modules');
const analysisTextSeo = modules.analysisTextSeo;
```

### Utilisation des Contrôleurs
```javascript
const { createAnalysisTextSeo } = modules.analysisTextSeo.controllers;
```

### Utilisation des Modèles
```javascript
const AnalysisTextSeo = modules.analysisTextSeo.models;
```

### Utilisation des Utilitaires
```javascript
const AnalyzerTextSeo = modules.analysisTextSeo.utils;
```

## 📝 Ajout d'un Nouveau Module

1. **Créer la structure de dossiers**
```bash
mkdir -p modules/nouveauModule/{controllers,models,routes,utils}
```

2. **Créer les fichiers d'index**
```javascript
// modules/nouveauModule/index.js
const controllers = require('./controllers');
const models = require('./models');
const routes = require('./routes');
const utils = require('./utils');

module.exports = {
  controllers,
  models,
  routes,
  utils
};
```

3. **Ajouter le module au fichier principal**
```javascript
// modules/index.js
const nouveauModule = require('./nouveauModule');

module.exports = {
  // ... autres modules
  nouveauModule
};
```

4. **Ajouter les routes**
```javascript
// routes/modules.js
router.use('/nouveau-module', modules.nouveauModule.routes);
```

## 🧪 Tests

Chaque module peut être testé indépendamment :

```javascript
// Test d'un contrôleur
const { createAnalysisTextSeo } = require('./modules/analysisTextSeo/controllers');

// Test d'un utilitaire
const AnalyzerTextSeo = require('./modules/analysisTextSeo/utils');
```

## 🔄 Migration

La migration depuis l'ancienne structure a été automatisée avec le script `scripts/migrateToModules.js`.

## 📊 Monitoring

Chaque module peut être monitoré indépendamment grâce aux logs spécifiques :

- `[ANALYSIS]` - Logs généraux d'analyse
- `[PAGE SEO]` - Logs spécifiques à l'analyse de page
- `[INTERNAL LINK]` - Logs spécifiques aux liens internes
- `[DOMAIN]` - Logs spécifiques à l'analyse de domaine 