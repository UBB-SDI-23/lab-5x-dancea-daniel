from django.contrib.auth.models import User, Group
from .models import Book, Author, Publisher, PublishedBooks
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)

class BookSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class AuthorSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'

    def validate(self,data):
        DOB = data.get('DOB')
        if DOB.year > 2022:
            raise serializers.ValidationError('Year cannot be earlier than current year.')
        return data


class PublisherSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = Publisher
        fields = ['id','name', 'headquarter', 'established', 'description', 'total_copies_sold', 'books']


class AuthorBooksSerializer(DynamicFieldsModelSerializer):
    books = BookSerializer(many=True, read_only=True, fields=('name', 'description',  'copies_sold', 'publication_date'))

    class Meta:
        model = Author
        fields = ['first_name', 'last_name', 'DOB', 'nationality', 'books_sold', 'books']



class PublishedBooksSerializer(DynamicFieldsModelSerializer):
    # book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())
    # publisher = serializers.PrimaryKeyRelatedField(queryset=Publisher.objects.all())
    book = BookSerializer(read_only=True)
    publisher = PublisherSerializer(read_only=True, fields=('name', 'headquarter', 'established', 'description', 'total_copies_sold'))
    class Meta:
        model = PublishedBooks
        fields = ['year', 'price', 'book', 'publisher']
        # depth = 1



class PublishedBooksSerializerWithJustId(DynamicFieldsModelSerializer):
    book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())
    publisher = serializers.PrimaryKeyRelatedField(queryset=Publisher.objects.all())
    # book = BookSerializer(read_only=True)
    # publisher = PublisherSerializer(read_only=True, fields=('name', 'headquarter', 'established', 'description', 'total_copies_sold'))
    class Meta:
        model = PublishedBooks
        fields = ['year', 'price', 'book', 'publisher']
        # depth = 1

    def validate(self, data):
        book = data.get('book')
        year = data.get('year')
        if book and year and book.publication_date.year > year:
            raise serializers.ValidationError('Year cannot be earlier than book publication year.')
        return data



class PublisherDetailSerializer(DynamicFieldsModelSerializer):
    # books = BookSerializer(many=True, read_only=True, fields=('id', 'name'))

    # books = serializers.SerializerMethodField()
    publishing_details = PublishedBooksSerializer(source="publishers", many=True, fields=('year', 'price', 'book'))
    print(publishing_details)
    #
    # def get_books(self, obj):
    #     data = BookSerializer(obj.books.all(), many=True).data
    #     return data

    class Meta:
        model = Publisher
        fields = ['id', 'name', 'headquarter', 'established', 'description', 'total_copies_sold', 'publishing_details']


class BooksWithAuthorSerializer(DynamicFieldsModelSerializer):
    author = AuthorSerializer(read_only=True)
    published_in = PublishedBooksSerializer(source="books", many=True, fields=('publisher', 'year', 'price'))
    class Meta:
        model = Book
        fields = ['id', 'name', 'author', 'description', 'copies_sold', 'publication_date', 'published_in']
