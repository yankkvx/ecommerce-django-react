from django.urls import path
from ..views import user_views


urlpatterns = [
    path('login/', user_views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),

    path('sign-up/', user_views.register_user, name='sign-up'),

    path('profile/update/', user_views.update_user, name='update-user'),
    path('profile/', user_views.get_user, name='user-profile'),

    path('delete/<str:pk>/', user_views.delete_user, name='delete-user'),
    path('update/<str:pk>/', user_views.update_user_by_admin,
         name='update-user-by-admin'),
    path('<str:pk>/', user_views.get_user_by_id, name='get-user-by-id'),

    path('', user_views.get_users, name='users'),
]
