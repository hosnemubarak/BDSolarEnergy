from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, CustomerAddress


class CustomerAddressInline(admin.StackedInline):
    model = CustomerAddress
    extra = 0


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'phone', 'role', 'is_verified', 'is_staff', 'created_at')
    list_filter = ('role', 'is_verified', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'email', 'phone', 'first_name', 'last_name')
    ordering = ('-created_at',)
    inlines = [CustomerAddressInline]

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Profile Fields', {
            'fields': ('phone', 'role', 'is_verified')
        }),
    )


@admin.register(CustomerAddress)
class CustomerAddressAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'user', 'phone', 'division', 'district', 'thana_area', 'is_default')
    list_filter = ('division', 'district', 'is_default')
    search_fields = ('full_name', 'phone', 'thana_area', 'full_address', 'user__username', 'user__email')
