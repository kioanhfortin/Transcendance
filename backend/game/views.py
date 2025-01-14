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
from .serializers import UserRegistrationSerializer, UserSerializer, UserStatisticsSerializer
from django.shortcuts import get_object_or_404

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