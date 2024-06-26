from django.urls import path
from store.views import product_views
from store.views.product_views import (
    GetProducts, GetLatestProducts, ProductsByCategory, GetCategories, ProductDetails, ReviewDetails, FavouritesDetails)

urlpatterns = [
    path('', GetProducts.as_view(), name='products'),
    path('latest/', GetLatestProducts.as_view(), name='last-products'),
    path('create/', ProductDetails.as_view(), name='create-product'),
    path('upload/', product_views.upload_image, name='image-upload'),
    path('<int:pk>/', ProductDetails.as_view(), name='product'),
    path('<int:pk>/action/', ProductDetails.as_view(), name='product-action'),
    path('<str:pk>/review/', ReviewDetails.as_view(), name='post-review'),
    path('category/', GetCategories.as_view(), name='category-list'),
    path('category/<str:category>/', ProductsByCategory.as_view(), name='product-by-category'),
    path('favourites/', FavouritesDetails.as_view(), name='favourites-list'),
    path('<str:pk>/favourites/', FavouritesDetails.as_view(), name='add-to-favourites'),
]
