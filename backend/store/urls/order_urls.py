from django.urls import path
from store.views import order_views


urlpatterns = [
    path('add/', order_views.add_order_items, name='add-order'),
    path('my-orders/', order_views.get_user_orders, name='user-orders'),
    path('<str:pk>/', order_views.get_order, name='get-order'),
    path('<str:pk>/pay/', order_views.paid_order_update, name='pay'),
    
]
