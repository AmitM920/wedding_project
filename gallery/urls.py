# gallery/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    hello_world, 
    WeddingImageViewSet, 
    CloudinarySignatureView,  # NEW
    SaveCloudinaryUrlsView,    # NEW
    BulkUploadAPIView          # Keep as backup
)

router = DefaultRouter()
router.register('images', WeddingImageViewSet, basename='images')

urlpatterns = [
    path('hello/', hello_world, name='api-health-check'),
    path('cloudinary-signature/', CloudinarySignatureView.as_view(), name='cloudinary-signature'),  # NEW
    path('save-urls/', SaveCloudinaryUrlsView.as_view(), name='save-urls'),  # NEW
    path('bulk-upload/', BulkUploadAPIView.as_view(), name='bulk-upload'),  # Keep for compatibility
    path('', include(router.urls)),
]