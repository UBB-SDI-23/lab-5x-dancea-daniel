from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class UserManager(BaseUserManager):
    def create_user(self, username, password=None, **extra_fields):
        if username is None:
            raise TypeError('Users must have a username.')

        user = self.model(username=username, **extra_fields)
        user.set_password(password)

        # Set is_staff and is_superuser fields if they are present in extra_fields
        if 'is_staff' in extra_fields:
            user.is_staff = extra_fields['is_staff']
        if 'is_superuser' in extra_fields:
            user.is_superuser = extra_fields['is_superuser']

        user.save(using=self._db)

        return user

    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        user = self.create_user(username, password, **extra_fields)
        print('myprint')
        print(user.is_superuser)
        print(user.is_staff)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    birthday = models.DateField()
    gender = models.CharField(max_length=20)
    marital_status = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username

class Author(models.Model):
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    DOB = models.DateField()
    nationality = models.CharField(max_length=200)
    books_sold = models.IntegerField(validators=[MinValueValidator(0)])
    description = models.CharField(max_length=1000)

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


