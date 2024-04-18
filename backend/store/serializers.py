from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ('image',)


class ProductSerializer(serializers.ModelSerializer):
    # Define a SerializerMethodField with 'images' name to handle cutstom serialization for images. This field is not a simple Product model field.
    images = serializers.SerializerMethodField()

    # Define a function to get all images associated with a product.
    def get_images(self, obj):
        # Extract all images, that are associated with the product.
        images = obj.productimage_set.all()
        # Return a list of image URLs for each image associated with the product.
        return [image.image.url for image in images]

    class Meta:
        model = Product
        fields = '__all__'
