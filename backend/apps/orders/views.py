import uuid
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiResponse

from .models import Order
from .serializers import OrderSerializer, OrderCreateSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    lookup_field = 'order_number'

    def get_permissions(self):
        if self.action in ['create', 'track']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Order.objects.none()
        qs = Order.objects.prefetch_related('items', 'items__product').all()
        user = self.request.user
        if not user.is_authenticated:
            return qs.none()
        if user.is_staff or user.role in ['admin', 'staff']:
            return qs
        return qs.filter(user=user)

    def get_object(self):
        lookup = self.kwargs.get(self.lookup_field)
        queryset = self.get_queryset()

        try:
            val = uuid.UUID(lookup)
            return get_object_or_404(queryset, id=val)
        except (ValueError, AttributeError):
            pass

        return get_object_or_404(queryset, order_number__iexact=lookup)

    @extend_schema(
        summary="Create a new order with atomic checkout and inventory reservation",
        request=OrderCreateSerializer,
        responses={201: OrderSerializer}
    )
    def create(self, request, *args, **kwargs):
        serializer = OrderCreateSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        output_serializer = OrderSerializer(order)
        return Response(output_serializer.data, status=status.HTTP_201_CREATED)

    @extend_schema(
        summary="Track order by order reference or tracking number",
        parameters=[
            OpenApiParameter(
                name="query",
                type=str,
                location=OpenApiParameter.PATH,
                description="Order number (e.g. BDSE-20261024-1234) or courier tracking number"
            )
        ],
        responses={
            200: OrderSerializer,
            404: OpenApiResponse(description="Order not found")
        }
    )
    @action(detail=False, methods=['get'], url_path=r'track/(?P<query>[^/.]+)')
    def track(self, request, query=None):
        # Allow anyone with the exact order number or tracking number to track the order
        order = Order.objects.prefetch_related('items').filter(
            order_number__iexact=query
        ).first() or Order.objects.prefetch_related('items').filter(
            tracking_number__iexact=query
        ).first()

        if not order:
            return Response(
                {'detail': f"No order found matching '{query}'"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = self.get_serializer(order)
        return Response(serializer.data)
