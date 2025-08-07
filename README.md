# Semantixo Project 

This project is a text SEO analysis application with a complete frontend/backend architecture including user authentication and MongoDB database.

## 🛠️ Architecture

### Backend - Node.js (Express + MongoDB)

#### Installation and startup

```bash
cd backend 
npm install
node index.js
```

The API will be available at: http://localhost:3000

### Frontend - Vue.js

Modern user interface with:
- **Fixed navigation** with menu and authentication
- **Homepage** with API tests
- **SEO analysis page** with analysis form
- **Integrated authentication**
- **Responsive and modern design**

#### Installation and startup

```bash
cd frontend
npm install
npm run serve
```

The application will be available at: http://localhost:8081/


## 🔐 Authentication & Authorization

- **JWT** (JSON Web Tokens) for authentication
- **Bcrypt** for password hashing
- **Role-based access control** (Member/Admin)
- **Protection middleware** for private routes
- **Complete error handling**


## 🔧 Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **CORS** - Cross-origin request handling

### Frontend
- **Vue.js 3** - JavaScript framework
- **Vue Router** - Client-side routing
- **Fetch API** - HTTP requests
- **CSS3** - Styling with gradients and animations

## 🚀 Tools on machine

need: docker, make

## Start with docker (recommanded)

1. **Install Docker Desktop**: https://www.docker.com/products/docker-desktop
2. Open a terminal in the project folder
3. Run the command:

```bash
docker-compose up -d
docker-compose up -d --build
```

- The frontend will be accessible at: http://localhost:8081
- The backend API at: http://localhost:3000
- MongoDB at: localhost:27017

To stop all services:

```bash
docker-compose down
```

## 🧪 Tests

### Tests Frontend (Vitest)
```bash
# general test frontend
make test-frontend
# Tests spécifiques
cd frontend && npm run test -- simple.test.js
```

### Tests E2E (Playwright)

```bash
# Tests end-to-end
make test-e2e
```

### Installation des Dépendances
```bash
# Installer toutes les dépendances de test
make install-test-deps
```

## Makefile 

```
make dev-kill
make dev-build
make dev-run
```

```
make install-test-deps
make test-all
make test-coverage
```