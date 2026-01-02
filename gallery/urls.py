# gallery/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import hello_world, WeddingImageViewSet, BulkUploadAPIView

router = DefaultRouter()
router.register('images', WeddingImageViewSet, basename='images')

urlpatterns = [
    path('hello/', hello_world, name='api-health-check'),
    path('bulk-upload/', BulkUploadAPIView.as_view(), name='bulk-upload'),  # NEW
    path('', include(router.urls)),
]