import json
from django.http import JsonResponse

from django.shortcuts import render
from django.db.models import F

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import User, UserStatistics, UserHistory
from .serializers import UserRegistrationSerializer, UserSerializer, UserStatisticsSerializer, UserHistorySerializer, SendOtpSerializer, OTPVerificationSerializer
from django.shortcuts import get_object_or_404
import random
import string
from django.core.cache import cache
from django.conf import settings
from django.core.mail import send_mail, BadHeaderError
from rest_framework.decorators import permission_classes
from rest_framework.decorators import api_view


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

            pass

        user.delete()

        return Response({"detail": "User data deleted successfully!"}, status=204)

class FriendsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        username = request.data.get('username')  # Nom d'utilisateur de l'ami
        if not username:
            return Response({"error": "Nom d'utilisateur requis"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            friend = User.objects.get(username=username)
            if friend == request.user:
                return Response({"error": "Vous ne pouvez pas vous ajouter en tant qu'ami"}, status=status.HTTP_400_BAD_REQUEST)

            request.user.add_friend(friend)
            return Response({"message": f"{username} ajouté à votre liste d'amis"}, status=status.HTTP_201_CREATED)

        except User.DoesNotExist:
            return Response({"error": f"L'utilisateur {username} n'existe pas"}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        friends = request.user.get_friends()  # Récupère la liste des amis
        friends_list = [
            {
                "id": friend.id,
                "username": friend.username,
                "isOnline": friend.isOnline,
                "isIngame": friend.isIngame,
                        
            }
             for friend in self.request.user.friends.all()
            ]
        return Response({"friends": friends_list})
    
    def delete(self, request):
        username = request.data.get('username')
        if not username:
            return Response({"error": "Nom d'utilisateur requis"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            friend = User.objects.get(username=username)
            if friend == request.user:
                return Response({"error": "Vous ne pouvez pas vous supprimer vous meme"}, status=status.HTTP_400_BAD_REQUEST)
            request.user.remove_friend(friend)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": f"L'utilisateur {username} n'existe pas"}, status=status.HTTP_404_NOT_FOUND)

class UserHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            print(f"Authenticated user: {request.user}")
            user = request.user
            user_history = UserHistory.objects.filter(user=user)

            if not user_history.exists():
                return Response({"message": "No history available"}, status=200)

            serializer = UserHistorySerializer(user_history, many=True)
            return Response(serializer.data, status=200)
        
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
    def post(self, request):
        request.data['user'] = request.user.id 

        serializer = UserHistorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UpdateAvatarView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user

        if not request.FILES.get('avatar'):
            return Response({'status': 'error', 'message': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        avatar_file = request.FILES['avatar']
        user.avatar.save(avatar_file.name, avatar_file)
        user.save()

        return Response( 'success', status=status.HTTP_200_OK)

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


def verify_otp(user, otp):
    """Vérifie si l'OTP soumis par l'utilisateur est valide."""
    cache_key = f"otp_{user.username}"  # Utilisation du username à la place de l'ID
    stored_otp = cache.get(cache_key)  # Récupérer l'OTP du cache

    return stored_otp == otp


@api_view(['POST'])
def validate_otp(request):
    """View to validate the OTP submitted by the user and remove it from the cache."""
    user = request.user  # Authenticated user

    # Vérification de l'authentification de l'utilisateur
    if not user.is_authenticated:
        raise AuthenticationFailed('User is not authenticated.')

    # Passer l'utilisateur au contexte du sérialiseur
    serializer = OTPVerificationSerializer(data=request.data, context={'user': user})

    if serializer.is_valid():
        otp_submitted = serializer.validated_data['otp']

        # Check if the OTP is valid
        if verify_otp(user, otp_submitted):
            # OTP is valid
            remove_otp_from_cache(user)  # Remove OTP from cache after validation
            return Response({"message": "OTP validated and authentication successful."}, status=200)
        else:
            # OTP is invalid or expired
            #remove_otp_from_cache(user)  # Remove OTP from cache after failed attempt
            return Response({"message": "Invalid or expired OTP."}, status=400)
    
    # In case of invalid data (e.g., missing OTP or incorrect format)
    #remove_otp_from_cache(user)  # Ensure OTP is removed even on invalid request
    return Response(serializer.errors, status=400)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])  # Assure que l'utilisateur est authentifié
def enable_2fa(request):
    """
    Gère l'état 2FA :
    - GET : Renvoie l'état actuel de 2FA.
    - POST : Active ou désactive 2FA.
    """
    user = request.user

    if request.method == 'GET':
        # Renvoie l'état actuel de 2FA
        return Response({"is_2fa_enabled": user.is2Fa}, status=200)

    elif request.method == 'POST':
        # Active ou désactive 2FA
        enable_2fa = request.data.get('enable_2fa')  # Récupère la valeur depuis la requête JSON

        if enable_2fa is not None:
            user.is2Fa = enable_2fa  # Met à jour l'état de 2FA
            user.save()

            message = "2FA activé avec succès." if enable_2fa else "2FA désactivé avec succès."
            return Response({"message": message, "is_2fa_enabled": user.is2Fa}, status=200)

        return Response({"error": "Données invalides dans la requête."}, status=400)