from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import ProductListing, ProductInquiry
from .serializers import ProductListingSerializer, ProductInquirySerializer


class ProductListingViewSet(viewsets.ModelViewSet):
    queryset = ProductListing.objects.filter(status='available')
    serializer_class = ProductListingSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = ProductListing.objects.all()
        
        # Filter parameters
        status_param = self.request.query_params.get('status', 'available')
        crop_id = self.request.query_params.get('crop_id', None)
        state = self.request.query_params.get('state', None)
        district = self.request.query_params.get('district', None)
        
        if status_param:
            queryset = queryset.filter(status=status_param)
        if crop_id:
            queryset = queryset.filter(crop_id=crop_id)
        if state:
            queryset = queryset.filter(state=state)
        if district:
            queryset = queryset.filter(district=district)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(seller=self.request.user)
    
    @action(detail=False, methods=['get'])
    def my_listings(self, request):
        """Get listings by current user"""
        listings = ProductListing.objects.filter(seller=request.user)
        serializer = self.get_serializer(listings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def mark_sold(self, request, pk=None):
        """Mark a listing as sold"""
        listing = self.get_object()
        if listing.seller != request.user and not request.user.is_staff:
            return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)
        
        listing.status = 'sold'
        listing.save()
        serializer = self.get_serializer(listing)
        return Response(serializer.data)


class ProductInquiryViewSet(viewsets.ModelViewSet):
    queryset = ProductInquiry.objects.all()
    serializer_class = ProductInquirySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Filter inquiries based on user role"""
        user = self.request.user
        
        # Sellers see inquiries for their listings
        # Buyers see their own inquiries
        if user.is_staff:
            return ProductInquiry.objects.all()
        
        return ProductInquiry.objects.filter(buyer=user) | ProductInquiry.objects.filter(listing__seller=user)
    
    def perform_create(self, serializer):
        serializer.save(buyer=self.request.user)
    
    @action(detail=True, methods=['post'])
    def reply(self, request, pk=None):
        """Seller reply to inquiry"""
        inquiry = self.get_object()
        
        if inquiry.listing.seller != request.user:
            return Response({'error': 'Only the seller can reply'}, status=status.HTTP_403_FORBIDDEN)
        
        reply_text = request.data.get('reply', '')
        if not reply_text:
            return Response({'error': 'Reply text required'}, status=status.HTTP_400_BAD_REQUEST)
        
        inquiry.seller_reply = reply_text
        inquiry.status = 'replied'
        inquiry.save()
        
        serializer = self.get_serializer(inquiry)
        return Response(serializer.data)
