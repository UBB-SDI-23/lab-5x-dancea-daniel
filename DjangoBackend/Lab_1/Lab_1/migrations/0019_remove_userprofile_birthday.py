# Generated by Django 4.1.7 on 2023-04-29 12:47

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Lab_1', '0018_user_userprofile'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='birthday',
        ),
    ]
