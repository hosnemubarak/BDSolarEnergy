import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator


ORDER_STATUS_CHOICES = [
    ('PENDING', 'Pending'),
    ('CONFIRMED', 'Confirmed'),
    ('PROCESSING', 'Processing'),
    ('SHIPPED', 'Shipped'),
    ('DELIVERED', 'Delivered'),
    ('CANCELLED', 'Cancelled'),
]

PAYMENT_METHOD_CHOICES = [
    ('COD', 'Cash on Delivery'),
    ('BKASH', 'bKash'),
    ('NAGAD', 'Nagad'),
    ('BANK_TRANSFER', 'Bank Transfer'),
]

PAYMENT_STATUS_CHOICES = [
    ('UNPAID', 'Unpaid'),
    ('PAID', 'Paid'),
]


class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=32, unique=True, db_index=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='orders',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    status = models.CharField(max_length=32, choices=ORDER_STATUS_CHOICES, default='CONFIRMED', db_index=True)
    
    # Customer Details
    full_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=32)
    alternate_phone = models.CharField(max_length=32, blank=True)
    division = models.CharField(max_length=64)
    district = models.CharField(max_length=64)
    thana_area = models.CharField(max_length=100)
    full_address = models.TextField()
    postal_code = models.CharField(max_length=20, blank=True)
    
    # Financial details
    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    discount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.0,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    coupon_code = models.CharField(max_length=32, blank=True)
    shipping_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.0,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    
    # Payment & Logistics
    payment_method = models.CharField(max_length=32, choices=PAYMENT_METHOD_CHOICES, default='COD')
    payment_status = models.CharField(max_length=32, choices=PAYMENT_STATUS_CHOICES, default='UNPAID')
    courier_name = models.CharField(max_length=64, blank=True)
    tracking_number = models.CharField(max_length=64, blank=True)
    estimated_delivery_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"Order #{self.order_number} - {self.full_name} (৳{self.total})"


class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(
        Order,
        related_name='items',
        on_delete=models.CASCADE
    )
    product = models.ForeignKey(
        'products.Product',
        null=True,
        blank=True,
        on_delete=models.SET_NULL
    )
    raw_product_id = models.CharField(max_length=64, blank=True)
    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    quantity = models.PositiveIntegerField(default=1)
    image = models.CharField(max_length=255, default='/images/solar-panel.svg')
    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )

    def __str__(self):
        return f"{self.quantity}x {self.name} in #{self.order.order_number}"
