# Generated by Django 4.2 on 2024-12-26 22:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0002_user_isingame_user_isonline'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='isIngame',
        ),
        migrations.RemoveField(
            model_name='user',
            name='isOnline',
        ),
    ]
