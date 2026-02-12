from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiseaseViewSet, DiseasePredictionViewSet

router = DefaultRouter()
router.register(r'', DiseaseViewSet, basename='disease')
router.register(r'predictions', DiseasePredictionViewSet, basename='disease-prediction')

urlpatterns = [
    path('', include(router.urls)),
]
