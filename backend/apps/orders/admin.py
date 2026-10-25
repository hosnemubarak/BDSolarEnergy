from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    fields = ('name', 'sku', 'price', 'quantity', 'subtotal', 'product')
    readonly_fields = ('name', 'sku', 'price', 'quantity', 'subtotal', 'product')
    can_delete = False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'order_number',
        'full_name',
        'phone',
        'status',
        'total',
        'payment_method',
        'payment_status',
        'created_at',
    )
    list_filter = (
        'status',
        'payment_method',
        'payment_status',
        'division',
        'created_at',
    )
    search_fields = ('order_number', 'full_name', 'phone', 'full_address')
    readonly_fields = ('order_number', 'created_at', 'updated_at', 'subtotal', 'total')
    inlines = [OrderItemInline]

    fieldsets = (
        ('Order Overview', {
            'fields': ('order_number', 'status', 'created_at', 'updated_at')
        }),
        ('Customer & Delivery Details', {
            'fields': (
                'full_name',
                'phone',
                'alternate_phone',
                'division',
                'district',
                'thana_area',
                'full_address',
                'postal_code',
                'notes',
            )
        }),
        ('Payment & Total', {
            'fields': (
                'payment_method',
                'payment_status',
                'subtotal',
                'discount',
                'coupon_code',
                'shipping_fee',
                'total',
            )
        }),
        ('Logistics & Fulfillment', {
            'fields': (
                'courier_name',
                'tracking_number',
                'estimated_delivery_date',
            )
        }),
    )
