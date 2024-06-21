from django.urls import path
from store.views import product_views


urlpatterns = [
    path('', product_views.get_products, name='products'),
    path('latest/', product_views.get_latest_products, name='last-products'),
    path('create/', product_views.create_product, name='create-product'),
    path('upload/', product_views.upload_image, name='image-ipload'),
    path('<str:pk>/reviews/', product_views.post_review, name='post-review'),
    path('delete/review/<str:pk>/', product_views.delete_review, name='delete-review'),
    path('<int:pk>/', product_views.get_product, name='product'),
    path('category/', product_views.get_categories, name='category'),
    path('category/<str:category>/', product_views.products_by_category,
         name='product-by-category'),
    path('favourites/', product_views.get_favourites, name='favourites'),
    path('<str:pk>/add-to-favourites/',  product_views.add_to_favourites, name='add-to-favourites'),
    path('<str:pk>/remove-from-favourites/',  product_views.remove_from_favourites, name='remove-from-favourites'),
    path('edit/<str:pk>/', product_views.edit_product, name='edit-product`'),
    path('delete/<str:pk>/', product_views.delete_product, name='delete-product'),
]
