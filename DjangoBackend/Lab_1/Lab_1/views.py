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



class book_list(APIView):
    @extend_schema(request=None, responses=BookSerializer)
    def get(self, request, format=None):
        books = Book.objects.all()
        min_copies_sold = self.request.query_params.get('min_copies_sold')
        if min_copies_sold is not None:
            books = books.filter(copies_sold__gt=min_copies_sold)
        bookSerializer = BookSerializer(books, many=True)
        return Response(bookSerializer.data)

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


class author_list(APIView):
    @extend_schema(request=None, responses=AuthorSerializer)
    def get(self, request, format=None):
        authors = Author.objects.all()
        author_serializer = AuthorSerializer(authors, many=True)

        return Response(author_serializer.data)

    @extend_schema(request=None, responses=AuthorSerializer)
    def post(self, request, format=None):
        author_serializer = AuthorSerializer(data=request.data)
        if author_serializer.is_valid():
            author_serializer.save()
            return Response(author_serializer.data, status=status.HTTP_201_CREATED)


class author_detail(APIView):
    def get_author_by_id(self, id):
        try:
            return Author.objects.get(pk=id)
        except Author.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @extend_schema(request=None, responses=AuthorSerializer)
    def get(self, request, id, format=None):
        author = self.get_author_by_id(id)
        authorSerializer = AuthorSerializer(author)
        return Response(authorSerializer.data)

    @extend_schema(request=None, responses=AuthorSerializer)
    def put(self, request, id, format=None):
        author = self.get_author_by_id(id)
        authorSerializer = AuthorSerializer(author, data=request.data)
        if authorSerializer.is_valid():
            authorSerializer.save()
            return Response(authorSerializer.data)
        return Response(authorSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=None, responses=AuthorSerializer)
    def delete(self, request, id, format=None):
        author = self.get_author_by_id(id)
        author.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class publisher_list(APIView):
    @extend_schema(request=None, responses=PublisherSerializer)
    def get(self, request):
        publishers = Publisher.objects.all()
        publisherSerializer = PublisherSerializer(publishers, many=True)

        return Response(publisherSerializer.data)

    @extend_schema(request=None, responses=PublisherSerializer)
    def post(self, request):
        publisherSerializer = PublisherSerializer(data=request.data)
        if publisherSerializer.is_valid():
            publisherSerializer.save()
            return Response(publisherSerializer.data, status=status.HTTP_201_CREATED)


class publisher_detail(APIView):
    def get_publisher_by_id(self, id):
        try:
            return Publisher.objects.get(pk=id)
        except Publisher.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @extend_schema(request=None, responses=PublisherSerializer)
    def get(self, request, id, format=None):
        publisher = self.get_publisher_by_id(id)
        publisherSerializer = PublisherDetailSerializer(publisher)
        return Response(publisherSerializer.data)

    @extend_schema(request=None, responses=PublisherSerializer)
    def put(self, request, id, format=None):
        publisher = self.get_publisher_by_id(id)
        publisherSerializer = PublisherDetailSerializer(publisher, data=request.data)
        if publisherSerializer.is_valid():
            publisherSerializer.save()
            return Response(publisherSerializer.data)
        return Response(publisherSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=None, responses=PublisherSerializer)
    def delete(self, request, id, format=None):
        publisher = self.get_publisher_by_id(id)
        publisher.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class published_books_list(APIView):
    @extend_schema(request=None, responses=PublishedBooksSerializer)
    def get(self, request, format=None):
        books = PublishedBooks.objects.all()
        published_books_list = PublishedBooksSerializer(books, many=True)
        return Response(published_books_list.data)

    @extend_schema(request=None, responses=PublishedBooksSerializerWithJustId)
    def post(self, request, format=None):
        published_books_list = PublishedBooksSerializerWithJustId(data=request.data)
        if published_books_list.is_valid():
            print("idk i suppose its validated")
            published_books_list.save()
            return Response(published_books_list.data, status=status.HTTP_201_CREATED)


class AuthorsByAvrBooks(APIView):
    def get(self, request, format=None):
        query1 = Author.objects.\
            filter(nationality='Russian').\
            values().annotate(books_in_the_db=Count('books')).\
            filter(books_in_the_db__gt=1).\
            order_by('books_sold')
        return Response(query1)


class BooksByNrOfBooksByAuthors(APIView):
    def get(self, request, format=None):
        # querry = Book.objects.values().annotate(book_by_same=Count('publisher__books')-Count(publisher__books__id)).order_by('-book_by_same')
        querry = Book.objects.values().annotate(boo=Count('publisher__id')).annotate(bo=Count('publisher__books__id'))
        q = Book.objects.values().annotate(bb=Count('publisher__id'))
        return Response(querry.values())


class AddBookListToPublisher(APIView):
    def get_publisher_by_id(self, id):
        try:
            return Publisher.objects.get(pk=id)
        except Publisher.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @extend_schema(request=None, responses=PublishedBooksSerializerWithJustId)
    def post(self, request, id, format=None):
        publisherObj = self.get_publisher_by_id(id)
        data = request.data
        newitems=[]
        for item in data:
            book_id = item.get('book')
            year = item.get('year')
            price = item.get('price')
            newPublishedBook=PublishedBooks.objects.create(
                year=year,
                price=price,
                publisher=publisherObj,
                book=Book.objects.get(id=book_id)
            )
            newPublishedBook.save()
            newitems.append(newPublishedBook)
        serializers=PublishedBooksSerializerWithJustId(newitems, many=True)
        return Response(serializers.data)
