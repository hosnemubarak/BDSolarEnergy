import uuid
from decimal import Decimal
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from apps.categories.models import Category
from apps.brands.models import Brand
from apps.products.models import Product
from apps.cart.models import Cart


class CartAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name='Inverters', slug='solar-inverters')
        self.brand = Brand.objects.create(name='Growatt', slug='growatt')
        self.product = Product.objects.create(
            legacy_id='prod-inv-01',
            name='Growatt 5kW Hybrid Inverter',
            slug='growatt-5kw-hybrid-inverter',
            sku='GW-SPF-5000ES',
            description='Growatt off-grid hybrid inverter',
            price=Decimal('82000.00'),
            category=self.category,
            brand=self.brand,
            stock=5,
            is_active=True
        )

    def test_add_item_to_cart(self):
        payload = {
            'productId': str(self.product.id),
            'quantity': 2
        }
        response = self.client.post('/api/v1/cart/items/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['totalItems'], 2)
        # 82000 * 2 = 164000
        self.assertEqual(response.data['subtotal'], 164000.00)

    def test_add_exceeding_stock_rejected(self):
        payload = {
            'productId': str(self.product.id),
            'quantity': 10  # Only 5 in stock
        }
        response = self.client.post('/api/v1/cart/items/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('Insufficient stock', response.data['detail'])

    def test_get_cart_and_clear(self):
        # Add item first
        self.client.post('/api/v1/cart/items/', {'productId': 'prod-inv-01', 'quantity': 1}, format='json')
        
        get_res = self.client.get('/api/v1/cart/')
        self.assertEqual(get_res.status_code, status.HTTP_200_OK)
        self.assertEqual(get_res.data['totalItems'], 1)

        # Clear cart
        del_res = self.client.delete('/api/v1/cart/')
        self.assertEqual(del_res.status_code, status.HTTP_204_NO_CONTENT)

        # Re-check
        check_res = self.client.get('/api/v1/cart/')
        self.assertEqual(check_res.data['totalItems'], 0)
