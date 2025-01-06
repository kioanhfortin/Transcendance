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

def log_request_data(get_response):
    def middleware(request):
        if request.path == "/api/register/" and request.method == "POST":
            try:
                print("Requête reçue :", json.loads(request.body))
            except Exception as e:
                print("Erreur lors de la lecture de la requête :", e)
        return get_response(request)
    return middleware


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_statistics(request):
    user = request.user
    game_type = request.data.get('game_type')  # 'solo', '1VS1', '2VS2', 'tournoi'
    result = request.data.get('result')  # 'V' ou 'L'

    # Validation des paramètres
    if game_type not in ['solo', '1VS1', '2VS2', 'tournoi']:
        return Response({"detail": "Invalid game type."}, status=status.HTTP_400_BAD_REQUEST)

    if result not in ['V', 'L']:
        return Response({"detail": "Invalid result type. Use 'V' for victory or 'L' for loss."}, status=status.HTTP_400_BAD_REQUEST)

    stats, created = UserStatistics.objects.get_or_create(user=user)
    
    # Mise à jour des statistiques en fonction du type de jeu et du résultat
    if game_type == 'solo':
        stats.nb_parties_solo = F('nb_parties_solo') + 1
        if result == 'V':
            stats.nb_victoires_solo = F('nb_victoires_solo') + 1
        elif result == 'L':
            stats.nb_defaites_solo = F('nb_defaites_solo') + 1
    elif game_type == '1VS1':
        stats.nb_parties_1VS1 = F('nb_parties_1VS1') + 1
        if result == 'V':
            stats.nb_victoires_1VS1 = F('nb_victoires_1VS1') + 1
        elif result == 'L':
            stats.nb_defaites_1VS1 = F('nb_defaites_1VS1') + 1
    elif game_type == '2VS2':
        stats.nb_parties_2VS2 = F('nb_parties_2VS2') + 1
        if result == 'V':
            stats.nb_victoires_2VS2 = F('nb_victoires_2VS2') + 1
        elif result == 'L':
            stats.nb_defaites_2VS2 = F('nb_defaites_2VS2') + 1
    elif game_type == 'tournoi':
        stats.nb_parties_tournois = F('nb_parties_tournois') + 1
        if result == 'V':
            stats.nb_victoires_tournois = F('nb_victoires_tournois') + 1
        elif result == 'L':
            stats.nb_defaites_tournois = F('nb_defaites_tournois') + 1
    
    # Sauvegarder les statistiques mises à jour dans la base de données
    stats.save()

    return Response({"detail": "Statistics updated successfully!"}, status=status.HTTP_200_OK)