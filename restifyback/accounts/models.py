from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models

from accounts.managers import CustomUserManager


class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True, null=False, primary_key=True)
    password = models.CharField(max_length=100, blank=False, null=False)
    first_name = models.CharField(max_length=150, blank=False, null=False)
    last_name = models.CharField(max_length=150, blank=False, null=False)
    avatar = models.ImageField(upload_to='user_avatars/')
    email = models.EmailField(blank=False, null=False)
    phone_number = models.CharField(max_length=20, blank=False, null=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['password', 'first_name', 'last_name', 'email', 'phone_number', 'avatar']

    objects = CustomUserManager()
    
    def __str__(self):
        return "@" + str(self.username) + ": " + self.get_full_name()


class Notification(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification_sent', verbose_name='notifications_sent')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notification', verbose_name='notifications')
    
    MESSAGE = (
        ('0', "Liked your restaurant"),
        ('1', "Followed your restaurant"),
        ('2', "Commented on your restaurant"),
        ('3', "Liked your blog post"),
        ('4', "Posted a new blog post"),
        ('5', "Has updated their menu"),
    )

    message = models.CharField(max_length=1, choices=MESSAGE)
    read = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_on']
