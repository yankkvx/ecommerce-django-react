from django.shortcuts import get_object_or_404
from django.db.models import Avg
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from PIL import Image

from ..serializers import ProductSerializer, FavouriteProductSerializer
from ..models import Product, ProductImage, Review, FavouriteProduct


class GetProducts(APIView):
    """
    API endpoint to fetch products with optional search query and pagination.

    Supports searching by 'query' parameter and paginates results.
    """

    def get(self, request):
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

            page = int(page) if page else 1
            serializer = ProductSerializer(products, many=True)
            return Response({'products': serializer.data, 'page': page, 'pages': paginator.num_pages})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetLatestProducts(APIView):
    """
    API endpoint to fetch the latest 5 products based on creation date.
    """

    def get(self, request):
        products = Product.objects.order_by('-created_at')[:5]
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)


class ProductsByCategory(APIView):
    """
    API endpoint to fetch products by category.

    Retrieves products matching the specified category.
    """

    def get(self, request, category):
        try:
            products = Product.objects.filter(category__iexact=category)
            if not products.exists():
                return Response({'detail': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class GetCategories(APIView):
    """
    API endpoint to fetch all distinct product categories.
    """

    def get(self, request):
        categories = Product.objects.values_list(
            'category', flat=True).distinct()
        return Response(categories)


class ProductCreate(APIView):
    """
    API endpoint to create a new product (admin only).

    Requires admin authentication. Uploads product images and returns serialized product details.
    """

    permission_classes = [IsAdminUser]

    def post(self, request):
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


class ProductDetails(APIView):
    """
    API endpoint to retrieve, update, or delete a specific product (admin only for delete and update).

    Supports GET, POST, DELETE, and PUT methods for detailed product operations.
    """

    def get(self, request, pk):
        product = get_object_or_404(Product, id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)

    def post(self, request):
        if not request.user.is_staff:
            return Response(data="You do not have permission to perform this action", status=status.HTTP_403_FORBIDDEN)
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

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response(data="You do not have permission to perform this action", status=status.HTTP_403_FORBIDDEN)
        try:
            product = Product.objects.get(id=pk)
            product.delete()
            return Response({'detail': 'Product successfully deleted.'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        if not request.user.is_staff:
            return Response(data="You do not have permission to perform this action", status=status.HTTP_403_FORBIDDEN)
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
            return Response({'detail': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def upload_image(request):
    """
    API endpoint to upload images for a specific product.

    Requires 'product_id' and 'images' fields in POST request data. Validates image formats (JPEG, PNG).
    """

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
                    return Response({'detail': 'Unsupported image format. Try to upload JPEG or PNG images.'}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            ProductImage.objects.create(product=product, image=img)
        return Response('Images were uploaded.')
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ReviewDetails(APIView):
    """
    API endpoint to handle product reviews.

    Supports creating and deleting reviews. Requires authentication and checks for duplicate reviews and valid ratings.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        user = request.user
        product = Product.objects.get(id=pk)
        data = request.data

        # Check if the user has already posted a review.
        if product.review_set.filter(user=user).exists():
            return Response({'detail': 'You have already submitted a review for this product.'}, status=status.HTTP_409_CONFLICT)

        # Check if the user wanna post a review without rating.
        if data['rating'] == 0:
            return Response({'detail': 'Please provide a rating'}, status=status.HTTP_400_BAD_REQUEST)

        # Create review

        eview = Review.objects.create(
            user=user,
            product=product,
            name=user.first_name,
            rating=data['rating'],
            comment=data['comment']
        )

        product.num_reviews = product.review_set.count()
        product.rating = product.review_set.aggregate(Avg('rating'))[
            'rating__avg'] or 0
        product.save()

        return Response({'detail': 'Thank you for your review! Your feedback has been submitted successfully.'}, status=status.HTTP_201_CREATED)

    def delete(self, request, pk):
        if not request.user.is_staff:
            return Response(data="You do not have permission to perform this action", status=status.HTTP_403_FORBIDDEN)
        try:
            review = Review.objects.get(id=pk)
            review.delete()
            return Response({'detail': 'Review successfully deleted.'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'detail': 'Review not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class FavouritesDetails(APIView):
    """
    API endpoint to handle user's favourite products.

    Supports retrieving, adding, and removing products from favourites.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            favourites = FavouriteProduct.objects.filter(user=user)
            serializer = FavouriteProductSerializer(favourites, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, pk):
        product = Product.objects.get(id=pk)
        user = request.user

        # Check if product is already in favourites.
        if FavouriteProduct.objects.filter(product=product, user=user).exists():
            return Response({'detail': 'Product is already in favourites.'}, status=status.HTTP_409_CONFLICT)

        FavouriteProduct.objects.create(product=product, user=user)
        return Response({'detail': 'Product added to favourites.'}, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        try:
            user = request.user
            favourite_product = FavouriteProduct.objects.get(
                product=pk, user=user)
            favourite_product.delete()
            return Response({'detail': 'Product removed from favourites.'}, status=status.HTTP_200_OK)
        except FavouriteProduct.DoesNotExist:
            return Response({'detail': 'Product is not in favourites.'}, status=status.HTTP_404_NOT_FOUND)
