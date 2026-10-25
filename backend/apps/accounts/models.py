import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('staff', 'Staff'),
        ('admin', 'Admin'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(max_length=32, blank=True, null=True, unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.username} ({self.get_full_name() or self.email})"


class CustomerAddress(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        User,
        related_name='addresses',
        on_delete=models.CASCADE
    )
    full_name = models.CharField(max_length=120)
    phone = models.CharField(max_length=32)
    alternate_phone = models.CharField(max_length=32, blank=True)
    division = models.CharField(max_length=64)
    district = models.CharField(max_length=64)
    thana_area = models.CharField(max_length=100)
    full_address = models.TextField()
    postal_code = models.CharField(max_length=20, blank=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = 'Customer Addresses'
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f"{self.full_name} - {self.thana_area}, {self.district}"

    def save(self, *args, **kwargs):
        if self.is_default:
            CustomerAddress.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)
