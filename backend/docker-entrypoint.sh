#!/bin/bash
# Attendre que la base de données soit disponible
./wait-for-it.sh db:5432 --timeout=30 --strict -- echo "Database is up"

# Appliquer les migrations
echo "Applying database migrations..."
python manage.py migrate

# Lancer le serveur
echo "Starting server..."
exec "$@"
