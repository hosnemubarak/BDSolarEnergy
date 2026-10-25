import uuid
from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    legacy_id = models.CharField(max_length=64, unique=True, null=True, blank=True, db_index=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    sku = models.CharField(max_length=100, unique=True, db_index=True)
    description = models.TextField()
    short_description = models.CharField(max_length=400, blank=True)
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
    currency = models.CharField(max_length=10, default='BDT')
    image = models.CharField(max_length=255, default='/images/solar-panel.svg')
    
    category = models.ForeignKey(
        'categories.Category',
        related_name='products',
        on_delete=models.PROTECT
    )
    subcategory = models.ForeignKey(
        'categories.Subcategory',
        related_name='products',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    brand = models.ForeignKey(
        'brands.Brand',
        related_name='products',
        on_delete=models.PROTECT
    )
    
    stock = models.PositiveIntegerField(default=10)
    in_stock = models.BooleanField(default=True, db_index=True)
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=5.00,
        validators=[MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('5.00'))]
    )
    review_count = models.PositiveIntegerField(default=0)
    
    specifications = models.JSONField(default=dict, blank=True)
    highlights = models.JSONField(default=list, blank=True)
    badges = models.JSONField(default=list, blank=True)
    
    is_featured = models.BooleanField(default=False, db_index=True)
    is_bestseller = models.BooleanField(default=False, db_index=True)
    is_on_sale = models.BooleanField(default=False, db_index=True)
    is_new_arrival = models.BooleanField(default=False, db_index=True)
    installation_support_available = models.BooleanField(default=True)
    compatibility_notes = models.TextField(blank=True)
    
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.CheckConstraint(
                condition=models.Q(price__gte=0),
                name='product_price_non_negative'
            ),
            models.CheckConstraint(
                condition=models.Q(rating__gte=0) & models.Q(rating__lte=5),
                name='product_rating_range_0_to_5'
            ),
        ]
        indexes = [
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['brand', 'is_active']),
            models.Index(fields=['price']),
            models.Index(fields=['rating']),
            models.Index(fields=['is_featured', 'is_active']),
        ]

    def __str__(self):
        return f"{self.name} ({self.sku})"

    def save(self, *args, **kwargs):
        self.in_stock = self.stock > 0
        super().save(*args, **kwargs)

    @property
    def gallery(self):
        images = list(self.gallery_images.order_by('display_order').values_list('image', flat=True))
        if not images:
            return [self.image]
        return images


class ProductImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        Product,
        related_name='gallery_images',
        on_delete=models.CASCADE
    )
    image = models.CharField(max_length=255)
    alt_text = models.CharField(max_length=255, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ['display_order', 'id']

    def __str__(self):
        return f"Image for {self.product.name} ({self.display_order})"
