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
    num_published = serializers.IntegerField(read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'name', 'description',  'copies_sold', 'publication_date', 'author', 'num_published']

    def validate(self,data):
        author_id = data.get('author')
        publication_date = data.get('publication_date')
        if author_id.DOB > publication_date:
            raise serializers.ValidationError('Publication year cannot be earlier than the date of birth of the author')
        if publication_date.year > 2023:
            raise serializers.ValidationError('Year cannot be earlier than current year.')
        return data

class AuthorSerializer(DynamicFieldsModelSerializer):
    num_book = serializers.IntegerField(read_only=True)
    class Meta:
        model = Author
        fields = ['id', 'first_name', 'last_name', 'description',  'books_sold', 'DOB', 'nationality', 'num_book']

    def validate(self,data):
        DOB = data.get('DOB')
        if DOB.year > 2023:
            raise serializers.ValidationError('Year cannot be earlier than current year.')
        return data


class PublisherSerializer(DynamicFieldsModelSerializer):
    num_published = serializers.IntegerField(read_only=True)

    class Meta:
        model = Publisher
        fields = ['id','name', 'headquarter', 'established', 'description', 'total_copies_sold', 'books', 'num_published']

    def validate(self,data):
        estab = data.get('established')
        if estab.year > 2023:
            raise serializers.ValidationError('Year cannot be earlier than current year.')
        return data

class AuthorBooksSerializer(DynamicFieldsModelSerializer):
    books = BookSerializer(many=True, read_only=True, fields=('id', 'name', 'description',  'copies_sold', 'publication_date'))

    class Meta:
        model = Author
        fields = '__all__'



class PublishedBooksSerializer(DynamicFieldsModelSerializer):
    # book = serializers.PrimaryKeyRelatedField(queryset=Book.objects.all())
    # publisher = serializers.PrimaryKeyRelatedField(queryset=Publisher.objects.all())
    book = BookSerializer(read_only=True)
    publisher = PublisherSerializer(read_only=True, fields=('id', 'name', 'headquarter', 'established', 'description', 'total_copies_sold'))
    class Meta:
        model = PublishedBooks
        fields = ['year', 'price', 'book', 'publisher']
        # depth = 1

class PublishedBooksDetailSerializer(DynamicFieldsModelSerializer):
    book = BookSerializer(many=False, read_only=True, fields=('name', 'description', 'copies_sold', 'publication_date'))
    publisher = PublisherSerializer(many=False, read_only=True, fields=('name', 'headquarter', 'established', 'description', 'total_copies_sold'))
    class Meta:
        model = PublishedBooks
        fields = ['year', 'price', 'book', 'publisher']



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
    publishing_details = PublishedBooksSerializer(source="publishers", many=True, fields=('year', 'price', 'book'), read_only=True)
    # print(publishing_details)
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
