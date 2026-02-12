from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import GovernmentScheme
from .serializers import GovernmentSchemeSerializer


class GovernmentSchemeViewSet(viewsets.ModelViewSet):
    queryset = GovernmentScheme.objects.filter(is_active=True)
    serializer_class = GovernmentSchemeSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Get schemes by category"""
        category = request.query_params.get('category', None)
        if category:
            schemes = self.queryset.filter(category=category)
            serializer = self.get_serializer(schemes, many=True)
            return Response(serializer.data)
        return Response({'error': 'category parameter required'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def by_state(self, request):
        """Get schemes by state"""
        state = request.query_params.get('state', None)
        if state:
            # Filter schemes where states list contains the given state or is empty (applies to all)
            schemes = self.queryset.filter(states__contains=[state]) | self.queryset.filter(states=[])
            serializer = self.get_serializer(schemes, many=True)
            return Response(serializer.data)
        return Response({'error': 'state parameter required'}, status=status.HTTP_400_BAD_REQUEST)
