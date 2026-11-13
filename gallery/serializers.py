from rest_framework import serializers
from .models import WeddingImage

class WeddingImageSerializer(serializers.ModelSerializer):
    # Make image field return full Cloudinary URL
    image = serializers.SerializerMethodField()
    # Add a custom field for absolute URL
    image_url = serializers.SerializerMethodField()
    # Add new thumbnail_url field
    thumbnail_url = serializers.SerializerMethodField()
    
    class Meta:
        model = WeddingImage
        fields = ['id', 'title', 'media_type', 'image', 'image_url', 'video', 'thumbnail_url',
                 'category', 'description', 'is_featured', 'uploaded_at', 'order']
    
    def get_image(self, obj):
        """Return full Cloudinary URL for the main image field"""
        return self.get_image_url(obj)
    
    def get_image_url(self, obj):
        """Return absolute Cloudinary URL for the image"""
        if obj.image:
            try:
                # CloudinaryField should return full URL
                return str(obj.image.url)
            except Exception as e:
                print(f"Error getting image URL for {obj.id}: {e}")
                # Fallback for when Cloudinary URL is not available
                request = self.context.get('request')
                if request:
                    try:
                        return request.build_absolute_uri(obj.image.url)
                    except:
                        pass
                
                # Last resort: try to construct Cloudinary URL
                try:
                    # Check if it's a CloudinaryResource
                    if hasattr(obj.image, 'public_id'):
                        cloud_name = getattr(obj.image, 'cloud_name', 'dddxxtr7o')
                        version = getattr(obj.image, 'version', 'v1')
                        format = getattr(obj.image, 'format', 'jpg')
                        return f"https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{obj.image.public_id}.{format}"
                except:
                    pass
                
                # Final fallback
                return f"https://res.cloudinary.com/dddxxtr7o/image/upload/{obj.image}"
        return None
    
    def get_thumbnail_url(self, obj):
        """Generate thumbnail URL via Cloudinary transformation - no extra upload."""
        if not obj.image:
          return None
        try:
           image_url = str(obj.image.url)
           # Insert transformation between /upload/ and the path
           if '/upload/' in image_url:
             return image_url.replace(
                '/upload/',
                '/upload/w_400,h_400,c_fill,g_auto,q_auto,f_auto/'
            )
           return image_url
        except Exception as e:
          print(f"Error getting thumbnail URL for {obj.id}: {e}")
          return None