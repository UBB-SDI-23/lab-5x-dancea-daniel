# Generated by Django 4.1.7 on 2023-04-10 08:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Lab_1', '0012_author_desciption'),
    ]

    operations = [
        migrations.RenameField(
            model_name='author',
            old_name='desciption',
            new_name='description',
        ),
    ]
