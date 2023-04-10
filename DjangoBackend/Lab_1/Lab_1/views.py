import openapi_codec
from django.http import JsonResponse
from django.db.models import Avg, Sum, Count
from .models import Book, Author, Publisher, PublishedBooks
from .serializers import BookSerializer, AuthorSerializer, PublisherSerializer, AuthorBooksSerializer,BooksWithAuthorSerializer, PublishedBooksSerializer, PublisherDetailSerializer, PublishedBooksSerializerWithJustId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

