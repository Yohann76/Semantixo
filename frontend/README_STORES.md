# 🏪 Gestion globale des stores

Ce projet utilise un système de gestion globale des stores avec Pinia, permettant un accès facile aux stores depuis n'importe quel composant.

## 📁 Structure des stores

```
frontend/src/
├── stores/
│   ├── auth.js          # Store d'authentification
│   └── index.js         # Export centralisé
├── composables/
│   └── useGlobalStores.js  # Composables pour les stores
├── plugins/
│   └── stores.js        # Plugin Vue pour injection globale
└── main.js              # Configuration de l'app
```

## 🚀 Utilisation des stores

### Option 1: Composable `useAuth()` (Recommandé)

```vue
<script setup>
import { useAuth } from '../composables/useGlobalStores.js'

// Utilisation simple
const { user, isAuthenticated, login, logout, getAuthHeaders } = useAuth()

// Vérifier l'authentification
if (isAuthenticated.value) {
  console.log('Utilisateur connecté:', user.value)
}

// Faire une requête API
const response = await fetch('/api/analysis', {
  headers: getAuthHeaders(),
  // ...
})
</script>
```

### Option 2: Composable `useGlobalStores()`

```vue
<script setup>
import { useGlobalStores } from '../composables/useGlobalStores.js'

// Accès à tous les stores
const { auth, isAuthenticated, getAuthHeaders } = useGlobalStores()

// Utilisation
const user = auth.user
const token = auth.token
</script>
```

### Option 3: Injection globale (Options API)

```vue
<script>
export default {
  name: 'MyComponent',
  computed: {
    user() {
      return this.$stores?.auth?.user
    },
    isAuthenticated() {
      return this.$isAuthenticated?.()
    }
  },
  methods: {
    async makeRequest() {
      const headers = this.$getAuthHeaders?.()
      // Utiliser headers...
    }
  }
}
</script>
```

### Option 4: Import direct

```vue
<script setup>
import { useAuthStore } from '../stores/auth.js'

const authStore = useAuthStore()

// Utilisation directe
console.log(authStore.user)
console.log(authStore.isAuthenticated)
</script>
```

## 🔧 Fonctionnalités disponibles

### Authentification
- `user` - Utilisateur connecté
- `token` - Token JWT
- `isAuthenticated` - État d'authentification
- `login(email, password)` - Connexion
- `logout()` - Déconnexion
- `register(name, email, password)` - Inscription
- `getAuthHeaders()` - Headers pour requêtes API

### Exemples d'utilisation

```javascript
// Vérifier l'authentification
const { isAuthenticated } = useAuth()
if (isAuthenticated.value) {
  // Utilisateur connecté
}

// Faire une requête API
const { getAuthHeaders } = useAuth()
const response = await fetch('/api/protected', {
  headers: getAuthHeaders()
})

// Obtenir l'utilisateur
const { user } = useAuth()
console.log('Nom:', user.value?.name)
```

## 🎯 Avantages

1. **Accès global** - Stores disponibles partout
2. **Réactivité** - Mise à jour automatique
3. **Simplicité** - API claire et intuitive
4. **Flexibilité** - Plusieurs façons d'utiliser
5. **TypeScript** - Support complet des types

## 🔄 Réactivité

Les stores sont automatiquement réactifs. Quand l'état change (connexion/déconnexion), tous les composants qui utilisent les stores sont mis à jour automatiquement.

```vue
<template>
  <div>
    <p v-if="isAuthenticated">Connecté: {{ user?.name }}</p>
    <p v-else>Non connecté</p>
  </div>
</template>

<script setup>
import { useAuth } from '../composables/useGlobalStores.js'

const { user, isAuthenticated } = useAuth()
// La vue se met à jour automatiquement quand l'état change
</script>
``` 