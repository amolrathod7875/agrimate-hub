from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from .models import Disease, DiseasePrediction
from .serializers import DiseaseSerializer, DiseasePredictionSerializer
from .prediction import predict_plant_disease


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
    permission_classes = [AllowAny]
    authentication_classes = []  # Disable authentication for this endpoint
    
    def get_queryset(self):
        """Filter predictions for current user, or return all for anonymous during creation"""
        # For list/retrieve, filter by user
        if self.action in ['list', 'retrieve', 'update', 'partial_update', 'destroy']:
            if self.request.user.is_authenticated:
                if self.request.user.is_staff:
                    return DiseasePrediction.objects.all()
                return DiseasePrediction.objects.filter(user=self.request.user)
            return DiseasePrediction.objects.none()
        # For create, allow all
        return DiseasePrediction.objects.all()
    
    def create(self, request, *args, **kwargs):
        """Override create to ensure it works for anonymous users"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def perform_create(self, serializer):
        """Process disease prediction using CNN model"""
        # Save the prediction with uploaded image
        # Allow both authenticated and anonymous users for testing
        user = self.request.user if self.request.user.is_authenticated else None
        prediction = serializer.save(user=user)
        
        # Get the uploaded image
        image_file = prediction.plant_image
        
        # Use ML model for prediction
        result = predict_plant_disease(image_file, top_k=3)
        
        if result.get('success'):
            top_pred = result['top_prediction']
            
            # Try to find matching disease in database
            disease_name = top_pred['disease']
            crop_name = top_pred['crop']
            
            # Search for disease (case-insensitive, partial match)
            matching_disease = Disease.objects.filter(
                name__icontains=disease_name
            ).first()
            
            # Update prediction with results
            prediction.predicted_disease = matching_disease
            prediction.confidence = top_pred['confidence']
            prediction.additional_info = {
                'crop': crop_name,
                'is_healthy': top_pred['is_healthy'],
                'all_predictions': result['all_predictions'],
                'model_info': result.get('model_info', {})
            }
            prediction.is_processed = True
            
            # Add notes if healthy
            if top_pred['is_healthy']:
                prediction.notes = f"The {crop_name} plant appears to be healthy!"
            else:
                prediction.notes = f"Detected: {disease_name} in {crop_name}"
            
            prediction.save()
        else:
            # If prediction failed, mark as processed with error
            prediction.is_processed = True
            prediction.notes = f"Error: {result.get('error', 'Prediction failed')}"
            prediction.save()
