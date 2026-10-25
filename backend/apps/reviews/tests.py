import uuid
from decimal import Decimal
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from apps.categories.models import Category
from apps.brands.models import Brand
from apps.products.models import Product
from apps.orders.models import Order, OrderItem
from apps.reviews.models import ProductReview

User = get_user_model()


class ReviewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='reviewer_user',
            email='reviewer@example.com',
            password='Password123!'
        )
        self.category = Category.objects.create(name='Inverters', slug='inverters')
        self.brand = Brand.objects.create(name='Growatt', slug='growatt')
        self.product = Product.objects.create(
            name='SPF 5000 ES Hybrid Inverter',
            slug='spf-5000-es-hybrid-inverter',
            sku='INV-GW-01',
            price=85000.00,
            category=self.category,
            brand=self.brand,
            stock=10,
            rating=Decimal('0.00'),
            review_count=0
        )

    def test_review_creation_and_rating_update(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'product': str(self.product.id),
            'rating': 5,
            'title': 'Outstanding Performance',
            'comment': 'Running my entire home smoothly. Clean sine wave output.',
            'author_name': 'Engr. Reviewer'
        }
        res = self.client.post('/api/v1/reviews/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIsInstance(uuid.UUID(res.data['id']), uuid.UUID)

        # Verify product rating recalculated
        self.product.refresh_from_db()
        self.assertEqual(self.product.rating, Decimal('5.00'))
        self.assertEqual(self.product.review_count, 1)

    def test_verified_purchase_review(self):
        # Create completed order with this product for user
        order = Order.objects.create(
            user=self.user,
            full_name='Reviewer User',
            phone='+8801700000000',
            division='Dhaka',
            district='Dhaka',
            thana_area='Mirpur',
            full_address='Mirpur 10',
            subtotal=Decimal('85000.00'),
            total=Decimal('85000.00'),
            status='delivered',
            payment_status='paid'
        )
        OrderItem.objects.create(
            order=order,
            product=self.product,
            raw_product_id=str(self.product.id),
            name=self.product.name,
            sku=self.product.sku,
            price=self.product.price,
            quantity=1,
            subtotal=self.product.price
        )

        self.client.force_authenticate(user=self.user)
        payload = {
            'product': self.product.slug,
            'rating': 4,
            'title': 'Great quality',
            'comment': 'Verified buyer feedback.',
            'author_name': 'Reviewer User'
        }
        res = self.client.post('/api/v1/reviews/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data['is_verified_purchase'])
