import json
from django.http import JsonResponse



from django.shortcuts import render
from django.db.models import F

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from .models import User, UserStatistics
from .serializers import UserRegistrationSerializer, UserSerializer, UserStatisticsSerializer, SendOtpSerializer, OTPVerificationSerializer
from django.shortcuts import get_object_or_404
import random
import string
from django.core.cache import cache
from django.conf import settings
from django.core.mail import send_mail, BadHeaderError

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserStatisticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            statistics = UserStatistics.objects.get(user=user)
            serializer = UserStatisticsSerializer(statistics)
            return Response(serializer.data)
        except UserStatistics.DoesNotExist:
            return Response({"error": "Statistics not found"}, status=400)
    
    # Méthode PATCH : Mise à jour des statistiques d'un utilisateur
    def patch(self, request):
        user = request.user
        game_type = request.data.get('game_type')  # 'solo', '1VS1', '2VS2', 'tournoi'
        result = request.data.get('result')  # 'V' ou 'L'

        # Validation des paramètres
        if game_type not in ['solo', '1VS1', '2VS2', 'tournoi']:
            return Response({"detail": "Invalid game type."}, status=400)

        if result not in ['V', 'L']:
            return Response({"detail": "Invalid result type. Use 'V' for victory or 'L' for loss."}, status=400)

        stats, created = UserStatistics.objects.get_or_create(user=user)

        # Mise à jour des statistiques en fonction du type de jeu et du résultat
        if game_type == 'solo':
            stats.nb_parties_solo = F('nb_parties_solo') + 1
            if result == 'V':
                stats.nb_victoires_solo = F('nb_victoires_solo') + 1
            else:
                stats.nb_defaites_solo = F('nb_defaites_solo') + 1
        elif game_type == '1VS1':
            stats.nb_parties_1VS1 = F('nb_parties_1VS1') + 1
            if result == 'V':
                stats.nb_victoires_1VS1 = F('nb_victoires_1VS1') + 1
            else:
                stats.nb_defaites_1VS1 = F('nb_defaites_1VS1') + 1
        elif game_type == '2VS2':
            stats.nb_parties_2VS2 = F('nb_parties_2VS2') + 1
            if result == 'V':
                stats.nb_victoires_2VS2 = F('nb_victoires_2VS2') + 1
            else:
                stats.nb_defaites_2VS2 = F('nb_defaites_2VS2') + 1
        elif game_type == 'tournoi':
            stats.nb_parties_tournois = F('nb_parties_tournois') + 1
            if result == 'V':
                stats.nb_victoires_tournois = F('nb_victoires_tournois') + 1
            else:
                stats.nb_defaites_tournois = F('nb_defaites_tournois') + 1

        # Sauvegarder les statistiques mises à jour dans la base de données
        stats.save()

        return Response({"detail": "Statistics updated successfully!"}, status=200)

def log_request_data(get_response):
    def middleware(request):
        if request.path == "/api/register/" and request.method == "POST":
            try:
                print("Requête reçue :", json.loads(request.body))
            except Exception as e:
                print("Erreur lors de la lecture de la requête :", e)
        return get_response(request)
    return middleware


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Permet à l'utilisateur de récupérer ses données"""
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def patch(self, request):
        """Permet à l'utilisateur de mettre à jour ses données"""
        user = request.user

        # Sérialiseur pour la mise à jour des données utilisateur
        serializer = UserSerializer(user, data=request.data, partial=True)

        # Validation des données
        if serializer.is_valid():
            # Sauvegarder les modifications
            serializer.save()

            # Optionnel : loguer la mise à jour pour être conforme au RGPD
            print(f"User {user.username} updated their data.")

            # Retourner une réponse de succès
            return Response({"detail": "User data updated successfully!"}, status=status.HTTP_200_OK)

        # Si les données ne sont pas valides, renvoyer une erreur
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id=None):
        user = request.user if user_id is None else get_object_or_404(User, pk=user_id)

        # Vérifier que l'utilisateur connecté peut supprimer cet utilisateur
        if not request.user.is_superuser and request.user != user:
            return Response({"detail": "You do not have permission to delete this user."}, status=403)

        # Anonymisation des statistiques si elles existent
        try:
            statistics = UserStatistics.objects.get(user=user)
            statistics.delete()  # Suppression des statistiques
        except UserStatistics.DoesNotExist:
            # Si l'utilisateur n'a pas de statistiques, ignorer la suppression des statistiques
            pass

        
        user.delete()

        return Response({"detail": "User data deleted successfully!"}, status=204)

class AddFriendAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get('username')  # Nom d'utilisateur de l'ami
        if not username:
            return Response({"error": "Nom d'utilisateur requis"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend = User.objects.get(username=username)
            if friend == request.user:
                return Response({"error": "Vous ne pouvez pas vous ajouter en tant qu'ami"}, status=status.HTTP_400_BAD_REQUEST)

            # Ajout de l'ami
            request.user.add_friend(friend)
            return Response({"message": f"{username} ajouté à votre liste d'amis"}, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({"error": f"L'utilisateur {username} n'existe pas"}, status=status.HTTP_404_NOT_FOUND)

class ListFriendsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        friends = request.user.get_friends()  # Récupère la liste des amis
        friends_list = [{"id": friend.id, "username": friend.username} for friend in friends]
        return Response({"friends": friends_list})

def generate_otp():
    """Génère un OTP à 6 chiffres."""
    return ''.join(random.choices(string.digits, k=6))

def send_otp_email(user, otp):
    """Envoie l'OTP par email."""
    subject = settings.TWO_FACTOR_EMAIL_SUBJECT
    body = settings.TWO_FACTOR_EMAIL_BODY.format(code=otp, expiry_time=settings.TWO_FACTOR_EXPIRATION)
    send_mail(subject, body, settings.EMAIL_HOST_USER, [user.email])

def store_otp_in_cache(user, otp):
    """Stocke l'OTP dans le cache avec une expiration définie."""
    cache_key = f"otp_{user.username}"  # Utilisation du username à la place de l'ID
    cache.set(cache_key, otp, timeout=settings.TWO_FACTOR_EXPIRATION)

def verify_otp(user, otp):
    """Vérifie si l'OTP soumis par l'utilisateur est valide."""
    cache_key = f"otp_{user.username}"  # Utilisation du username à la place de l'ID
    stored_otp = cache.get(cache_key)  # Récupérer l'OTP du cache
    return stored_otp == otp

def remove_otp_from_cache(user):
    """Supprime l'OTP du cache après validation réussie."""
    cache_key = f"otp_{user.username}"  # Utilisation du username à la place de l'ID
    cache.delete(cache_key)  # Supprimer l'OTP du cache



@api_view(['POST'])
def send_otp(request):
    serializer = SendOtpSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        try:
            user = User.objects.get(username=username)
            otp = generate_otp()  # Générer un OTP
            store_otp_in_cache(user, otp)  # Stocker dans le cache
            send_otp_email(user, otp)  # Passer l'OTP à la fonction pour l'envoyer par email
            return Response({"message": "OTP envoyé avec succès!"}, status=200)
        except User.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé"}, status=404)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def validate_otp(request):
    """Vue pour valider l'OTP soumis par l'utilisateur et le supprimer du cache."""
    print(f"request.user: {request.user}")
    # Vérifiez que l'utilisateur est authentifié
    print(f"En-têtes de la requête : {request.headers}")
    if not request.user.is_authenticated:
        return Response({"error": "Utilisateur non authentifié."}, status=401)

    user = request.user  # Utilisateur authentifié
    print(f"Utilisateur authentifié : {user.username}")

    serializer = OTPVerificationSerializer(data=request.data)  # Sérialiser les données

    if serializer.is_valid():
        otp_submitted = serializer.validated_data['otp']

        if verify_otp(user, otp_submitted):
            remove_otp_from_cache(user)  # Supprimer l'OTP après validation
            return Response({"message": "OTP validé et authentification réussie."}, status=200)
        else:
            return Response({"message": "OTP invalide ou expiré."}, status=400)
    else:
        return Response(serializer.errors, status=400)



