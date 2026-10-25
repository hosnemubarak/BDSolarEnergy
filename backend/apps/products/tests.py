import uuid
from decimal import Decimal
from django.test import TestCase
from django.db import IntegrityError
from rest_framework.test import APIClient
from rest_framework import status
from apps.categories.models import Category
from apps.brands.models import Brand
from apps.products.models import Product


class ProductAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name='Solar Panels',
            slug='solar-panels'
        )
        self.brand = Brand.objects.create(
            name='Trina Solar',
            slug='trina-solar'
        )
        self.product = Product.objects.create(
            legacy_id='prod-sp-01',
            name='Trina Solar Vertex S+ 585W',
            slug='trina-solar-vertex-s-plus-585w',
            sku='TS-585',
            description='Test panel description',
            price=Decimal('18500.00'),
            original_price=Decimal('20000.00'),
            category=self.category,
            brand=self.brand,
            stock=15,
            rating=Decimal('4.90'),
            is_featured=True,
            is_active=True
        )

    def test_product_has_native_uuid_primary_key(self):
        self.assertIsInstance(self.product.id, uuid.UUID)

    def test_list_products(self):
        response = self.client.get('/api/v1/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        results = response.data.get('results', response.data)
        self.assertGreaterEqual(len(results), 1)
        self.assertEqual(results[0]['slug'], 'trina-solar-vertex-s-plus-585w')

    def test_get_product_by_slug(self):
        response = self.client.get(f'/api/v1/products/{self.product.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Trina Solar Vertex S+ 585W')
        self.assertEqual(response.data['price'], 18500.00)

    def test_get_product_by_legacy_id(self):
        response = self.client.get('/api/v1/products/prod-sp-01/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], str(self.product.id))

    def test_get_product_by_uuid(self):
        response = self.client.get(f'/api/v1/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['slug'], self.product.slug)

    def test_featured_products(self):
        response = self.client.get('/api/v1/products/featured/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_live_search(self):
        response = self.client.get('/api/v1/products/live-search/?q=Vertex')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], self.product.slug)
