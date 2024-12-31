from rest_framework import serializers
# from django.contrib.auth.models import User
from .models import User, UserStatistics, UserProfile

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('otp', 'otp_expiry_time', 'other_fields_from_user_model')


class UserStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStatistics
        fields = ['nombre_de_parties', 'nombre_de_victoires_1vs1', 'nombre_de_defaites', 'nombre_de_tournois', 'nombre_de_victoires_tournoi']