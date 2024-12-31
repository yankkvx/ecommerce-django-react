from django.urls import path
from store.views.order_views import (OrderManagement, AdminOrderManagement)


urlpatterns = [
    path('', AdminOrderManagement.as_view(), name='orders'),
    path('add/', OrderManagement.as_view(), name='add-order'),
    path('my-orders/', OrderManagement.as_view(), name='user-orders'),
    path('<str:pk>/deliver/', AdminOrderManagement.as_view(), name='deliver'),
    path('<str:pk>/', OrderManagement.as_view(), name='get-order'),
    path('<str:pk>/pay/', OrderManagement.as_view(), name='pay'),
]
