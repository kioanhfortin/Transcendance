from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth import authenticate, login as django_login
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from .models import User, UserStatistics
from .serializers import UserRegistrationSerializer, UserSerializer, UserStatisticsSerializer, Verify2FACodeSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import random


# Create your views here.
class HelloWorld(APIView):
    renderer_classes = [JSONRenderer]
    
    def get(self, request):
        return Response({"message": "Hello, world!"}, status=status.HTTP_200_OK)


class UserRegistrationView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            return Response({"error": "Statistics not found"}, status=404)


def generate_random_digits(n=6):
    return "".join(map(str, random.sample(range(0, 10), n)))

#test 2FA
class Verify2FAView(APIView):
    def post(self, request):
        # Valider les données envoyées
        serializer = Verify2FACodeSerializer(data=request.data)
        
        if serializer.is_valid():
            # Récupérer le code validé par le serializer
            code = serializer.validated_data['code']
            
            # Logique pour vérifier le code 2FA
            if valid_code(code):  # Vous devez définir la fonction `valid_code` pour valider le codeTODO!!!!!
                return Response({'detail': '2FA verified successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid 2FA code'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Si le serializer n'est pas valide, retourner les erreurs de validation
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


