from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field
from .models import Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'display_order', 'is_primary']


class ProductSerializer(serializers.ModelSerializer):
    legacyId = serializers.CharField(source='legacy_id', read_only=True)
    categoryId = serializers.CharField(source='category.slug', read_only=True)
    categoryName = serializers.CharField(source='category.name', read_only=True)
    subcategoryId = serializers.CharField(source='subcategory.slug', read_only=True, allow_null=True)
    brand = serializers.CharField(source='brand.name', read_only=True)
    brandId = serializers.CharField(source='brand.slug', read_only=True)
    shortDescription = serializers.CharField(source='short_description', read_only=True)
    
    price = serializers.FloatField()
    originalPrice = serializers.FloatField(source='original_price', allow_null=True, read_only=True)
    
    inStock = serializers.BooleanField(source='in_stock', read_only=True)
    reviewCount = serializers.IntegerField(source='review_count', read_only=True)
    rating = serializers.FloatField()
    
    isFeatured = serializers.BooleanField(source='is_featured', read_only=True)
    isBestseller = serializers.BooleanField(source='is_bestseller', read_only=True)
    isBestSeller = serializers.BooleanField(source='is_bestseller', read_only=True)
    isOnSale = serializers.BooleanField(source='is_on_sale', read_only=True)
    isNewArrival = serializers.BooleanField(source='is_new_arrival', read_only=True)
    installationSupportAvailable = serializers.BooleanField(source='installation_support_available', read_only=True)
    compatibilityNotes = serializers.CharField(source='compatibility_notes', read_only=True)
    
    gallery = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id',
            'legacyId',
            'legacy_id',
            'name',
            'slug',
            'sku',
            'description',
            'short_description',
            'shortDescription',
            'price',
            'original_price',
            'originalPrice',
            'currency',
            'image',
            'gallery',
            'category',
            'categoryId',
            'categoryName',
            'subcategory',
            'subcategoryId',
            'brand',
            'brandId',
            'stock',
            'in_stock',
            'inStock',
            'rating',
            'review_count',
            'reviewCount',
            'specifications',
            'highlights',
            'badges',
            'is_featured',
            'isFeatured',
            'is_bestseller',
            'isBestseller',
            'isBestSeller',
            'is_on_sale',
            'isOnSale',
            'is_new_arrival',
            'isNewArrival',
            'installation_support_available',
            'installationSupportAvailable',
            'compatibility_notes',
            'compatibilityNotes',
            'is_active',
            'created_at',
            'updated_at',
        ]

    @extend_schema_field(list[str])
    def get_gallery(self, obj):
        return obj.gallery
