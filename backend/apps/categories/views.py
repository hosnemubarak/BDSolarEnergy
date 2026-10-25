import uuid
from django.db.models import Count, Q, Prefetch
from rest_framework import viewsets, filters
from .models import Category, Subcategory
from .serializers import CategorySerializer, SubcategorySerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'slug', 'description']
    ordering_fields = ['display_order', 'name', 'created_at']
    ordering = ['display_order', 'name']
    lookup_field = 'slug'

    def get_queryset(self):
        # Optimized query with Count annotation and prefetched subcategories with annotations
        subcategories_qs = Subcategory.objects.filter(is_active=True).annotate(
            _product_count=Count('products', filter=Q(products__is_active=True))
        ).order_by('display_order', 'name')

        return Category.objects.filter(is_active=True).annotate(
            _product_count=Count('products', filter=Q(products__is_active=True))
        ).prefetch_related(
            Prefetch('subcategories', queryset=subcategories_qs)
        )

    def get_object(self):
        lookup = self.kwargs.get(self.lookup_field)
        queryset = self.get_queryset()

        # Check if lookup is a valid UUID
        try:
            val = uuid.UUID(lookup)
            return queryset.get(id=val)
        except (ValueError, AttributeError):
            pass

        try:
            return queryset.get(slug=lookup)
        except Category.DoesNotExist:
            return queryset.get(id=lookup)
