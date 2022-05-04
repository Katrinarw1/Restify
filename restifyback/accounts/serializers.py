from datetime import datetime

import pytz
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from accounts.models import Notification, User
from restaurants.models import Restaurant


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for a user.
    """
    password = serializers.CharField(write_only=True, style={'input_type': 'password', 'placeholder': 'Password'})

    class Meta:
        model = User
        fields = ['username', 'password', 'avatar', 'email', 'phone_number', 'first_name', 'last_name']

    def create(self, validated_data):
        """
        Create a new user with the entered information.
        """
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        Restaurant.objects.create(owner=user)
        return user

    def update(self, instance, validated_data):
        """
        Update the user's information.
        """
        user = super().update(instance, validated_data)
        try:
            user.set_password(validated_data['password'])
            user.save()
        except KeyError:
            pass
        return user


class LoginSerializer(serializers.ModelSerializer):
    """
    Serializer for the login page.
    """
    password = serializers.CharField(write_only=True, required=True,
                                     style={'input_type': 'password', 'placeholder': 'Password'})

    class Meta:
        model = User
        fields = ['username', 'password']


#code from: https://medium.com/django-rest/django-rest-framework-login-and-register-user-fd91cf6029d5
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Serializer for the login/token.
    """

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        token['username'] = user.username
        return token


class NotificationSerializer(serializers.ModelSerializer):
    """
    Serializer for a notification.
    """
    sender_name = serializers.SerializerMethodField()
    sender_image = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ['id', 'sender', 'sender_name', 'sender_image', 'get_message_display', 'date', 'read']

    def get_sender_name(self, obj):
        if obj.message == '0' or obj.message == '1' or obj.message == '2' or obj.message == '3':
            return "@" + str(obj.sender.username)
        else:
            try:
                return str(obj.sender.restaurant.name)
            except:
                return None

    def get_sender_image(self, obj):
        if obj.message == '0' or obj.message == '1' or obj.message == '2' or obj.message == '3':
            return obj.sender.avatar.url
        else:
            try:
                return obj.sender.restaurant.logo.url
            except:
                return None

    def get_date(self, obj):
        local_tz = pytz.timezone('America/Toronto')
        strip_date = obj.created_on
        local_dt = strip_date.replace(tzinfo=pytz.utc).astimezone(local_tz)
        local_dt = local_tz.normalize(local_dt)

        '''date_month = local_dt.strftime("%B ")
        date_rest = local_dt.strftime('%d, %Y - ')
        day_time = local_dt.strftime('%I:%M %p')
        return date_month + date_rest.lstrip("0") + day_time.lstrip('0')'''

        now = datetime.now(pytz.timezone('America/Toronto'))
        duration = now - local_dt
        duration_in_s = duration.total_seconds()
        years = divmod(duration_in_s, 31536000)[0]
        months = divmod(duration_in_s, 2592000)[0]
        days = divmod(duration_in_s, 86400)[0]
        hours = divmod(duration_in_s, 3600)[0]
        minutes = divmod(duration_in_s, 60)[0]

        if years > 0:
            date = str(int(years)) + "y ago"
        elif days > 0:
            date = str(int(days)) + "d ago"
        elif hours > 0:
            date = str(int(hours)) + "h ago"
        elif minutes > 0:
            date = str(int(minutes)) + "m ago"
        else:
            date = "now"

        return date
