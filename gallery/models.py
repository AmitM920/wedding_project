# gallery/models.py - WITH SIMPLE THUMBNAIL GENERATION
from django.db import models
import os
from cloudinary.models import CloudinaryField
import cloudinary.uploader
import requests
from io import BytesIO
from PIL import Image

def wedding_video_upload_path(instance, filename):
    """
    Returns the upload path for wedding videos.
    Format: wedding_videos/category/filename
    """
    ext = filename.split(".")[-1]
    clean_title = instance.title.replace(" ", "_").lower()[:50]
    return os.path.join("wedding_videos", instance.category, f"{clean_title}.{ext}")

class WeddingImage(models.Model):
    CATEGORY_CHOICES = [
        ("pre_wedding", "Pre-Wedding"),
        ("haldi", "Haldi"),
        ("mehndi", "Mehndi"),
        ("sagan", "Sagan"),
        ("rokha", "Rokha"),
        ("wedding", "Wedding"),
    ]

    MEDIA_TYPE_CHOICES = [
        ("image", "Image"),
        ("video", "Video"),
    ]

    title = models.CharField(max_length=200)
    media_type = models.CharField(
        max_length=10, choices=MEDIA_TYPE_CHOICES, default="image"
    )

    image = CloudinaryField(
        "image",
        folder="wedding_gallery",
        blank=True,
        null=True,
        help_text="Upload image files only",
    )
    
    thumbnail = CloudinaryField(
        "image",
        folder="wedding_gallery/thumbnails",
        blank=True,
        null=True,
        help_text="Auto-generated thumbnail",
    )

    video = models.FileField(
        upload_to=wedding_video_upload_path,
        blank=True,
        null=True,
        help_text="Upload video files only",
    )

    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ["category", "order", "-uploaded_at"]
        verbose_name = "Wedding Media"
        verbose_name_plural = "Wedding Media"

    def __str__(self):
        return f"{self.title} ({self.category}) - {self.media_type}"

    def save(self, *args, **kwargs):
        print(f"🔄 SAVE: {self.title}")
        
        # Auto-set media_type
        if self.image and not self.video:
            self.media_type = "image"
            print(f"   Set media_type to 'image'")
        elif self.video and not self.image:
            self.media_type = "video"
            print(f"   Set media_type to 'video'")
        
        # Check if image is being set/changed
        is_new = self.pk is None
        
        # Save the model
        super().save(*args, **kwargs)
        print(f"✅ Model saved (ID: {self.pk})")
        
        # Generate thumbnail for new images or if image changed
        if self.image and is_new and not self.thumbnail:
            print(f"   🖼️ Generating thumbnail for new image...")
            try:
                self.generate_thumbnail_simple()
                super().save(update_fields=['thumbnail'])
                print(f"   ✅ Thumbnail saved")
            except Exception as e:
                print(f"   ⚠️ Thumbnail generation skipped: {e}")
        
        print(f"✅ SAVE COMPLETE: {self.title}")

    def generate_thumbnail_simple(self):
        """Simple thumbnail generation for Cloudinary"""
        if not self.image:
            return
        
        try:
            print(f"   📍 Generating thumbnail for: {self.image.public_id}")
            
            # Method 1: Use Cloudinary's eager transformations (simpler)
            # We'll create a derived thumbnail by uploading a smaller version
            
            # Download the original (small version for thumbnail)
            original_url = self.image.build_url(width=500, height=500, crop="limit")
            response = requests.get(original_url)
            
            if response.status_code == 200:
                # Create thumbnail image
                img = Image.open(BytesIO(response.content))
                img.thumbnail((300, 300))
                
                # Save to bytes
                thumb_buffer = BytesIO()
                img.save(thumb_buffer, format='JPEG', quality=70)
                thumb_buffer.seek(0)
                
                # Generate thumbnail public_id
                thumb_public_id = f"{self.image.public_id}_thumb"
                
                # Upload to Cloudinary
                result = cloudinary.uploader.upload(
                    thumb_buffer,
                    public_id=thumb_public_id,
                    folder="wedding_gallery/thumbnails",
                    overwrite=True
                )
                
                # Set the thumbnail field
                self.thumbnail = result['public_id']
                print(f"   ✅ Thumbnail created: {result['public_id']}")
            else:
                print(f"   ⚠️ Could not download image for thumbnail")
                
        except Exception as e:
            print(f"   ❌ Thumbnail generation error: {e}")
            # Don't crash if thumbnail fails