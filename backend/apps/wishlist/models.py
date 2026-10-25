import uuid
from django.db import models
from django.conf import settings


class Wishlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='wishlists',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    session_key = models.CharField(max_length=40, blank=True, null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        owner = self.user.username if self.user else f"Session {self.session_key}"
        return f"Wishlist ({owner}) - {self.items.count()} items"


class WishlistItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    wishlist = models.ForeignKey(
        Wishlist,
        related_name='items',
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        'products.Product',
        related_name='wishlist_items',
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['wishlist', 'product'], name='unique_product_per_wishlist')
        ]

    def __str__(self):
        return f"{self.product.name} in Wishlist"
