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
from .models import User, UserStatistics, UserProfile
from .serializers import UserRegistrationSerializer, UserSerializer, UserStatisticsSerializer, UserProfileSerializer
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


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    user = authenticate(request, email=email, password=password)

    if user is not None:
        # User credentials are valid, proceed with code generation and email sending
        user_profile = UserProfile.objects.get(user=user)
        
        # Generate a 6-digit code and set the expiry time to 1 hour from now
        verification_code = generate_random_digits()  # Add parentheses to call the function
        user_profile.otp = verification_code
        user_profile.otp_expiry_time = timezone.now() + timedelta(hours=1)
        user_profile.save()

        # Send the code via email (use Django's send_mail function)
        send_mail(
            'Verification Code',
            f'Your verification code is: {verification_code}',  # Corrected variable name
            'from@example.com',  # Use a proper email address or from settings
            [email],
            fail_silently=False,
        )

        return Response({'detail': 'Verification code sent successfully.'}, status=status.HTTP_200_OK)

    return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    # Check if email and otp are provided
    if not email or not otp:
        return Response({'detail': 'Email and OTP are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_profile = UserProfile.objects.get(user__email=email)
    except UserProfile.DoesNotExist:
        return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Check if the verification code is valid and not expired
    if (
        user_profile.otp == otp and
        user_profile.otp_expiry_time is not None and
        user_profile.otp_expiry_time > timezone.now()
    ):
        # Verification successful, generate access and refresh tokens
        user = user_profile.user
        django_login(request, user)

        # Use djangorestframework_simplejwt to generate tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Reset verification code and expiry time
        user_profile.otp = ''
        user_profile.otp_expiry_time = None
        user_profile.save()

        return Response({'access_token': access_token, 'refresh_token': str(refresh)}, status=status.HTTP_200_OK)

    return Response({'detail': 'Invalid verification code or credentials.'}, status=status.HTTP_401_UNAUTHORIZED)
