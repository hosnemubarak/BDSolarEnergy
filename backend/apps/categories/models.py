import uuid
from django.db import models


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    description = models.TextField(blank=True)
    icon_name = models.CharField(max_length=64, blank=True, default='Sun')
    featured_image = models.CharField(max_length=255, blank=True, default='/images/solar-panel.svg')
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['display_order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name

    @property
    def product_count(self):
        # Fallback property if not annotated
        if hasattr(self, '_product_count'):
            return self._product_count
        return self.products.filter(is_active=True).count()


class Subcategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    category = models.ForeignKey(
        Category,
        related_name='subcategories',
        on_delete=models.CASCADE
    )
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Subcategories'
        ordering = ['display_order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category', 'is_active']),
        ]

    def __str__(self):
        return f"{self.category.name} -> {self.name}"

    @property
    def product_count(self):
        if hasattr(self, '_product_count'):
            return self._product_count
        return self.products.filter(is_active=True).count()
