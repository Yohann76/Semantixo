# Module Analysis Text SEO - Documentation

## Vue d'ensemble

Le module `analysisTextSEO` est un système complet d'analyse SEO de texte qui évalue la qualité et l'optimisation SEO d'un contenu textuel selon plusieurs critères pondérés.

## Architecture

### Backend
- **Contrôleur** : `backend/modules/analysisTextSeo/controllers/index.js`
- **Modèle** : `backend/modules/analysisTextSeo/models/index.js` 
- **Routes** : `backend/modules/analysisTextSeo/routes/index.js`
- **Système de barème** : `backend/modules/analysisTextSeo/bareme/`

### Frontend
- **Formulaire** : `frontend/src/components/products/text-seo/TextAnalysisForm.vue`
- **Résultats** : `frontend/src/components/products/text-seo/TextAnalysisResult.vue`
- **Page principale** : `frontend/src/components/products/text-seo/TextAnalysisPage.vue`

## API Endpoints

### Base URL
```
http://localhost:3000/api/analysis-text-seo
```

### 1. Créer une analyse SEO
**POST** `/`

#### Entrées requises
```json
{
  "text": "string (requis) - Le texte à analyser (max 50,000 caractères)",
  "keywords": ["array de strings (optionnel) - Liste des mots-clés ciblés (max 5)"]
}
```

#### Exemple de requête
```javascript
const response = await fetch('http://localhost:3000/api/analysis-text-seo', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: "Votre contenu SEO à analyser ici...",
    keywords: ["SEO", "marketing digital", "référencement"]
  })
})
```

#### Sortie
```json
{
  "success": true,
  "message": "Analyse SEO créée avec succès",
  "data": {
    "id": "string",
    "text": "string",
    "seoScore": "number (0-100)",
    "grade": "string (Excellent|Très bon|Bon|Moyen|Insuffisant)",
    "topic": "string",
    "keywords": ["array de strings"],
    "keywordAnalysis": {
      "keyword": ["array"],
      "moyenne_traine": ["array"], 
      "longue_traine": ["array"]
    },
    "metrics": {
      "wordCount": "number",
      "characterCount": "number",
      "paragraphCount": "number",
      "averageWordLength": "number"
    },
    "baremeResults": {
      "totalScore": "number",
      "maxScore": "number", 
      "grade": "string",
      "criteria": "object",
      "recommendations": "array",
      "metrics": "object",
      "scoringVersion": "string",
      "timestamp": "date"
    },
    "timestamp": "date"
  }
}
```

### 2. Récupérer toutes les analyses
**GET** `/`

