from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from dj_rest_auth.serializers import (
    LoginSerializer as BaseLoginSerializer,
    JWTSerializer as BaseJWTSerializer,
    PasswordChangeSerializer as BasePasswordChangeSerializer,
)
from dj_rest_auth.registration.serializers import (
    RegisterSerializer as BaseRegisterSerializer,
)

from .models import CustomerAddress

User = get_user_model()


class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = [
            'id',
            'full_name',
            'phone',
            'alternate_phone',
            'division',
            'district',
            'thana_area',
            'full_address',
            'postal_code',
            'is_default',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class UserSerializer(serializers.ModelSerializer):
    addresses = CustomerAddressSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'phone',
            'role',
            'is_verified',
            'addresses',
            'created_at',
        ]
        read_only_fields = ['id', 'role', 'is_verified', 'created_at']


class CustomRegisterSerializer(BaseRegisterSerializer):
    """
    Package-integrated registration serializer for dj-rest-auth & django-allauth.
    Supports BD Solar Energy customer profile attributes:
    - Full name (auto-splits into first_name and last_name)
    - Phone number
    - Password & confirm password flexibility
    - Automatic username generation from email or phone when omitted
    """
    name = serializers.CharField(required=False, allow_blank=True, write_only=True)
    phone = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    password = serializers.CharField(required=False, allow_blank=True, write_only=True)
    confirmPassword = serializers.CharField(required=False, allow_blank=True, write_only=True)

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'password' in data and not data.get('password1'):
            data['password1'] = data['password']
        if 'confirmPassword' in data and not data.get('password2'):
            data['password2'] = data['confirmPassword']
        elif not data.get('password2') and data.get('password1'):
            data['password2'] = data['password1']
        return super().to_internal_value(data)

    def validate(self, data):
        # Parse full name if provided
        name = data.get('name', '').strip()
        if name and not data.get('first_name'):
            parts = name.split(' ', 1)
            data['first_name'] = parts[0]
            if len(parts) > 1:
                data['last_name'] = parts[1]

        # Auto-generate unique username if omitted
        if not data.get('username'):
            email = data.get('email', '').strip()
            phone = data.get('phone', '').strip()
            base = ''
            if email and '@' in email:
                base = email.split('@')[0]
            elif phone:
                base = phone.replace('+', '').replace(' ', '').replace('-', '')
            elif data.get('first_name'):
                base = data['first_name'].lower()
            else:
                base = 'customer'

            clean_base = ''.join(c for c in base if c.isalnum() or c in '_-')[:30] or 'customer'
            candidate = clean_base
            counter = 1
            while User.objects.filter(username=candidate).exists():
                candidate = f"{clean_base}_{counter}"
                counter += 1
            data['username'] = candidate

        return super().validate(data)

    def custom_signup(self, request, user):
        user.phone = self.validated_data.get('phone') or None
        if self.validated_data.get('first_name'):
            user.first_name = self.validated_data['first_name']
        if self.validated_data.get('last_name'):
            user.last_name = self.validated_data['last_name']
        # Enforce non-privileged customer role
        user.role = 'customer'
        user.is_staff = False
        user.is_superuser = False
        user.backend = 'django.contrib.auth.backends.ModelBackend'
        user.save()


# Backward-compatible alias
RegisterSerializer = CustomRegisterSerializer


class CustomLoginSerializer(BaseLoginSerializer):
    """
    Custom Login Serializer supporting login via username, email, OR phone.
    """
    username = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)

    def get_auth_user(self, username, email, password):
        login_input = (username or email or '').strip()
        if login_input and password:
            # Query by username, email, or phone
            user = User.objects.filter(
                Q(username__iexact=login_input) |
                Q(email__iexact=login_input) |
                Q(phone=login_input)
            ).first()

            if user and user.check_password(password):
                user.backend = 'django.contrib.auth.backends.ModelBackend'
                return user

        user = super().get_auth_user(username, email, password)
        if user and not getattr(user, 'backend', None):
            user.backend = 'django.contrib.auth.backends.ModelBackend'
        return user


class CustomJWTSerializer(BaseJWTSerializer):
    """
    Custom JWT Serializer for dj-rest-auth.
    Produces:
    - access: JWT access token
    - refresh: JWT refresh token
    - user: serialized user profile
    - tokens: {access, refresh} for legacy frontend clients
    """
    user = UserSerializer(read_only=True)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['tokens'] = {
            'access': data.get('access'),
            'refresh': data.get('refresh'),
        }
        return data


class CustomPasswordChangeSerializer(BasePasswordChangeSerializer):
    """
    Password change serializer supporting both dj-rest-auth standard fields
    (new_password1, new_password2) and frontend fields (new_password, confirm_password).
    """
    new_password = serializers.CharField(required=False, write_only=True)
    confirm_password = serializers.CharField(required=False, write_only=True)

    def to_internal_value(self, data):
        data = data.copy() if hasattr(data, 'copy') else dict(data)
        if 'new_password' in data and not data.get('new_password1'):
            data['new_password1'] = data['new_password']
        if 'confirm_password' in data and not data.get('new_password2'):
            data['new_password2'] = data['confirm_password']
        elif not data.get('new_password2') and data.get('new_password1'):
            data['new_password2'] = data['new_password1']
        return super().to_internal_value(data)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    SimpleJWT TokenObtainPairSerializer fallback with username/email/phone support.
    """
    def validate(self, attrs):
        login_input = (attrs.get('username') or '').strip()
        password = attrs.get('password')

        if login_input and password:
            user = User.objects.filter(
                Q(username__iexact=login_input) |
                Q(email__iexact=login_input) |
                Q(phone=login_input)
            ).first()

            if user and user.check_password(password):
                attrs['username'] = user.username

        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user, context=self.context).data
        return data


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=False, write_only=True)
