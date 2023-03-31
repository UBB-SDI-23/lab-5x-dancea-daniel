from django.contrib import admin
from .models import Book, Author, Publisher, PublishedBooks

admin.site.register(Book)
admin.site.register(Author)
admin.site.register(Publisher)
admin.site.register(PublishedBooks)
