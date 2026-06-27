from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from storeapp.models import Cart


class CreateCartTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_cart_persists_cart_and_returns_cart_code(self):
        response = self.client.post(reverse("create_cart"))

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["cart_code"])
        self.assertTrue(Cart.objects.filter(cart_code=response.data["cart_code"]).exists())
