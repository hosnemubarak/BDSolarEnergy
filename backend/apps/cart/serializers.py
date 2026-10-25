from rest_framework import serializers
from apps.products.models import Product
from .models import Cart, CartItem


class CartItemProductMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',
            'legacy_id',
            'name',
            'slug',
            'sku',
            'price',
            'original_price',
            'image',
            'stock',
            'in_stock',
        ]


class CartItemSerializer(serializers.ModelSerializer):
    product = CartItemProductMiniSerializer(read_only=True)
    productId = serializers.CharField(write_only=True, required=False)
    lineTotal = serializers.FloatField(source='line_total', read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id',
            'product',
            'productId',
            'quantity',
            'lineTotal',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.FloatField(read_only=True)
    totalItems = serializers.IntegerField(source='total_items', read_only=True)

    class Meta:
        model = Cart
        fields = [
            'id',
            'items',
            'subtotal',
            'totalItems',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
