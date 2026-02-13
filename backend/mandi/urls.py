from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MandiPriceViewSet, PriceAlertViewSet, mandi_price_proxy

router = DefaultRouter()
router.register(r'prices', MandiPriceViewSet, basename='mandi-price')
router.register(r'alerts', PriceAlertViewSet, basename='price-alert')

urlpatterns = [
    path('', include(router.urls)),
    path('proxy/', mandi_price_proxy, name='mandi-price-proxy'),
]
