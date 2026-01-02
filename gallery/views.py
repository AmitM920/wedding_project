# gallery/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
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
            "/api/gallery/bulk-upload/"  # NEW
        ]
    })

class BulkUploadAPIView(APIView):
    """
    Handle bulk uploads for Render (max 20 images at a time)
    Works with your existing CloudinaryField model
    """
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request, *args, **kwargs):
        # Get images from request (handles both 'images' and 'images[]')
        images = request.FILES.getlist('images[]') or request.FILES.getlist('images')
        
        if not images:
            return Response({
                'error': 'No images provided',
                'tip': 'Make sure form field name is "images" or "images[]"'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # IMPORTANT: Limit to 20 images at a time for Render
        if len(images) > 20:
            return Response({
                'error': 'Too many images at once',
                'message': 'Render free tier has 30-second timeout. Please upload maximum 20 images at a time.',
                'max_allowed': 20,
                'received': len(images),
                'solution': 'Split your upload into batches of 20 images'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_images = []
        failed_images = []
        
        # Get category from request or use default
        category = request.data.get('category', 'wedding')
        if category not in [choice[0] for choice in WeddingImage.CATEGORY_CHOICES]:
            category = 'wedding'  # Default to wedding
        
        for index, image in enumerate(images):
            try:
                print(f"📤 Uploading {index + 1}/{len(images)}: {image.name} ({category})")
                
                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    image,
                    folder="wedding_gallery",
                    resource_type="image",
                    overwrite=False,
                    timeout=30
                )
                
                # Get the filename without extension for title
                title = image.name.rsplit('.', 1)[0] if '.' in image.name else image.name
                title = title[:200]  # Truncate to model max length
                
                # Create WeddingImage instance with CloudinaryField
                # CloudinaryField accepts the Cloudinary result directly
                wedding_image = WeddingImage(
                    title=title,
                    media_type='image',
                    category=category,
                    description=f"Uploaded in bulk - {category}",
                    is_featured=False,
                    order=0
                )
                
                # Set the CloudinaryField using the upload result
                wedding_image.image = upload_result
                
                # Save to trigger thumbnail generation
                wedding_image.save()
                
                # Get the image URLs for response
                image_url = wedding_image.image.url if wedding_image.image else None
                thumbnail_url = wedding_image.thumbnail.url if wedding_image.thumbnail else image_url
                
                uploaded_images.append({
                    'id': wedding_image.id,
                    'title': wedding_image.title,
                    'image_url': image_url,
                    'thumbnail_url': thumbnail_url,
                    'category': wedding_image.category,
                    'media_type': wedding_image.media_type,
                    'public_id': upload_result.get('public_id', '')
                })
                
                print(f"✅ Uploaded: {image.name} (ID: {wedding_image.id})")
                
            except Exception as e:
                error_msg = str(e)
                print(f"❌ Failed to upload {image.name}: {error_msg}")
                failed_images.append({
                    'name': image.name,
                    'error': error_msg,
                    'category': category
                })
        
        return Response({
            'success': True,
            'message': f'Uploaded {len(uploaded_images)} images, {len(failed_images)} failed',
            'uploaded_count': len(uploaded_images),
            'failed_count': len(failed_images),
            'uploaded_images': uploaded_images,
            'failed_images': failed_images,
            'next_step': 'Continue uploading next batch of 20 images'
        }, status=status.HTTP_200_OK)

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