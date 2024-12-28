# Generated by Django 4.2 on 2024-12-28 12:52

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0003_remove_user_isingame_remove_user_isonline'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='friends',
            field=models.ManyToManyField(blank=True, related_name='friends_set', to='game.user'),
        ),
        migrations.AddField(
            model_name='user',
            name='isIngame',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='isOnline',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='UserStatistics',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre_de_parties', models.IntegerField(default=0)),
                ('nombre_de_victoires_1vs1', models.IntegerField(default=0)),
                ('nombre_de_defaites', models.IntegerField(default=0)),
                ('nombre_de_tournois', models.IntegerField(default=0)),
                ('nombre_de_victoires_tournoi', models.IntegerField(default=0)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='statistics', to='game.user')),
            ],
        ),
    ]
