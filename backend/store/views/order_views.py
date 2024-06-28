from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.shortcuts import get_object_or_404
from rest_framework import status
from datetime import datetime
from ..models import Product, Order, OrderItem, ShippingAddress
from ..serializers import OrderSerializer


class OrderManagement(APIView):
    """
    API endpoint for managing orders.
    Supports creation, retrieval, and updating of orders.
    Requires authentication for access.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Creates a new order with associated items and shipping address.
        user = request.user
        data = request.data
        # Extracts the order items from the data.
        order_items = data['orderItems']

        # Checks if there are no order items in the request data.
        if order_items and len(order_items) == 0:
            # Returns a response indicating no order items were provided, with a bad request status.
            return Response({'detail': 'No order items'}, status=status.HTTP_400_BAD_REQUEST)
            # If there are order items, proceeds to create the order.
            # Create a new order with the provided data.
        try:
            order = Order.objects.create(
                user=user,
                payment_method=data['paymentMethod'],
                shipping_price=data['shipping_price'],
                total_price=data['total_price']
            )
            # Create a shipping address associated with the order.
            shipping = ShippingAddress.objects.create(
                order=order,
                country=data['shippingAddress']['country'],
                city=data['shippingAddress']['city'],
                address=data['shippingAddress']['address'],
                postal_code=data['shippingAddress']['postal_code'],
            )
            # Create order items and set the order to OrderItem relationship
            for i in order_items:
                product = get_object_or_404(Product, id=i['product'])
                product_image = product.productimage_set.first()

                # Creates the order item with the provided data.
                item = OrderItem.objects.create(
                    product=product,
                    order=order,
                    name=product.name,
                    quantity=i['quantity'],
                    price=i['price'],
                    image=product_image,
                )
                # Update the count_in_stock of the product after the order item is created.
                product.count_in_stock -= item.quantity
                product.save()

            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None):
        # Retrieves orders based on user permissions.
        user = request.user

        if pk:
            order = get_object_or_404(Order, id=pk)
            if user.is_staff or order.user == user:
                serializer = OrderSerializer(order, many=False)
                return Response(serializer.data)
            else:
                return Response({'detail': 'Access denied. This order does not belong to you.'}, status=status.HTTP_403_FORBIDDEN)
        else:
            orders = user.order_set.all()
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data)

    def put(self, request, pk):
        order = get_object_or_404(Order, id=pk)
        order.is_paid = True
        order.paid_at = datetime.now()
        order.save()

        return Response('Order was paid.', status=status.HTTP_200_OK)


class AdminOrderManagement(APIView):
    """
    API endpoint for managing orders by admins.
    Supports retrieval and updating of orders.
    Requires admin permissions for access.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        # Retrieves all orders.
        try:
            orders = Order.objects.all()
            serializer = OrderSerializer(orders, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        # Updates the delivery status of a specific order.
        order = get_object_or_404(Order, id=pk)
        order.is_delivered = True
        order.delivered_at = datetime.now()
        order.save()

        return Response('Order was delivered.', status=status.HTTP_200_OK)
