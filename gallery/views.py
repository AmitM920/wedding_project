# gallery/views.py
import time
import cloudinary.utils
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
import cloudinary.uploader
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
            "/api/gallery/images/featured/",
            "/api/gallery/cloudinary-signature/",  # UPDATED
            "/api/gallery/save-urls/",  # UPDATED
        ]
    })

class CloudinarySignatureView(APIView):
    """
    Returns a signature for secure client-side upload.
    This avoids the 30s timeout on Render - VERY FAST
    """
    def get(self, request):
        timestamp = int(time.time())
        folder = "wedding_gallery"
        
        # We sign the parameters that the frontend MUST send
        params_to_sign = {
            'timestamp': timestamp,
            'folder': folder,
        }
        
        # Get signature using Cloudinary's utility
        signature = cloudinary.utils.api_sign_request(
            params_to_sign, 
            cloudinary.config().api_secret
        )

        return Response({
            'success': True,
            'signature': signature,
            'timestamp': timestamp,
            'cloud_name': cloudinary.config().cloud_name,
            'api_key': cloudinary.config().api_key,
            'folder': folder
        })

class SaveCloudinaryUrlsView(APIView):
    """
    After frontend uploads to Cloudinary, it sends the URLs here 
    to be saved in the Django Database.
    This is FAST because it only saves URLs, no file handling.
    """
    parser_classes = (JSONParser,)
    
    def post(self, request):
        urls = request.data.get('urls', [])  # List of Cloudinary response objects
        category = request.data.get('category', 'wedding')
        
        if not urls:
            return Response({
                'error': 'No URLs provided'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate category
        valid_categories = [choice[0] for choice in WeddingImage.CATEGORY_CHOICES]
        if category not in valid_categories:
            category = 'wedding'
        
        saved_images = []
        failed_images = []
        
        for cloudinary_data in urls:
            try:
                # Extract filename from URL or public_id
                public_id = cloudinary_data.get('public_id', '')
                if '/' in public_id:
                    filename = public_id.split('/')[-1]
                else:
                    filename = public_id
                
                # Create the record in DB
                wedding_image = WeddingImage(
                    title=filename,
                    media_type='image',
                    category=category,
                    description=f"Direct upload - {category}",
                    is_featured=False,
                    order=0
                )
                
                # CloudinaryField accepts either:
                # 1. Cloudinary upload result dict
                # 2. URL string
                # 3. public_id string
                
                # Pass the entire Cloudinary result dict
                wedding_image.image = cloudinary_data
                
                # Save (this will trigger thumbnail generation)
                wedding_image.save()
                
                # Get URLs after save
                image_url = wedding_image.image.url if wedding_image.image else None
                thumbnail_url = wedding_image.thumbnail.url if wedding_image.thumbnail else image_url
                
                saved_images.append({
                    'id': wedding_image.id,
                    'title': wedding_image.title,
                    'image_url': image_url,
                    'thumbnail_url': thumbnail_url,
                    'category': wedding_image.category,
                    'media_type': wedding_image.media_type,
                    'public_id': public_id
                })
                
            except Exception as e:
                failed_images.append({
                    'data': cloudinary_data.get('public_id', 'unknown'),
                    'error': str(e)
                })
        
        return Response({
            'success': True,
            'message': f'Saved {len(saved_images)} images to database',
            'saved_count': len(saved_images),
            'failed_count': len(failed_images),
            'saved_images': saved_images,
            'failed_images': failed_images
        })

# Keep the old BulkUploadAPIView as backup (optional)
class BulkUploadAPIView(APIView):
    """
    DEPRECATED: Old bulk upload method that causes 502 timeout
    Keeping for backward compatibility
    """
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        return Response({
            'error': 'This endpoint is deprecated',
            'message': 'Use direct Cloudinary upload instead',
            'new_endpoints': {
                'get_signature': '/api/gallery/cloudinary-signature/',
                'save_urls': '/api/gallery/save-urls/'
            }
        }, status=status.HTTP_410_GONE)

class WeddingImageViewSet(viewsets.ModelViewSet):
    queryset = WeddingImage.objects.all()
    serializer_class = WeddingImageSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_featured', 'media_type']
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def get_queryset(self):
        queryset = WeddingImage.objects.all().order_by('category', 'order', '-uploaded_at')
        
        # Filter by category if provided
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by media_type if provided
        media_type = self.request.query_params.get('media_type')
        if media_type:
            queryset = queryset.filter(media_type=media_type)
            
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
    def media_types(self, request):
        """Get all media types with counts"""
        return Response({
            'image': WeddingImage.objects.filter(media_type='image').count(),
            'video': WeddingImage.objects.filter(media_type='video').count(),
        })
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured images only"""
        featured_images = WeddingImage.objects.filter(is_featured=True).order_by('order')
        serializer = self.get_serializer(featured_images, many=True)
        return Response({
            'count': featured_images.count(),
            'results': serializer.data
        })
    
    @action(detail=False, methods=['post'])
    def bulk_delete(self, request):
        """Bulk delete images by IDs"""
        image_ids = request.data.get('ids', [])
        
        if not image_ids:
            return Response({'error': 'No IDs provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Get the images first to delete from Cloudinary
            images = WeddingImage.objects.filter(id__in=image_ids)
            
            # Delete each one (will trigger Cloudinary deletion via model's delete method)
            for image in images:
                image.delete()
            
            return Response({
                'success': True,
                'message': f'Deleted {len(images)} images',
                'deleted_count': len(images)
            })
            
        except Exception as e:
            return Response({
                'error': f'Failed to delete images: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    def create(self, request, *args, **kwargs):
        """Custom create method for single image upload"""
        print(f"🆕 Single image upload: {request.data.get('title', 'Untitled')}")
        
        # Handle file upload
        if 'image' in request.FILES:
            try:
                image_file = request.FILES['image']
                
                # Get category from request or use default
                category = request.data.get('category', 'wedding')
                if category not in [choice[0] for choice in WeddingImage.CATEGORY_CHOICES]:
                    category = 'wedding'
                
                # Create a mutable copy of request.data
                mutable_data = request.data.copy()
                
                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    image_file,
                    folder="wedding_gallery",
                    resource_type="image"
                )
                
                # Set the media_type
                mutable_data['media_type'] = 'image'
                
                # Create the model instance with the upload result
                wedding_image = WeddingImage(
                    title=mutable_data.get('title', image_file.name.rsplit('.', 1)[0]),
                    media_type='image',
                    category=category,
                    description=mutable_data.get('description', ''),
                    is_featured=mutable_data.get('is_featured', False),
                    order=mutable_data.get('order', 0)
                )
                
                # Set the CloudinaryField
                wedding_image.image = upload_result
                wedding_image.save()
                
                # Return the created instance
                serializer = self.get_serializer(wedding_image)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                return Response({
                    'error': f'Upload failed: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle video upload or other cases
        return super().create(request, *args, **kwargs)