#### Sortie
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "text": "string",
      "seoScore": "number (0-100)",
      "grade": "string (Excellent|Très bon|Bon|Moyen|Insuffisant)",
      "topic": "string",
      "keywords": ["array"],
      "keywordAnalysis": "object",
      "metrics": "object",
      "baremeResults": "object",
      "timestamp": "date"
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
    "scoreDistribution": "object",
    "gradeDistribution": "object",
    "topKeywords": "array",
    "recentActivity": "array"
  }
}
```

### 6. Configuration du barème
**GET** `/bareme/config`

#### Sortie
```json
{
  "success": true,
  "data": {
    "configuration": {
      "version": "2.3.0",
      "totalPoints": 100,
      "criteria": "object",
      "grading": "object",
      "thresholds": "object"
    },
    "validation": "object"
  }
}
```

## Système de Barème SEO

### Critères d'évaluation (Total : 100 points)

1. **Utilisation des mots-clés** (60 points)
   - Analyse de la fréquence et densité des mots-clés
   - Évaluation du champ sémantique
   - Détection automatique de la thématique

2. **Position des mots-clés** (10 points)
   - Présence dans le titre, premier/dernier paragraphe
   - Présence dans les balises H1, H2
   - Positions stratégiques

3. **Longueur du contenu** (10 points)
   - Évaluation par rapport à la plage optimale (600-1200 mots)
   - Recommandations d'ajustement

4. **Lisibilité** (10 points)
   - Longueur moyenne des phrases
   - Variété du vocabulaire
   - Structure des paragraphes
   - Score de ponctuation

5. **Originalité** (10 points)
   - Détection de contenu dupliqué
   - Évaluation de l'unicité
   - Identification des phrases communes

### Grilles de notation

| Grade | Score minimum | Libellé |
|-------|---------------|---------|
| Excellent | 60+ | Excellent |
| Très bon | 49-59 | Très bon |
| Bon | 39-48 | Bon |
| Moyen | 28-38 | Moyen |
| Insuffisant | 0-27 | Insuffisant |

## Frontend - Composants

### TextAnalysisForm.vue

#### Props attendues
Aucune prop requise

#### Événements émis
- `analysis-complete` : Émis quand l'analyse est terminée avec succès
- `error` : Émis en cas d'erreur avec le message d'erreur

#### Fonctionnalités
- Gestion des mots-clés (max 5)
- Validation du texte (minimum recommandé : 600 mots)
- Interface de saisie intuitive
- Gestion des états de chargement

### TextAnalysisResult.vue

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
- Affichage du score global et de la notation
- Détail des critères d'évaluation
- Recommandations d'amélioration
- Statistiques détaillées
- Analyse des mots-clés
- Visualisation des métriques

### TextAnalysisPage.vue

#### Fonctionnalités
- Orchestration du formulaire et des résultats
- Gestion des états (formulaire, résultats, erreurs)
- Navigation et historique des analyses

## Modèle de données

### Schema MongoDB

```javascript
{
  userId: ObjectId (requis),
  text: String (requis, max 50000),
  seoScore: Number (0-100),
  metrics: {
    wordCount: Number,
    characterCount: Number,
    paragraphCount: Number,
    averageWordLength: Number
  },
  keywords: [String],
  topic: String,
  keywordAnalysis: {
    keyword: [String],
    moyenne_traine: [String],
    longue_traine: [String]
  },
  baremeResults: {
    totalScore: Number,
    maxScore: Number,
    grade: String,
    criteria: Map,
    recommendations: [Object],
    metrics: Object,
    scoringVersion: String,
    timestamp: Date
  },
  timestamp: Date
}
```

## Utilisation côté Frontend

### Exemple d'intégration

```vue
<template>
  <div>
    <TextAnalysisForm 
      @analysis-complete="handleAnalysisComplete"
      @error="handleError" 
    />
    
    <TextAnalysisResult 
      v-if="analysisResult"
      :analysis="analysisResult"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TextAnalysisForm from './TextAnalysisForm.vue'
import TextAnalysisResult from './TextAnalysisResult.vue'

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

### Frontend
- Vue.js 3 avec Composition API
- Gestion des stores (Pinia/Vuex)
- Composables pour l'authentification
- Interface responsive

### API
- Authentification requise pour toutes les routes
- Headers requis : `Authorization: Bearer <token>`
- Content-Type : `application/json`
- Gestion des erreurs HTTP standard

## Sécurité

- Toutes les routes sont protégées par authentification
- Validation des données côté serveur
- Limitation de la taille du texte (50,000 caractères)
- Limitation du nombre de mots-clés (5 maximum)
- Protection contre les injections

## Performance

- Index MongoDB sur userId et createdAt
- Pagination implicite sur les listes
- Cache possible sur la configuration du barème
- Optimisation des requêtes avec projection

## Exemples d'utilisation

### Cas d'usage typique

1. L'utilisateur saisit du texte et des mots-clés
2. Le frontend envoie une requête POST à `/api/analysis-text-seo`
3. Le backend analyse le texte selon les 5 critères
4. Un score sur 100 et une notation sont calculés
5. Les résultats détaillés sont retournés
6. Le frontend affiche les résultats avec recommandations

### Intégration dans une application

Le module peut être intégré dans n'importe quelle application nécessitant une analyse SEO de contenu textuel. Il suffit de :

1. Inclure les routes dans votre serveur Express
2. Connecter à votre base MongoDB
3. Utiliser les composants Vue.js fournis
4. Adapter le styling selon vos besoins

## Maintenance

- Version actuelle du barème : 2.3.0
- Configuration modifiable via `ScoringConfig.js`
- Logs détaillés pour le debugging
- Tests unitaires et d'intégration disponibles
