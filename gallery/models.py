# gallery/models.py
from django.db import models
import os
from io import BytesIO
from django.core.files.base import ContentFile
from PIL import Image, ImageOps

def wedding_image_upload_path(instance, filename):
    """
    Returns the upload path for wedding images.
    Format: wedding_images/category/filename
    Example: wedding_images/pre_wedding/044A3859.JPG
    """
    # Get file extension
    ext = filename.split('.')[-1]
    
    # Create a clean filename (optional)
    clean_title = instance.title.replace(' ', '_').lower()[:50]
    
    # Create path: wedding_images/category/filename
    return os.path.join('wedding_images', instance.category, f'{clean_title}.{ext}')

def wedding_video_upload_path(instance, filename):
    """
    Returns the upload path for wedding videos.
    Format: wedding_videos/category/filename
    """
    ext = filename.split('.')[-1]
    clean_title = instance.title.replace(' ', '_').lower()[:50]
    return os.path.join('wedding_videos', instance.category, f'{clean_title}.{ext}')

class WeddingImage(models.Model):
    CATEGORY_CHOICES = [
        ('pre_wedding', 'Pre-Wedding'),
        ('haldi', 'Haldi'),
        ('mehndi', 'Mehndi'),
        ('sagan', 'Sagan'),
        ('rokha', 'Rokha'),
        ('wedding', 'Wedding'),
    ]
    
    MEDIA_TYPE_CHOICES = [
        ('image', 'Image'),
        ('video', 'Video'),
    ]
    
    title = models.CharField(max_length=200)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPE_CHOICES, default='image')
    
    # For images - using the function for better organization
    image = models.ImageField(
        upload_to=wedding_image_upload_path, 
        blank=True, 
        null=True,
        help_text="Upload image files only"
    )
    # For thumbnails (smaller, faster-loading versions)
    thumbnail = models.ImageField(
        upload_to='thumbnails/',
        blank=True,
        null=True,
        help_text="Auto-generated smaller version of the image for fast loading"
    )
    # For videos  
    video = models.FileField(
        upload_to=wedding_video_upload_path, 
        blank=True, 
        null=True,
        help_text="Upload video files only"
    )
    
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['category', 'order', '-uploaded_at']
        verbose_name = 'Wedding Media'
        verbose_name_plural = 'Wedding Media'
    
    def __str__(self):
        return f"{self.title} ({self.category}) - {self.media_type}"
    
    @property
    def media_url(self):
        """Returns the URL for the media file (image or video)"""
        if self.media_type == 'image' and self.image:
            return self.image.url
        elif self.media_type == 'video' and self.video:
            return self.video.url
        return None
    
    @property
    def filename(self):
        """Returns just the filename"""
        if self.media_type == 'image' and self.image:
            return os.path.basename(self.image.name)
        elif self.media_type == 'video' and self.video:
            return os.path.basename(self.video.name)
        return None
    
    # gallery/models.py - Corrected save() method
    def save(self, *args, **kwargs):
        print(f"🔄 SAVE METHOD STARTED for: {self.title or 'No title'}")
        print(f"   Media type before auto-set: {self.media_type}")
        
        # Auto-set media_type based on which field has content
        if self.image and not self.video:
            self.media_type = 'image'
            print(f"   ✅ Auto-set media_type to 'image'")
        elif self.video and not self.image:
            self.media_type = 'video'
            print(f"   ✅ Auto-set media_type to 'video'")
        
        # Check if we're creating a new image or updating an existing one
        is_new = self.pk is None  # No primary key means new record
        has_image_changed = False
        
        if not is_new:
            print(f"   📄 Existing record (pk: {self.pk})")
            try:
                # Get the old instance to compare
                old_instance = WeddingImage.objects.get(pk=self.pk)
                # FIXED: Better check for image change
                if old_instance.image and self.image:
                    has_image_changed = (old_instance.image.name != self.image.name)
                elif (old_instance.image and not self.image) or (not old_instance.image and self.image):
                    has_image_changed = True
                    
                if has_image_changed:
                    print(f"   📸 Image field has changed")
            except Exception as e:
                print(f"   ⚠️ Error checking old instance: {e}")
        else:
            print(f"   🆕 New record (no pk yet)")
        
        print(f"   📊 Status - New: {is_new}, Image changed: {has_image_changed}")
        
        # Call the parent save first to ensure image is saved to disk
        print(f"   💾 Calling parent save()...")
        super().save(*args, **kwargs)
        print(f"   ✅ Parent save completed")
        
        # Initialize thumbnail generation flag
        should_generate_thumbnail = False
        
        # Check if we need to generate a thumbnail
        if self.image and (is_new or has_image_changed or not self.thumbnail):
            should_generate_thumbnail = True
            print(f"   🖼️ Thumbnail generation triggered because:")
            if is_new:
                print(f"     - This is a new image")
            if has_image_changed:
                print(f"     - Image field was changed")
            if not self.thumbnail:
                print(f"     - No thumbnail exists yet")
        
        if should_generate_thumbnail:
            print(f"   🔧 Generating thumbnail...")
            self.generate_thumbnail()
            # Save again to store the thumbnail
            print(f"   💾 Saving thumbnail to database...")
            super().save(update_fields=['thumbnail'])
            print(f"   ✅ Thumbnail saved to database")
        else:
            print(f"   ⏭️ Skipping thumbnail generation (not needed)")
        
        print(f"   ✅ SAVE METHOD COMPLETED for: {self.title or 'No title'}")

    # THIS WAS INSIDE THE save() METHOD - NOW IT'S A SEPARATE METHOD
    def generate_thumbnail(self):
        if not self.image:
            print(f"   ⚠️ No image to generate thumbnail for")
            return
            
        try:
            # Open the original image
            img = Image.open(self.image.path)
            
            # Convert to RGB if necessary (for PNG with transparency)
            if img.mode in ('RGBA', 'LA', 'P'):
                # Create a white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                # Paste the image on the background
                if img.mode == 'P':
                    img = img.convert('RGBA')
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            elif img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Create thumbnail (max 300x300, maintaining aspect ratio)
            img.thumbnail((300, 300), Image.Resampling.LANCZOS)
            
            # Save to BytesIO
            thumb_io = BytesIO()
            img.save(thumb_io, format='JPEG', quality=80, optimize=True)
            
            # Generate filename
            original_name = os.path.basename(self.image.name)
            name, ext = os.path.splitext(original_name)
            thumb_filename = f'thumb_{name}.jpg'
            
            # Save to thumbnail field
            self.thumbnail.save(
                thumb_filename,
                ContentFile(thumb_io.getvalue()),
                save=False  # Don't save the model yet
            )
            
            print(f"   ✅ Generated thumbnail for: {original_name}")
            
        except Exception as e:
            print(f"   ❌ Error generating thumbnail for {self.image.name if self.image else 'unknown'}: {e}")