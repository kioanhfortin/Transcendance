#!/bin/bash

# Attendre que la base de données soit disponible
/app/wait-for-it.sh db:5432 --timeout=30 --strict -- echo "Database is up"

# Appliquer les migrations
echo "Applying database migrations..."
python manage.py makemigrations
python manage.py migrate

pip install django-cors-headers


# Creer super user
echo "create superuser..."
python create_superuser.py

# Lancer le serveur
echo "Starting server..."
exec "$@"
