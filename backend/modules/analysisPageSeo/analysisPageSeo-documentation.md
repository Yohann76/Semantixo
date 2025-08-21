# Module Analysis Page SEO - Documentation

## Vue d'ensemble

Le module `analysisPageSeo` est un système d'analyse SEO complet d'une page web qui évalue tous les éléments SEO on-page : balises meta, structure HTML, contenu, images, liens et optimisation technique.

## Architecture

### Backend
- **Contrôleur** : `backend/modules/analysisPageSeo/controllers/index.js`
- **Modèle** : `backend/modules/analysisPageSeo/models/index.js` 
- **Routes** : `backend/modules/analysisPageSeo/routes/index.js`
- **Analyseur** : `backend/modules/analysisPageSeo/utils/index.js`

### Frontend
- **Formulaire** : `frontend/src/components/products/page-seo/PageAnalysisForm.vue`
- **Résultats** : `frontend/src/components/products/page-seo/PageAnalysisResult.vue`
- **Page principale** : `frontend/src/components/products/page-seo/PageAnalysisPage.vue`

## API Endpoints

### Base URL
```
http://localhost:3000/api/analysis-page-seo
```

### 1. Créer une analyse de page SEO
**POST** `/`

#### Entrées requises
```json
{
  "url": "string (requis) - L'URL de la page à analyser (ex: https://example.com/page)"
}
```

#### Exemple de requête
```javascript
const response = await fetch('http://localhost:3000/api/analysis-page-seo', {
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
  "message": "Analyse de page créée avec succès",
  "data": {
    "analysis": {
      "id": "string",
      "url": "string",
      "pageTitle": "string",
      "metaDescription": "string",
      "seoScore": "number (0-100)",
      "metrics": {
        "wordCount": "number",
        "characterCount": "number",
        "headingCount": "number",
        "imageCount": "number",
        "linkCount": "number"
      },
      "seoElements": {
        "hasTitle": "boolean",
        "hasMetaDescription": "boolean",
        "hasHeadings": "boolean",
        "hasImages": "boolean",
        "hasLinks": "boolean"
      },
      "analysis": "object",
      "createdAt": "date"
    }
  }
}
```

### 2. Récupérer toutes les analyses de page
**GET** `/`

#### Paramètres optionnels
- `page` : Numéro de page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 10)

#### Sortie
```json
{
  "success": true,
  "data": {
    "analyses": [
      {
        "id": "string",
        "url": "string",
        "pageTitle": "string",
        "seoScore": "number",
        "wordCount": "number",
        "characterCount": "number",
        "headingCount": "number",
        "imageCount": "number",
        "linkCount": "number",
        "createdAt": "date"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "pages": "number"
    }
  }
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

## Système d'évaluation SEO de page

### Critères d'analyse

1. **Balise Title**
   - Présence et unicité
   - Longueur optimale (50-60 caractères)
   - Pertinence des mots-clés
   - Structure et lisibilité

2. **Meta Description**
   - Présence et unicité
   - Longueur optimale (150-160 caractères)
   - Appel à l'action
   - Pertinence du contenu

3. **Structure des titres (H1-H6)**
   - Hiérarchie correcte
   - Présence du H1 unique
   - Distribution des sous-titres
   - Optimisation des mots-clés

4. **Contenu de la page**
   - Longueur du contenu
   - Qualité et lisibilité
   - Densité des mots-clés
   - Structure des paragraphes

5. **Images**
   - Balises alt optimisées
   - Taille et compression
   - Format approprié
   - Noms de fichiers descriptifs

6. **Liens**
   - Liens internes et externes
   - Textes d'ancre optimisés
   - Répartition équilibrée
   - Liens sortants de qualité

7. **SEO technique**
   - Vitesse de chargement
   - Responsive design
   - Structure de l'URL
   - Schema markup

### Grilles de notation

| Score | Classification |
|-------|----------------|
| 80-100 | Excellent |
| 60-79 | Bon |
| 40-59 | Moyen |
| 0-39 | Faible |

## Frontend - Composants

### PageAnalysisForm.vue

#### Props attendues
Aucune prop requise

#### Événements émis
- `analysis-complete` : Émis quand l'analyse est terminée avec succès
- `error` : Émis en cas d'erreur avec le message d'erreur

#### Fonctionnalités
- Validation du format d'URL
- Vérification de la liste noire des domaines
- Interface de saisie intuitive
- Gestion des états de chargement
- Options d'analyse avancées

### PageAnalysisResult.vue

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
- Affichage du score SEO global
- Détail de chaque critère d'évaluation
- Analyse des balises meta
- Structure des titres
- Rapport sur les images et liens
- Recommandations d'amélioration
- Visualisation des métriques

### PageAnalysisPage.vue

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
  pageTitle: String (requis),
  metaDescription: String (requis),
  seoScore: Number (0-100, requis),
  metrics: {
    wordCount: Number (requis),
    characterCount: Number (requis),
    headingCount: Number (requis),
    imageCount: Number (requis),
    linkCount: Number (requis)
  },
  seoElements: {
    hasTitle: Boolean (requis),
    hasMetaDescription: Boolean (requis),
    hasHeadings: Boolean (requis),
    hasImages: Boolean (requis),
    hasLinks: Boolean (requis)
  },
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Utilisation côté Frontend

### Exemple d'intégration

```vue
<template>
  <div>
    <PageAnalysisForm 
      @analysis-complete="handleAnalysisComplete"
      @error="handleError" 
    />
    
    <PageAnalysisResult 
      v-if="analysisResult"
      :analysis="analysisResult"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import PageAnalysisForm from './PageAnalysisForm.vue'
