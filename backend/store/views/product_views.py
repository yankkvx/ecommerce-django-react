from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ..models import Product, ProductImage, Review, FavouriteProduct
from django.contrib.auth.models import User
from ..serializers import ProductSerializer, FavouriteProductSerializer
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from PIL import Image
from django.db.models import Avg


@api_view(['GET'])
def get_products(request):
    try:
        query = request.query_params.get('query', '')
        page = request.query_params.get('page', 1)
        products = Product.objects.filter(
            name__icontains=query).prefetch_related('productimage_set')

        paginator = Paginator(products, 6)
        try:
            products = paginator.page(page)
        except PageNotAnInteger:
            products = paginator.page(1)
        except EmptyPage:
            products = paginator.page(paginator.num_pages)

        if page == None:
            page = 1

        page = int(page)

        serializer = ProductSerializer(products, many=True)
        return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_latest_products(request):
    products = Product.objects.order_by('-created_at')[:5]
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def products_by_category(request, category):
    try:
        products = Product.objects.filter(category__iexact=category)
        if not products.exists():
            content = {'detail': 'Category not found'}
            return Response(content, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)
    except Product.DoesNotExist:
        content = {'detail': 'Category not found'}
        return Response(content, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_categories(request):
    categories = Product.objects.values_list('category', flat=True).distinct()
    return Response(categories)


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


@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_product(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Name',
        brand='Brand',
        category='Category',
        description='',
        price=0,
        count_in_stock=0,
    )

    images = request.FILES.getlist('images')
    for image in images:
        ProductImage.objects.create(product=product, image=image)

    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def edit_product(request, pk):
    try:
        data = request.data
        product = Product.objects.get(id=pk)
        product.name = data['name']
        product.brand = data['brand']
        product.category = data['category']
        product.description = data['description']
        product.price = data['price']
        product.count_in_stock = data['count_in_stock']
        product.save()

        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        content = {'detail': 'Product not found.'}
        return Response(content, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def upload_image(request):
    try:
        data = request.data
        product_id = data['product_id']
        product = Product.objects.get(id=product_id)
        images = request.FILES.getlist('images')  # Retrieve multiple images
        allowed_formats = ['JPEG', 'PNG']
        for img in images:
            # Check image format.
            try:
                image = Image.open(img)
                if image.format not in allowed_formats:
                    content = {
                        'detail': 'Unsupported image format. Try to upload JPEG or PNG images.'}
                    return Response(content, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            ProductImage.objects.create(product=product, image=img)
        return Response('Images were uploaded.')
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def post_review(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)
    data = request.data

    # Check if the user has already posted a review.
    exist = product.review_set.filter(user=user).exists()
    if exist:
        content = {
            'detail': 'You have already submitted a review for this product.'}
        return Response(content, status=status.HTTP_409_CONFLICT)

    # Check if the user wanna post a review without rating.
    elif data['rating'] == 0:
        content = {'detail': 'Please provide a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # Create review
    else:
        review = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment']
        )

        # Update the product model.
        product.num_reviews = product.review_set.count()
        avg_rating = product.review_set.aggregate(Avg('rating'))['rating__avg']
        product.rating = avg_rating if avg_rating is not None else 0

        product.save()

        content = {
            'detail': 'Thank you for your review! Your feedback has been submitted successfully.'}
        return Response(content, status=status.HTTP_201_CREATED)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_review(request, pk):
    try:
        review = Review.objects.get(id=pk)
        review.delete()
        content = {'detail': 'Review successfully deleted.'}
        return Response(content, status=status.HTTP_200_OK)
    except ObjectDoesNotExist:
        content = {'detail': 'Review not found.'}
        return Response(content, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favourites(request):
    try:
        user = request.user
        favourites = FavouriteProduct.objects.filter(user=user)

        if not favourites:
            content = {'detail': "You don't have favourites products yet."}
            return Response(content, status=status.HTTP_404_NOT_FOUND)

        serializer = FavouriteProductSerializer(favourites, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_favourites(request, pk):
    product = Product.objects.get(id=pk)
    user = request.user

    # Check if product is already in favourites.
    if FavouriteProduct.objects.filter(product=product, user=user).exists():
        content = {'detail': 'Product is already in favourites.'}
        return Response(content, status=status.HTTP_409_CONFLICT)

    FavouriteProduct.objects.create(product=product, user=user)
    content = {'detail': 'Product added to favourites.'}
    return Response(content, status=status.HTTP_200_OK)
