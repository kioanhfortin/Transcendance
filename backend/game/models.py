from django.db.models.signals import post_save
from django.dispatch import receiver

from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    isOnline = models.BooleanField(default=False)
    isIngame = models.BooleanField(default=False)
    is2Fa = models.BooleanField(default=False)
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

@staticmethod
def get_default_statistics(user):
    return UserStatistics.objects.create(user=user)


# Signal to create UserStatistics when a new User is created
@receiver(post_save, sender=User)
def create_user_statistics(sender, instance, created, **kwargs):
    if created:
        UserStatistics.objects.create(user=instance)


# Signal to save UserStatistics when a User is saved
@receiver(post_save, sender=User)
def save_user_statistics(sender, instance, **kwargs):
    instance.statistics.save()