from django.contrib import admin
from .models import Wishlist, WishlistItem


class WishlistItemInline(admin.TabularInline):
    model = WishlistItem
    extra = 0
    fields = ('product', 'created_at')
    readonly_fields = ('product', 'created_at')


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'session_key', 'created_at')
    search_fields = ('user__username', 'user__email', 'session_key')
    inlines = [WishlistItemInline]
