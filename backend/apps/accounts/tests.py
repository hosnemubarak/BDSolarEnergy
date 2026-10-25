import uuid
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import CustomerAddress

User = get_user_model()


class AccountsJWTTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='tanvir_customer',
            email='tanvir@example.com',
            phone='+8801712345678',
            password='Password123!',
            first_name='Tanvir',
            last_name='Hossain'
        )

    def test_user_has_uuid_primary_key(self):
        self.assertIsInstance(self.user.id, uuid.UUID)

    def test_user_registration(self):
        payload = {
            'username': 'new_customer',
            'email': 'new@example.com',
            'phone': '+8801912345678',
            'password': 'SecurePassword123!',
            'confirmPassword': 'SecurePassword123!',
            'first_name': 'New',
            'last_name': 'User'
        }
        response = self.client.post('/api/v1/auth/register/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('tokens', response.data)
        self.assertIn('access', response.data['tokens'])
        self.assertIn('refresh', response.data['tokens'])
        self.assertTrue(User.objects.filter(email='new@example.com').exists())

    def test_user_login_jwt(self):
        payload = {
            'username': 'tanvir_customer',
            'password': 'Password123!'
        }
        response = self.client.post('/api/v1/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        # Test authenticated me endpoint
        access_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        me_resp = self.client.get('/api/v1/auth/me/')
        self.assertEqual(me_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(me_resp.data['email'], 'tanvir@example.com')

    def test_customer_addresses(self):
        self.client.force_authenticate(user=self.user)
        payload = {
            'full_name': 'Tanvir Hossain',
            'phone': '+8801712345678',
            'division': 'Dhaka',
            'district': 'Dhaka',
            'thana_area': 'Dhanmondi',
            'full_address': 'Road 27, House 42',
            'postal_code': '1209',
            'is_default': True
        }
        res = self.client.post('/api/v1/auth/addresses/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertIsInstance(uuid.UUID(res.data['id']), uuid.UUID)

        # Verify default address single constraint
        payload2 = {
            'full_name': 'Tanvir Office',
            'phone': '+8801712345678',
            'division': 'Dhaka',
            'district': 'Dhaka',
            'thana_area': 'Gulshan',
            'full_address': 'Road 11',
            'is_default': True
        }
        res2 = self.client.post('/api/v1/auth/addresses/', payload2, format='json')
        self.assertEqual(res2.status_code, status.HTTP_201_CREATED)

        # Check only one default address
        self.assertEqual(CustomerAddress.objects.filter(user=self.user, is_default=True).count(), 1)

    def test_token_refresh_and_logout(self):
        login_res = self.client.post('/api/v1/auth/login/', {
            'username': 'tanvir_customer',
            'password': 'Password123!'
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        refresh_token = login_res.data['refresh']

        # Refresh token
        refresh_res = self.client.post('/api/v1/auth/token/refresh/', {
            'refresh': refresh_token
        }, format='json')
        self.assertEqual(refresh_res.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_res.data)
        new_refresh = refresh_res.data.get('refresh', refresh_token)

        # Blacklist / Logout
        logout_res = self.client.post('/api/v1/auth/logout/', {
            'refresh': new_refresh
        }, format='json')
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)

        # Attempting to refresh blacklisted token should fail with 401
        failed_refresh = self.client.post('/api/v1/auth/token/refresh/', {
            'refresh': new_refresh
        }, format='json')
        self.assertEqual(failed_refresh.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password(self):
        self.client.force_authenticate(user=self.user)
        res = self.client.post('/api/v1/auth/change-password/', {
            'old_password': 'Password123!',
            'new_password': 'BrandNewPassword456!',
            'confirm_password': 'BrandNewPassword456!'
        }, format='json')
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        # Login with new password
        self.client.force_authenticate(user=None)
        login_res = self.client.post('/api/v1/auth/login/', {
            'username': 'tanvir_customer',
            'password': 'BrandNewPassword456!'
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
