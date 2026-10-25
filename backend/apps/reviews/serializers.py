from rest_framework import serializers
from .models import ProductReview


class ProductReviewSerializer(serializers.ModelSerializer):
    productId = serializers.UUIDField(source='product.id', read_only=True)
    productName = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = ProductReview
        fields = [
            'id',
            'productId',
            'productName',
            'reviewer_name',
            'rating',
            'title',
            'comment',
            'is_verified_purchase',
            'created_at',
        ]
        read_only_fields = ['id', 'is_verified_purchase', 'created_at']


class ProductReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = [
            'product',
            'reviewer_name',
            'rating',
            'title',
            'comment',
        ]
