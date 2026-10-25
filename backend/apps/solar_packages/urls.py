from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SolarPackageViewSet

router = DefaultRouter()
router.register(r'', SolarPackageViewSet, basename='solar-package')

urlpatterns = [
    path('', include(router.urls)),
]
