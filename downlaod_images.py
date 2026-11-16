import os
import django
import requests

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from gallery.models import WeddingImage

# The 'r' before the quote fixes the Windows \U path error
DOWNLOAD_DIR = r"C:\Users\am\Desktop\img" 
os.makedirs(DOWNLOAD_DIR, exist_ok=True)

images = WeddingImage.objects.exclude(image='').exclude(image__isnull=True)
print(f"Found {images.count()} images. Starting download...")

for img in images:
    try:
        # Get the image URL from the model
        url = str(img.image.url)
        
        # Extract the public_id (filename) from the URL
        filename = url.split('/')[-1]
        if not filename.endswith(('.jpg', '.jpeg', '.png', '.webp')):
            filename += '.jpg' # Fallback
            
        filepath = os.path.join(DOWNLOAD_DIR, filename)
        
        # Skip if we already downloaded it
        if os.path.exists(filepath):
            continue
            
        print(f"Downloading {filename}...")
        response = requests.get(url)
        with open(filepath, 'wb') as f:
            f.write(response.content)
            
    except Exception as e:
        print(f"Failed to download ID {img.id}: {e}")

print("✅ All images downloaded to:", DOWNLOAD_DIR)