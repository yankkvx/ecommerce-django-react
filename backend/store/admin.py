from django.contrib import admin
from .models import Product, ProductImage, Review, Order, OrderItem, ShippingAddress, FavouriteProduct
# Register your models here.

admin.site.register(Product)
admin.site.register(ProductImage)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(FavouriteProduct)