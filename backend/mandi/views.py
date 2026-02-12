from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.db.models import Avg, Max, Min
from .models import MandiPrice, PriceAlert
from .serializers import MandiPriceSerializer, PriceAlertSerializer


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
