import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


class Cart(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='carts',
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    session_key = models.CharField(max_length=40, blank=True, null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        owner = self.user.username if self.user else f"Session {self.session_key}"
        return f"Cart ({owner}) - {self.items.count()} items"

    @property
    def subtotal(self) -> Decimal:
        return sum(
            (item.product.price * item.quantity for item in self.items.select_related('product')),
            Decimal('0.00')
        )

    @property
    def total_items(self) -> int:
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    cart = models.ForeignKey(
        Cart,
        related_name='items',
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        'products.Product',
        related_name='cart_items',
        on_delete=models.CASCADE
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['cart', 'product'], name='unique_product_per_cart'),
            models.CheckConstraint(condition=models.Q(quantity__gte=1), name='cart_item_quantity_min_1')
        ]

    def __str__(self):
        return f"{self.quantity}x {self.product.name} in Cart"

    @property
    def line_total(self) -> Decimal:
        return self.product.price * self.quantity
