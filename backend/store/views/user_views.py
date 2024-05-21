from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from ..serializers import ProductSerializer, UserSerializer, UserSerializerRefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serialzier = UserSerializerRefreshToken(self.user).data
        for key, value in serialzier.items():
            data[key] = value
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user
    serializer = UserSerializerRefreshToken(user, many=False)

    data = request.data
    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.email = data['email']
    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['POST'])
def register_user(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['first_name'],
            last_name=data['last_name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )

        serializer = UserSerializerRefreshToken(user, many=False)
        return Response(serializer.data)
    except:
        content = {'detail': 'This email is already associated with an account.'}
        return Response(content, status=status.HTTP_409_CONFLICT)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_users(request):
    try:
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    except:
        content = {
            'detail': 'Access Denied: This page is restricted to admin users only.'}
        return Response(content, status=status.HTTP_403_FORBIDDEN)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
    try:
        user = User.objects.get(id=pk)
        user.delete()
        return Response('User was deleted', status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response('User not found', status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
