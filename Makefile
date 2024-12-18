# Nom des services
SERVICE=frontend
ALL_SERVICES=frontend backend db

# Commande par défaut : construire toutes les images et démarrer tous les services
default: build-all up-all

# Construire l'image pour un service spécifique (par défaut : front-end)
build:
	docker-compose build $(SERVICE)

# Construire toutes les images
build-all:
	docker-compose build $(ALL_SERVICES)

# Lancer un service spécifique (par défaut : front-end)
up:
	docker-compose up $(SERVICE)

# Lancer tous les services
up-all:
	docker-compose up

# Lancer tous les services en arrière-plan
up-detached:
	docker-compose up -d

# Arrêter un service spécifique
stop:
	docker-compose stop $(SERVICE)

# Arrêter tous les services
down:
	docker-compose down

# Afficher les logs d'un service spécifique (par défaut : front-end)
logs:
	docker-compose logs -f $(SERVICE)

# Nettoyer tous les conteneurs, images et volumes
clean:
	docker-compose down --rmi all --volumes --remove-orphans
