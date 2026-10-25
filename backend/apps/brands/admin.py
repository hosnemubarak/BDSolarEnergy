from django.contrib import admin
from .models import Brand


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name', 'id', 'country', 'is_popular', 'get_product_count', 'created_at')
    list_filter = ('is_popular', 'country')
    search_fields = ('name', 'slug', 'country', 'description')
    prepopulated_fields = {'slug': ('name',)}

    @admin.display(description='Products')
    def get_product_count(self, obj):
        return obj.product_count
