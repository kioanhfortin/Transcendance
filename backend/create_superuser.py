import os
import django
from dotenv import load_dotenv

# Charger les variables d'environnement depuis le fichier .env
load_dotenv()

# Assure-toi que cette ligne est présente dans ton script
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendance.settings')

# Initialiser Django
django.setup()

from django.contrib.auth import get_user_model

# Récupérer le modèle utilisateur personnalisé
User = get_user_model()

# Récupérer les données depuis les variables d'environnement
username = os.getenv('DJANGO_SUPERUSER_USERNAME')
email = os.getenv('DJANGO_SUPERUSER_EMAIL')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD')


# Vérifier si les variables sont bien chargées
print(f"Username: {username}")
print(f"Email: {email}")
print(f"Password: {password}")


if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superuser {username} created!")
else:
    print(f"Superuser {username} already exists.")


# Créer d'autres utilisateurs
for i in range(1, 4):
    username = os.getenv(f'DJANGO_USER_{i}_USERNAME')
    email = os.getenv(f'DJANGO_USER_{i}_EMAIL')
    password = os.getenv(f'DJANGO_USER_{i}_PASSWORD')

    if not User.objects.filter(username=username).exists():
        User.objects.create_user(username=username, email=email, password=password)
        print(f"User {username} created!")
    else:
        print(f"User {username} already exists.")