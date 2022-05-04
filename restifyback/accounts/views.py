from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework import permissions, status, viewsets
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView, RetrieveUpdateAPIView, \
    get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.models import Notification, User
from accounts.serializers import MyTokenObtainPairSerializer, NotificationSerializer, UserSerializer
from p2.pagination import SmallPagination
from restaurants.permissions import UserOwnsNotificationPermission, UserOwnsObjectPermission


class SignUp(CreateAPIView):
    """
    Registers a new user.
    """
    serializer_class = UserSerializer


#code from: https://medium.com/django-rest/django-rest-framework-login-and-register-user-fd91cf6029d5
class MyObtainTokenPairView(TokenObtainPairView):
    """
    Login a user.
    """
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer


class UserDetail(RetrieveUpdateAPIView):
    """
    Shows and updates profile information for the current user.
    """
    permission_classes = [UserOwnsObjectPermission]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class CurrentUserDetail(RetrieveAPIView):
    """
    Shows the profile information for the current user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return get_object_or_404(User, username=self.request.user.username)


class NotificationView(ListAPIView):
    """
    List all the notifications for the current user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = NotificationSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user, read=False)


class ReadNotificationView(viewsets.ViewSet):
    """
    Mark the notification with id=pk as read.
    """
    permission_classes = [UserOwnsNotificationPermission]
    User = get_user_model()
    queryset = User.objects.all()

    def read(self, request, pk):
        """
        Mark the notification as read.
        """
        notification_to_read = Notification.objects.get(id=pk)
        if notification_to_read.read is False:
            notification_to_read.read = True
            return Response({'message': 'notification read'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'can\'t mark a notification as read that\'s already been read'},
                            status=status.HTTP_400_BAD_REQUEST)
