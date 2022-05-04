from rest_framework import permissions
from rest_framework.generics import get_object_or_404

from accounts.models import Notification
from restaurants.models import BlogPost, Image, Menu


class UserOwnsObjectPermission(permissions.BasePermission):
    """
    Permission class to check that a user can update or delete only the objects they own
    """

    def has_permission(self, request, view):
        if request.method not in permissions.SAFE_METHODS and view.kwargs['pk'] != request.user.username:
            return False
        else:
            return True


class UserOwnsMenuPermission(permissions.BasePermission):
    """
    Permission class to check that a user can update or delete only the menus they own
    """

    def has_permission(self, request, view):
        menu = get_object_or_404(Menu, id=view.kwargs['pk'])
        if request.method not in permissions.SAFE_METHODS and menu.restaurant_owner != request.user:
            return False
        else:
            return True


class UserOwnsImagePermission(permissions.BasePermission):
    """
    Permission class to check that a user can update or delete only the images they own
    """

    def has_permission(self, request, view):
        image = get_object_or_404(Image, id=view.kwargs['pk'])
        if request.method not in permissions.SAFE_METHODS and image.restaurant_owner != request.user:
            return False
        else:
            return True


class UserOwnsBlogPostPermission(permissions.BasePermission):
    """
    Permission class to check that a user can update or delete only the menus they own
    """

    def has_permission(self, request, view):
        blogpost = get_object_or_404(BlogPost, id=view.kwargs['pk'])
        if request.method not in permissions.SAFE_METHODS and blogpost.restaurant_owner != request.user:
            return False
        else:
            return True


class UserOwnsNotificationPermission(permissions.BasePermission):
    """
    Permission class to check that a user can update or delete only the menus they own
    """

    def has_permission(self, request, view):
        notification = get_object_or_404(Notification, id=view.kwargs['pk'])
        if notification.recipient != request.user:
            return False
        else:
            return True