import PageAnalysisResult from './PageAnalysisResult.vue'

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
- Parser HTML pour l'analyse de contenu
- Crawler web optimisé

### Frontend
- Vue.js 3 avec Composition API
- Gestion des stores (Pinia/Vuex)
- Composables pour l'authentification
- Interface responsive
- Composants de visualisation de données
- Graphiques et métriques interactives

### API
- Authentification requise pour toutes les routes
- Headers requis : `Authorization: Bearer <token>`
- Content-Type : `application/json`
- Gestion des erreurs HTTP standard
- Timeout configuré pour les analyses

## Sécurité

- Toutes les routes sont protégées par authentification
- Validation des données côté serveur
- Vérification contre liste noire des domaines
- Protection contre les attaques XSS lors du parsing HTML
- Limitation des ressources d'analyse
- Respect des robots.txt et politiques des sites

## Performance

- Index MongoDB sur userId et createdAt
- Pagination sur les listes d'analyses
- Cache des résultats récents
- Optimisation du parsing HTML
- Compression des données stockées
- Requêtes optimisées avec projection

## Exemples d'utilisation

### Cas d'usage typique

1. L'utilisateur saisit l'URL d'une page web
2. Le frontend envoie une requête POST à `/api/analysis-page-seo`
3. Le backend crawle et parse la page HTML
4. Analyse de tous les éléments SEO on-page
5. Calcul du score SEO global sur 100
6. Génération de recommandations personnalisées
7. Les résultats détaillés sont retournés
8. Le frontend affiche l'analyse complète

### Cas d'usage avancé

1. Audit SEO complet d'un site web
2. Comparaison avant/après optimisation
3. Monitoring continu des performances SEO
4. Analyse de la concurrence
5. Optimisation technique et de contenu

### Intégration dans une application

Le module peut être intégré dans n'importe quelle plateforme d'audit SEO. Il suffit de :

1. Inclure les routes dans votre serveur Express
2. Connecter à votre base MongoDB
3. Utiliser les composants Vue.js fournis
4. Configurer les critères d'analyse selon vos besoins
5. Personnaliser l'interface utilisateur
6. Adapter les recommandations selon votre expertise

## Maintenance

- Mise à jour des critères SEO selon les dernières recommandations Google
- Optimisation des algorithmes d'analyse
- Surveillance des performances d'analyse
- Logs détaillés pour le debugging
- Tests unitaires et d'intégration
- Monitoring des timeouts et erreurs réseau
- Mise à jour des parsers HTML selon l'évolution du web
