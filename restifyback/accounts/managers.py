from django.contrib.auth.base_user import BaseUserManager

#some of the code here is from: https://testdriven.io/blog/django-custom-user-model/#model-manager
class CustomUserManager(BaseUserManager):
    """
    Custom user model manager
    """
    def create_user(self, username, password, email, first_name, last_name, phone_number, avatar, **extra_fields):
        """
        Create and save a User with the given fields.
        """
        if not username:
            raise ValueError('The Username must be set')
        user = self.model(username=username, email=email, first_name=first_name, last_name=last_name, phone_number=phone_number, avatar=avatar, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password, email, first_name, last_name, phone_number, avatar, **extra_fields):
        """
        Create and save a superuser with the given fields.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(username, password, email, first_name, last_name, phone_number, avatar, **extra_fields)
