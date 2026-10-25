import uuid
from django.db.models import Count, Q
from rest_framework import viewsets, filters
from .models import Brand
from .serializers import BrandSerializer


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = BrandSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'slug', 'country', 'description']
    ordering_fields = ['name', 'created_at', 'is_popular']
    ordering = ['name']
    lookup_field = 'slug'

    def get_queryset(self):
        return Brand.objects.filter(is_active=True).annotate(
            _product_count=Count('products', filter=Q(products__is_active=True))
        )

    def get_object(self):
        lookup = self.kwargs.get(self.lookup_field)
        queryset = self.get_queryset()

        try:
            val = uuid.UUID(lookup)
            return queryset.get(id=val)
        except (ValueError, AttributeError):
            pass

        try:
            return queryset.get(slug=lookup)
        except Brand.DoesNotExist:
            return queryset.get(id=lookup)
