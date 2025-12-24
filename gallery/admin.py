# gallery/admin.py
from django.contrib import admin
from django.urls import path
from django.utils.html import format_html
from django.urls import reverse
from .models import WeddingImage
from .admin_views import bulk_upload_simple  # Import the view

class WeddingImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'media_type', 'has_thumbnail', 'uploaded_at']
    list_filter = ['category', 'is_featured', 'media_type']
    search_fields = ['title', 'description']
    readonly_fields = ['uploaded_at']
    
    def has_thumbnail(self, obj):
        return bool(obj.thumbnail)
    has_thumbnail.boolean = True
    has_thumbnail.short_description = 'Has Thumb'
    
    # Add custom URL for bulk upload
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('bulk-upload/', self.admin_site.admin_view(bulk_upload_simple), name='bulk_upload'),
        ]
        return custom_urls + urls
    
    # Add bulk upload button to change list page
    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['show_bulk_upload'] = True
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