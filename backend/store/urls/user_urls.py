from django.urls import path
from ..views import user_views


urlpatterns = [
    path('login/', user_views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('', user_views.get_users, name='users'),
    path('delete/<str:pk>/', user_views.delete_user, name='delete-user'),

    path('sign-up/', user_views.register_user, name='sign-up'),
    path('profile/', user_views.get_user, name='user-profile'),
    path('profile/update/', user_views.update_user, name='update-user'),
]
