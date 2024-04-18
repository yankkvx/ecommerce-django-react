from django.shortcuts import render
from django.http import JsonResponse

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Product
from .serializers import ProductSerializer



@api_view(['GET'])
def get_products(request):
    products = Product.objects.all().prefetch_related('productimage_set')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_product(request, pk):
    if product := Product.objects.filter(id=pk).first():
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    return Response({"message": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
