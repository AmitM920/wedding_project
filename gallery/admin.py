# gallery/admin.py
import django
import os

print("✅ Admin module is loading...")
print(f"✅ Django version: {django.get_version()}")

from django.contrib import admin
from django.urls import path
from django.utils.html import format_html
from django.urls import reverse
from django.contrib import messages
from .models import WeddingImage
from .admin_views import bulk_upload_simple
import cloudinary

class WeddingImageAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "category",
        "media_type",
        "has_thumbnail",
        "uploaded_at",
        "image_preview",
    ]
    list_filter = ["category", "is_featured", "media_type"]
    search_fields = ["title", "description"]
    change_list_template = "admin/bulk_upload_button.html"
    readonly_fields = ["uploaded_at", "image_preview_large"]
    
    # ✅ CRITICAL: Disable default delete action, use custom one
    actions = ['delete_selected_custom', 'regenerate_thumbnails']
    
    # Custom delete action with Cloudinary cleanup
    def delete_selected_custom(self, request, queryset):
        """
        Custom delete action that shows confirmation and handles Cloudinary cleanup
        """
        # Count before deletion
        count_before = queryset.count()
        
        # Delete each one (model's delete() method handles Cloudinary)
        deleted_count = 0
        for obj in queryset:
            try:
                # This will trigger the model's delete() method
                obj.delete()
                deleted_count += 1
            except Exception as e:
                self.message_user(
                    request,
                    f"Error deleting {obj.title}: {str(e)}",
                    messages.ERROR
                )
        
        if deleted_count > 0:
            self.message_user(
                request,
                f"✅ Successfully deleted {deleted_count} images from database and Cloudinary.",
                messages.SUCCESS
            )
        
        # Return None to stay on same page
        return None
    
    delete_selected_custom.short_description = "Delete selected images (with Cloudinary cleanup)"
    
    def regenerate_thumbnails(self, request, queryset):
        """Regenerate thumbnails for selected images"""
        regenerated = 0
        for obj in queryset:
            if obj.image and not obj.thumbnail:
                try:
                    obj.generate_thumbnail_simple()
                    obj.save(update_fields=['thumbnail'])
                    regenerated += 1
                except Exception as e:
                    self.message_user(
                        request,
                        f"Error regenerating thumbnail for {obj.title}: {e}",
                        messages.WARNING
                    )
        
        if regenerated > 0:
            self.message_user(
                request,
                f"✅ Regenerated thumbnails for {regenerated} images.",
                messages.SUCCESS
            )
    
    regenerate_thumbnails.short_description = "Regenerate thumbnails"
    
    def delete_queryset(self, request, queryset):
        """
        Handle bulk deletion from admin change list
        This ensures model's delete() method is called for each object
        """
        count = queryset.count()
        for obj in queryset:
            # Call individual delete() to trigger Cloudinary cleanup
            obj.delete()
        
        self.message_user(
            request,
            f"✅ Successfully deleted {count} images from database and Cloudinary.",
            messages.SUCCESS
        )

    def has_thumbnail(self, obj):
        return bool(obj.thumbnail)
    
    has_thumbnail.boolean = True
    has_thumbnail.short_description = "Has Thumb"

    def image_preview(self, obj):
        if obj.image:
            try:
                url = obj.image.build_url(
                    width=50, height=50, crop="fill", gravity="auto", quality=80
                )
                return format_html(
                    '<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />',
                    url,
                )
            except Exception as e:
                print(f"Preview error for {obj.title}: {e}")
                return format_html(
                    '<div style="width:50px;height:50px;background:#667eea;border-radius:4px;" title="Preview error"></div>'
                )
        return "-"
    
    image_preview.short_description = "Preview"

    def image_preview_large(self, obj):
        if obj.image:
            try:
                url = obj.image.build_url(
                    width=300, height=300, crop="limit", quality=85
                )
                return format_html(
                    '<img src="{}" style="max-width: 300px; max-height: 300px; object-fit: contain; border: 1px solid #ddd; border-radius: 4px;" />',
                    url,
                )
            except Exception as e:
                print(f"Large preview error for {obj.title}: {e}")
                return format_html(
                    '<div style="width:300px;height:200px;background:#f8f9fa;border:1px solid #ddd;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#666;">Image preview error</div>'
                )
        return "No image"
    
    image_preview_large.short_description = "Image Preview"

    # Add custom URL for bulk upload
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "bulk-upload/",
                self.admin_site.admin_view(bulk_upload_simple),
                name="gallery_weddingimage_bulk_upload",
            ),
        ]
        return custom_urls + urls

    # Add bulk upload button to change list page
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        bulk_upload_url = reverse("admin:gallery_weddingimage_bulk_upload")
        extra_context["bulk_upload_url"] = bulk_upload_url
        extra_context["show_bulk_upload"] = "true"
        return super().changelist_view(request, extra_context=extra_context)
    
    # Customize delete confirmation page
    def delete_view(self, request, object_id, extra_context=None):
        """Custom delete view to show Cloudinary warning"""
        extra_context = extra_context or {}
        extra_context["cloudinary_warning"] = "true"
        return super().delete_view(request, object_id, extra_context=extra_context)


admin.site.register(WeddingImage, WeddingImageAdmin)

# 1. http://127.0.0.1:8000/gallery/hello/
# 2. http://127.0.0.1:8000/gallery/images/
# 3. http://127.0.0.1:8000/gallery/images/categories/
# 4. http://127.0.0.1:8000/gallery/images/featured/
# 5. http://127.0.0.1:8000/admin/gallery/weddingimage/bulk-upload/

# /gallery/images/           → GET: List all images, POST: Create
# /gallery/images/{id}/      → GET: Single image, PUT/PATCH: Update, DELETE: Remove
# /gallery/images/categories/ → GET: List categories with counts
# /gallery/images/featured/   → GET: Featured images only

# /gallery/images/?category=pre_wedding
# /gallery/images/?category=haldi
# /gallery/images/?category=mehndi
# /gallery/images/?category=sagan
# /gallery/images/?category=wedding