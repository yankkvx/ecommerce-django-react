from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ..models import Product
from django.contrib.auth.models import User
from ..serializers import ProductSerializer
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist


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


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_product(request, pk):
    try:
        product = Product.objects.get(id=pk)
        product.delete()
        content = {'detail': 'Product successfully deleted.'}
        return Response(content, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        content = {'detail': 'Product not found.'}
        return Response(content, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
