from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenVerifyView

from .views import (
    CustomRegisterView,
    CustomLoginView,
    CustomLogoutView,
    CustomUserDetailsView,
    CustomPasswordChangeView,
    CustomTokenRefreshView,
    GoogleLogin,
    CustomerAddressViewSet,
)

router = DefaultRouter()
router.register(r'addresses', CustomerAddressViewSet, basename='customer-address')

urlpatterns = [
    # Core Package-Based REST Authentication
    path('register/', CustomRegisterView.as_view(), name='auth-register'),
    path('registration/', CustomRegisterView.as_view(), name='rest-register'),
    path('login/', CustomLoginView.as_view(), name='auth-login'),
    path('logout/', CustomLogoutView.as_view(), name='auth-logout'),
    path('user/', CustomUserDetailsView.as_view(), name='auth-user'),
    path('me/', CustomUserDetailsView.as_view(), name='auth-me'),

    # Token Lifecycle Management
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token-refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token-verify'),

    # Password Management
    path('password/change/', CustomPasswordChangeView.as_view(), name='auth-password-change'),
    path('change-password/', CustomPasswordChangeView.as_view(), name='auth-change-password'),

    # Social Authentication (Google OAuth2 ready)
    path('google/', GoogleLogin.as_view(), name='auth-google'),

    # Include full dj-rest-auth URLs for password reset / standard endpoints
    path('', include('dj_rest_auth.urls')),

    # Customer addresses API
    path('', include(router.urls)),
]
