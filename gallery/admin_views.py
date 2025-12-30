# gallery/admin_views.py - FIXED VERSION
from django.shortcuts import render, redirect
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib import messages
from .models import WeddingImage
from .forms import BulkUploadForm
import os
import traceback

@staff_member_required
def bulk_upload_simple(request):
    """
    Handle bulk image uploads from the admin interface
    """
    print(f"\n🔍 BULK UPLOAD STARTED - Method: {request.method}")
    
    if request.method == "POST":
        print(f"📤 POST data: {dict(request.POST)}")
        print(f"📁 FILES received: {list(request.FILES.keys())}")
        
        form = BulkUploadForm(request.POST)
        
        if form.is_valid():
            category = form.cleaned_data["category"]
            is_featured = form.cleaned_data["is_featured"]
            images = request.FILES.getlist("images")
            
            print(f"📸 Processing {len(images)} images for category: {category}")
            
            if not images:
                messages.error(request, "Please select at least one image to upload.")
                return render(request, "admin/bulk_upload_simple.html", {"form": form})

            created_count = 0
            error_count = 0

            for i, img_file in enumerate(images):
                print(f"\n--- Processing image {i+1}/{len(images)}: {img_file.name} ---")
                print(f"   File size: {img_file.size} bytes")
                print(f"   Content type: {img_file.content_type}")
                
                try:
                    # ✅ FIX: Create the WeddingImage instance with image field
                    wedding_image = WeddingImage(
                        title=os.path.splitext(img_file.name)[0],
                        category=category,
                        is_featured=is_featured,
                        media_type="image",
                    )
                    
                    print(f"   ✅ Model instance created")
                    
                    # ✅ FIX: Save the image FIRST, then save the model
                    # CloudinaryField needs the file during save()
                    wedding_image.image = img_file  # Assign the file to the field
                    
                    # Now save - this will upload to Cloudinary
                    wedding_image.save()
                    
                    print(f"   💾 Model saved to database (ID: {wedding_image.id})")
                    print(f"   ✅ Image uploaded to Cloudinary")
                    
                    # Check if image was actually saved
                    if wedding_image.image:
                        print(f"   📍 Image field populated: YES")
                        print(f"   📍 public_id: {wedding_image.image.public_id}")
                        print(f"   🔗 Image URL: {wedding_image.image.url}")
                    else:
                        print(f"   ⚠️ Image field is still empty!")
                    
                    created_count += 1
                    print(f"   🎉 Successfully uploaded: {img_file.name}")

                except Exception as e:
                    print(f"   ❌ ERROR uploading {img_file.name}:")
                    print(f"   Error: {str(e)}")
                    traceback.print_exc()
                    error_count += 1

            # Show messages
            if created_count > 0:
                messages.success(
                    request,
                    f'Successfully uploaded {created_count} images to "{category}" category.',
                )
            if error_count > 0:
                messages.warning(request, f"{error_count} images failed to upload.")

            return redirect("admin:gallery_weddingimage_changelist")
        else:
            print(f"❌ Form invalid: {form.errors}")
            messages.error(request, "Please correct the form errors.")
    else:
        form = BulkUploadForm()
        print("📄 Showing empty form")

    return render(request, "admin/bulk_upload_simple.html", {"form": form})