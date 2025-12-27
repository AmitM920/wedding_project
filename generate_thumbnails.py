# generate_thumbnails.py - ENHANCED VERSION
import os
import sys
import django
import traceback
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

# Setup Django
sys.path.append('C:/Users/Asus/Desktop/wedding_project')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from gallery.models import WeddingImage
from django.conf import settings

print("=" * 60)
print("THUMBNAIL GENERATION SCRIPT - ENHANCED")
print("=" * 60)

# Get all images that have image files
images = WeddingImage.objects.filter(image__isnull=False)
total_images = images.count()

print(f"Total images in database: {total_images}")
print("Starting thumbnail generation with enhanced error handling...")

success_count = 0
error_count = 0
skip_count = 0

for img in images:
    print(f"\n" + "-" * 40)
    print(f"Processing: {img.title} (ID: {img.id})")
    print(f"Category: {img.category}")
    print(f"Media Type: {img.media_type}")
    
    # Check if thumbnail already exists
    if img.thumbnail:
        # Verify thumbnail file actually exists on disk
        if os.path.exists(img.thumbnail.path):
            thumb_size = os.path.getsize(img.thumbnail.path) // 1024
            print(f"  ✓ Thumbnail already exists: {img.thumbnail.name} ({thumb_size} KB)")
            success_count += 1
        else:
            print(f"  ⚠️ Thumbnail in DB but missing file: {img.thumbnail.name}")
            # Mark for regeneration
            img.thumbnail = None
            img.save(update_fields=['thumbnail'])
        continue
    
    # Check if image field is valid
    if not img.image:
        print(f"  ✗ No image file in database field")
        error_count += 1
        continue
    
    print(f"  Original image: {img.image.name}")
    
    # Check if image file exists on disk
    img_path = os.path.join(settings.MEDIA_ROOT, img.image.name)
    if not os.path.exists(img_path):
        print(f"  ✗ Image file not found: {img_path}")
        
        # Try alternative path (sometimes MEDIA_ROOT has issues)
        alt_path = os.path.join('media', img.image.name)
        if os.path.exists(alt_path):
            print(f"  ⚠️ Found image at alternative path: {alt_path}")
            img_path = alt_path
        else:
            error_count += 1
            continue
    
    # Get original file size
    original_size = os.path.getsize(img_path) // 1024
    print(f"  Original size: {original_size} KB")
    
    # Check if it's a valid image file
    try:
        # Try to open with PIL to verify it's a valid image
        test_img = Image.open(img_path)
        print(f"  ✓ Image format: {test_img.format}, Size: {test_img.size}, Mode: {test_img.mode}")
        test_img.close()
    except Exception as e:
        print(f"  ✗ Invalid image file: {e}")
        error_count += 1
        continue
    
    # METHOD 1: Try using the model's save() method
    print(f"  Method 1: Using save() method...")
    try:
        # Save the model to trigger thumbnail generation
        img.save()
        
        if img.thumbnail:
            # Verify thumbnail was saved
            if os.path.exists(img.thumbnail.path):
                thumb_size = os.path.getsize(img.thumbnail.path) // 1024
                print(f"    ✓ Thumbnail created via save(): {img.thumbnail.name} ({thumb_size} KB)")
                success_count += 1
                continue
            else:
                print(f"    ⚠️ Thumbnail field set but file not created")
        else:
            print(f"    ⚠️ save() method didn't create thumbnail")
    except Exception as e:
        print(f"    ✗ Error in save() method: {e}")
        traceback.print_exc()
    
    # METHOD 2: Direct thumbnail generation (fallback)
    print(f"  Method 2: Direct thumbnail generation...")
    try:
        # Open the image
        pil_img = Image.open(img_path)
        
        # Convert to RGB if necessary
        if pil_img.mode in ('RGBA', 'LA', 'P'):
            print(f"    Converting {pil_img.mode} to RGB...")
            background = Image.new('RGB', pil_img.size, (255, 255, 255))
            if pil_img.mode == 'P':
                pil_img = pil_img.convert('RGBA')
            background.paste(pil_img, mask=pil_img.split()[-1] if pil_img.mode == 'RGBA' else None)
            pil_img = background
        elif pil_img.mode != 'RGB':
            print(f"    Converting {pil_img.mode} to RGB...")
            pil_img = pil_img.convert('RGB')
        
        # Create thumbnail
        pil_img.thumbnail((300, 300), Image.Resampling.LANCZOS)
        print(f"    Thumbnail size: {pil_img.size}")
        
        # Save to BytesIO
        thumb_io = BytesIO()
        pil_img.save(thumb_io, format='JPEG', quality=80, optimize=True)
        thumb_size = thumb_io.getbuffer().nbytes // 1024
        print(f"    Thumbnail memory size: {thumb_size} KB")
        
        # Generate filename
        original_name = os.path.basename(img.image.name)
        name, ext = os.path.splitext(original_name)
        thumb_filename = f'thumb_{name}.jpg'
        
        # Ensure thumbnails directory exists
        thumb_dir = os.path.join(settings.MEDIA_ROOT, 'thumbnails')
        os.makedirs(thumb_dir, exist_ok=True)
        
        # Save thumbnail file
        thumb_path = os.path.join(thumb_dir, thumb_filename)
        with open(thumb_path, 'wb') as f:
            f.write(thumb_io.getvalue())
        
        print(f"    ✓ Thumbnail saved to: {thumb_path}")
        
        # Update model
        img.thumbnail.name = f'thumbnails/{thumb_filename}'
        img.save(update_fields=['thumbnail'])
        
        print(f"    ✓ Database updated")
        success_count += 1
        continue
        
    except Exception as e:
        print(f"    ✗ Direct generation failed: {e}")
        traceback.print_exc()
        error_count += 1
    
    # METHOD 3: Manual file copy as last resort
    print(f"  Method 3: Creating simple copy (last resort)...")
    try:
        # Just copy the original as thumbnail (not ideal but better than nothing)
        original_name = os.path.basename(img.image.name)
        name, ext = os.path.splitext(original_name)
        thumb_filename = f'thumb_{name}.jpg'
        
        thumb_dir = os.path.join(settings.MEDIA_ROOT, 'thumbnails')
        os.makedirs(thumb_dir, exist_ok=True)
        
        thumb_path = os.path.join(thumb_dir, thumb_filename)
        
        # Open and resize to max 300px
        pil_img = Image.open(img_path)
        pil_img.thumbnail((300, 300))
        pil_img.save(thumb_path, 'JPEG', quality=60)
        
        img.thumbnail.name = f'thumbnails/{thumb_filename}'
        img.save(update_fields=['thumbnail'])
        
        thumb_size = os.path.getsize(thumb_path) // 1024
        print(f"    ⚠️ Created simple copy: {thumb_path} ({thumb_size} KB)")
        success_count += 1
        continue
        
    except Exception as e:
        print(f"    ✗ All methods failed: {e}")
        error_count += 1

