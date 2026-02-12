from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Disease, DiseasePrediction
from .serializers import DiseaseSerializer, DiseasePredictionSerializer
import random


class DiseaseViewSet(viewsets.ModelViewSet):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['get'])
    def by_crop(self, request):
        """Get diseases by crop"""
        crop_id = request.query_params.get('crop_id', None)
        if crop_id:
            diseases = self.queryset.filter(affected_crops__id=crop_id)
            serializer = self.get_serializer(diseases, many=True)
            return Response(serializer.data)
        return Response({'error': 'crop_id parameter required'}, status=status.HTTP_400_BAD_REQUEST)


class DiseasePredictionViewSet(viewsets.ModelViewSet):
    queryset = DiseasePrediction.objects.all()
    serializer_class = DiseasePredictionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter predictions for current user"""
        if self.request.user.is_staff:
            return DiseasePrediction.objects.all()
        return DiseasePrediction.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        """Process disease prediction"""
        # Save the prediction
        prediction = serializer.save(user=self.request.user)
        
        # Mock ML prediction (replace with actual ML model)
        # For now, randomly select a disease
        diseases = Disease.objects.all()
        if diseases.exists():
            predicted_disease = random.choice(diseases)
            confidence = round(random.uniform(70, 95), 2)
            
            prediction.predicted_disease = predicted_disease
            prediction.confidence = confidence
            prediction.is_processed = True
            prediction.save()
