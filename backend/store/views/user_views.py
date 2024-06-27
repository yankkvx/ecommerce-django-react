from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import make_password
from ..serializers import UserSerializer, UserSerializerRefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom serializer for JWT token obtain pair.

    Extends the default token obtain pair serializer to include user data.
    """

    def validate(self, attrs):
        data = super().validate(attrs)
        serialzier = UserSerializerRefreshToken(self.user).data
        for key, value in serialzier.items():
            data[key] = value
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Custom view for JWT token obtain pair.

    Uses MyTokenObtainPairSerializer for validation.
    """
    serializer_class = MyTokenObtainPairSerializer


class UserManagement(APIView):
    """
    API endpoint for managing user details.

    Supports updating user details and fetching current user information.
    """
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user
        data = request.data

        try:
            # Update user fields
            user.first_name = data['first_name']
            user.last_name = data['last_name']
            user.email = data['email']
            if data['password'] != '':
                user.password = make_password(data['password'])

            user.save()
            serializer = UserSerializerRefreshToken(user, many=False)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            user = request.user
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class AdminUserManagement(APIView):
    """
    API endpoint for admin to manage users.

    Supports fetching all users, fetching a specific user, updating user details, and deleting users.
    """
    permission_classes = [IsAdminUser]

    def get(self, request, pk=None):
        try:
            if pk:
                user = get_object_or_404(User, id=pk)
                serializer = UserSerializer(user, many=False)
                return Response(serializer.data)
            else:
                users = User.objects.all()
                serializer = UserSerializer(users, many=True)
                return Response(serializer.data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, pk):
        user = get_object_or_404(User, id=pk)
        data = request.data

        try:
            # Update user fields
            user.first_name = data['first_name']
            user.last_name = data['last_name']
            user.email = data['email']
            user.is_staff = data['is_staff']
            if data['password'] != '':
                user.password = make_password(data['password'])

            user.save()
            serializer = UserSerializer(user, many=False)
            return Response(serializer.data)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, pk):
        try:
            user = get_object_or_404(User, id=pk)
            user.delete()
            return Response('User was deleted', status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class RegisterUser(APIView):
    """
    API endpoint for user registration.

    Creates a new user account.
    """

    def post(self, request):
        data = request.data
        if User.objects.filter(email=data['email']).exists():
            return Response({'detail': 'This email is already associated with an account.'}, status=status.HTTP_409_CONFLICT)
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
        except Exception as e:
            return Response({'detail': 'An error occurred during registration.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
