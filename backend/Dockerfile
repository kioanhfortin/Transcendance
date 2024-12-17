# Utilisez une image de base appropriée pour votre backend (par exemple, Python)
FROM python:3.10

# Définissez le répertoire de travail
WORKDIR /app

# Copiez les fichiers de votre application
COPY . /app

# Installez les dépendances
COPY requirements.txt /app/

RUN pip install -r requirements.txt

EXPOSE 8000

# Commande pour démarrer l'application
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]