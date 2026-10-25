import uuid
from rest_framework import status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from drf_spectacular.utils import extend_schema, OpenApiResponse, inline_serializer

from apps.products.models import Product
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer


def get_user_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        # Migrate anonymous session cart to authenticated user cart if exists
        session_key = request.headers.get('X-Session-ID') or request.session.session_key
        if session_key:
            anon_cart = Cart.objects.filter(session_key=session_key).exclude(pk=cart.pk).first()
            if anon_cart:
                for item in anon_cart.items.all():
                    existing_item = cart.items.filter(product=item.product).first()
                    if existing_item:
                        existing_item.quantity += item.quantity
                        existing_item.save()
                    else:
                        item.cart = cart
                        item.save()
                anon_cart.delete()
        return cart

    # Anonymous user
    session_key = request.headers.get('X-Session-ID')
    if not session_key:
        if not request.session.session_key:
            request.session.create()
        session_key = request.session.session_key

    cart, _ = Cart.objects.get_or_create(session_key=session_key)
    return cart


class CartView(APIView):
    @extend_schema(
        summary="Retrieve user or guest shopping cart",
        responses={200: CartSerializer}
    )
    def get(self, request):
        cart = get_user_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @extend_schema(
        summary="Clear all items in shopping cart",
        responses={204: OpenApiResponse(description="Cart cleared successfully.")}
    )
    def delete(self, request):
        # Clear cart
        cart = get_user_cart(request)
        cart.items.all().delete()
        return Response({'detail': 'Cart cleared.'}, status=status.HTTP_204_NO_CONTENT)


class CartItemAddView(APIView):
    @extend_schema(
        summary="Add item to cart or increment quantity",
        request=inline_serializer(
            name="CartItemAddRequest",
            fields={
                "productId": serializers.CharField(help_text="Product UUID, slug, or legacy ID"),
                "quantity": serializers.IntegerField(default=1, min_value=1)
            }
        ),
        responses={
            201: CartSerializer,
            400: OpenApiResponse(description="Validation error or insufficient stock"),
            404: OpenApiResponse(description="Product not found or inactive")
        }
    )
    @transaction.atomic
    def post(self, request):
        cart = get_user_cart(request)
        product_id = request.data.get('productId')
        quantity = int(request.data.get('quantity', 1))

        if not product_id:
            return Response({'productId': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        if quantity <= 0:
            return Response({'quantity': ['Quantity must be greater than zero.']}, status=status.HTTP_400_BAD_REQUEST)

        # Resolve product by UUID, slug, or legacy_id
        product = None
        try:
            val = uuid.UUID(str(product_id))
            product = Product.objects.filter(id=val, is_active=True).first()
        except (ValueError, AttributeError):
            pass

        if not product:
            product = Product.objects.filter(slug=product_id, is_active=True).first()
        if not product:
            product = Product.objects.filter(legacy_id=product_id, is_active=True).first()

        if not product:
            return Response({'detail': f"Product '{product_id}' not found or inactive."}, status=status.HTTP_404_NOT_FOUND)

        if product.stock < quantity:
            return Response(
                {'detail': f"Insufficient stock for '{product.name}'. Available: {product.stock}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            defaults={'quantity': quantity}
        )
        if not created:
            new_qty = cart_item.quantity + quantity
            if product.stock < new_qty:
                return Response(
                    {'detail': f"Cannot add {quantity} more. Maximum available in stock is {product.stock}."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            cart_item.quantity = new_qty
            cart_item.save(update_fields=['quantity', 'updated_at'])

        cart_serializer = CartSerializer(cart)
        return Response(cart_serializer.data, status=status.HTTP_201_CREATED)


class CartItemDetailView(APIView):
    @extend_schema(
        summary="Update quantity of a cart item",
        request=inline_serializer(
            name="CartItemUpdateRequest",
            fields={
                "quantity": serializers.IntegerField(default=1, min_value=0, help_text="Set to 0 to remove item")
            }
        ),
        responses={
            200: CartSerializer,
            400: OpenApiResponse(description="Insufficient stock"),
            404: OpenApiResponse(description="Cart item not found")
        }
    )
    @transaction.atomic
    def patch(self, request, item_id):
        cart = get_user_cart(request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        quantity = int(request.data.get('quantity', cart_item.quantity))

        if quantity <= 0:
            cart_item.delete()
            return Response(CartSerializer(cart).data)

        if cart_item.product.stock < quantity:
            return Response(
                {'detail': f"Insufficient stock for '{cart_item.product.name}'. Available: {cart_item.product.stock}."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save(update_fields=['quantity', 'updated_at'])
        return Response(CartSerializer(cart).data)

    @extend_schema(
        summary="Remove item from cart by item ID",
        responses={
            200: CartSerializer,
            404: OpenApiResponse(description="Cart item not found")
        }
    )
    def delete(self, request, item_id):
        cart = get_user_cart(request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        return Response(CartSerializer(cart).data)
