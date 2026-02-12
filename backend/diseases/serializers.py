from rest_framework import serializers
from .models import Disease, DiseasePrediction


class DiseaseSerializer(serializers.ModelSerializer):
    affected_crops = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Disease
        fields = '__all__'


class DiseasePredictionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    predicted_disease = DiseaseSerializer(read_only=True)
    
    class Meta:
        model = DiseasePrediction
        fields = '__all__'
        read_only_fields = ['user', 'predicted_disease', 'confidence', 'is_processed', 'created_at', 'updated_at']
