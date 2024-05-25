from django.urls import path
from store.views import product_views


urlpatterns = [
    path('', product_views.get_products, name='products'),
    path('create/', product_views.create_product, name='create-product'),
    path('<int:pk>/', product_views.get_product, name='product'),
    path('edit/<str:pk>/', product_views.edit_product, name='edit-product`'),
    path('delete/<str:pk>/', product_views.delete_product, name='delete-product'),
]
