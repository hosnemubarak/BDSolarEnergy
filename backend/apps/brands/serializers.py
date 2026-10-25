from rest_framework import serializers
from .models import Brand


class BrandSerializer(serializers.ModelSerializer):
    isPopular = serializers.BooleanField(source='is_popular', read_only=True)
    product_count = serializers.IntegerField(read_only=True)
    productCount = serializers.IntegerField(source='product_count', read_only=True)

    class Meta:
        model = Brand
        fields = [
            'id',
            'name',
            'slug',
            'country',
            'description',
            'logo',
            'is_popular',
            'isPopular',
            'product_count',
            'productCount',
        ]
