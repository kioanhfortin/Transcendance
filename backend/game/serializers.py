from rest_framework import serializers
from .models import User, UserStatistics


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password2 = serializers.CharField(write_only=True)
    has_accepted_terms = serializers.BooleanField(write_only=True)


    class Meta:
        model = User
        fields = ('username', 'password1', 'password2', 'email', 'has_accepted_terms')

    def validate(self, data):
        # Vérifie que les mots de passe sont identiques
        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Les mots de passe ne correspondent pas.")
        
        # Vérifie que l'utilisateur a accepté les conditions d'utilisation
        if not data['has_accepted_terms']:
            raise serializers.ValidationError("Vous devez accepter les conditions d'utilisation.")
        
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password1=validated_data['password1'],
            password2=validated_data['password2'],
            email=validated_data['email'],
            has_accepted_terms = validated_data['has_accepted_terms']
        )
        user.save()
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

class SendOtpSerializer(serializers.Serializer):
    username = serializers.CharField() 

class OTPVerificationSerializer(serializers.Serializer):
    otp = serializers.CharField(write_only=True)  # Le champ OTP que l'utilisateur soumet

    def validate_otp(self, value):
        """Vérifie l'OTP stocké dans le cache pour l'utilisateur."""
        from .views import verify_otp  # Importation différée pour éviter la boucle
        user = self.context.get('user')  # Assurez-vous d'injecter l'utilisateur dans le contexte
        if not verify_otp(user, value):  # Appel à la fonction verify_otp
            raise serializers.ValidationError("OTP invalide ou expiré.")
        return value