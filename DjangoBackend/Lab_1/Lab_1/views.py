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


@api_view(['GET', 'POST'])
def author_list(request, format=None):

    if request.method == 'GET':
        authors = Author.objects.all()
        authorSerializer = AuthorSerializer(authors, many=True)

        return Response(authorSerializer.data)

    elif request.method == 'POST':
        authorSerializer = AuthorSerializer(data=request.data)
        if authorSerializer.is_valid():
            authorSerializer.save()
            return Response(authorSerializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PUT', 'DELETE'])
def author_detail(request, id, format=None):

    try:
        author = Author.objects.get(pk=id)
    except Author.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


    if request.method == 'GET':
        authorSerializer = AuthorBooksSerializer(author)
        return Response(authorSerializer.data)
    elif request.method == 'PUT':
        authorSerializer = AuthorSerializer(author, data=request.data)
        if authorSerializer.is_valid():
            authorSerializer.save()
            return Response(authorSerializer.data)
        return Response(authorSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        author.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



@api_view(['GET', 'POST'])
def publisher_list(request, format=None):

    if request.method == 'GET':
        publishers = Publisher.objects.all()
        publisherSerializer =  PublisherSerializer(publishers, many=True)

        return Response(publisherSerializer.data)

    elif request.method == 'POST':
        publisherSerializer = PublisherSerializer(data=request.data)
        if publisherSerializer.is_valid():
            publisherSerializer.save()
            return Response(publisherSerializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET', 'PUT', 'DELETE'])
def publisher_detail(request, id, format=None):

    try:
        publisher = Publisher.objects.get(pk=id)
    except Publisher.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


    if request.method == 'GET':
        publisherSerializer = PublisherDetailSerializer(publisher)
        return Response(publisherSerializer.data)
    elif request.method == 'PUT':
        publisherSerializer = PublisherDetailSerializer(publisher, data=request.data)
        if publisherSerializer.is_valid():
            publisherSerializer.save()
            return Response(publisherSerializer.data)
        return Response(publisherSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        publisher.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class book_list(APIView):
    def get(self, request, format=None):
        books = Book.objects.all()
        min_copies_sold = self.request.query_params.get('min_copies_sold')
        if min_copies_sold is not None:
            books = books.filter(copies_sold__gt=min_copies_sold)
        bookSerializer = BookSerializer(books, many=True)
        return Response(bookSerializer.data)

    def post(self, request, format=None):
        bookSerializer = BookSerializer(data=request.data)
        if bookSerializer.is_valid():
            bookSerializer.save()
            return Response(bookSerializer.data, status=status.HTTP_201_CREATED)

class book_detail(APIView):
    def get_book_by_id(self, id):
        try:
            return Book.objects.get(pk=id)
        except Book.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get(self, request, id, format=None):
        book = self.get_book_by_id(id)
        bookSerializer = BooksWithAuthorSerializer(book)
        return Response(bookSerializer.data)

    def put(self, request, id, format=None):
        book = self.get_book_by_id(id)
        bookSerializer = BookSerializer(book, data=request.data)
        if bookSerializer.is_valid():
            bookSerializer.save()
            return Response(bookSerializer.data)
        return Response(bookSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id, format=None):
        book = self.get_book_by_id(id)
        book.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class published_books_list(APIView):
    def get(self, request, format=None):
        books = PublishedBooks.objects.all()
        published_books_list = PublishedBooksSerializer(books, many=True)
        return Response(published_books_list.data)

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
        serializers=PublishedBooksSerializer(newitems, many=True)
        return Response(serializers.data)
