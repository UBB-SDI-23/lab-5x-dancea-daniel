import openapi_codec
from django.http import JsonResponse
from django.db.models import Avg, Sum, Count
from Lab_1.models import Book, Author, Publisher, PublishedBooks
from Lab_1.serializers import BookSerializer, AuthorSerializer, PublisherSerializer, AuthorBooksSerializer,BooksWithAuthorSerializer, PublishedBooksSerializer, PublisherDetailSerializer, PublishedBooksSerializerWithJustId
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from django.core.paginator import Paginator

class book_list(APIView):
    @extend_schema(request=None, responses=BookSerializer)
    def get(self, request, format=None):
        books = Book.objects.all()

        paginator = Paginator(books, 100)  # 10 objects per page
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        # serialize the paginated objects
        serializer = BookSerializer(page_obj, many=True)


        min_copies_sold = self.request.query_params.get('min_copies_sold')
        if min_copies_sold is not None:
            books = books.filter(copies_sold__gt=min_copies_sold)
        bookSerializer = BookSerializer(books, many=True)
        # return Response(bookSerializer.data)
        return Response(serializer.data)

    @extend_schema(request=None, responses=BookSerializer)
    def post(self, request, format=None):
        bookSerializer = BookSerializer(data=request.data)
        print("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaa")
        print(bookSerializer)
        if bookSerializer.is_valid():
            bookSerializer.save()
            return Response(bookSerializer.data, status=status.HTTP_201_CREATED)


class book_detail(APIView):
    def get_book_by_id(self, id):
        try:
            return Book.objects.get(pk=id)
        except Book.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @extend_schema(request=None, responses=BooksWithAuthorSerializer)
    def get(self, request, id, format=None):
        book = self.get_book_by_id(id)
        bookSerializer = BooksWithAuthorSerializer(book)
        return Response(bookSerializer.data)

    @extend_schema(request=None, responses=BookSerializer)
    def put(self, request, id, format=None):
        book = self.get_book_by_id(id)
        bookSerializer = BookSerializer(book, data=request.data)
        if bookSerializer.is_valid():
            bookSerializer.save()
            return Response(bookSerializer.data)
        return Response(bookSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=None, responses=BookSerializer)
    def delete(self, request, id, format=None):
        book = self.get_book_by_id(id)
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


