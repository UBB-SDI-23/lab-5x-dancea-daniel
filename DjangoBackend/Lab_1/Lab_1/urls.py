"""Lab_1 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from Lab_1 import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('admin/', admin.site.urls),
    path('books/', views.book_list.as_view()),
    path('books/<int:id>', views.book_detail.as_view()),
    path('authors/', views.author_list),
    path('authors/<int:id>', views.author_detail),
    path('publishers/', views.publisher_list),
    path('publishers/<int:id>', views.publisher_detail),
    path('published_books/', views.published_books_list.as_view()),
    path('books/avr-books/', views.AuthorsByAvrBooks.as_view()),
    path('books/book-sorted/', views.BooksByNrOfBooksByAuthors.as_view()),
    path('publishers/<int:id>/books/', views.AddBookListToPublisher.as_view())

]

urlpatterns = format_suffix_patterns(urlpatterns)