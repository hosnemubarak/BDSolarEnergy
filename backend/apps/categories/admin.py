from django.contrib import admin
from .models import Category, Subcategory


class SubcategoryInline(admin.TabularInline):
    model = Subcategory
    extra = 1
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'icon_name', 'get_product_count', 'created_at')
    search_fields = ('name', 'slug', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [SubcategoryInline]

    @admin.display(description='Products')
    def get_product_count(self, obj):
        return obj.product_count


@admin.register(Subcategory)
class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'slug', 'get_product_count')
    list_filter = ('category',)
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

    @admin.display(description='Products')
    def get_product_count(self, obj):
        return obj.product_count
