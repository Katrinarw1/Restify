from django.contrib import admin

from accounts.models import Notification, User
from restaurants.models import BlogPost, Comment, Image, MenuItem, MenuSubItem, Restaurant, Menu

admin.site.register(User)
admin.site.register(Notification)
admin.site.register(Restaurant)
admin.site.register(Menu)
admin.site.register(MenuItem)
admin.site.register(MenuSubItem)
admin.site.register(Comment)
admin.site.register(Image)
admin.site.register(BlogPost)
