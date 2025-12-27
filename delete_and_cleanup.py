# delete_and_cleanup.py
import os
import sys
import django

# Setup Django
sys.path.append('C:/Users/Asus/Desktop/wedding_project')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from gallery.models import WeddingImage

print("=" * 60)
print("DELETE IMAGES WITHOUT THUMBNAILS")
print("=" * 60)

# Find images without thumbnails in the problematic categories
problematic_categories = ['haldi', 'mehndi', 'sagan', 'wedding']

images_to_delete = WeddingImage.objects.filter(
    category__in=problematic_categories,
    thumbnail__isnull=True,
    image__isnull=False  # Only if they have an image file
)

print(f"Found {images_to_delete.count()} images without thumbnails:")
for img in images_to_delete:
    print(f"  - {img.title} (ID: {img.id}, Category: {img.category})")
    if img.image:
        print(f"    Image file: {img.image.path}")

print("\n" + "-" * 60)

# Also find entries without any image files (completely empty)
empty_entries = WeddingImage.objects.filter(
    category__in=problematic_categories,
    image__isnull=True
)

if empty_entries.count() > 0:
    print(f"\nFound {empty_entries.count()} empty entries (no image files):")
    for img in empty_entries:
        print(f"  - {img.title} (ID: {img.id}, Category: {img.category})")

total_to_delete = images_to_delete.count() + empty_entries.count()

if total_to_delete == 0:
    print("\n✅ No problematic images found!")
    sys.exit(0)

print(f"\nTotal to delete: {total_to_delete}")
response = input("\nDelete these entries? (yes/no): ")

if response.lower() == 'yes':
    deleted_count = 0
    file_errors = 0
    
    # Delete images without thumbnails
    for img in images_to_delete:
        try:
            # Delete the image file from disk
            if img.image and os.path.exists(img.image.path):
                os.remove(img.image.path)
                print(f"  Deleted file: {img.image.path}")
            
            # Delete thumbnail file if exists
            if img.thumbnail and os.path.exists(img.thumbnail.path):
                os.remove(img.thumbnail.path)
                print(f"  Deleted thumbnail: {img.thumbnail.path}")
            
            # Delete database entry
            img.delete()
            deleted_count += 1
            print(f"  ✅ Deleted: {img.title}")
            
        except Exception as e:
            print(f"  ❌ Error deleting {img.title}: {e}")
            file_errors += 1
    
    # Delete empty entries
    empty_count = empty_entries.count()
    empty_entries.delete()
    deleted_count += empty_count
    
    print(f"\n" + "=" * 60)
    print(f"✅ Successfully deleted {deleted_count} entries")
    if file_errors > 0:
        print(f"⚠️  Had {file_errors} file deletion errors")
    
    # Show remaining images by category
    print(f"\n" + "=" * 60)
    print("REMAINING IMAGES BY CATEGORY:")
    for category in problematic_categories:
        count = WeddingImage.objects.filter(category=category).count()
        print(f"  {category.upper():<12}: {count} images")
    
else:
    print("⚠️  Cancelled deletion")

print("\n✨ Cleanup complete!")