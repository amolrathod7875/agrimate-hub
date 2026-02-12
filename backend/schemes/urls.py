from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GovernmentSchemeViewSet

router = DefaultRouter()
router.register(r'', GovernmentSchemeViewSet, basename='scheme')

urlpatterns = [
    path('', include(router.urls)),
]
