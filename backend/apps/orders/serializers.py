import uuid
import random
from decimal import Decimal
from django.utils import timezone
from django.db import transaction
from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field

from apps.products.models import Product
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    productId = serializers.CharField(source='raw_product_id', read_only=True)
    price = serializers.FloatField(read_only=True)
    subtotal = serializers.FloatField(read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            'id',
            'productId',
            'name',
            'sku',
            'price',
            'quantity',
            'image',
            'subtotal',
        ]


class OrderSerializer(serializers.ModelSerializer):
    orderNumber = serializers.CharField(source='order_number', read_only=True)
    createdAt = serializers.DateTimeField(source='created_at', read_only=True)
    subtotal = serializers.FloatField(read_only=True)
    discount = serializers.FloatField(read_only=True)
    shippingFee = serializers.FloatField(source='shipping_fee', read_only=True)
    total = serializers.FloatField(read_only=True)
    paymentMethod = serializers.CharField(source='payment_method', read_only=True)
    paymentStatus = serializers.CharField(source='payment_status', read_only=True)
    estimatedDeliveryDate = serializers.DateField(source='estimated_delivery_date', read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    shippingAddress = serializers.SerializerMethodField()
    customerEmail = serializers.EmailField(source='user.email', read_only=True, allow_null=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'orderNumber',
            'status',
            'createdAt',
            'customerEmail',
            'shippingAddress',
            'items',
            'subtotal',
            'discount',
            'coupon_code',
            'shippingFee',
            'total',
            'paymentMethod',
            'paymentStatus',
            'courier_name',
            'tracking_number',
            'estimatedDeliveryDate',
            'notes',
        ]

    @extend_schema_field(dict)
    def get_shippingAddress(self, obj):
        return {
            'fullName': obj.full_name,
            'phone': obj.phone,
            'alternatePhone': obj.alternate_phone,
            'division': obj.division,
            'district': obj.district,
            'thanaArea': obj.thana_area,
            'fullAddress': obj.full_address,
            'postalCode': obj.postal_code,
        }


class OrderItemInputSerializer(serializers.Serializer):
    productId = serializers.CharField()
    quantity = serializers.IntegerField(min_value=1)


class OrderCreateSerializer(serializers.Serializer):
    # Customer Details
    fullName = serializers.CharField(max_length=120)
    phone = serializers.CharField(max_length=32)
    alternatePhone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    division = serializers.CharField(max_length=64)
    district = serializers.CharField(max_length=64)
    thanaArea = serializers.CharField(max_length=100)
    fullAddress = serializers.CharField()
    postalCode = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    # Items
    items = OrderItemInputSerializer(many=True)
    
    # Options
    paymentMethod = serializers.ChoiceField(
        choices=['COD', 'BKASH', 'NAGAD', 'BANK_TRANSFER'],
        default='COD'
    )
    couponCode = serializers.CharField(max_length=32, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Order must include at least one item.")
        return items

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        coupon_code = validated_data.get('couponCode', '').strip().upper()
        request = self.context.get('request')
        user = request.user if request and request.user.is_authenticated else None

        # Resolve and lock products with select_for_update to avoid concurrency overselling
        line_items_to_create = []
        subtotal = Decimal('0.00')

        for item_input in items_data:
            pid = item_input['productId']
            qty = item_input['quantity']

            # Resolve product
            product = None
            try:
                val = uuid.UUID(str(pid))
                product = Product.objects.select_for_update().filter(id=val, is_active=True).first()
            except (ValueError, AttributeError):
                pass

            if not product:
                product = Product.objects.select_for_update().filter(slug=pid, is_active=True).first()
            if not product:
                product = Product.objects.select_for_update().filter(legacy_id=pid, is_active=True).first()

            if not product:
                raise serializers.ValidationError({"items": f"Product '{pid}' does not exist or is inactive."})

            if product.stock < qty:
                raise serializers.ValidationError({
                    "items": f"Insufficient stock for '{product.name}'. Available: {product.stock}, requested: {qty}."
                })

            unit_price = product.price
            line_subtotal = unit_price * qty
            subtotal += line_subtotal

            # Decrement stock safely
            product.stock -= qty
            product.save(update_fields=['stock', 'in_stock'])

            line_items_to_create.append({
                'product': product,
                'raw_product_id': product.legacy_id or str(product.id),
                'name': product.name,
                'sku': product.sku,
                'price': unit_price,
                'quantity': qty,
                'image': product.image,
                'subtotal': line_subtotal,
            })

        # Calculate discount
        discount = Decimal('0.00')
        if coupon_code == 'BDSOLAR5':
            discount = (subtotal * Decimal('0.05')).quantize(Decimal('0.01'))
        elif coupon_code == 'BDSOLAR10':
            discount = (subtotal * Decimal('0.10')).quantize(Decimal('0.01'))
        elif coupon_code == 'WELCOME500':
            discount = min(Decimal('500.00'), subtotal)

        # Shipping fee: Free if subtotal > 15000 BDT, else 120 BDT
        shipping_fee = Decimal('0.00') if subtotal >= Decimal('15000.00') else Decimal('120.00')
        total = subtotal - discount + shipping_fee

        # Generate unique order number
        year = timezone.now().strftime('%Y')
        while True:
            order_number = f"BDS-{year}-{random.randint(10000, 99999)}"
            if not Order.objects.filter(order_number=order_number).exists():
                break

        order = Order.objects.create(
            order_number=order_number,
            user=user,
            status='CONFIRMED',
            full_name=validated_data['fullName'],
            phone=validated_data['phone'],
            alternate_phone=validated_data.get('alternatePhone', ''),
            division=validated_data['division'],
            district=validated_data['district'],
            thana_area=validated_data['thanaArea'],
            full_address=validated_data['fullAddress'],
            postal_code=validated_data.get('postalCode', ''),
            payment_method=validated_data.get('paymentMethod', 'COD'),
            payment_status='UNPAID',
            subtotal=subtotal,
            discount=discount,
            coupon_code=coupon_code,
            shipping_fee=shipping_fee,
            total=total,
            notes=validated_data.get('notes', ''),
            estimated_delivery_date=timezone.now().date() + timezone.timedelta(days=3),
        )

        for item_info in line_items_to_create:
            OrderItem.objects.create(order=order, **item_info)

        return order
