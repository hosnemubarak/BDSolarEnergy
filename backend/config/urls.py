from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


def api_root_view(request):
    return JsonResponse({
        'name': 'BD Solar Energy REST API',
        'version': 'v1',
        'status': 'online',
        'architecture': 'UUID-Based Relational Architecture with JWT Authentication',
        'documentation': {
            'swagger': '/api/docs/',
            'redoc': '/api/redoc/',
            'schema': '/api/schema/',
        },
        'endpoints': {
            'auth_register': '/api/v1/auth/register/',
            'auth_login': '/api/v1/auth/login/',
            'auth_token_refresh': '/api/v1/auth/token/refresh/',
            'auth_logout': '/api/v1/auth/logout/',
            'auth_me': '/api/v1/auth/me/',
            'auth_addresses': '/api/v1/auth/addresses/',
            'products': '/api/v1/products/',
            'featured_products': '/api/v1/products/featured/',
            'new_arrivals': '/api/v1/products/new-arrivals/',
            'on_sale_products': '/api/v1/products/on-sale/',
            'live_search': '/api/v1/products/live-search/?q=',
            'categories': '/api/v1/categories/',
            'brands': '/api/v1/brands/',
            'solar_packages': '/api/v1/solar-packages/',
            'cart': '/api/v1/cart/',
            'wishlist': '/api/v1/wishlist/',
            'orders': '/api/v1/orders/',
            'reviews': '/api/v1/reviews/',
            'admin': '/admin/',
        }
    })


urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # OpenAPI Schema & Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # API Root
    path('api/v1/', api_root_view, name='api-root'),

    # Core Application APIs
    path('api/v1/auth/', include('apps.accounts.urls')),
    path('api/v1/products/', include('apps.products.urls')),
    path('api/v1/categories/', include('apps.categories.urls')),
    path('api/v1/brands/', include('apps.brands.urls')),
    path('api/v1/solar-packages/', include('apps.solar_packages.urls')),
    path('api/v1/cart/', include('apps.cart.urls')),
    path('api/v1/wishlist/', include('apps.wishlist.urls')),
    path('api/v1/orders/', include('apps.orders.urls')),
    path('api/v1/reviews/', include('apps.reviews.urls')),
]
