from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductListingViewSet, ProductInquiryViewSet

router = DefaultRouter()
router.register(r'listings', ProductListingViewSet, basename='product-listing')
router.register(r'inquiries', ProductInquiryViewSet, basename='product-inquiry')

urlpatterns = [
    path('', include(router.urls)),
]
