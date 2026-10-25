from django.contrib import admin
from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    fields = ('product', 'quantity', 'line_total', 'created_at')
    readonly_fields = ('product', 'quantity', 'line_total', 'created_at')


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'session_key', 'total_items', 'subtotal', 'created_at', 'updated_at')
    search_fields = ('user__username', 'user__email', 'session_key')
    readonly_fields = ('created_at', 'updated_at', 'subtotal')
    inlines = [CartItemInline]
