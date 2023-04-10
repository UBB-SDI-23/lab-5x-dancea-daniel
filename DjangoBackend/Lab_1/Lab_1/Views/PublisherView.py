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




class publisher_list(APIView):
    @extend_schema(request=None, responses=PublisherSerializer)
    def get(self, request):
        publishers = Publisher.objects.all()[:100]
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
