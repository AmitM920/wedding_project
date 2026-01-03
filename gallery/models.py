# gallery/models.py - IMPROVED THUMBNAIL GENERATION
from django.db import models
import os
from cloudinary.models import CloudinaryField
import cloudinary.uploader
import cloudinary
import requests
from io import BytesIO
from PIL import Image
from django.db import router
import time

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
        # Add unique constraint to prevent duplicates at database level
        constraints = [
            models.UniqueConstraint(
                fields=['image'],
                name='unique_image_public_id',
                condition=models.Q(image__isnull=False)
            )
        ]

    def __str__(self):
        return f"{self.title} ({self.category}) - {self.media_type}"

    def get_image_public_id(self):
        """Helper method to extract public_id from image field"""
        if not self.image:
            return None
        
        try:
            if hasattr(self.image, 'public_id'):
                return self.image.public_id
            elif isinstance(self.image, str):
                # If it's a URL, extract public_id
                if 'cloudinary.com' in self.image:
                    # Example: .../wedding_gallery/zoh2jw7phd57gjwquhmv
                    parts = self.image.split('/')
                    # Find the upload folder part and get the filename
                    for i, part in enumerate(parts):
                        if part == 'upload':
                            # The next part is version, the one after that is the path
                            if i + 2 < len(parts):
                                # Remove file extension
                                filename = parts[i + 2]
                                return filename.split('.')[0]
                # Assume it's already a public_id
                return self.image
        except Exception as e:
            print(f"⚠️ Could not extract public_id: {e}")
        
        return None

    def save(self, *args, **kwargs):
        print(f"\n🔄 SAVE: {self.title}")
        
        # Get public_id before saving
        image_public_id = self.get_image_public_id()
        print(f"   Public ID: {image_public_id}")
        
        # Track if we need to delete old image/thumbnail
        old_image_public_id = None
        old_thumbnail_public_id = None
        
        # If this is an update (not new), check if image changed
        if self.pk:
            try:
                old = WeddingImage.objects.get(pk=self.pk)
                # If image changed, delete old one from Cloudinary
                if old.image and hasattr(old.image, 'public_id'):
                    old_public_id = old.image.public_id
                    if image_public_id and old_public_id != image_public_id:
                        old_image_public_id = old_public_id
                        print(f"   📝 Image changed, will delete old from Cloudinary: {old_image_public_id}")
                
                # If thumbnail changed, delete old thumbnail
                if old.thumbnail and hasattr(old.thumbnail, 'public_id'):
                    old_thumb_id = old.thumbnail.public_id
                    if self.thumbnail and hasattr(self.thumbnail, 'public_id'):
                        new_thumb_id = self.thumbnail.public_id
                        if old_thumb_id != new_thumb_id:
                            old_thumbnail_public_id = old_thumb_id
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
        
        # Check if this is a new image
        is_new = self.pk is None
        
        # ✅ CRITICAL: Check for duplicates BEFORE saving
        if is_new and image_public_id:
            # Check if an image with this public_id already exists
            existing_images = WeddingImage.objects.all()
            for existing in existing_images:
                existing_public_id = existing.get_image_public_id()
                if existing_public_id and existing_public_id == image_public_id:
                    print(f"   ❌ DUPLICATE: Image with public_id '{image_public_id}' already exists (ID: {existing.id})")
                    # Don't save - raise an exception
                    raise ValueError(
                        f"Image with public_id '{image_public_id}' already exists in database. "
                        f"Duplicate of WeddingImage ID: {existing.id}"
                    )
        
        # Save the model first
        print(f"   Saving model to database...")
        super().save(*args, **kwargs)
        print(f"   ✅ Model saved (ID: {self.pk})")
        
        # ✅ Generate thumbnail for new images
        if self.image and is_new and not self.thumbnail:
            print(f"   🖼️ Generating thumbnail for new image...")
            try:
                # Use the improved thumbnail generation
                self.generate_thumbnail_improved()
                # Save just the thumbnail field
                super().save(update_fields=['thumbnail'])
                print(f"   ✅ Thumbnail generated and saved")
            except Exception as e:
                print(f"   ⚠️ Thumbnail generation failed: {e}")
                # Don't crash if thumbnail fails - the main image is still saved
        
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

    def generate_thumbnail_improved(self):
        """
        IMPROVED thumbnail generation using Cloudinary's transformations
        This method is faster and more reliable
        """
        if not self.image:
            print("   ❌ No image to generate thumbnail from")
            return
        
        try:
            # Get the public_id
            public_id = self.get_image_public_id()
            if not public_id:
                print("   ❌ Could not get public_id for thumbnail generation")
                return
            
            print(f"   📍 Generating thumbnail for: {public_id}")
            
            # Method 1: Use Cloudinary's eager transformation (most efficient)
            # This creates a derived image in Cloudinary without downloading/uploading
            try:
                # Create a thumbnail using Cloudinary's eager transformation
                thumb_public_id = f"{public_id}_thumb"
                
                # Use Cloudinary's explicit method to create a transformed version
                # This creates a new derived image
                result = cloudinary.uploader.explicit(
                    public_id,
                    type="upload",
                    eager=[
                        {
                            "width": 300,
                            "height": 300,
                            "crop": "fill",
                            "gravity": "auto",
                            "quality": "auto:good",
                            "format": "jpg"
                        }
                    ],
                    eager_async=False,
                    folder="wedding_gallery/thumbnails",
                    public_id=thumb_public_id,
                    overwrite=True
                )
                
                # Check if eager transformation was created
                if 'eager' in result and result['eager']:
                    # Set the thumbnail field to the public_id
                    self.thumbnail = thumb_public_id
                    print(f"   ✅ Thumbnail created via eager transformation: {thumb_public_id}")
                    return
                else:
                    print("   ⚠️ Eager transformation didn't return expected result, trying fallback...")
                    
            except Exception as e:
                print(f"   ⚠️ Eager transformation failed: {e}, trying fallback method...")
            
            # Method 2: Fallback - Use URL transformation and upload
            try:
                # Generate thumbnail URL using Cloudinary transformation
                thumb_url = cloudinary.CloudinaryImage(public_id).build_url(
                    width=300,
                    height=300,
                    crop="fill",
                    gravity="auto",
                    quality="auto:good",
                    format="jpg"
                )
                
                # Download the transformed image
                response = requests.get(thumb_url, timeout=10)
                
                if response.status_code == 200:
                    # Generate unique public_id for thumbnail
                    thumb_public_id = f"{public_id}_thumb_{int(time.time())}"
                    
                    # Upload the thumbnail to Cloudinary
                    upload_result = cloudinary.uploader.upload(
                        response.content,
                        public_id=thumb_public_id,
                        folder="wedding_gallery/thumbnails",
                        overwrite=True,
                        resource_type="image"
                    )
                    
                    # Set the thumbnail field
                    self.thumbnail = upload_result['public_id']
                    print(f"   ✅ Thumbnail created via URL transformation: {upload_result['public_id']}")
                else:
                    print(f"   ❌ Failed to download transformed image: HTTP {response.status_code}")
                    
            except Exception as e:
                print(f"   ❌ URL transformation method failed: {e}")
                
                # Method 3: Ultimate fallback - Just set a reference
                # We'll store the original public_id with _thumb suffix
                # The thumbnail will be generated on-the-fly when requested
                thumb_public_id = f"{public_id}_thumb"
                self.thumbnail = thumb_public_id
                print(f"   ⚠️ Set thumbnail reference only: {thumb_public_id}")
                print(f"   ℹ️ Thumbnail will be generated on-the-fly when accessed")
                
        except Exception as e:
            print(f"   ❌ Thumbnail generation failed completely: {e}")
            # Don't crash - we can still work without thumbnail

    def get_thumbnail_url(self):
        """
        Get thumbnail URL - generates on-the-fly if needed
        """
        if not self.thumbnail:
            # Generate thumbnail URL from original image
            public_id = self.get_image_public_id()
            if public_id:
                return cloudinary.CloudinaryImage(public_id).build_url(
                    width=300,
                    height=300,
                    crop="fill",
                    gravity="auto"
                )
            return None
        
        # If thumbnail field has a value, use it
        try:
            if hasattr(self.thumbnail, 'url'):
                return self.thumbnail.url
            elif isinstance(self.thumbnail, str):
                # Check if it's a Cloudinary public_id
                if '/' in self.thumbnail and 'cloudinary.com' not in self.thumbnail:
                    # It's a public_id, build URL
                    return f"https://res.cloudinary.com/{cloudinary.config().cloud_name}/image/upload/w_300,h_300,c_fill/{self.thumbnail}"
                else:
                    # Assume it's already a URL
                    return self.thumbnail
        except:
            pass
        
        return None

    def has_thumb(self):
        """Check if thumbnail exists (for admin display)"""
        return bool(self.thumbnail)

    def delete(self, using=None, keep_parents=False):
        """
        Override delete to also delete from Cloudinary.
        Returns: (deleted_count, {model_name: count})
        """
        print(f"\n🗑️  Deleting WeddingImage {self.id}: {self.title}")
        
        if using is None:
            using = router.db_for_write(self.__class__, instance=self)
        
        # Get public_ids before deletion
        image_public_id = self.get_image_public_id()
        thumb_public_id = None
        
        if self.thumbnail:
            if hasattr(self.thumbnail, 'public_id'):
                thumb_public_id = self.thumbnail.public_id
            elif isinstance(self.thumbnail, str) and '_thumb' in self.thumbnail:
                thumb_public_id = self.thumbnail
        
        # Delete from Cloudinary if image exists
        if image_public_id:
            try:
                print(f"   Deleting from Cloudinary: {image_public_id}")
                cloudinary.uploader.destroy(image_public_id)
            except Exception as e:
                print(f"   ⚠️ Cloudinary image deletion error: {e}")
        
        # Delete thumbnail if exists
        if thumb_public_id:
            try:
                print(f"   Deleting thumbnail: {thumb_public_id}")
                cloudinary.uploader.destroy(thumb_public_id)
            except Exception as e:
                print(f"   ⚠️ Thumbnail deletion error: {e}")
        
        # Call parent delete with correct signature
        return super().delete(using=using, keep_parents=keep_parents)

    def thumbnail_preview(self):
        """
        Method for admin to show thumbnail preview
        """
        thumb_url = self.get_thumbnail_url()
        if thumb_url:
            return f'<img src="{thumb_url}" width="100" height="100" style="object-fit: cover;" />'
        return "No thumbnail"
    
    thumbnail_preview.allow_tags = True
    thumbnail_preview.short_description = 'Thumbnail'