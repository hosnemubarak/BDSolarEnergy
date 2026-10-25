import uuid
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.categories.models import Category
from apps.brands.models import Brand
from apps.products.models import Product
from apps.wishlist.models import Wishlist, WishlistItem

User = get_user_model()


class WishlistTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='wishlist_user',
            email='wishlist@example.com',
            password='Password123!'
        )
        self.category = Category.objects.create(name='Batteries', slug='batteries')
        self.brand = Brand.objects.create(name='Pylontech', slug='pylontech')
        self.product = Product.objects.create(
            name='US5000 Lithium Battery',
            slug='us5000-lithium-battery',
            sku='BAT-PYL-01',
            price=175000.00,
            category=self.category,
            brand=self.brand,
            stock=15
        )

    def test_wishlist_has_uuid_primary_key(self):
        wishlist = Wishlist.objects.create(user=self.user)
        self.assertIsInstance(wishlist.id, uuid.UUID)

    def test_wishlist_toggle_and_delete(self):
        self.client.force_authenticate(user=self.user)

        # Toggle product (Add)
        res = self.client.post('/api/v1/wishlist/', {'productId': str(self.product.id)}, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['added'])
        self.assertEqual(len(res.data['wishlist']['items']), 1)

        item_id = res.data['wishlist']['items'][0]['id']
        self.assertIsInstance(uuid.UUID(item_id), uuid.UUID)

        # Toggle product again (Remove)
        res2 = self.client.post('/api/v1/wishlist/', {'productId': str(self.product.id)}, format='json')
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertFalse(res2.data['added'])
        self.assertEqual(len(res2.data['wishlist']['items']), 0)

        # Add again and delete by item_id
        res3 = self.client.post('/api/v1/wishlist/', {'productId': self.product.slug}, format='json')
        self.assertTrue(res3.data['added'])
        new_item_id = res3.data['wishlist']['items'][0]['id']

        del_res = self.client.delete(f'/api/v1/wishlist/{new_item_id}/')
        self.assertEqual(del_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(del_res.data['items']), 0)
