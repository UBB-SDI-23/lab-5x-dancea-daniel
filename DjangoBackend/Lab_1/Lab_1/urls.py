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
    path('admin/', admin.site.urls),
    path('books/', BookView.book_list.as_view()),
    path('books/<int:id>', BookView.book_detail.as_view()),
    path('authors/', AuthorView.author_list.as_view()),
    path('authors/<int:id>', AuthorView.author_detail.as_view()),
    path('publishers/', PublisherView.publisher_list.as_view()),
    path('publishers/<int:id>', PublisherView.publisher_detail.as_view()),
    path('published_books/', PublisherView.published_books_list.as_view()),
    path('books/avr-books/', PublisherView.AuthorsByAvrBooks.as_view()),
    path('books/book-sorted/', PublisherView.BooksByNrOfBooksByAuthors.as_view()),
    path('publishers/<int:id>/books/', PublisherView.AddBookListToPublisher.as_view()),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path('schema/swagger-ui/',
         SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # Redoc UI:

    # path('swagger/schema/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-schema')

]

urlpatterns = format_suffix_patterns(urlpatterns)
