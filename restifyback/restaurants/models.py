from ckeditor_uploader.fields import RichTextUploadingField
from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.text import slugify
from phonenumber_field.modelfields import PhoneNumberField


class Restaurant(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    logo = models.ImageField(upload_to='restaurant_logos/')
    email = models.EmailField(blank=True, null=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=200, blank=True, null=True)
    postal_code = models.CharField(max_length=12, blank=True, null=True)

    owner = models.OneToOneField(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='restaurant', primary_key=True)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_restaurant', verbose_name='liked_restaurants', blank=True)
    followers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='followed_restaurant', verbose_name='followed_restaurants', blank=True)

    def __str__(self):
        return str(self.owner) + "'s " + str(self.name)


class Image(models.Model):
    image = models.ImageField(upload_to='restaurant_images/')

    restaurant_owner = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='restaurant_image', verbose_name='restaurant_images')


class Menu(models.Model):
    name = models.CharField(max_length=100)
    #image = models.ImageField()

    restaurant_owner = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='menu', verbose_name='menus')
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='restaurant_menu', verbose_name='restaurant_menus')

    def __str__(self):
        return str(self.restaurant_owner) + "'s " + self.name


class MenuItem(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=100000, decimal_places=2, validators=[MinValueValidator(0)], blank=True, null=True)
    description = models.CharField(max_length=250, blank=True, null=True)

    menu = models.ForeignKey(Menu, on_delete=models.CASCADE, related_name='menu_item', verbose_name='menu_items')

    def __str__(self):
        return str(self.menu) + "'s " + self.name


class MenuSubItem(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=100000, decimal_places=2, validators=[MinValueValidator(0)], blank=True, null=True)
    description = models.CharField(max_length=250, blank=True, null=True)

    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='menu_subitem', verbose_name='menu_subitems')

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    title = models.CharField(max_length=200)
    small_title = models.CharField(max_length=200, blank=True, null=True)
    #slug = models.SlugField(max_length=100, unique=True, blank=False, null=False, primary_key=True, editable=False)
    created_on = models.DateTimeField(auto_now_add=True)
    header_image = models.ImageField(blank=True, null=True)
    content = RichTextUploadingField()

    restaurant_owner = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='blog_posts')
    blog_likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_post', verbose_name='liked_posts', blank=True)

    class Meta:
        ordering = ['-created_on']
        constraints = [
            models.UniqueConstraint(fields=['restaurant_owner', 'title'], name='title unique for author')
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        #self.slug = '-'.join((slugify(self.restaurant_owner), slugify(self.title)))
        return super().save(*args, **kwargs)


class Comment(models.Model):
    content = models.TextField()
    created_on = models.DateTimeField(auto_now_add=True)

    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='comment', verbose_name='comments')
    owner = models.ForeignKey(to=settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comment_written', verbose_name='comments_written')

    class Meta:
        ordering = ['-created_on']
