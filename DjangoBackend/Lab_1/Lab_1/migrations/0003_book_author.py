# Generated by Django 4.1.7 on 2023-03-11 13:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Lab_1', '0002_author_remove_book_author_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='author',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='Lab_1.author'),
        ),
    ]
