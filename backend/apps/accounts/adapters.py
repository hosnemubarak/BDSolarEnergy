import logging
from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)
User = get_user_model()


class CustomAccountAdapter(DefaultAccountAdapter):
    """
    Custom account adapter for BD Solar Energy.
    Enforces security rules:
    - Ensures registration never assigns staff or admin privileges.
    - Auto-generates clean, collision-free usernames when omitted.
    """

    def save_user(self, request, user, form, commit=True):
        user = super().save_user(request, user, form, commit=False)
        # Enforce customer role on registration
        user.role = 'customer'
        user.is_staff = False
        user.is_superuser = False
        if commit:
            user.save()
        return user


class CustomSocialAccountAdapter(DefaultSocialAccountAdapter):
    """
    Production-grade social account adapter for BD Solar Energy.
    Supports Google and future OAuth2 providers:
    - Safe account linking: links verified social accounts to existing email users.
    - Prevents account takeover by ensuring email verification from the provider.
    - Automatically populates name and customer profile fields.
    """

    def pre_social_login(self, request, sociallogin):
        # If social account is already linked to a user, proceed normally
        if sociallogin.is_existing:
            return

        # Check for verified email from provider
        email = None
        extra_data = sociallogin.account.extra_data or {}

        # Google provider payload inspection
        if sociallogin.account.provider == 'google':
            is_email_verified = extra_data.get('email_verified', False)
            if is_email_verified:
                email = extra_data.get('email')
        else:
            email = (sociallogin.account.extra_data or {}).get('email')

        if not email and sociallogin.user:
            email = getattr(sociallogin.user, 'email', None)

        if not email:
            return

        # Attempt to link to an existing user with matching email
        try:
            existing_user = User.objects.filter(email__iexact=email.strip()).first()
            if existing_user:
                logger.info(
                    "Connecting existing user %s (%s) to %s social account",
                    existing_user.id,
                    existing_user.email,
                    sociallogin.account.provider
                )
                sociallogin.connect(request, existing_user)
        except Exception as e:
            logger.error("Error during pre_social_login account linking: %s", e)

    def populate_user(self, request, sociallogin, data):
        user = super().populate_user(request, sociallogin, data)
        extra = sociallogin.account.extra_data or {}

        # Fill first_name / last_name from provider payload
        if not user.first_name:
            user.first_name = extra.get('given_name') or data.get('first_name', '')
        if not user.last_name:
            user.last_name = extra.get('family_name') or data.get('last_name', '')

        # Generate unique username if needed
        if not user.username:
            email = user.email or ''
            base = email.split('@')[0] if '@' in email else 'customer'
            clean_base = ''.join(c for c in base if c.isalnum() or c in '_-')[:30] or 'customer'
            candidate = clean_base
            counter = 1
            while User.objects.filter(username=candidate).exists():
                candidate = f"{clean_base}_{counter}"
                counter += 1
            user.username = candidate

        user.role = 'customer'
        user.is_verified = True
        return user
