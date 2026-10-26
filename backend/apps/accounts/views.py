import os
import logging
from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse

from dj_rest_auth.views import (
    LoginView,
    LogoutView,
    UserDetailsView,
    PasswordChangeView,
    PasswordResetView,
    PasswordResetConfirmView,
)
from dj_rest_auth.jwt_auth import get_refresh_view
from dj_rest_auth.registration.views import RegisterView, SocialLoginView
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client

from .models import CustomerAddress
from .serializers import (
    CustomerAddressSerializer,
    UserSerializer,
    CustomRegisterSerializer,
    CustomLoginSerializer,
    CustomPasswordChangeSerializer,
)

logger = logging.getLogger(__name__)


class CustomRegisterView(RegisterView):
    """
    Register a new customer account using dj-rest-auth and django-allauth.
    Accepts customer profile attributes: name, email, phone, password.
    Returns serialized user profile and JWT tokens.
    """
    serializer_class = CustomRegisterSerializer

    @extend_schema(
        summary="Register a new customer account",
        responses={201: OpenApiResponse(description="Registration successful with user object and JWT tokens.")}
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


class CustomLoginView(LoginView):
    """
    Authenticate user and issue JWT access and refresh tokens.
    Supports login via username, email address, OR phone number.
    Sets HttpOnly JWT cookies if enabled and returns tokens in JSON.
    """
    serializer_class = CustomLoginSerializer

    @extend_schema(
        summary="Log in with username, email, or phone",
        responses={200: OpenApiResponse(description="Login successful with user profile and JWT tokens.")}
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def get_response(self):
        response = super().get_response()
        # Guarantee refresh token is present in JSON payload for API clients
        if hasattr(self, 'refresh_token') and self.refresh_token:
            if isinstance(response.data, dict) and not response.data.get('refresh'):
                response.data['refresh'] = str(self.refresh_token)
                if 'tokens' in response.data and isinstance(response.data['tokens'], dict):
                    response.data['tokens']['refresh'] = str(self.refresh_token)
        return response


class CustomTokenRefreshView(get_refresh_view()):
    """
    Refresh JWT access token and rotate refresh token.
    Reads refresh token from either HttpOnly cookie or request JSON body.
    Sets new cookies and returns refreshed tokens in JSON.
    """
    def finalize_response(self, request, response, *args, **kwargs):
        # Capture rotated refresh token before dj-rest-auth strips it for httponly
        rotated_refresh = (
            response.data.get('refresh')
            if hasattr(response, 'data') and isinstance(response.data, dict)
            else None
        )
        res = super().finalize_response(request, response, *args, **kwargs)
        if rotated_refresh and isinstance(res.data, dict) and 'refresh' not in res.data:
            res.data['refresh'] = rotated_refresh
        return res


class CustomLogoutView(LogoutView):
    """
    Log out authenticated user, revoke/blacklist JWT refresh token,
    and clear authentication cookies.
    Seamlessly handles tokens whether provided in HttpOnly cookies or request body.
    """
    @extend_schema(
        summary="Log out and blacklist refresh token",
        responses={200: OpenApiResponse(description="Successfully logged out.")}
    )
    def logout(self, request):
        response = super().logout(request)

        # If cookie was not present or client sent refresh in JSON body, blacklist explicitly
        if response.status_code != 200:
            refresh_token = request.data.get('refresh')
            if refresh_token:
                try:
                    from rest_framework_simplejwt.tokens import RefreshToken
                    token = RefreshToken(refresh_token)
                    token.blacklist()
                    response.status_code = status.HTTP_200_OK
                    response.data = {'detail': 'Successfully logged out.'}
                except Exception as err:
                    logger.warning("Token blacklist exception during logout: %s", err)
                    response.status_code = status.HTTP_200_OK
                    response.data = {'detail': 'Successfully logged out.'}
            else:
                response.status_code = status.HTTP_200_OK
                response.data = {'detail': 'Successfully logged out.'}

        return response


class CustomUserDetailsView(UserDetailsView):
    """
    Retrieve or update currently authenticated user profile.
    GET /api/v1/auth/user/ or /api/v1/auth/me/
    PATCH /api/v1/auth/user/ or /api/v1/auth/me/
    """
    serializer_class = UserSerializer

    @extend_schema(
        summary="Get currently authenticated user profile",
        responses={200: UserSerializer}
    )
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @extend_schema(
        summary="Update currently authenticated user profile",
        request=UserSerializer,
        responses={200: UserSerializer}
    )
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)


class CustomPasswordChangeView(PasswordChangeView):
    """
    Change password for authenticated user.
    Supports both dj-rest-auth standard fields and legacy frontend fields.
    """
    serializer_class = CustomPasswordChangeSerializer


class GoogleLogin(SocialLoginView):
    """
    Google OAuth2 Social Authentication endpoint.
    Accepts:
      POST /api/v1/auth/google/
      Payload: {"access_token": "..."} OR {"code": "..."}
    Returns standard JWT tokens and user profile.
    """
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = os.getenv('GOOGLE_CALLBACK_URL', 'http://localhost:5173/auth/google/callback')


class CustomerAddressViewSet(viewsets.ModelViewSet):
    """
    Manage customer delivery and billing addresses.
    Restricted to authenticated users and automatically scoped to the request user.
    """
    queryset = CustomerAddress.objects.all()
    serializer_class = CustomerAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return CustomerAddress.objects.none()
        return CustomerAddress.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
