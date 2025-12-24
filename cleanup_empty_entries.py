# cleanup_empty_entries.py
import os
import sys
import django

# Setup Django
sys.path.append('C:/Users/Asus/Desktop/wedding_project')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from gallery.models import WeddingImage

print("=" * 60)
print("DATABASE CLEANUP - REMOVE EMPTY IMAGE ENTRIES")
print("=" * 60)

# Find entries without image files
empty_entries = WeddingImage.objects.filter(image__isnull=True)

print(f"Found {empty_entries.count()} entries without image files:")
for entry in empty_entries:
    print(f"  - ID {entry.id}: {entry.title} (Category: {entry.category})")
    if entry.video:
        print(f"    ⚠️ Has video file: {entry.video.name}")

print("\n" + "-" * 60)

# Ask for confirmation
response = input("Delete these entries? (yes/no): ")

if response.lower() == 'yes':
    deleted_count = empty_entries.count()
    empty_entries.delete()
    print(f"✅ Deleted {deleted_count} empty entries")
    
    # Verify deletion
    remaining = WeddingImage.objects.filter(image__isnull=True).count()
    print(f"Remaining empty entries: {remaining}")
else:
    print("⚠️ Skipping deletion")

print("\n" + "=" * 60)
print("CURRENT DATABASE STATUS:")
print("=" * 60)

# Count by category
from django.db.models import Count

categories = WeddingImage.objects.values('category').annotate(
    total=Count('id'),
    with_images=Count('id', filter=models.Q(image__isnull=False)),
    with_thumbnails=Count('id', filter=models.Q(thumbnail__isnull=False))
)

for cat in categories:
    category = cat['category']
    total = cat['total']
    with_images = cat['with_images']
    with_thumbnails = cat['with_thumbnails']
    
    if total > 0:
        image_percent = (with_images / total * 100) if total > 0 else 0
        thumb_percent = (with_thumbnails / with_images * 100) if with_images > 0 else 0
        
        print(f"\n{category.upper():<15}")
        print(f"  Total entries: {total}")
        print(f"  With images:   {with_images}/{total} ({image_percent:.1f}%)")
        print(f"  With thumbnails: {with_thumbnails}/{with_images} ({thumb_percent:.1f}%)")

print("\n✨ Cleanup complete!")