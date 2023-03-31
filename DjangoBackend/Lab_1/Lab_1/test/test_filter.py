from django.test import TestCase
from unittest import mock

from Lab_1.models import Book, Author
from Lab_1.serializers import BookSerializer
from rest_framework.test import APIRequestFactory, APITestCase, APIClient


class BooksSoldTest(APITestCase):
    @classmethod
    def setUpTestData(cls):
        author = Author.objects.create(first_name='a', last_name='a', nationality='a', books_sold='1', DOB='2222-2-2')
        for book_id in range(5):
            Book.objects.create(name=f'book_{book_id}', author=author, description='adf', copies_sold=book_id*10, publication_date='1922-2-2')

    def test_url_exists(self):
        response = self.client.get("/books/?min_copies_sold=29")

        self.assertEqual(response.status_code, 200)

    def test_count_correctly_returned(self):
        response = self.client.get("/books/?min_copies_sold=29")
        self.assertEqual(len(response.data), 2)