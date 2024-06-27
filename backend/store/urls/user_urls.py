from django.urls import path
from store.views.user_views import (
    MyTokenObtainPairView, UserManagement, AdminUserManagement, RegisterUser)

urlpatterns = [
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('sign-up/', RegisterUser.as_view(), name='sign-up'),
    path('profile/', UserManagement.as_view(), name='user-management'),
    path('<str:pk>/', AdminUserManagement.as_view(), name='delete-user'),
    path('', AdminUserManagement.as_view(), name='users'),
]
