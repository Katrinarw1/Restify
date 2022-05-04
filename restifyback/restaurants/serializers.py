from rest_framework import serializers
from rest_framework.fields import SerializerMethodField
from drf_writable_nested.serializers import WritableNestedModelSerializer
from restaurants.models import BlogPost, Comment, Image, Menu, MenuItem, MenuSubItem, Restaurant
from bs4 import BeautifulSoup


class ImageSerializer(serializers.ModelSerializer):
    """
    Serializer for a restaurant's image.
    """

    class Meta:
        model = Image
        fields = ['id', 'image']


class RestaurantSerializer(serializers.ModelSerializer):
    """
    Serializer for a restaurant.
    """
    restaurant_image = ImageSerializer(many=True, required=False)
    num_followers = SerializerMethodField()
    num_likes = SerializerMethodField()
    num_comments = SerializerMethodField()

    class Meta:
        model = Restaurant
        fields = ['owner', 'name', 'logo', 'email', 'phone_number', 'address', 'postal_code', 'restaurant_image',
                  'num_followers', 'num_likes', 'num_comments']
        read_only_fields = ['owner']

    def get_num_followers(self, obj):
        return obj.followers.count()

    def get_num_likes(self, obj):
        return obj.likes.count()

    def get_num_comments(self, obj):
        return obj.comment.count()


class MenuSubItemSerializer(serializers.ModelSerializer):
    """
    Serializer for a restaurant's sub-item on the menu.
    """

    class Meta:
        model = MenuSubItem
        fields = ['id', 'name', 'price', 'description']


class MenuItemSerializer(WritableNestedModelSerializer):
    """
    Serializer for a restaurant's item on the menu.
    """
    menu_subitem = MenuSubItemSerializer(many=True, required=False)

    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'price', 'menu_subitem', 'description']


class MenuSerializer(WritableNestedModelSerializer):
    """
    Serializer for a restaurant's menu.
    """
    menu_item = MenuItemSerializer(many=True, required=False)

    class Meta:
        model = Menu
        fields = ['id', 'name', 'menu_item']


class BlogPostSerializer(serializers.ModelSerializer):
    """
    Serializer for a blog post.
    """
    num_likes = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ['restaurant_owner', 'id', 'title', 'small_title', 'date', 'header_image', 'content', 'num_likes']

    def get_num_likes(self, obj):
        return obj.blog_likes.count()

    def get_date(self, obj):
        strip_date = obj.created_on.date()
        date_year = strip_date.strftime('%Y')
        date_month = strip_date.strftime("%B")
        date_day = strip_date.strftime('%d')
        return date_month + " " + date_day.lstrip("0") + ", " + date_year


class BlogSerializer(serializers.ModelSerializer):
    """
    Serializer for a blog card on feed or other page of blog posts.
    """
    summary = serializers.SerializerMethodField()
    num_likes = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ['restaurant_owner', 'id', 'title', 'small_title', 'date', 'header_image', 'summary', 'num_likes']

    def get_summary(self, obj):
        smry = obj.content[:170]
        smry = BeautifulSoup(smry, features="html.parser").text
        smry = smry.replace("\n", " ")
        smry += " ..."
        return smry

    def get_num_likes(self, obj):
        return obj.blog_likes.count()

    def get_date(self, obj):
        strip_date = obj.created_on.date()
        date_year = strip_date.strftime('%Y')
        date_month = strip_date.strftime("%B")
        date_day = strip_date.strftime('%d')
        return date_month + " " + date_day.lstrip("0") + ", " + date_year


class CommentSerializer(serializers.ModelSerializer):
    """
    Serializer for a comment on a restaurant.
    """
    owner_name = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['id', 'owner', 'owner_name', 'created_on', 'date', 'content']

    def get_owner_name(self, obj):
        return str(obj.owner)

    def get_date(self, obj):
        strip_date = obj.created_on.date()
        date_year = strip_date.strftime('%Y')
        date_month = strip_date.strftime("%B")
        date_day = strip_date.strftime('%d')
        return date_month + " " + date_day.lstrip("0") + ", " + date_year


class SearchSerializer(serializers.ModelSerializer):
    """
    Serializer for a search card on the home/index/search page.
    """
    num_followers = SerializerMethodField()
    num_likes = SerializerMethodField()
    num_comments = SerializerMethodField()
    restaurant_menu = MenuSerializer(many=True, required=False)

    class Meta:
        model = Restaurant
        fields = ['owner', 'name', 'logo', 'address', 'postal_code', 'phone_number', 'email', 'num_followers', 'num_likes', 'num_comments', 'restaurant_menu']

    def get_num_followers(self, obj):
        return obj.followers.count()

    def get_num_likes(self, obj):
        return obj.likes.count()

    def get_num_comments(self, obj):
        return obj.comment.count()
