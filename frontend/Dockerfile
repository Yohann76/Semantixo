# Argument pour définir le mode (dev ou prod)
ARG NODE_ENV=production

# Build stage
FROM node:20-alpine as build-stage

WORKDIR /app

# Installer les dépendances système pour les builds natifs
RUN apk add --no-cache python3 make g++

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Exposer le port 8080 pour le développement
EXPOSE 8080

# Si c'est en mode développement, lancer le serveur de dev
# Sinon, builder et lancer nginx
RUN if [ "$NODE_ENV" = "development" ] ; then \
        echo "Mode développement - pas de build nécessaire" ; \
    else \
        npm run build ; \
    fi

# Production stage (seulement si pas en développement)
FROM nginx:alpine as production-stage

# Copier les fichiers buildés
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Pour le développement, utiliser directement le build-stage
FROM build-stage as development-stage

CMD ["npm", "run", "serve", "--", "--host", "0.0.0.0", "--port", "8080"] 