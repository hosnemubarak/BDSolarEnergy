from django.contrib import admin
from .models import SolarPackage, SolarPackageItem


class SolarPackageItemInline(admin.TabularInline):
    model = SolarPackageItem
    extra = 1
    fields = ('product', 'raw_product_id', 'product_name', 'quantity', 'category', 'specs_summary')


@admin.register(SolarPackage)
class SolarPackageAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'system_type',
        'price',
        'original_price',
        'daily_generation_estimate_kwh',
        'savings_monthly_estimate_bdt',
        'installation_included',
        'net_metering_eligible',
        'is_active',
    )
    list_filter = (
        'system_type',
        'installation_included',
        'net_metering_eligible',
        'is_active',
    )
    search_fields = ('title', 'slug', 'tagline', 'ideal_for')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [SolarPackageItemInline]


@admin.register(SolarPackageItem)
class SolarPackageItemAdmin(admin.ModelAdmin):
    list_display = ('product_name', 'package', 'quantity', 'category', 'specs_summary')
    list_filter = ('package', 'category')
    search_fields = ('product_name', 'package__title')
