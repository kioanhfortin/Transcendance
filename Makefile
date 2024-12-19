# Nom des services
ALL_SERVICES=frontend backend db

# Commande par défaut : construire toutes les images et démarrer tous les services
default: build-all up-all

# Construire l'image pour un service spécifique
build:
	@[ "$(SERVICE)" ] || { echo "Erreur: SERVICE n'est pas défini."; exit 1; }
	docker compose build $(SERVICE)

# Construire toutes les images
build-all:
	docker compose build $(ALL_SERVICES)

# Lancer un service spécifique
up:
	@[ "$(SERVICE)" ] || { echo "Erreur: SERVICE n'est pas défini."; exit 1; }
	docker compose up $(SERVICE)

# Lancer tous les services
up-all:
	docker compose up

# Lancer tous les services en arrière-plan
up-detached:
	docker compose up -d

# Arrêter un service spécifique
stop:
	@[ "$(SERVICE)" ] || { echo "Erreur: SERVICE n'est pas défini."; exit 1; }
	docker compose stop $(SERVICE)

# Arrêter tous les services
down:
	docker compose down

# Afficher les logs d'un service spécifique
logs:
	@[ "$(SERVICE)" ] || { echo "Erreur: SERVICE n'est pas défini."; exit 1; }
	docker compose logs -f $(SERVICE)

# Nettoyer tous les conteneurs, images et volumes
clean:
	docker compose down --rmi all --volumes --remove-orphans

# Commandes alias explicites
.PHONY: frontend backend db

frontend:
	$(MAKE) build SERVICE=frontend
	$(MAKE) up SERVICE=frontend

backend:
	$(MAKE) build SERVICE=backend
	$(MAKE) up SERVICE=backend

db:
	$(MAKE) build SERVICE=db
	$(MAKE) up SERVICE=db
