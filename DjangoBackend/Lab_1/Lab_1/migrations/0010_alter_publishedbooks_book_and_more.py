# Generated by Django 4.1.7 on 2023-03-16 08:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Lab_1', '0009_alter_publishedbooks_book'),
    ]

    operations = [
        migrations.AlterField(
            model_name='publishedbooks',
            name='book',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='books', to='Lab_1.book'),
        ),
        migrations.AlterUniqueTogether(
            name='publishedbooks',
            unique_together={('book', 'publisher')},
        ),
    ]
