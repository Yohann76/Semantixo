# Semantixo Project 

This project is for text SEO Analyse 

## Backend - Node.js (Express)

endpoint from API: 

- `GET /` - Route principale avec message de bienvenue
- `GET /api/test` - Endpoint de test avec informations détaillées
- `GET /api/hello/:name` - Endpoint personnalisé avec paramètre

Install and run 

```bash
cd backend 
npm install
node index.js
```

API available : http://localhost:3000

## Frontend - Vue.js


Install and run 

```bash
cd frontend
npm install
npm run serve
```

App available : http://localhost:8081/

```
Semantixo/
├── backend/
│   ├── index.js          # Serveur Express
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.vue       # Composant
│   │   ├── components/
│   │   │   └── Home.vue  # Homepage
│   │   └── main.js
│   └── package.json
└── README.md
```

## 🔧 Technologies

- **Backend** : Node.js, Express.js
- **Frontend** : Vue.js 3
- **Communication** : Fetch API, CORS
- **Styling** : CSS3 avec gradients et animations
