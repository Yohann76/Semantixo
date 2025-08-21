# Module Analysis Domain - Documentation

## Vue d'ensemble

Le module `analysisDomain` est un système d'analyse SEO de noms de domaine qui évalue la qualité et l'optimisation d'un nom de domaine selon plusieurs critères : longueur, extension, présence de mots-clés, mémorabilité et disponibilité.

## Architecture

### Backend
- **Contrôleur** : `backend/modules/analysisDomain/controllers/index.js`
- **Modèle** : `backend/modules/analysisDomain/models/index.js` 
- **Routes** : `backend/modules/analysisDomain/routes/index.js`
- **Analyseur** : `backend/modules/analysisDomain/utils/index.js`

### Frontend
- **Formulaire** : `frontend/src/components/products/domain/DomainAnalysisForm.vue`
- **Résultats** : `frontend/src/components/products/domain/DomainAnalysisResult.vue`
- **Page principale** : `frontend/src/components/products/domain/DomainAnalysisPage.vue`

## API Endpoints

### Base URL
```
http://localhost:3000/api/analysis-domain
```

### 1. Créer une analyse de domaine
**POST** `/`

#### Entrées requises
```json
{
  "domain": "string (requis) - Le nom de domaine à analyser (ex: example.com)"
}
```

#### Exemple de requête
```javascript
const response = await fetch('http://localhost:3000/api/analysis-domain', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    domain: "monsite.com"
  })
})
```

#### Sortie
```json
{
  "success": true,
  "message": "Analyse de nom de domaine créée avec succès",
  "data": {
    "id": "string",
    "domain": "string",
    "seoScore": "number (0-100)",
    "metrics": {
      "domainAge": "number",
      "domainAuthority": "number",
      "domainLength": "number",
      "domainExtension": "string",
      "domainKeywords": "number",
      "domainReadability": "number"
    },
    "domainElements": {
      "hasGoodLength": "boolean",
      "hasGoodExtension": "boolean", 
      "hasKeywords": "boolean",
      "isMemorable": "boolean",
      "isBrandable": "boolean",
      "isAvailable": "boolean"
    },
    "analysis": {
      "domainQuality": "string",
      "domainStrength": "string", 
      "domainWeakness": "string",
      "recommendations": ["array de strings"]
    },
    "createdAt": "date",
    "type": "domain"
  }
}
```

### 2. Récupérer toutes les analyses de domaine
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
      "domain": "string",
      "seoScore": "number",
      "metrics": "object",
      "domainElements": "object",
      "analysis": "object",
      "createdAt": "date",
      "type": "domain"
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

## Système d'évaluation des domaines

### Critères d'analyse

1. **Longueur du domaine**
   - Longueur optimale : 6-14 caractères
   - Pénalité pour domaines trop courts ou trop longs

2. **Extension du domaine**
   - Extensions privilégiées : .com, .org, .net
   - Extensions géographiques selon le contexte

3. **Présence de mots-clés**
   - Détection de mots-clés pertinents dans le domaine
   - Analyse de la pertinence sémantique

4. **Mémorabilité**
   - Facilité de mémorisation
   - Absence de caractères complexes (traits d'union, chiffres)

5. **Potentiel de marque**
   - Capacité à devenir une marque
   - Unicité et originalité

6. **Disponibilité**
   - Vérification de la disponibilité du domaine
   - Statut d'enregistrement

### Grilles de notation

| Score | Classification |
|-------|----------------|
| 80-100 | Excellent |
| 60-79 | Bon |
| 40-59 | Moyen |
| 0-39 | Faible |

## Frontend - Composants

### DomainAnalysisForm.vue

#### Props attendues
Aucune prop requise

#### Événements émis
- `analysis-complete` : Émis quand l'analyse est terminée avec succès
- `error` : Émis en cas d'erreur avec le message d'erreur

#### Fonctionnalités
- Validation du format de domaine
- Vérification de la liste noire des domaines
- Interface de saisie simple
- Gestion des états de chargement

### DomainAnalysisResult.vue

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
- Affichage du score global de domaine
- Détail des métriques d'évaluation
- Visualisation des éléments de qualité
- Recommandations d'amélioration
- Analyse des forces et faiblesses

### DomainAnalysisPage.vue

#### Fonctionnalités
- Orchestration du formulaire et des résultats
- Gestion des états (formulaire, résultats, erreurs)
- Navigation et historique des analyses

## Modèle de données

### Schema MongoDB

```javascript
{
  userId: ObjectId (requis),
  domain: String (requis),
  domainScore: Number (0-100),
  metrics: {
    domainAge: Number,
    domainAuthority: Number,
    domainLength: Number,
    domainExtension: String,
    domainKeywords: Number,
    domainReadability: Number
  },
  domainElements: {
    hasGoodLength: Boolean,
    hasGoodExtension: Boolean,
    hasKeywords: Boolean,
    isMemorable: Boolean,
    isBrandable: Boolean,
    isAvailable: Boolean
  },
  analysis: {
    domainQuality: String,
    domainStrength: String,
    domainWeakness: String,
    recommendations: [String]
  },
  createdAt: Date (auto)
}
```

## Utilisation côté Frontend

### Exemple d'intégration

```vue
<template>
  <div>
    <DomainAnalysisForm 
      @analysis-complete="handleAnalysisComplete"
      @error="handleError" 
    />
    
    <DomainAnalysisResult 
      v-if="analysisResult"
      :analysis="analysisResult"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DomainAnalysisForm from './DomainAnalysisForm.vue'
import DomainAnalysisResult from './DomainAnalysisResult.vue'

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
- Vérification contre liste noire des domaines
- Protection contre les domaines malveillants
- Limitation des analyses par utilisateur

## Performance

- Index MongoDB sur userId et createdAt
- Pagination sur les listes d'analyses
- Cache possible sur les résultats de domaines
- Optimisation des requêtes de validation

## Exemples d'utilisation

### Cas d'usage typique

1. L'utilisateur saisit un nom de domaine
2. Le frontend envoie une requête POST à `/api/analysis-domain`
3. Le backend analyse le domaine selon les critères définis
4. Un score sur 100 et des recommandations sont calculés
5. Les résultats détaillés sont retournés
6. Le frontend affiche les résultats avec les recommandations

### Intégration dans une application

Le module peut être intégré dans n'importe quelle application nécessitant une évaluation de noms de domaine. Il suffit de :

1. Inclure les routes dans votre serveur Express
2. Connecter à votre base MongoDB
3. Utiliser les composants Vue.js fournis
4. Adapter le styling selon vos besoins
5. Configurer la liste noire des domaines

## Maintenance

- Vérification régulière de la liste noire des domaines
- Mise à jour des critères d'évaluation
- Logs détaillés pour le debugging
- Tests unitaires et d'intégration disponibles
