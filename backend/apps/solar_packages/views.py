import uuid
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from .models import SolarPackage
from .serializers import SolarPackageSerializer


class SolarPackageViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = SolarPackageSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return SolarPackage.objects.filter(is_active=True).prefetch_related(
            'package_items',
            'package_items__product'
        )

    def get_object(self):
        lookup = self.kwargs.get(self.lookup_field)
        queryset = self.get_queryset()

        try:
            val = uuid.UUID(lookup)
            return get_object_or_404(queryset, id=val)
        except (ValueError, AttributeError):
            pass

        pkg = queryset.filter(slug=lookup).first()
        if pkg:
            return pkg

        pkg = queryset.filter(legacy_id=lookup).first()
        if pkg:
            return pkg

        return get_object_or_404(queryset, id=lookup)
