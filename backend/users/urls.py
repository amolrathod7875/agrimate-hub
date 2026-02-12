from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, FarmerProfileViewSet

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')
router.register(r'profiles', FarmerProfileViewSet, basename='farmer-profile')

urlpatterns = [
    path('', include(router.urls)),
]
