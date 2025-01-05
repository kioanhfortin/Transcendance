from django.core.management.base import BaseCommand
from game.models import User, UserStatistics

class Command(BaseCommand):
    help = 'Create UserStatistics for users without them'

    def handle(self, *args, **kwargs):
        users_without_statistics = User.objects.filter(statistics__isnull=True)
        for user in users_without_statistics:
            UserStatistics.objects.create(user=user)
        self.stdout.write(self.style.SUCCESS('Successfully created UserStatistics for users without them'))