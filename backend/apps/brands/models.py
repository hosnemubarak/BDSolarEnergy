import uuid
from django.db import models


class Brand(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=120, unique=True)
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    country = models.CharField(max_length=80, blank=True)
    description = models.TextField(blank=True)
    logo = models.CharField(max_length=255, blank=True)
    is_popular = models.BooleanField(default=False, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_popular']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.name

    @property
    def product_count(self):
        if hasattr(self, '_product_count'):
            return self._product_count
        return self.products.filter(is_active=True).count()
