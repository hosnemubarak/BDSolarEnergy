import uuid
from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator


class SolarPackage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    legacy_id = models.CharField(max_length=64, unique=True, null=True, blank=True, db_index=True)
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    tagline = models.CharField(max_length=255, blank=True)
    system_type = models.CharField(max_length=64)
    daily_generation_estimate_kwh = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        default=0.0,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    original_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    savings_monthly_estimate_bdt = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.0,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    warranty_summary = models.CharField(max_length=255, blank=True)
    ideal_for = models.CharField(max_length=255, blank=True)
    image = models.CharField(max_length=255, default='/images/solar-package.svg')
    
    features = models.JSONField(default=list, blank=True)
    specifications = models.JSONField(default=dict, blank=True)
    installation_included = models.BooleanField(default=True)
    net_metering_eligible = models.BooleanField(default=False)
    
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['price']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['system_type']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.title


class SolarPackageItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    package = models.ForeignKey(
        SolarPackage,
        related_name='package_items',
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        'products.Product',
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    raw_product_id = models.CharField(max_length=64, blank=True)
    product_name = models.CharField(max_length=255)
    quantity = models.PositiveIntegerField(default=1)
    category = models.CharField(max_length=100, blank=True)
    specs_summary = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.quantity}x {self.product_name} in {self.package.title}"
