from rest_framework import serializers
from .models import Category, Subcategory


class SubcategorySerializer(serializers.ModelSerializer):
    parentId = serializers.CharField(source='category.slug', read_only=True)
    product_count = serializers.IntegerField(read_only=True)
    productCount = serializers.IntegerField(source='product_count', read_only=True)

    class Meta:
        model = Subcategory
        fields = [
            'id',
            'name',
            'slug',
            'parentId',
            'product_count',
            'productCount',
            'display_order',
            'is_active',
        ]


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubcategorySerializer(many=True, read_only=True)
    iconName = serializers.CharField(source='icon_name', read_only=True)
    featuredImage = serializers.CharField(source='featured_image', read_only=True)
    product_count = serializers.IntegerField(read_only=True)
    productCount = serializers.IntegerField(source='product_count', read_only=True)

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'icon_name',
            'iconName',
            'featured_image',
            'featuredImage',
            'display_order',
            'is_active',
            'product_count',
            'productCount',
            'subcategories',
        ]
