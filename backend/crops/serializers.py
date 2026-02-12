from rest_framework import serializers
from .models import Crop, CropRecommendation


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = '__all__'


class CropRecommendationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = CropRecommendation
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'recommended_crops']
