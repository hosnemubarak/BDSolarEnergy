from django.contrib import admin
from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    fields = ('image', 'display_order', 'is_primary')


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'sku',
        'category',
        'brand',
        'price',
        'original_price',
        'stock',
        'in_stock',
        'is_featured',
        'is_bestseller',
        'is_active',
    )
    list_filter = (
        'category',
        'brand',
        'in_stock',
        'is_featured',
        'is_bestseller',
        'is_on_sale',
        'is_new_arrival',
        'is_active',
    )
    search_fields = ('name', 'sku', 'slug', 'description', 'short_description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('price', 'stock', 'is_featured', 'is_bestseller', 'is_active')
    inlines = [ProductImageInline]

    fieldsets = (
        ('Basic Information', {
            'fields': ('id', 'name', 'slug', 'sku', 'description', 'short_description')
        }),
        ('Classification', {
            'fields': ('category', 'subcategory', 'brand')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'original_price', 'currency', 'stock', 'in_stock')
        }),
        ('Visual Assets', {
            'fields': ('image',)
        }),
        ('Merchandising & Badges', {
            'fields': (
                'badges',
                'highlights',
                'is_featured',
                'is_bestseller',
                'is_on_sale',
                'is_new_arrival',
                'rating',
                'review_count',
            )
        }),
        ('Technical Specifications & Compatibility', {
            'fields': (
                'specifications',
                'installation_support_available',
                'compatibility_notes',
            )
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ('product', 'image', 'display_order', 'is_primary')
    list_filter = ('is_primary',)
    search_fields = ('product__name', 'product__sku')
