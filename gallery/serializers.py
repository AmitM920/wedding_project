from rest_framework import serializers
from .models import WeddingImage

class WeddingImageSerializer(serializers.ModelSerializer):
    # This converts Python objects to JSON and vice-versa
    class Meta:
        model = WeddingImage
        fields = '__all__'  # Include all model fields