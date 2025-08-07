# Makefile
.PHONY: dev-build dev-kill dev-run

dev-build:
	docker-compose up -d --build

dev-kill:
	docker-compose down

dev-run:
	docker-compose up -d 

# TODO:
# make deploy

# Tests
.PHONY: test test-backend test-frontend test-e2e test-all install-test-deps

# Installer les dépendances de test
install-test-deps:
	@echo "📦 Installation des dépendances de test..."
	cd backend && npm install
	cd frontend && npm install
	cd e2e && npm install
	cd e2e && npx playwright install

# Tests backend # backend/tests
test-backend:
	@echo "🧪 Lancement des tests backend..."
	cd backend && npm test

# Tests frontend # frontend/tests
test-frontend:
	@echo "🧪 Lancement des tests frontend..."
	cd frontend && npm run test

# Tests E2E # /e2e/tests # Test End to End
test-e2e:
	@echo "🧪 Lancement des tests E2E..."
	cd e2e && npm test

# Tous les tests
test-all: test-backend test-frontend test-e2e
	@echo "✅ Tous les tests sont terminés!"

# Tests avec couverture
test-coverage:
	@echo "📊 Lancement des tests avec couverture..."
	cd backend && npm run test:coverage
	cd frontend && npm run test:coverage

# Tests en mode watch
test-watch:
	@echo "👀 Lancement des tests en mode watch..."
	cd backend && npm run test:watch &
	cd frontend && npm run test:watch &
	wait