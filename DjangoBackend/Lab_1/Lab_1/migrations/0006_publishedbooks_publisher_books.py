# Generated by Django 4.1.7 on 2023-03-14 13:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Lab_1', '0005_alter_book_author'),
    ]

    operations = [
        migrations.CreateModel(
            name='PublishedBooks',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('year', models.IntegerField()),
                ('price', models.IntegerField()),
                ('book', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Lab_1.book')),
                ('publisher', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='Lab_1.publisher')),
            ],
        ),
        migrations.AddField(
            model_name='publisher',
            name='books',
            field=models.ManyToManyField(through='Lab_1.PublishedBooks', to='Lab_1.book'),
        ),
    ]
