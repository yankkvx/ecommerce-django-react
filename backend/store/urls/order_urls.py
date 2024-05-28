from django.urls import path
from store.views import order_views


urlpatterns = [
    path('', order_views.get_orders, name='orders'),
    path('add/', order_views.add_order_items, name='add-order'),
    path('my-orders/', order_views.get_user_orders, name='user-orders'),
    path('<str:pk>/deliver/', order_views.deliver_order_update, name='deliver'),
    path('<str:pk>/', order_views.get_order, name='get-order'),
    path('<str:pk>/pay/', order_views.paid_order_update, name='pay'),
]
