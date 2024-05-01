from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ..models import Product
from django.contrib.auth.models import User
from ..serializers import ProductSerializer
from rest_framework import status


@api_view(['GET'])
def get_products(request):
    products = Product.objects.all().prefetch_related('productimage_set')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_product(request, pk):
    product = Product.objects.get(id=pk)
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)
