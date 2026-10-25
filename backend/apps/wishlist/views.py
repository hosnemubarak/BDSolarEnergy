import uuid
from rest_framework import status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiResponse, inline_serializer

from apps.products.models import Product
from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer


def get_user_wishlist(request):
    if request.user.is_authenticated:
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        session_key = request.headers.get('X-Session-ID') or request.session.session_key
        if session_key:
            anon_wishlist = Wishlist.objects.filter(session_key=session_key).exclude(pk=wishlist.pk).first()
            if anon_wishlist:
                for item in anon_wishlist.items.all():
                    WishlistItem.objects.get_or_create(wishlist=wishlist, product=item.product)
                anon_wishlist.delete()
        return wishlist

    session_key = request.headers.get('X-Session-ID')
    if not session_key:
        if not request.session.session_key:
            request.session.create()
        session_key = request.session.session_key

    wishlist, _ = Wishlist.objects.get_or_create(session_key=session_key)
    return wishlist


class WishlistView(APIView):
    @extend_schema(
        summary="Retrieve user or guest wishlist",
        responses={200: WishlistSerializer}
    )
    def get(self, request):
        wishlist = get_user_wishlist(request)
        serializer = WishlistSerializer(wishlist)
        return Response(serializer.data)

    @extend_schema(
        summary="Toggle product presence in wishlist",
        request=inline_serializer(
            name="WishlistToggleRequest",
            fields={
                "productId": serializers.CharField(help_text="Product UUID, slug, or legacy ID")
            }
        ),
        responses={
            200: inline_serializer(
                name="WishlistToggleResponse",
                fields={
                    "added": serializers.BooleanField(),
                    "wishlist": WishlistSerializer()
                }
            ),
            400: OpenApiResponse(description="Product ID required"),
            404: OpenApiResponse(description="Product not found")
        }
    )
    def post(self, request):
        # Toggle item in wishlist
        wishlist = get_user_wishlist(request)
        product_id = request.data.get('productId')

        if not product_id:
            return Response({'productId': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)

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
            return Response({'detail': f"Product '{product_id}' not found."}, status=status.HTTP_404_NOT_FOUND)

        item = WishlistItem.objects.filter(wishlist=wishlist, product=product).first()
        if item:
            item.delete()
            added = False
        else:
            WishlistItem.objects.create(wishlist=wishlist, product=product)
            added = True

        return Response({
            'added': added,
            'wishlist': WishlistSerializer(wishlist).data
        })


class WishlistItemDeleteView(APIView):
    @extend_schema(
        summary="Remove item from wishlist by item ID",
        responses={
            200: WishlistSerializer,
            404: OpenApiResponse(description="Wishlist item not found")
        }
    )
    def delete(self, request, item_id):
        wishlist = get_user_wishlist(request)
        item = get_object_or_404(WishlistItem, id=item_id, wishlist=wishlist)
        item.delete()
        return Response(WishlistSerializer(wishlist).data)
