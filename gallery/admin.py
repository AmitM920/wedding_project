# gallery/admin.py
from django import forms
from django.contrib import admin
from django.shortcuts import render, redirect
from django.urls import path
from django.contrib import messages
from django.utils.html import format_html  
from .models import WeddingImage

class BulkUploadForm(forms.Form):
    category = forms.ChoiceField(choices=WeddingImage.CATEGORY_CHOICES)
    images = forms.FileField(
        required=True,
        help_text='Select multiple images to upload'
    )
    is_featured = forms.BooleanField(required=False, initial=False)

@admin.register(WeddingImage)
class WeddingImageAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'media_type', 'is_featured', 'order', 'image_preview', 'uploaded_at']
    list_filter = ['category', 'media_type', 'is_featured', 'uploaded_at']
    search_fields = ['title', 'description']
    list_editable = ['is_featured', 'order']
    readonly_fields = ['uploaded_at']
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('bulk-upload/', self.bulk_upload_view, name='gallery_weddingimage_bulk_upload'),
        ]
        return custom_urls + urls
    
    def bulk_upload_view(self, request):
        if request.method == 'POST':
            form = BulkUploadForm(request.POST, request.FILES)
            if form.is_valid():
                category = form.cleaned_data['category']
                is_featured = form.cleaned_data['is_featured']
                images = request.FILES.getlist('images')  # 🎯 This gets ALL files
                
                created_count = 0
                for i, image_file in enumerate(images):
                    WeddingImage.objects.create(
                        title=f"{category.title()} Image {i+1}",
                        media_type='image',
                        image=image_file,
                        category=category,
                        is_featured=is_featured,
                        order=i,
                        description=f"Automatically uploaded {category} image"
                    )
                    created_count += 1
                
                messages.success(request, f'Successfully uploaded {created_count} images to {category} category!')
                return redirect('admin:gallery_weddingimage_changelist')
        else:
            form = BulkUploadForm()
        
        # 🎯 SIMPLIFIED - No complex imports needed
        context = {
            'form': form,
            'title': 'Bulk Image Upload',
            **self.admin_site.each_context(request),
        }
        return render(request, 'admin/bulk_upload_simple.html', context)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover;" />',obj.image.url)
        return "No Image"
    # image_preview.allow_tags = True
    image_preview.short_description = 'Preview'

# 1. http://127.0.0.1:8000/gallery/hello/
# 2. http://127.0.0.1:8000/gallery/images/
# 3. http://127.0.0.1:8000/gallery/images/categories/
# 4. http://127.0.0.1:8000/gallery/images/featured/
# 5. http://127.0.0.1:8000/admin/gallery/weddingimage/bulk-upload/