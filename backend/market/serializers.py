from rest_framework import serializers
from .models import ProductListing, ProductInquiry


class ProductListingSerializer(serializers.ModelSerializer):
    seller_name = serializers.CharField(source='seller.username', read_only=True)
    crop_name = serializers.CharField(source='crop.name', read_only=True)
    total_price = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductListing
        fields = '__all__'
        read_only_fields = ['seller', 'created_at', 'updated_at']
    
    def get_total_price(self, obj):
        return float(obj.quantity * obj.price_per_unit)


class ProductInquirySerializer(serializers.ModelSerializer):
    buyer_name = serializers.CharField(source='buyer.username', read_only=True)
    listing_title = serializers.CharField(source='listing.title', read_only=True)
    
    class Meta:
        model = ProductInquiry
        fields = '__all__'
        read_only_fields = ['buyer', 'status', 'created_at', 'updated_at']
