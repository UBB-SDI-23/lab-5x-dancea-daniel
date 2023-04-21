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
from Lab_1.Views import BookView, AuthorView, PublisherView
from rest_framework.urlpatterns import format_suffix_patterns
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView


urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/books/', BookView.book_list.as_view()),
    path('api/books/autocomplete/', BookView.BooksAutoComple.as_view()),
    path('api/books/<int:id>', BookView.book_detail.as_view()),
    path('api/authors/', AuthorView.author_list.as_view()),
    path('api/authors/autocomplete/', AuthorView.AuthorsAutoComple.as_view()),
    path('api/authors/<int:id>', AuthorView.author_detail.as_view()),
    path('api/publishers/', PublisherView.publisher_list.as_view()),
    path('api/publishers/autocomplete/', PublisherView.PublishersAutoComple.as_view()),
    path('api/publishers/<int:id>', PublisherView.publisher_detail.as_view()),
    path('api/published_books/', PublisherView.published_books_list.as_view()),
    path('api/published_books/<int:bookId>/<int:publisherId>', PublisherView.published_books_detail.as_view()),
    path('api/author_stats/avr-books/', PublisherView.AuthorsByAvrBooks.as_view()),
    path('api/publisher_stats/num-books/', PublisherView.BooksByNrOfBooksByAuthors.as_view()),
    path('api/publishers/<int:id>/books/', PublisherView.AddBookListToPublisher.as_view()),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path('api/schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
