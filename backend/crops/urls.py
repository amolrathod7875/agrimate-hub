from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CropViewSet, CropRecommendationViewSet

router = DefaultRouter()
router.register(r'', CropViewSet, basename='crop')
router.register(r'recommendations', CropRecommendationViewSet, basename='crop-recommendation')

urlpatterns = [
    path('', include(router.urls)),
]
