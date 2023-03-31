from django.test import TestCase
from unittest import mock
from Lab_1.models import Book, Author
from Lab_1.serializers import AuthorSerializer
from rest_framework.test import APIRequestFactory, APITestCase, APIClient


class AvrBooksTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        author = Author.objects.create(first_name='a', last_name='a', nationality='Russian', books_sold='1', DOB='2222-2-2')
        author2 = Author.objects.create(first_name='b', last_name='b', nationality='American', books_sold='5',
                                        DOB='2222-2-2')
        author3 = Author.objects.create(first_name='b', last_name='b', nationality='Russian', books_sold='1',
                                       DOB='2222-2-2')
        for book_id in range(5):
            Book.objects.create(name=f'book_{book_id}', author=author, description='adf', copies_sold=book_id * 10,
                                publication_date='1922-2-2')

        for book_id in range(5, 10):
            Book.objects.create(name=f'book_{book_id}', author=author2, description='adf', copies_sold=book_id * 10,
                                publication_date='1922-2-2')

        Book.objects.create(name=f'book_{book_id}', author=author3, description='adf', copies_sold=0,
                                publication_date='1922-2-2')

    def test_url_exists(self):
        response = self.client.get("/books/avr-books/")

        self.assertEqual(response.status_code, 200)

    def test_count_correctly_returned(self):
        response = self.client.get("/books/avr-books/")
        self.assertEqual(len(response.data), 1)
