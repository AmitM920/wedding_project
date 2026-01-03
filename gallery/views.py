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
import cloudinary
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
    FIXED VERSION: Prevents duplicate entries by checking for existing images first
    """
    parser_classes = (JSONParser,)
    
    def post(self, request):
        urls = request.data.get('urls', [])
        category = request.data.get('category', 'wedding')
        
        print(f"📥 Received request to save {len(urls)} images")
        print(f"📥 Category: {category}")
        
        if not urls:
            return Response({'error': 'No URLs provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        saved = 0
        failed = 0
        duplicates = 0
        results = []
        
        for i, data in enumerate(urls):
            try:
                # Extract basic info
                public_id = data.get('public_id', '')
                secure_url = data.get('secure_url', '')
                
                print(f"\n📝 Processing image {i+1}/{len(urls)}:")
                print(f"   Public ID: {public_id}")
                print(f"   Secure URL: {secure_url}")
                
                # Create simple title from filename
                if '/' in public_id:
                    title = public_id.split('/')[-1]
                else:
                    title = public_id
                
                title = title.replace('_', ' ').replace('-', ' ').split('.')[0]
                title = title[:200]  # Max 200 chars
                
                print(f"   Title: {title}")
                
                # CRITICAL: Check for duplicates using multiple methods
                existing = None
                
                # Method 1: Check by public_id string (direct comparison)
                existing = WeddingImage.objects.filter(image=public_id).first()
                
                # Method 2: If not found, check using get_image_public_id method
                if not existing and public_id:
                    # Check all images for a match using the model's helper method
                    all_images = WeddingImage.objects.all()
                    for img in all_images:
                        img_public_id = img.get_image_public_id()
                        if img_public_id and img_public_id == public_id:
                            existing = img
                            break
                
                if existing:
                    print(f"   ⚠️ Image already exists in database (ID: {existing.id}, Title: {existing.title})")
                    duplicates += 1
                    results.append({
                        'status': 'duplicate',
                        'id': existing.id,
                        'title': existing.title,
                        'public_id': public_id,
                        'message': 'Image already exists, skipping duplicate'
                    })
                    continue  # Skip to next image
                
                # Try to save the image
                try:
                    print(f"   Saving new image...")
                    img = WeddingImage(
                        title=title,
                        media_type='image',
                        category=category,
                        description=f"Uploaded - {category}",
                        is_featured=False,
                        order=0
                    )
                    
                    # Use just the public_id string (not the entire dict)
                    img.image = public_id
                    img.save()
                    print(f"   ✅ Saved successfully! ID: {img.id}")
                    
                    # Get URLs safely - DON'T try to access img.image.url when it's a string
                    image_url = secure_url  # Use the secure_url from Cloudinary
                    
                    # Handle thumbnail URL safely
                    thumbnail_url = None
                    if img.thumbnail:
                        if hasattr(img.thumbnail, 'url'):
                            thumbnail_url = img.thumbnail.url
                        elif isinstance(img.thumbnail, str):
                            # Build thumbnail URL from public_id
                            thumb_public_id = img.thumbnail
                            if not thumb_public_id.startswith('http'):
                                # Add Cloudinary base URL with thumbnail transformation
                                cloud_name = cloudinary.config().cloud_name
                                thumbnail_url = f"https://res.cloudinary.com/{cloud_name}/image/upload/w_300,h_300,c_fill/{thumb_public_id}"
                            else:
                                thumbnail_url = thumb_public_id
                    
                    results.append({
                        'status': 'success',
                        'id': img.id,
                        'title': img.title,
                        'image_url': image_url,
                        'thumbnail_url': thumbnail_url,
                        'category': img.category,
                        'public_id': public_id,
                    })
                    saved += 1
                    print(f"   ✅ Successfully saved image {i+1}")
                    
                except Exception as save_error:
                    print(f"   ❌ Save failed: {save_error}")
                    
                    # Try one more time with secure_url
                    try:
                        print(f"   Trying with secure_url as fallback...")
                        img = WeddingImage(
                            title=title,
                            media_type='image',
                            category=category,
                            description=f"Uploaded - {category}",
                            is_featured=False,
                            order=0
                        )
                        img.image = secure_url  # Try with the full URL
                        img.save()
                        print(f"   ✅ Saved with URL! ID: {img.id}")
                        
                        # Get URLs safely
                        image_url = secure_url
                        thumbnail_url = None
                        
                        if img.thumbnail:
                            if hasattr(img.thumbnail, 'url'):
                                thumbnail_url = img.thumbnail.url
                        
                        results.append({
                            'status': 'success',
                            'id': img.id,
                            'title': img.title,
                            'image_url': image_url,
                            'thumbnail_url': thumbnail_url,
                            'category': img.category,
                            'public_id': public_id,
                        })
                        saved += 1
                        
                    except Exception as final_error:
                        print(f"   ❌ All save methods failed")
                        raise final_error
                
            except Exception as e:
                import traceback
                error_trace = traceback.format_exc()
                print(f"   ❌❌❌ Failed for image {i+1}:")
                print(f"   Error: {str(e)}")
                
                failed += 1
                results.append({
                    'status': 'failed',
                    'public_id': data.get('public_id', 'unknown'),
                    'error': str(e),
                })
        
        print(f"\n📊 FINAL RESULTS: {saved} saved, {failed} failed, {duplicates} duplicates skipped")
        
        return Response({
            'success': saved > 0,
            'message': f'Saved {saved} new images, skipped {duplicates} duplicates, {failed} failed',
            'saved_count': saved,
            'failed_count': failed,
            'duplicate_count': duplicates,
            'results': results,
            'total': len(urls)
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
                
                # Upload to Cloudinary
                upload_result = cloudinary.uploader.upload(
                    image_file,
                    folder="wedding_gallery",
                    resource_type="image"
                )
                
                public_id = upload_result.get('public_id', '')
                
                # Check for duplicates using direct string comparison
                if public_id:
                    existing = WeddingImage.objects.filter(image=public_id).first()
                    if existing:
                        return Response({
                            'error': f'Image with public_id "{public_id}" already exists (ID: {existing.id})'
                        }, status=status.HTTP_400_BAD_REQUEST)
                
                # Create title from filename
                title = request.data.get('title', image_file.name.rsplit('.', 1)[0])
                
                # Create the model instance
                wedding_image = WeddingImage(
                    title=title[:200],
                    media_type='image',
                    category=category,
                    description=request.data.get('description', ''),
                    is_featured=request.data.get('is_featured', False),
                    order=request.data.get('order', 0)
                )
                
                # Set the image using public_id string
                wedding_image.image = public_id
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