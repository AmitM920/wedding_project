import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from gallery.models import WeddingImage

# Your actual folder path, with 'r' to prevent Windows path errors
SORTED_DIR = r"C:\Users\am\Desktop\img" 

# The folder names inside your 'img' folder
CATEGORIES = ['pre_wedding', 'mehndi', 'haldi', 'sagan', 'rokha', 'wedding']

print(f"Scanning folders inside: {SORTED_DIR}\n")

for category in CATEGORIES:
    folder_path = os.path.join(SORTED_DIR, category)
    
    # Skip if you haven't created this folder yet
    if not os.path.exists(folder_path):
        print(f"⚠️ Folder missing (skipping): {category}")
        continue
        
    print(f"📁 Updating database for category: {category.upper()}")
    updated_count = 0
    
    for filename in os.listdir(folder_path):
        # Ignore hidden files or non-images
        if not filename.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
            continue
            
        # Separate the filename from the extension 
        # (e.g., 'bxprok5smwvwu4koxiaf' from 'bxprok5smwvwu4koxiaf.jpg')
        public_id = filename.rsplit('.', 1)[0]
        
        # Find the image in the database by matching the public_id
        img = WeddingImage.objects.filter(image__endswith=public_id).first()
        
        if img:
            # Only save if the category is actually different
            if img.category != category:
                img.category = category
                img.save(update_fields=['category']) # Fast update, no Cloudinary calls!
                print(f"  ✅ Updated: {img.title} -> {category}")
            updated_count += 1
        else:
            print(f"  ⚠️ Image not found in DB: {public_id}")

    print(f"✅ Finished {category}: {updated_count} images matched.\n")

print("✨ Database category update complete!")