from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Crop, CropRecommendation
from .serializers import CropSerializer, CropRecommendationSerializer


class CropViewSet(viewsets.ModelViewSet):
    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['get'])
    def by_season(self, request):
        """Get crops by season"""
        season = request.query_params.get('season', None)
        if season:
            crops = self.queryset.filter(season__in=[season, 'all'])
            serializer = self.get_serializer(crops, many=True)
            return Response(serializer.data)
        return Response({'error': 'Season parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class CropRecommendationViewSet(viewsets.ModelViewSet):
    queryset = CropRecommendation.objects.all()
    serializer_class = CropRecommendationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter recommendations for current user"""
        if self.request.user.is_staff:
            return CropRecommendation.objects.all()
        return CropRecommendation.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Generate crop recommendations based on input parameters"""
        # Get input parameters
        nitrogen = serializer.validated_data['nitrogen']
        phosphorus = serializer.validated_data['phosphorus']
        potassium = serializer.validated_data['potassium']
        temperature = serializer.validated_data['temperature']
        ph = serializer.validated_data['ph']
        rainfall = serializer.validated_data['rainfall']
        
        # Simple recommendation logic (can be replaced with ML model)
        suitable_crops = Crop.objects.filter(
            ph_min__lte=ph,
            ph_max__gte=ph,
            temp_min__lte=temperature,
            temp_max__gte=temperature,
            rainfall_min__lte=rainfall,
            rainfall_max__gte=rainfall,
        )
        
        recommended_crops = []
        for crop in suitable_crops[:5]:  # Top 5 recommendations
            recommended_crops.append({
                'crop_name': crop.name,
                'crop_id': crop.id,
                'season': crop.season,
                'duration_days': crop.duration_days,
            })
        
        serializer.save(user=self.request.user, recommended_crops=recommended_crops)
