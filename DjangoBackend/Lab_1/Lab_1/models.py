from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

class Author(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    DOB = models.DateField()
    nationality = models.CharField(max_length=200)
    books_sold = models.IntegerField(validators=[MinValueValidator(0)])

    def __str__(self):
        return self.first_name + " " + self.last_name

class Book(models.Model):
    name = models.CharField(max_length=200)
    author = models.ForeignKey(Author, related_name="books", on_delete=models.CASCADE, default=1)
    description = models.CharField(max_length=200)
    copies_sold = models.IntegerField(validators=[MinValueValidator(0)])
    publication_date = models.DateField()


    def __str__(self):
        return self.name + ' \nby: ' + self.author.first_name + " " + self.author.last_name


class Publisher(models.Model):
    name = models.CharField(max_length=200)
    headquarter = models.CharField(max_length=200)
    established = models.DateField()
    description = models.CharField(max_length=200)
    total_copies_sold = models.IntegerField(validators=[MinValueValidator(0)])
    books = models.ManyToManyField(Book, through='PublishedBooks')

    def __str__(self):
        return self.name

class PublishedBooks(models.Model):
    class Meta:
        unique_together = (('book', 'publisher'),)

    book = models.ForeignKey(Book, related_name="books", on_delete=models.CASCADE)
    publisher = models.ForeignKey(Publisher, related_name="publishers", on_delete=models.CASCADE)
    year = models.IntegerField()
    price = models.DecimalField(max_digits=6, decimal_places=2, validators=[MinValueValidator(0)])

    def __str__(self):
        return self.book.name + " " + self.publisher.name


