from django.urls import path
from ..views import user_views


urlpatterns = [
    path('login/', user_views.MyTokenObtainPairView.as_view(),
         name='token_obtain_pair'),
    path('', user_views.get_users, name='users'),
    path('sign-up/', user_views.register_user, name='sign-up'),
    path('profile/', user_views.get_user, name='user-profile'),
]
