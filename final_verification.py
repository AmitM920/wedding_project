# final_verification.py
import os
import sys
import django

sys.path.append('C:/Users/Asus/Desktop/wedding_project')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from gallery.models import WeddingImage
from django.conf import settings

print("=" * 60)
print("FINAL VERIFICATION - THUMBNAIL GENERATION")
print("=" * 60)

categories = ['haldi', 'mehndi', 'wedding', 'pre_wedding', 'sagan']

for category in categories:
    images = WeddingImage.objects.filter(category=category)
    
    print(f"\n{category.upper():<15}: {images.count()} images")
    
    for img in images:
        print(f"  - {img.title}")
        
        # Check image file
        if img.image:
            img_exists = os.path.exists(img.image.path)
            print(f"    Image: {'✅' if img_exists else '❌'} {img.image.name}")
        else:
            print(f"    Image: ❌ No image file")
        
        # Check thumbnail
        if img.thumbnail:
            thumb_exists = os.path.exists(img.thumbnail.path)
            print(f"    Thumbnail: {'✅' if thumb_exists else '❌'} {img.thumbnail.name}")
        else:
            print(f"    Thumbnail: ❌ No thumbnail")

print("\n" + "=" * 60)
print("TEST THESE API ENDPOINTS:")
print("=" * 60)

for category in categories:
    if WeddingImage.objects.filter(category=category).exists():
        print(f"  http://127.0.0.1:8000/gallery/images/?category={category}")

print("\n✨ All thumbnails should be generated automatically now!")