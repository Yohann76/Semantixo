# Module Analysis Internal Link - Documentation

## Vue d'ensemble

Le module `analysisInternalLink` est un système d'analyse du maillage interne qui évalue la structure et la qualité des liens internes d'une page web. Il analyse la distribution des liens, détecte les liens brisés et fournit des recommandations pour optimiser le maillage interne SEO.

## Architecture

### Backend
- **Contrôleur** : `backend/modules/analysisInternalLink/controllers/index.js`
- **Modèle** : `backend/modules/analysisInternalLink/models/index.js` 
- **Routes** : `backend/modules/analysisInternalLink/routes/index.js`
- **Analyseur** : `backend/modules/analysisInternalLink/utils/index.js`

### Frontend
- **Formulaire** : `frontend/src/components/products/internal-link/InternalLinkAnalysisForm.vue`
- **Résultats** : `frontend/src/components/products/internal-link/InternalLinkAnalysisResult.vue`
- **Page principale** : `frontend/src/components/products/internal-link/InternalLinkAnalysisPage.vue`

## API Endpoints

### Base URL
```
http://localhost:3000/api/analysis-internal-link
```

### 1. Créer une analyse de maillage interne
**POST** `/`

#### Entrées requises
```json
{
  "url": "string (requis) - L'URL de la page à analyser (ex: https://example.com/page)"
}
```

#### Exemple de requête
```javascript
const response = await fetch('http://localhost:3000/api/analysis-internal-link', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: "https://monsite.com/page-exemple"
  })
})
```

#### Sortie
```json
{
  "success": true,
  "message": "Analyse de maillage interne créée avec succès",
  "data": {
    "id": "string",
    "url": "string",
    "seoScore": "number (0-100)",
    "metrics": {
      "totalInternalLinks": "number",
      "totalExternalLinks": "number",
      "brokenLinks": "number",
      "uniqueInternalPages": "number",
      "averageInternalLinksPerPage": "number"
    },
    "internalLinkElements": {
      "hasInternalLinks": "boolean",
      "hasBrokenLinks": "boolean",
      "hasOptimalDistribution": "boolean",
      "hasDescriptiveAnchorText": "boolean"
    },
    "internalPages": [
      {
        "url": "string",
        "title": "string",
        "internalLinksCount": "number",
        "externalLinksCount": "number"
      }
    ],
    "brokenLinks": [
      {
        "url": "string",
        "anchorText": "string",
        "statusCode": "number"
      }
    ],
    "analysis": "object",
    "createdAt": "date",
    "type": "internal-link"
  }
}
```

### 2. Récupérer toutes les analyses de maillage interne
**GET** `/`

#### Paramètres optionnels
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)

