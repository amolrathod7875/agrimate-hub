from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Crop, CropRecommendation
from .serializers import CropSerializer, CropRecommendationSerializer
from .recommendation import get_crop_recommendations


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
    permission_classes = [IsAuthenticatedOrReadOnly]  # Allow read-only for testing
    
    def get_queryset(self):
        """Filter recommendations for current user"""
        if self.request.user.is_authenticated:
            if self.request.user.is_staff:
                return CropRecommendation.objects.all()
            return CropRecommendation.objects.filter(user=self.request.user)
        return CropRecommendation.objects.none()
    
    def perform_create(self, serializer):
        """Generate crop recommendations based on input parameters"""
        # Get input parameters
        nitrogen = serializer.validated_data['nitrogen']
        phosphorus = serializer.validated_data['phosphorus']
        potassium = serializer.validated_data['potassium']
        temperature = serializer.validated_data['temperature']
        humidity = serializer.validated_data['humidity']
        ph = serializer.validated_data['ph']
        rainfall = serializer.validated_data['rainfall']
        state = serializer.validated_data.get('state', None)
        
        # Use the recommendation engine
        recommended_crops = get_crop_recommendations(
            nitrogen=nitrogen,
            phosphorus=phosphorus,
            potassium=potassium,
            temperature=temperature,
            humidity=humidity,
            ph=ph,
            rainfall=rainfall,
            state=state
        )
        
        # Save with user if authenticated, otherwise allow anonymous
        if self.request.user.is_authenticated:
            serializer.save(user=self.request.user, recommended_crops=recommended_crops)
        else:
            # For testing/demo purposes, create with a dummy response
            # In production, you might want to require authentication
            serializer.save(user=None, recommended_crops=recommended_crops)
