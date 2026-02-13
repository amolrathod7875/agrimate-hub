from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django.db.models import Avg, Max, Min
from django.conf import settings
from .models import MandiPrice, PriceAlert
from .serializers import MandiPriceSerializer, PriceAlertSerializer
import requests
import logging

logger = logging.getLogger(__name__)

# data.gov.in API configuration
DATA_GOV_API_URL = "https://api.data.gov.in/resource/9ef842fd-9a74-49c2-ad7a-ccc945674a44"
DATA_GOV_API_KEY = getattr(settings, 'DATA_GOV_API_KEY', '')  # Add your API key in settings.py


class MandiPriceViewSet(viewsets.ModelViewSet):
    queryset = MandiPrice.objects.all()
    serializer_class = MandiPriceSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = MandiPrice.objects.all()
        
        # Filter by parameters
        crop_id = self.request.query_params.get('crop_id', None)
        state = self.request.query_params.get('state', None)
        district = self.request.query_params.get('district', None)
        
        if crop_id:
            queryset = queryset.filter(crop_id=crop_id)
        if state:
            queryset = queryset.filter(state=state)
        if district:
            queryset = queryset.filter(district=district)
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest prices for a crop"""
        crop_id = request.query_params.get('crop_id', None)
        if not crop_id:
            return Response({'error': 'crop_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Get latest date for this crop
        latest_date = MandiPrice.objects.filter(crop_id=crop_id).first()
        if not latest_date:
            return Response({'error': 'No prices found for this crop'}, status=status.HTTP_404_NOT_FOUND)
        
        prices = MandiPrice.objects.filter(crop_id=crop_id, price_date=latest_date.price_date)
        serializer = self.get_serializer(prices, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get price statistics for a crop"""
        crop_id = request.query_params.get('crop_id', None)
        state = request.query_params.get('state', None)
        
        if not crop_id:
            return Response({'error': 'crop_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        
        queryset = MandiPrice.objects.filter(crop_id=crop_id)
        if state:
            queryset = queryset.filter(state=state)
        
        stats = queryset.aggregate(
            avg_price=Avg('modal_price'),
            max_price=Max('max_price'),
            min_price=Min('min_price')
        )
        
        return Response(stats)


class PriceAlertViewSet(viewsets.ModelViewSet):
    queryset = PriceAlert.objects.all()
    serializer_class = PriceAlertSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter alerts for current user"""
        if self.request.user.is_staff:
            return PriceAlert.objects.all()
        return PriceAlert.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
def mandi_price_proxy(request):
    """
    Proxy view for data.gov.in Mandi Price API.
    Accepts GET parameters for 'state' and 'district'.
    
    Usage:
        GET /api/mandi/proxy/?state=Maharashtra&district=Mumbai
        GET /api/mandi/proxy/?state=Punjab
    """
    # Get API key from settings or request header
    api_key = DATA_GOV_API_KEY or request.headers.get('X-API-Key', '')
    
    # Get filter parameters
    state = request.query_params.get('state', None)
    district = request.query_params.get('district', None)
    crop = request.query_params.get('crop', None)
    market = request.query_params.get('market', None)
    limit = request.query_params.get('limit', 100)  # Default limit
    
    # Build filters dictionary
    filters = {}
    if state:
        filters['state'] = state
    if district:
        filters['district'] = district
    if crop:
        filters['commodity'] = crop
    if market:
        filters['market'] = market
    
    # Build API request parameters
    params = {
        'api-key': api_key,
        'format': 'json',
        'limit': limit,
    }
    params.update(filters)
    
    try:
        # Make request to data.gov.in API
        response = requests.get(DATA_GOV_API_URL, params=params, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            
            # Check if we got records
            if 'records' in data and len(data['records']) > 0:
                return Response({
                    'success': True,
                    'source': 'data.gov.in',
                    'filters_applied': filters,
                    'count': len(data['records']),
                    'total_records': data.get('total', len(data['records'])),
                    'records': data['records']
                })
            else:
                return Response({
                    'success': False,
                    'error': 'No records found',
                    'filters_applied': filters,
                    'message': 'No mandi price data found for the specified filters'
                }, status=status.HTTP_404_NOT_FOUND)
        elif response.status_code == 401:
            logger.error("data.gov.in API: Invalid or missing API key")
            return Response({
                'success': False,
                'error': 'API key invalid or missing',
                'message': 'Please provide a valid API key for data.gov.in'
            }, status=status.HTTP_401_UNAUTHORIZED)
        elif response.status_code == 403:
            logger.error("data.gov.in API: Access forbidden (rate limit or quota exceeded)")
            return Response({
                'success': False,
                'error': 'Access forbidden',
                'message': 'API rate limit exceeded or quota finished'
            }, status=status.HTTP_403_FORBIDDEN)
        else:
            logger.error(f"data.gov.in API: HTTP {response.status_code} - {response.text}")
            return Response({
                'success': False,
                'error': f'HTTP {response.status_code}',
                'message': 'Failed to fetch data from data.gov.in'
            }, status=status.HTTP_502_BAD_GATEWAY)
            
    except requests.exceptions.Timeout:
        logger.error("data.gov.in API: Request timed out")
        return Response({
            'success': False,
            'error': 'Request timeout',
            'message': 'The data.gov.in API is not responding. Please try again later.'
        }, status=status.HTTP_504_GATEWAY_TIMEOUT)
    
    except requests.exceptions.ConnectionError as e:
        logger.error(f"data.gov.in API: Connection error - {e}")
        return Response({
            'success': False,
            'error': 'Connection error',
            'message': 'Unable to connect to data.gov.in API. The service may be down.'
        }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
    except requests.exceptions.RequestException as e:
        logger.error(f"data.gov.in API: Request failed - {e}")
        return Response({
            'success': False,
            'error': 'Request failed',
            'message': f'An error occurred while fetching data: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    except Exception as e:
        logger.exception(f"Unexpected error in mandi_price_proxy: {e}")
        return Response({
            'success': False,
            'error': 'Internal server error',
            'message': 'An unexpected error occurred'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
