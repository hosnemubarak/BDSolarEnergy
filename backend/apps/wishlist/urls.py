from django.urls import path
from .views import WishlistView, WishlistItemDeleteView

urlpatterns = [
    path('', WishlistView.as_view(), name='wishlist-detail'),
    path('toggle/', WishlistView.as_view(), name='wishlist-toggle'),
    path('<uuid:item_id>/', WishlistItemDeleteView.as_view(), name='wishlist-item-delete-direct'),
    path('items/<uuid:item_id>/', WishlistItemDeleteView.as_view(), name='wishlist-item-delete'),
]
