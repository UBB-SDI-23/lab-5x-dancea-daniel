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
from django.db.models import Q


class author_list(APIView):
    @extend_schema(request=None, responses=AuthorSerializer)
    def get(self, request, format=None):
        # authors = Author.objects.all().order_by('id')
        authors = Author.objects.annotate(num_book=Count('books')).order_by('id')
        paginator = Paginator(authors, 10)
        page_number = request.GET.get('page')
        page_obj = paginator.get_page(page_number)
        serializer = AuthorSerializer(page_obj, many=True)

        return Response(serializer.data)


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
        authorSerializer = AuthorBooksSerializer(author)
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

class AuthorsAutoComple(APIView):
    @extend_schema(request=None, responses=AuthorSerializer)
    def get(self, request):
        query = request.query_params.get('query', None)
        if query:
            authors = Author.objects.filter(Q(first_name__icontains=query) | Q(last_name__icontains=query) | Q(
                first_name__icontains=query.split()[0], last_name__icontains=query.split()[-1]) | Q(
                first_name__icontains=query.split()[-1], last_name__icontains=query.split()[0]))[:10]
        else:
            authors = Author.objects.all()[:10]

        serialized_authors = AuthorSerializer(authors, many=True)
        return Response(serialized_authors.data)