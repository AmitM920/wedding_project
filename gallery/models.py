# gallery/models.py - WITH SIMPLE THUMBNAIL GENERATION
from django.db import models
import os
from cloudinary.models import CloudinaryField
import cloudinary.uploader
import requests
from io import BytesIO
from PIL import Image
from django.db import router
from django.db import models
from django.db.models.deletion import Collector

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
    id = models.AutoField(primary_key=True)
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
        
        # Track if we need to delete old image
        old_image_public_id = None
        old_thumbnail_public_id = None
        
        # If this is an update (not new), check if image changed
        if self.pk:
            try:
                old = WeddingImage.objects.get(pk=self.pk)
                # If image changed, delete old one from Cloudinary
                if old.image and self.image and old.image.public_id != self.image.public_id:
                    old_image_public_id = old.image.public_id
                    print(f"   📝 Image changed, will delete old from Cloudinary: {old_image_public_id}")
                
                # If thumbnail changed, delete old thumbnail
                if old.thumbnail and self.thumbnail and old.thumbnail.public_id != self.thumbnail.public_id:
                    old_thumbnail_public_id = old.thumbnail.public_id
                    print(f"   📝 Thumbnail changed, will delete old: {old_thumbnail_public_id}")
            except WeddingImage.DoesNotExist:
                pass
        
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
        
        # Delete old Cloudinary files after successful save
        if old_image_public_id:
            try:
                print(f"   🗑️ Deleting old image from Cloudinary: {old_image_public_id}")
                cloudinary.uploader.destroy(old_image_public_id)
            except Exception as e:
                print(f"   ⚠️ Failed to delete old image: {e}")
        
        if old_thumbnail_public_id:
            try:
                print(f"   🗑️ Deleting old thumbnail from Cloudinary: {old_thumbnail_public_id}")
                cloudinary.uploader.destroy(old_thumbnail_public_id)
            except Exception as e:
                print(f"   ⚠️ Failed to delete old thumbnail: {e}")
        
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
    
    def delete(self, using=None, keep_parents=False):
        """
        Override delete to also delete from Cloudinary.
        Returns: (deleted_count, {model_name: count})
        """
        print(f"🗑️  Deleting WeddingImage {self.id}: {self.title}")
        
        if using is None:
            using = router.db_for_write(self.__class__, instance=self)
        
        # Delete from Cloudinary if image exists
        if self.image and hasattr(self.image, 'public_id'):
            try:
                print(f"   Deleting from Cloudinary: {self.image.public_id}")
                cloudinary.uploader.destroy(self.image.public_id)
            except Exception as e:
                print(f"   ❌ Cloudinary deletion error: {e}")
        
        # Delete thumbnail if exists
        if self.thumbnail and hasattr(self.thumbnail, 'public_id'):
            try:
                print(f"   Deleting thumbnail: {self.thumbnail.public_id}")
                cloudinary.uploader.destroy(self.thumbnail.public_id)
            except Exception as e:
                print(f"   ❌ Thumbnail deletion error: {e}")
        
        # Call parent delete with correct signature
        return super().delete(using=using, keep_parents=keep_parents)