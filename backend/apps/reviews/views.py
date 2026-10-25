import uuid
from decimal import Decimal
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.db.models import Avg
from django.db import transaction

from apps.products.models import Product
from apps.orders.models import Order
from drf_spectacular.utils import extend_schema, OpenApiResponse
from .models import ProductReview
from .serializers import ProductReviewSerializer, ProductReviewCreateSerializer


class ProductReviewViewSet(viewsets.ModelViewSet):
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return ProductReview.objects.none()
        qs = ProductReview.objects.filter(is_approved=True).select_related('product')
        product_param = self.request.query_params.get('product')
        if product_param:
            try:
                val = uuid.UUID(product_param)
                return qs.filter(product__id=val)
            except (ValueError, AttributeError):
                return qs.filter(product__slug=product_param) | qs.filter(product__legacy_id=product_param)
        return qs

    @extend_schema(
        summary="Submit customer review for a product",
        request=ProductReviewCreateSerializer,
        responses={201: ProductReviewSerializer}
    )
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product')
        product = None
        try:
            val = uuid.UUID(str(product_id))
            product = Product.objects.filter(id=val).first()
        except (ValueError, AttributeError):
            pass

        if not product:
            product = Product.objects.filter(slug=product_id).first() or Product.objects.filter(legacy_id=product_id).first()

        if not product:
            return Response({'product': ['Product not found.']}, status=status.HTTP_404_NOT_FOUND)

        data = request.data.copy()
        data['product'] = product.id
        if not data.get('reviewer_name'):
            data['reviewer_name'] = data.get('author_name') or data.get('userName') or (
                request.user.get_full_name() or request.user.username if request.user.is_authenticated else 'Customer'
            )

        serializer = ProductReviewCreateSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        user = request.user if request.user.is_authenticated else None
        is_verified = False
        if user:
            # Check if user previously bought this product
            is_verified = Order.objects.filter(user=user, items__product=product).exists()

        review = serializer.save(user=user, is_verified_purchase=is_verified)

        # Update Product rating and review_count
        avg_rating = ProductReview.objects.filter(product=product, is_approved=True).aggregate(Avg('rating'))['rating__avg'] or review.rating
        product.rating = Decimal(str(round(avg_rating, 2)))
        product.review_count = ProductReview.objects.filter(product=product, is_approved=True).count()
        product.save(update_fields=['rating', 'review_count'])

        return Response(ProductReviewSerializer(review).data, status=status.HTTP_201_CREATED)
