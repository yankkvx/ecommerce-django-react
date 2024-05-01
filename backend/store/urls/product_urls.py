from django.urls import path
from store.views import product_views


urlpatterns = [
    path('', product_views.get_products, name='products'),
    path('<int:pk>/', product_views.get_product, name='product'),
]
