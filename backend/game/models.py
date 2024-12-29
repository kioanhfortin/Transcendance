from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    # username = models.CharField(max_length=100)
    # password = models.CharField(max_length=100)
    isOnline = models.BooleanField(default=False)
    isIngame = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', blank=True)

    def __str__(self):
        return self.username

class UserStatistics(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='statistics')
    nombre_de_parties = models.IntegerField(default=0)
    nombre_de_victoires_1vs1 = models.IntegerField(default=0)
    nombre_de_defaites = models.IntegerField(default=0)
    nombre_de_tournois = models.IntegerField(default=0)
    nombre_de_victoires_tournoi = models.IntegerField(default=0)

    def __str__(self):
        return f"Statistics for {self.user.username}"