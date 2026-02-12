"""
URL configuration for agri_sahayak project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/crops/', include('crops.urls')),
    path('api/diseases/', include('diseases.urls')),
    path('api/schemes/', include('schemes.urls')),
    path('api/mandi/', include('mandi.urls')),
    path('api/market/', include('market.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
