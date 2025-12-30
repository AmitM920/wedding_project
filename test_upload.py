# test_upload.py
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from gallery.models import WeddingImage
from django.core.files.uploadedfile import SimpleUploadedFile

print("Testing model creation and image upload...")

# Create a simple test
test_img = WeddingImage(
    title="Test Upload",
    category="haldi",
    media_type="image",
    is_featured=True
)

# Create a dummy image file
dummy_content = b'fake image content for testing'
dummy_file = SimpleUploadedFile(
    "test_image.jpg",
    dummy_content,
    content_type="image/jpeg"
)

try:
    # Save the image to Cloudinary
    test_img.image.save("test_image.jpg", dummy_file, save=True)
    print(f"✅ Model created successfully!")
    print(f"   ID: {test_img.id}")
    print(f"   Title: {test_img.title}")
    print(f"   Image field: {test_img.image}")
    print(f"   public_id: {test_img.image.public_id}")
    print(f"   URL: {test_img.image.url}")
    
    # Clean up (optional)
    test_img.delete()
    print("✅ Test record cleaned up")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()