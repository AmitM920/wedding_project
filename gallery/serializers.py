# gallery/serializers.py
from rest_framework import serializers
from .models import WeddingImage

class WeddingImageSerializer(serializers.ModelSerializer):
    # Add a custom field for absolute URL
    image_url = serializers.SerializerMethodField()
    # Add new thumbnail_url field
    thumbnail_url = serializers.SerializerMethodField()
    class Meta:
        model = WeddingImage
        fields = ['id', 'title', 'media_type', 'image', 'image_url', 'video',   'image_url', 'thumbnail_url',  # Add thumbnail_url here
                 'category', 'description', 'is_featured', 'uploaded_at', 'order']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            # Fallback for when request is not available
            return f"http://127.0.0.1:8000{obj.image.url}"
        return None
    def get_thumbnail_url(self, obj):
        """Return absolute URL for the thumbnail (fallback to full image if no thumbnail)"""
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            # Fallback for when request is not available
            return f"http://127.0.0.1:8000{obj.thumbnail.url}"
        # If no thumbnail exists yet, return the full image URL
        # This ensures the API doesn't break while thumbnails are being generated
        return self.get_image_url(obj)