print(f"\n" + "=" * 60)
print("SUMMARY:")
print(f"✅ Successful: {success_count}")
print(f"❌ Errors: {error_count}")
print(f"⏭️ Skipped (already had thumbnails): {skip_count}")
print(f"📊 Total processed: {success_count + error_count + skip_count}")

# Verify results
print(f"\n" + "=" * 60)
print("VERIFICATION BY CATEGORY:")
print("=" * 60)

# Check each category
categories = WeddingImage.objects.values_list('category', flat=True).distinct()
for category in categories:
    total = WeddingImage.objects.filter(category=category, image__isnull=False).count()
    if total == 0:
        continue
    
    with_thumbs = WeddingImage.objects.filter(category=category, thumbnail__isnull=False).count()
    percentage = (with_thumbs / total * 100) if total > 0 else 0
    
    status = "✅" if percentage == 100 else "⚠️" if percentage > 0 else "❌"
    print(f"{status} {category.upper():<15}: {with_thumbs:3d}/{total:3d} ({percentage:5.1f}%)")

# Overall stats
total_with_images = WeddingImage.objects.filter(image__isnull=False).count()
total_with_thumbs = WeddingImage.objects.filter(thumbnail__isnull=False).count()
overall_percentage = (total_with_thumbs / total_with_images * 100) if total_with_images > 0 else 0

print(f"\n" + "=" * 60)
print(f"OVERALL: {total_with_thumbs}/{total_with_images} ({overall_percentage:.1f}%)")
print("=" * 60)

# List problematic images
problematic = WeddingImage.objects.filter(image__isnull=False, thumbnail__isnull=True)
if problematic.count() > 0:
    print(f"\n⚠️ IMAGES STILL WITHOUT THUMBNAILS ({problematic.count()}):")
    for img in problematic:
        print(f"  - {img.title} (ID: {img.id}, Category: {img.category})")
        if img.image:
            img_path = os.path.join(settings.MEDIA_ROOT, img.image.name)
            if os.path.exists(img_path):
                print(f"    Path: {img_path}")
            else:
                print(f"    ⚠️ File missing from disk")

# Check for entries without image files (should be cleaned up)
empty_images = WeddingImage.objects.filter(image__isnull=True, category__isnull=False)
if empty_images.count() > 0:
    print(f"\n⚠️ ENTRIES WITHOUT IMAGE FILES ({empty_images.count()}):")
    for img in empty_images:
        print(f"  - {img.title} (ID: {img.id}, Category: {img.category})")
    print("  Consider cleaning these up with: WeddingImage.objects.filter(image__isnull=True).delete()")

print(f"\n✨ Thumbnail generation complete!")