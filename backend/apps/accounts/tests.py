import uuid
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.accounts.models import CustomerAddress

User = get_user_model()


class AccountsPackageAuthTestCase(TestCase):
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

        self.other_user = User.objects.create_user(
            username='other_customer',
            email='other@example.com',
            phone='+8801812345678',
            password='Password123!',
            first_name='Other',
            last_name='Customer'
        )

    def test_user_has_uuid_primary_key(self):
        self.assertIsInstance(self.user.id, uuid.UUID)

    def test_user_registration_success(self):
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
        self.assertIn('access', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'new@example.com')
        self.assertTrue(User.objects.filter(email='new@example.com').exists())

    def test_registration_security_cannot_elevate_privileges(self):
        # Attempt to register with privileged roles in payload
        payload = {
            'username': 'attacker_user',
            'email': 'attacker@example.com',
            'phone': '+8801999999999',
            'password': 'HackerPassword123!',
            'confirmPassword': 'HackerPassword123!',
            'role': 'admin',
            'is_staff': True,
            'is_superuser': True,
        }
        res = self.client.post('/api/v1/auth/register/', payload, format='json')
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        created_user = User.objects.get(email='attacker@example.com')
        self.assertEqual(created_user.role, 'customer')
        self.assertFalse(created_user.is_staff)
        self.assertFalse(created_user.is_superuser)

    def test_user_login_via_username(self):
        payload = {
            'username': 'tanvir_customer',
            'password': 'Password123!'
        }
        response = self.client.post('/api/v1/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)
        self.assertEqual(response.data['user']['email'], 'tanvir@example.com')

    def test_user_login_via_email(self):
        payload = {
            'username': 'tanvir@example.com',
            'password': 'Password123!'
        }
        response = self.client.post('/api/v1/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user']['username'], 'tanvir_customer')

    def test_user_login_via_phone(self):
        payload = {
            'username': '+8801712345678',
            'password': 'Password123!'
        }
        response = self.client.post('/api/v1/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertEqual(response.data['user']['phone'], '+8801712345678')

    def test_invalid_credentials_rejected(self):
        payload = {
            'username': 'tanvir_customer',
            'password': 'WrongPassword999!'
        }
        response = self.client.post('/api/v1/auth/login/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_current_user_and_me_endpoints(self):
        self.client.force_authenticate(user=self.user)

        # Test /api/v1/auth/user/
        user_res = self.client.get('/api/v1/auth/user/')
        self.assertEqual(user_res.status_code, status.HTTP_200_OK)
        self.assertEqual(user_res.data['email'], 'tanvir@example.com')

        # Test /api/v1/auth/me/ alias
        me_res = self.client.get('/api/v1/auth/me/')
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data['username'], 'tanvir_customer')

    def test_profile_update_patch(self):
        self.client.force_authenticate(user=self.user)
        patch_res = self.client.patch('/api/v1/auth/me/', {
            'first_name': 'Tanvir Updated',
            'last_name': 'Hossain Senior',
            'phone': '+8801799887766'
        }, format='json')
        self.assertEqual(patch_res.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Tanvir Updated')
        self.assertEqual(self.user.phone, '+8801799887766')

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

    def test_customer_addresses_ownership_isolation(self):
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
        addr_id = res.data['id']

        # Switch to other_user and verify cannot view or edit tanvir's address
        self.client.force_authenticate(user=self.other_user)
        get_res = self.client.get(f'/api/v1/auth/addresses/{addr_id}/')
        self.assertEqual(get_res.status_code, status.HTTP_404_NOT_FOUND)

        list_res = self.client.get('/api/v1/auth/addresses/')
        items = list_res.data.get('results', list_res.data)
        self.assertEqual(len(items), 0)

    def test_google_social_login_endpoint_exists(self):
        # Empty payload should return 400 Bad Request rather than 404 Not Found
        res = self.client.post('/api/v1/auth/google/', {}, format='json')
        self.assertIn(res.status_code, [status.HTTP_400_BAD_REQUEST])
