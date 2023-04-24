import openapi_codec
from django.http import JsonResponse
from django.db.models import Avg, Sum, Count
from Lab_1.models import Book, Author, Publisher, PublishedBooks
from Lab_1.serializers import BookSerializer, AuthorSerializer, PublisherSerializer, AuthorBooksSerializer,BooksWithAuthorSerializer, PublishedBooksSerializer, PublisherDetailSerializer, PublishedBooksSerializerWithJustId, PublishedBooksDetailSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema
from django.core.paginator import Paginator


class publisher_list(APIView):
    @extend_schema(request=None, responses=PublisherSerializer)
    def get(self, request):
        # publishers = Publisher.objects.all().order_by('id')
        publishers = Publisher.objects.annotate(num_published=Count('books')).order_by('id')

        paginator = Paginator(publishers, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        serializer = PublisherSerializer(page_obj, many=True)

        return Response(serializer.data)

    @extend_schema(request=None, responses=PublisherSerializer)
    def post(self, request):
        publisherSerializer = PublisherSerializer(data=request.data)
        if publisherSerializer.is_valid():
            publisherSerializer.save()
            return Response(publisherSerializer.data, status=status.HTTP_201_CREATED)

        return Response(publisherSerializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
        published_books = PublishedBooks.objects.all().order_by('book')


        paginator = Paginator(published_books, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        serializer = PublishedBooksSerializer(page_obj, many=True)

        return Response(serializer.data)

    @extend_schema(request=None, responses=PublishedBooksSerializerWithJustId)
    def post(self, request, format=None):
        published_books_list = PublishedBooksSerializerWithJustId(data=request.data)
        if published_books_list.is_valid():
            print("idk i suppose its validated")
            published_books_list.save()
            return Response(published_books_list.data, status=status.HTTP_201_CREATED)

class published_books_detail(APIView):
    def get_publisher_by_id(self, publisherId):
        try:
            return Publisher.objects.get(pk=publisherId)
        except Publisher.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    def get_book_by_id(self, bookId):
        try:
            return Book.objects.get(pk=bookId)
        except Book.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    @extend_schema(request=None, responses=PublisherSerializer)
    def get(self, request, bookId, publisherId, format=None):
        published = PublishedBooks.objects.get(book=bookId, publisher=publisherId)
        pb = PublishedBooksDetailSerializer(published, read_only=True)
        return Response(pb.data)

    #
    @extend_schema(request=None, responses=PublishedBooksSerializerWithJustId)
    def put(self, request, bookId, publisherId, format=None):
        published = PublishedBooks.objects.get(book=bookId, publisher=publisherId)
        # publisher = self.get_publisher_by_id(publisherId)
        publisherSerializer = PublishedBooksSerializerWithJustId(published, data=request.data)
        # publisherSerializer = PublisherDetailSerializer(publisher, data=request.data)
        if publisherSerializer.is_valid():
            publisherSerializer.save()
            return Response(publisherSerializer.data)
        return Response(publisherSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @extend_schema(request=None, responses=PublisherSerializer)
    def delete(self, request, bookId, publisherId, format=None):
        published = PublishedBooks.objects.get(book=bookId, publisher=publisherId)
        published.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AuthorsByAvrBooks(APIView):
    def get(self, request, format=None):
        query1 = Author.objects.\
            filter(nationality='Hungary').\
            values().annotate(num_book=Count('books')).\
            filter(num_book__gt=1).\
            order_by('num_book')

        paginator = Paginator(query1, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        print(page_obj.object_list.values())

        serializer = AuthorSerializer(page_obj, many=True)
        return Response(serializer.data)
        # return Response(query1)


class BooksByNrOfBooksByAuthors(APIView):
    def get(self, request, format=None):
        nrOfPublications = Publisher.objects.filter(established__year__gt=1928).annotate(num_published=Count('books')).filter(num_published__gt=5).order_by('num_published')
        # print(nrOfPublications.values())
        paginator = Paginator(nrOfPublications, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        print(page_obj.object_list.values())

        serializer = PublisherSerializer(page_obj, many=True)
        return Response(serializer.data)

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


class PublishersAutoComple(APIView):
    @extend_schema(request=None, responses=PublisherSerializer)
    def get(self, request):
        query = request.query_params.get('query', None)
        if query:
            publishers = Publisher.objects.filter(name__icontains=query).order_by('name')[:10]
        else:
            publishers = Publisher.objects.all()[:10]

        serialized_publishers = PublisherSerializer(publishers, many=True)
        return Response(serialized_publishers.data)