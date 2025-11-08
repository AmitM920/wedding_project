# gallery/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend  # 🆕 For filtering
from .models import WeddingImage
from .serializers import WeddingImageSerializer

@api_view(['GET'])
def hello_world(request):
    return Response({
        "message": "API is running!",
        "version": "1.0",
        "endpoints": [
            "/api/gallery/images/",
            "/api/gallery/images/categories/",
            "/api/gallery/images/featured/"
        ]
    })

class WeddingImageViewSet(viewsets.ModelViewSet):
    queryset = WeddingImage.objects.all()
    serializer_class = WeddingImageSerializer
    filter_backends = [DjangoFilterBackend]  # 🆕 Enable filtering
    filterset_fields = ['category', 'is_featured']  # 🆕 Filter by these fields
    
    def get_queryset(self):
        # 🆕 Advanced query optimization
        queryset = WeddingImage.objects.all().select_related()
        
        # Filter by category if provided
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
            
        return queryset
    
    @action(detail=False, methods=['get'])
    def categories(self, request):
        """Get all available categories with counts"""
        categories = []
        for choice in WeddingImage.CATEGORY_CHOICES:
            count = WeddingImage.objects.filter(category=choice[0]).count()
            categories.append({
                'value': choice[0],
                'label': choice[1],
                'count': count
            })
        return Response(categories)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured images only"""
        featured_images = WeddingImage.objects.filter(is_featured=True)
        serializer = self.get_serializer(featured_images, many=True)
        return Response({
            'count': featured_images.count(),
            'results': serializer.data
        })
    
    def create(self, request, *args, **kwargs):
        """Custom create method for logging"""
        print(f"🆕 New image upload: {request.data.get('title')}")
        return super().create(request, *args, **kwargs)