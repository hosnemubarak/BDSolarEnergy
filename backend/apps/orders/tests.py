import uuid
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.categories.models import Category
from apps.brands.models import Brand
from apps.products.models import Product
from apps.orders.models import Order

User = get_user_model()


class OrderAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_a = User.objects.create_user(
            username='customer_a',
            email='a@example.com',
            password='Password123!'
        )
        self.user_b = User.objects.create_user(
            username='customer_b',
            email='b@example.com',
            password='Password123!'
        )
        self.category = Category.objects.create(name='Solar Panels', slug='solar-panels')
        self.brand = Brand.objects.create(name='Trina Solar', slug='trina-solar')
        self.product = Product.objects.create(
            legacy_id='prod-sp-01',
            name='Trina Solar Vertex S+ 585W',
            slug='trina-solar-vertex-s-plus-585w',
            sku='TS-585',
            description='Test panel description',
            price=Decimal('18500.00'),
            category=self.category,
            brand=self.brand,
            stock=10,
            is_active=True
        )

    def test_order_has_uuid_primary_key(self):
        order = Order.objects.create(
            order_number='BDS-TEST-001',
            full_name='Test',
            phone='01700000000',
            division='Dhaka',
            district='Dhaka',
            thana_area='Dhanmondi',
            full_address='House 1',
            subtotal=Decimal('1000.00'),
            total=Decimal('1000.00')
        )
        self.assertIsInstance(order.id, uuid.UUID)

    def test_create_order_recalculates_price_and_decrements_stock(self):
        payload = {
            'fullName': 'Md. Tanvir Hossain',
            'phone': '+880 1712-345678',
            'division': 'Dhaka',
            'district': 'Dhaka',
            'thanaArea': 'Dhanmondi',
            'fullAddress': 'House 12, Road 5',
            'paymentMethod': 'COD',
            'items': [
                {
                    'productId': 'prod-sp-01',
                    'quantity': 2
                }
            ]
        }

        response = self.client.post('/api/v1/orders/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['orderNumber'].startswith('BDS-'))
        self.assertEqual(response.data['subtotal'], 37000.00)
        self.assertEqual(response.data['total'], 37000.00)
        self.assertEqual(response.data['shippingFee'], 0.00)

        # Check product stock decremented
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 8)

    def test_insufficient_stock_fails_order(self):
        payload = {
            'fullName': 'Md. Tanvir Hossain',
            'phone': '+880 1712-345678',
            'division': 'Dhaka',
            'district': 'Dhaka',
            'thanaArea': 'Dhanmondi',
            'fullAddress': 'House 12, Road 5',
            'paymentMethod': 'COD',
            'items': [
                {
                    'productId': 'prod-sp-01',
                    'quantity': 50  # Only 10 available
                }
            ]
        }

        response = self.client.post('/api/v1/orders/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 10)

    def test_customer_isolation_and_order_ownership(self):
        # Create order for user A
        order_a = Order.objects.create(
            order_number='BDS-A-100',
            user=self.user_a,
            full_name='Customer A',
            phone='01700000001',
            division='Dhaka',
            district='Dhaka',
            thana_area='Dhanmondi',
            full_address='House A',
            subtotal=Decimal('5000.00'),
            total=Decimal('5000.00')
        )

        # Create order for user B
        order_b = Order.objects.create(
            order_number='BDS-B-200',
            user=self.user_b,
            full_name='Customer B',
            phone='01700000002',
            division='Chittagong',
            district='Chittagong',
            thana_area='Pahartali',
            full_address='House B',
            subtotal=Decimal('7000.00'),
            total=Decimal('7000.00')
        )

        # Authenticate as User A
        self.client.force_authenticate(user=self.user_a)
        res = self.client.get('/api/v1/orders/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        order_numbers = [o['orderNumber'] for o in res.data['results']]
        self.assertIn('BDS-A-100', order_numbers)
        self.assertNotIn('BDS-B-200', order_numbers)  # Customer B's order is hidden!

        # Try to retrieve User B's order directly by order_number
        res_direct = self.client.get('/api/v1/orders/BDS-B-200/')
        self.assertEqual(res_direct.status_code, status.HTTP_404_NOT_FOUND)

    def test_anonymous_user_cannot_list_all_orders(self):
        self.client.force_authenticate(user=None)
        res = self.client.get('/api/v1/orders/')
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)
