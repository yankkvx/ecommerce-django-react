from django.urls import path
from . import views


urlpatterns = [
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('products/', views.get_products, name='products'),
    path('products/<int:pk>/', views.get_product, name='product'),
    path('users/', views.get_users, name='users'),
    path('users/profile/', views.get_user, name='user-profile'),
]
