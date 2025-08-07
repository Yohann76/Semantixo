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