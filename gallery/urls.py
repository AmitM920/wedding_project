# gallery/urls.py (create this file)
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import hello_world, WeddingImageViewSet

router = DefaultRouter()
router.register('images',WeddingImageViewSet, basename='images')
urlpatterns = [
    path('hello/', hello_world, name='api-health-check'),
    path('',include(router.urls)),

]