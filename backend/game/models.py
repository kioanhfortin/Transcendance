from django.db.models.signals import post_save
from django.dispatch import receiver
# from django.http import JsonResponse
# from django.contrib.auth.decorators import login_required
from django.db import models
from django.contrib.auth.models import AbstractUser


# Create your models here.
class User(AbstractUser):
    isOnline = models.BooleanField(default=False)
    isIngame = models.BooleanField(default=False)
    is2Fa = models.BooleanField(default=False)
    friends = models.ManyToManyField('self', symmetrical=True, blank=True)  # Relation d’amitié bidirectionnelle
    avatar = models.ImageField(upload_to='avatars/', default='', blank=True, null=True)
    has_accepted_terms = models.BooleanField(default=True)

    def __str__(self):
        return self.username

    # Récupérer les amis de l'utilisateur
    def get_friends(self):
        return self.friends.all()
        
    # Ajouter un ami
    def add_friend(self, friend):
        if friend != self and not self.friends.filter(id=friend.id).exists():
            self.friends.add(friend)

    # Supprimer un ami
    def remove_friend(self, friend):
        if self.friends.filter(id=friend.id).exists():
            self.friends.remove(friend)

class UserStatistics(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='statistics')
    nb_parties_solo = models.IntegerField(default=0)
    nb_victoires_solo = models.IntegerField(default=0)
    nb_defaites_solo = models.IntegerField(default=0)
    nb_parties_1VS1 = models.IntegerField(default=0)
    nb_victoires_1VS1 = models.IntegerField(default=0)
    nb_defaites_1VS1 = models.IntegerField(default=0)
    nb_parties_2VS2 = models.IntegerField(default=0)
    nb_victoires_2VS2 = models.IntegerField(default=0)
    nb_defaites_2VS2 = models.IntegerField(default=0)
    nb_parties_tournois = models.IntegerField(default=0)
    nb_victoires_tournois = models.IntegerField(default=0)
    nb_defaites_tournois = models.IntegerField(default=0)

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


class UserHistory(models.Model):

    RESULT_CHOICES = [
        ('L', 'lose'),
        ('V', 'win'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)  # Date et heure automatiques
    game_mode = models.CharField(max_length=10)
    result = models.CharField(max_length=10, choices=RESULT_CHOICES, null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} - {self.game_mode} - {self.result} - {self.timestamp}"