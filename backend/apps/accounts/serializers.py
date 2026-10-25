from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db.models import Q
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
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


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False)
    name = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirmPassword = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'name',
            'email',
            'first_name',
            'last_name',
            'phone',
            'password',
            'confirmPassword',
        ]
        read_only_fields = ['id']

    def validate(self, attrs):
        confirm = attrs.pop('confirmPassword', None)
        if confirm and attrs['password'] != confirm:
            raise serializers.ValidationError({"password": "Passwords do not match."})

        # Split full name if provided
        name = attrs.pop('name', '').strip()
        if name and not attrs.get('first_name'):
            parts = name.split(' ', 1)
            attrs['first_name'] = parts[0]
            if len(parts) > 1:
                attrs['last_name'] = parts[1]

        # Auto-generate unique username if omitted
        if not attrs.get('username'):
            email = attrs.get('email', '').strip()
            phone = attrs.get('phone', '').strip()
            base = ''
            if email and '@' in email:
                base = email.split('@')[0]
            elif phone:
                base = phone.replace('+', '').replace(' ', '').replace('-', '')
            elif attrs.get('first_name'):
                base = attrs['first_name'].lower()
            else:
                base = 'customer'

            # Clean alphanumeric
            clean_base = ''.join(c for c in base if c.isalnum() or c in '_-')[:30] or 'customer'
            candidate = clean_base
            counter = 1
            while User.objects.filter(username=candidate).exists():
                candidate = f"{clean_base}_{counter}"
                counter += 1
            attrs['username'] = candidate

        return attrs

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        login_input = (attrs.get('username') or '').strip()
        password = attrs.get('password')

        # Allow logging in with username, email, or phone
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