#### Sortie
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "url": "string",
      "seoScore": "number",
      "metrics": "object",
      "internalPages": "array",
      "brokenLinks": "array",
      "internalLinkElements": "object",
      "analysis": "object",
      "createdAt": "date",
      "type": "internal-link"
    }
  ]
}
```

### 3. Récupérer une analyse spécifique
**GET** `/:id`

#### Paramètres
- `id` : ID de l'analyse

### 4. Supprimer une analyse
**DELETE** `/:id`

#### Paramètres
- `id` : ID de l'analyse

### 5. Obtenir les statistiques
**GET** `/stats`

#### Sortie
```json
{
  "success": true,
  "data": {
    "totalAnalyses": "number",
    "averageScore": "number",
    "scoreDistribution": [
      {
        "_id": "Excellent|Bon|Moyen|Faible",
        "count": "number"
      }
    ]
  }
}
```

## Système d'évaluation du maillage interne

### Critères d'analyse

1. **Nombre de liens internes**
   - Quantité optimale de liens internes par page
   - Distribution équilibrée des liens

2. **Qualité des liens internes**
   - Pertinence des liens par rapport au contenu
   - Diversité des pages liées

3. **Textes d'ancre**
   - Descriptivité des textes d'ancre
   - Variété et optimisation SEO

4. **Architecture du site**
   - Profondeur de navigation
   - Accessibilité des pages importantes

5. **Liens brisés**
   - Détection des erreurs 404, 405, 500
   - Impact sur l'expérience utilisateur

6. **Distribution des liens**
   - Équilibrage du PageRank interne
   - Identification des pages orphelines

### Configuration d'analyse

```javascript
{
  checkBrokenLinks: true,
  maxBrokenLinkChecks: 30, // Limite pour la performance
  skip405Checks: false // Vérifier les erreurs 405
}
```

### Grilles de notation

| Score | Classification |
|-------|----------------|
| 80-100 | Excellent |
| 60-79 | Bon |
| 40-59 | Moyen |
| 0-39 | Faible |

## Frontend - Composants

### InternalLinkAnalysisForm.vue

#### Props attendues
Aucune prop requise

#### Événements émis
- `analysis-complete` : Émis quand l'analyse est terminée avec succès
- `error` : Émis en cas d'erreur avec le message d'erreur

#### Fonctionnalités
- Validation du format d'URL
- Vérification de la liste noire des domaines
- Interface de saisie avec validation
- Gestion des états de chargement
- Configuration des options d'analyse

### InternalLinkAnalysisResult.vue

#### Props requises
```javascript
props: {
  analysis: {
    type: Object,
    required: true
  }
}
```

#### Fonctionnalités
- Affichage du score global de maillage
- Détail des métriques d'analyse
- Liste des pages internes trouvées
- Rapport des liens brisés
- Recommandations d'optimisation
- Visualisation de l'architecture de liens

### InternalLinkAnalysisPage.vue

#### Fonctionnalités
- Orchestration du formulaire et des résultats
- Gestion des états (formulaire, résultats, erreurs)
- Navigation et historique des analyses

## Modèle de données

### Schema MongoDB

```javascript
{
  userId: ObjectId (requis),
  url: String (requis),
  internalLinkScore: Number (0-100),
  metrics: {
    totalInternalLinks: Number (requis),
    totalExternalLinks: Number (requis),
    brokenLinks: Number (requis),
    uniqueInternalPages: Number (requis),
    averageInternalLinksPerPage: Number (requis)
  },
  internalLinkElements: {
    hasInternalLinks: Boolean (requis),
    hasBrokenLinks: Boolean (requis),
    hasOptimalDistribution: Boolean (requis),
    hasDescriptiveAnchorText: Boolean (requis)
  },
  internalPages: [{
    url: String,
    title: String,
    internalLinksCount: Number,
    externalLinksCount: Number
  }],
  brokenLinks: [{
    url: String,
    anchorText: String,
    statusCode: Number
  }],
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Utilisation côté Frontend

### Exemple d'intégration

```vue
<template>
  <div>
    <InternalLinkAnalysisForm 
      @analysis-complete="handleAnalysisComplete"
      @error="handleError" 
    />
    
    <InternalLinkAnalysisResult 
      v-if="analysisResult"
      :analysis="analysisResult"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import InternalLinkAnalysisForm from './InternalLinkAnalysisForm.vue'
import InternalLinkAnalysisResult from './InternalLinkAnalysisResult.vue'

const analysisResult = ref(null)

const handleAnalysisComplete = (result) => {
  analysisResult.value = result
}

const handleError = (error) => {
  console.error('Erreur d\'analyse:', error)
  // Gestion de l'erreur
}
</script>
```

## Besoins techniques

### Backend
- Node.js avec Express
- MongoDB avec Mongoose
- Système d'authentification JWT
- Middleware de protection des routes
- Validation des domaines contre liste noire
- Crawler web pour l'analyse des liens

### Frontend
- Vue.js 3 avec Composition API
- Gestion des stores (Pinia/Vuex)
- Composables pour l'authentification
- Interface responsive
- Composants de visualisation de données

### API
- Authentification requise pour toutes les routes
- Headers requis : `Authorization: Bearer <token>`
- Content-Type : `application/json`
- Gestion des erreurs HTTP standard
- Timeout configuré pour les analyses longues

## Sécurité

- Toutes les routes sont protégées par authentification
- Validation des données côté serveur
- Vérification contre liste noire des domaines
- Protection contre les attaques par déni de service
- Limitation du nombre de liens vérifiés (30 max)
- Respect des robots.txt et des politiques des sites

## Performance

- Index MongoDB sur userId et createdAt
- Pagination sur les listes d'analyses
- Limitation des vérifications de liens pour optimiser la vitesse
- Cache possible sur les résultats récents
- Optimisation des requêtes HTTP parallèles

## Exemples d'utilisation

### Cas d'usage typique

1. L'utilisateur saisit l'URL d'une page web
2. Le frontend envoie une requête POST à `/api/analysis-internal-link`
3. Le backend crawle la page et analyse les liens internes
4. Vérification des liens brisés (limité à 30 vérifications)
5. Calcul du score de maillage interne sur 100
6. Les résultats détaillés sont retournés
7. Le frontend affiche l'analyse avec recommandations

### Cas d'usage avancé

1. Analyse de l'architecture complète d'un site
2. Détection des pages orphelines
3. Optimisation de la distribution du PageRank
4. Audit des textes d'ancre
5. Planification de la stratégie de maillage interne

### Intégration dans une application

Le module peut être intégré dans n'importe quelle application d'audit SEO. Il suffit de :

1. Inclure les routes dans votre serveur Express
2. Connecter à votre base MongoDB
3. Utiliser les composants Vue.js fournis
4. Configurer les limites d'analyse selon vos besoins
5. Adapter le styling selon vos besoins

## Maintenance

- Surveillance des performances d'analyse
- Mise à jour des critères d'évaluation
- Optimisation des algorithmes de crawling
- Logs détaillés pour le debugging
- Tests unitaires et d'intégration disponibles
- Monitoring des timeouts et erreurs réseau
