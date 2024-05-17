from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from ..models import Product, Order, OrderItem, ShippingAddress
from ..serializers import OrderSerializer
from rest_framework import status
from datetime import datetime


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_order_items(request):
    user = request.user
    data = request.data
    # Extracts the order items from the data.
    order_items = data['orderItems']

    # Checks if there are no order items in the request data.
    if order_items and len(order_items) == 0:
        # Returns a response indicating no order items were provided, with a bad request status.
        content = {'detail': 'No order items'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)
    else:
        # If there are order items, proceeds to create the order.
        # Create a new order with the provided data.
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
            product = Product.objects.get(id=i['product'])
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_order(request, pk):
    user = request.user
    order = Order.objects.get(id=pk)
    try:
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            content = {
                'detail': 'Access denied. This order does not belong to you'}
            return Response(content, status=status.HTTP_403_FORBIDDEN)
    except:
        content = {'detail': 'Order not found.'}
        return Response(content, status=status.HTTP_404_NOT_FOUND)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def paid_order_update(request, pk):
    order = Order.objects.get(id=pk)
    order.is_paid = True
    order.paid_at = datetime.now()
    order.save()

    return Response('Order was paid')
