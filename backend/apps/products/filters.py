import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(method='filter_category')
    categoryId = django_filters.CharFilter(method='filter_category')
    
    subcategory = django_filters.CharFilter(method='filter_subcategory')
    subcategoryId = django_filters.CharFilter(method='filter_subcategory')
    
    brand = django_filters.CharFilter(method='filter_brand')
    brandId = django_filters.CharFilter(method='filter_brand')
    
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    minPrice = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    maxPrice = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    
    in_stock = django_filters.BooleanFilter(field_name='in_stock')
    inStockOnly = django_filters.BooleanFilter(field_name='in_stock')
    
    is_featured = django_filters.BooleanFilter(field_name='is_featured')
    featuredOnly = django_filters.BooleanFilter(field_name='is_featured')
    
    is_on_sale = django_filters.BooleanFilter(field_name='is_on_sale')
    onSaleOnly = django_filters.BooleanFilter(field_name='is_on_sale')
    
    ids = django_filters.CharFilter(method='filter_ids')

    class Meta:
        model = Product
        fields = [
            'category',
            'categoryId',
            'subcategory',
            'subcategoryId',
            'brand',
            'brandId',
            'min_price',
            'minPrice',
            'max_price',
            'maxPrice',
            'in_stock',
            'inStockOnly',
            'is_featured',
            'featuredOnly',
            'is_on_sale',
            'onSaleOnly',
            'ids',
        ]

    def filter_category(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(category__slug__iexact=value)

    def filter_subcategory(self, queryset, name, value):
        if not value:
            return queryset
        return queryset.filter(subcategory__slug__iexact=value)

    def filter_brand(self, queryset, name, value):
        brands = [b.strip() for b in value.split(',') if b.strip()]
        if not brands:
            return queryset
        return queryset.filter(brand__name__in=brands) | queryset.filter(brand__slug__in=brands)

    def filter_ids(self, queryset, name, value):
        if not value:
            return queryset
        import uuid
        from django.db.models import Q
        raw_ids = [v.strip() for v in value.split(',') if v.strip()]
        uuid_list = []
        legacy_list = []
        for item in raw_ids:
            try:
                uuid_list.append(uuid.UUID(item))
            except (ValueError, AttributeError):
                legacy_list.append(item)
        q = Q()
        if uuid_list:
            q |= Q(id__in=uuid_list)
        if legacy_list:
            q |= Q(legacy_id__in=legacy_list) | Q(slug__in=legacy_list)
        return queryset.filter(q)
