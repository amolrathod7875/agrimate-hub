from django.urls import path, include
from rest_framework.routers import DefaultRouter
from ._views_clean import ProductListingViewSet, ProductInquiryViewSet, mandi_prices

router = DefaultRouter()
router.register(r'listings', ProductListingViewSet, basename='product-listing')
router.register(r'inquiries', ProductInquiryViewSet, basename='product-inquiry')

urlpatterns = [
    path('', include(router.urls)),
    path('mandi/', mandi_prices, name='mandi-prices'),
]
