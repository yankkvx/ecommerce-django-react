from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, ProductImage
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    # SerializerMethodField to get the full name of the user.
    full_name = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'is_staff']

    # MEthod to get full name based on first_name and last_name.
    def get_full_name(self, obj):
        if obj.first_name and obj.last_name:
            full_name = f'{obj.first_name} {obj.last_name}'
        elif obj.first_name:
            full_name = obj.first_name
        elif obj.last_name:
            full_name = obj.last_name
        else:
            full_name = obj.email
        return full_name


# Serializer for the User model with the addition of a token field
class UserSerializerRefreshToken(UserSerializer):
    # SerializerMethodField to get the token associated with the user.
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'full_name', 'is_staff', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


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
