from rest_framework import serializers
from .models import User, UserStatistics

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password1', 'password2', 'email')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password1=validated_data['password1'],
            password2=validated_data['password2'],
            email=validated_data['email']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'isOnline', 'isIngame', 'is2Fa', 'friends']

class UserStatisticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStatistics
        fields = \
            [
                'nb_parties_solo', 'nb_victoires_solo', 'nb_defaites_solo',
                'nb_parties_1VS1', 'nb_victoires_1VS1', 'nb_defaites_1VS1',
                'nb_parties_2VS2', 'nb_victoires_2VS2', 'nb_defaites_2VS2',
                'nb_parties_tournois', 'nb_victoires_tournois', 'nb_defaites_tournois'
            ]