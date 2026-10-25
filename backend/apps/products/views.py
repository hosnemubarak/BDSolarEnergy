import uuid
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.shortcuts import get_object_or_404

from .models import Product
from .serializers import ProductSerializer
from .filters import ProductFilter


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'sku', 'description', 'short_description', 'brand__name']
    ordering_fields = ['price', 'rating', 'created_at', 'review_count']
    ordering = ['-created_at']
    lookup_field = 'slug'

    def get_queryset(self):
        return Product.objects.filter(is_active=True).select_related(
            'category',
            'subcategory',
            'brand'
        ).prefetch_related(
            'gallery_images'
        )

    def get_object(self):
        lookup = self.kwargs.get(self.lookup_field)
        queryset = self.get_queryset()

        # 1. Try UUID lookup
        try:
            val = uuid.UUID(lookup)
            return get_object_or_404(queryset, id=val)
        except (ValueError, AttributeError):
            pass

        # 2. Try slug lookup
        product = queryset.filter(slug=lookup).first()
        if product:
            return product

        # 3. Try legacy_id lookup (e.g. 'prod-sp-01')
        product = queryset.filter(legacy_id=lookup).first()
        if product:
            return product

        # 4. Try SKU lookup
        return get_object_or_404(queryset, sku__iexact=lookup)

    @action(detail=False, methods=['get'], url_path='featured')
    def featured(self, request):
        featured_qs = self.get_queryset().filter(Q(is_featured=True) | Q(is_bestseller=True))[:12]
        serializer = self.get_serializer(featured_qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='new-arrivals')
    def new_arrivals(self, request):
        new_qs = self.get_queryset().filter(is_new_arrival=True).order_by('-created_at')[:12]
        if not new_qs.exists():
            new_qs = self.get_queryset().order_by('-created_at')[:12]
        serializer = self.get_serializer(new_qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='on-sale')
    def on_sale(self, request):
        sale_qs = self.get_queryset().filter(Q(is_on_sale=True) | Q(original_price__isnull=False))[:12]
        serializer = self.get_serializer(sale_qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='live-search')
    def live_search(self, request):
        query = request.query_params.get('q', '').strip()
        limit = int(request.query_params.get('limit', 8))
        if not query:
            return Response([])

        qs = self.get_queryset().filter(
            Q(name__icontains=query) |
            Q(sku__icontains=query) |
            Q(brand__name__icontains=query)
        )[:limit]

        results = [
            {
                'id': str(p.id),
                'legacyId': p.legacy_id,
                'name': p.name,
                'slug': p.slug,
                'sku': p.sku,
                'brand': p.brand.name,
                'price': float(p.price),
                'originalPrice': float(p.original_price) if p.original_price else None,
                'image': p.image,
                'category': p.category.name,
            }
            for p in qs
        ]
        return Response(results)

    @action(detail=True, methods=['get'], url_path='related')
    def related(self, request, slug=None):
        product = self.get_object()
        related_qs = self.get_queryset().filter(
            category=product.category
        ).exclude(id=product.id)[:4]
        serializer = self.get_serializer(related_qs, many=True)
        return Response(serializer.data)
