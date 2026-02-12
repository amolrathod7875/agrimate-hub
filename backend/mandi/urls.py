from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MandiPriceViewSet, PriceAlertViewSet

router = DefaultRouter()
router.register(r'prices', MandiPriceViewSet, basename='mandi-price')
router.register(r'alerts', PriceAlertViewSet, basename='price-alert')

urlpatterns = [
    path('', include(router.urls)),
]
