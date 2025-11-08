# gallery/models.py
from django.db import models

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
    
    # For images
    image = models.ImageField(upload_to='wedding_images/',  blank=True, null=True)
    
    # For videos  
    video = models.FileField(upload_to='wedding_videos/', blank=True, null=True)
    
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    description = models.TextField(blank=True)
    is_featured = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['category', 'order', '-uploaded_at']
    
    def __str__(self):
        return f"{self.title} ({self.category}) - {self.media_type}"