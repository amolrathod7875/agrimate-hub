"""
URL configuration for agri_sahayak project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def api_root(request):
    """Root API endpoint showing available endpoints"""
    return JsonResponse({
        'message': 'Welcome to Agri Sahayak API',
        'version': '1.0',
        'endpoints': {
            'admin': '/admin/',
            'users': '/api/users/',
            'crops': '/api/crops/',
            'crop_recommendations': '/api/crops/recommendations/',
            'diseases': '/api/diseases/',
            'disease_predictions': '/api/diseases/predictions/',
            'government_schemes': '/api/schemes/',
            'mandi_prices': '/api/mandi/prices/',
            'price_alerts': '/api/mandi/alerts/',
            'market_listings': '/api/market/listings/',
            'product_inquiries': '/api/market/inquiries/',
        },
        'documentation': 'See README.md for detailed API documentation'
    })


urlpatterns = [
    path('', api_root, name='api-root'),
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
