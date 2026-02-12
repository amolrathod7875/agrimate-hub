from rest_framework import serializers
from .models import MandiPrice, PriceAlert


class MandiPriceSerializer(serializers.ModelSerializer):
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    
    class Meta:
        model = MandiPrice
        fields = '__all__'


class PriceAlertSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    
    class Meta:
        model = PriceAlert
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']
