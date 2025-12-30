# gallery/admin.py
import django  # Add this import at the top
import os

print("✅ Admin module is loading...")
print(f"✅ Django version: {django.get_version()}")

from django.contrib import admin
from django.urls import path
from django.utils.html import format_html
from django.urls import reverse
from .models import WeddingImage
from .admin_views import bulk_upload_simple  # Import the view
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

    def has_thumbnail(self, obj):
        if obj.thumbnail:
        # Check if thumbnail URL is valid
          try:
            import requests
            response = requests.head(obj.thumbnail.url, timeout=2)
            return response.status_code == 200
          except:
            return False
        return False

    has_thumbnail.boolean = True
    has_thumbnail.short_description = "Has Thumb"

    # In your admin.py - Update image_preview method

    def image_preview(self, obj):
        if obj.image:
            try:
                # Use Cloudinary transformation for thumbnail
                url = obj.image.build_url(
                    width=50, height=50, crop="fill", gravity="auto", quality=80
                )
                return format_html(
                    '<img src="{}" width="50" height="50" style="object-fit: cover; border-radius: 4px;" />',
                    url,
                )
            except:
                # Fallback
                return format_html(
                    '<div style="width:50px;height:50px;background:#667eea;border-radius:4px;"></div>'
                )
        return "-"

    def image_preview_large(self, obj):
        if obj.image:
            try:
                # Use Cloudinary's build_url method with transformations
                url = obj.image.build_url(
                    width=300, height=300, crop="limit", quality=80
                )
                return format_html(
                    '<img src="{}" style="max-width: 300px; max-height: 300px; object-fit: contain; border: 1px solid #ddd; border-radius: 4px;" />',
                    url,
                )
            except Exception as e:
                print(f"Admin large preview error: {e}")
                return format_html(
                    '<div style="width: 300px; height: 200px; background: #f8f9fa; display: flex; align-items: center; justify-content: center; border-radius: 4px; border: 1px solid #ddd; color: #666;">Image preview error</div>'
                )
        return "No image"

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
        # Add bulk upload URL
        bulk_upload_url = reverse("admin:gallery_weddingimage_bulk_upload")
        extra_context["bulk_upload_url"] = bulk_upload_url
        extra_context["show_bulk_upload"] = "true"
        return super().changelist_view(request, extra_context=extra_context)


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
