# gallery/admin_views.py
from django.shortcuts import render, redirect
from django.contrib import admin
from django.contrib.auth.decorators import permission_required
from .models import WeddingImage
from .forms import BulkUploadForm  # You'll create this next
import os

# This decorator makes it an admin view (requires add permission)
@admin.site.admin_view
@permission_required('gallery.add_weddingimage')
def bulk_upload_simple(request):
    """
    Handle bulk image uploads from the admin interface
    """
    if request.method == 'POST':
        # Include request.FILES to get uploaded images
        form = BulkUploadForm(request.POST, request.FILES)
        
        if form.is_valid():
            category = form.cleaned_data['category']
            is_featured = form.cleaned_data['is_featured']
            images = request.FILES.getlist('images')  # Get ALL uploaded files
            
            created_count = 0
            error_count = 0
            
            for img_file in images:
                try:
                    # Create WeddingImage instance
                    wedding_image = WeddingImage(
                        title=os.path.splitext(img_file.name)[0],  # Filename without extension
                        category=category,
                        is_featured=is_featured,
                        media_type='image'
                    )
                    
                    # Save the image file - this triggers thumbnail generation
                    wedding_image.image.save(img_file.name, img_file, save=True)
                    created_count += 1
                    
                    print(f"✅ Created: {wedding_image.title} (ID: {wedding_image.id})")
                    
                except Exception as e:
                    print(f"❌ Error uploading {img_file.name}: {e}")
                    error_count += 1
            
            # Show success message in admin
            from django.contrib import messages
            if created_count > 0:
                messages.success(
                    request, 
                    f'Successfully uploaded {created_count} images to "{category}" category. ' +
                    f'Thumbnails were auto-generated. ' +
                    f'({error_count} errors)' if error_count > 0 else ''
                )
            else:
                messages.error(request, f'Failed to upload images. Check server logs.')
            
            return redirect('admin:gallery_weddingimage_changelist')
    
    else:
        # GET request - show empty form
        form = BulkUploadForm()
    
    return render(request, 'admin/bulk_upload_simple.html', {'form': form})
