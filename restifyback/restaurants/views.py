from django.contrib.auth import get_user_model
from django.db.models import Count
from django.shortcuts import render
from rest_framework import filters, permissions, status, viewsets
from rest_framework.exceptions import ValidationError
from rest_framework.generics import CreateAPIView, DestroyAPIView, ListAPIView, ListCreateAPIView, \
    RetrieveUpdateDestroyAPIView, get_object_or_404
from rest_framework.response import Response

from accounts.models import Notification
from p2.pagination import BlogPagination, SmallPagination
from restaurants.filters import DynamicSearchFilter
from restaurants.models import BlogPost, Comment, Image, Menu, Restaurant
from restaurants.permissions import UserOwnsBlogPostPermission, UserOwnsImagePermission, UserOwnsMenuPermission, \
    UserOwnsObjectPermission
from restaurants.serializers import BlogPostSerializer, BlogSerializer, CommentSerializer, ImageSerializer, \
    MenuSerializer, RestaurantSerializer, SearchSerializer


'''class CreateRestaurantView(CreateAPIView):
    """
    Creates a restaurant for the current user.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = RestaurantSerializer

    def perform_create(self, serializer):
        #only want to create a restaurant if it doesn't already exist since it's a one-to-one relationship
        queryset = Restaurant.objects.filter(owner=self.request.user)
        if queryset.exists():
            raise ValidationError('You have already created a restaurant')
        serializer.save(owner=self.request.user)'''


class RestaurantView(RetrieveUpdateDestroyAPIView):
    """
    View the restaurant. Update or delete the current user's restaurant.
    """
    permission_classes = [UserOwnsObjectPermission]
    serializer_class = RestaurantSerializer

    def get_object(self):
        return get_object_or_404(Restaurant, owner=self.kwargs['pk'])


class RestaurantImagesView(ListCreateAPIView):
    """
    View all of a restaurant's images. Add images to the current user's restaurant.
    """
    permission_classes = [UserOwnsObjectPermission]
    serializer_class = ImageSerializer
    #pagination_class = SmallPagination

    def get_queryset(self):
        return Image.objects.filter(restaurant_owner=self.kwargs['pk'])

    def perform_create(self, serializer):
        serializer.save(restaurant_owner=self.request.user)


class RestaurantDeleteImageView(DestroyAPIView):
    """
    View all of a restaurant's images. Add images to the current user's restaurant.
    """
    permission_classes = [UserOwnsImagePermission]
    serializer_class = ImageSerializer

    def get_object(self):
        return get_object_or_404(Image, id=self.kwargs['pk'])


class MenuView(RetrieveUpdateDestroyAPIView):
    """
    View the menu. Update or delete a menu the current user owns.
    """
    permission_classes = [UserOwnsMenuPermission]
    serializer_class = MenuSerializer

    def get_object(self):
        return get_object_or_404(Menu, id=self.kwargs['pk'])

    def perform_update(self, serializer):
        #create a notification for all followers that there's a menu update
        for person in self.request.user.restaurant.followers.all():
            Notification.objects.create(sender=self.request.user, recipient=person, message='5')
        serializer.save()


#view all of a restaurant's menus
class AllMenuView(ListCreateAPIView):
    """
    View all of a restaurant's menus. Add a menu if the current user owns the restaurant.
    """
    permission_classes = [UserOwnsObjectPermission]
    serializer_class = MenuSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return Menu.objects.filter(restaurant_owner=self.kwargs['pk'])

    def perform_create(self, serializer):
        #can't create a menu for a restaurant that doesn't exist
        get_object_or_404(Restaurant, owner=self.request.user)
        #create a notification for all followers that there's a menu update
        for person in self.request.user.restaurant.followers.all():
            Notification.objects.create(sender=self.request.user, recipient=person, message='5')
        serializer.save(restaurant_owner=self.request.user, restaurant=self.request.user.restaurant)


#one single blog post
class CreateBlogPostView(CreateAPIView):
    """
    Create a blogpost.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BlogPostSerializer

    def perform_create(self, serializer):
        #can't create a blog post for a restaurant that doesn't exist
        get_object_or_404(Restaurant, owner=self.request.user)
        #create a notification for all followers that there's a new blog post
        for person in self.request.user.restaurant.followers.all():
            Notification.objects.create(sender=self.request.user, recipient=person, message='4')
        serializer.save(restaurant_owner=self.request.user)


class BlogPostView(RetrieveUpdateDestroyAPIView):
    """
    View a blog post. Update or delete a blog post if the current user owns it.
    """
    permission_classes = [UserOwnsBlogPostPermission]
    serializer_class = BlogPostSerializer

    def get_object(self):
        return get_object_or_404(BlogPost, id=(self.kwargs['pk']))


#all the blog posts for a restaurant
class BlogView(ListAPIView):
    """
    View all the blog posts for the given restaurant.
    """
    serializer_class = BlogSerializer
    pagination_class = BlogPagination

    def get_queryset(self):
        return BlogPost.objects.filter(restaurant_owner=self.kwargs['username'])


class CommentView(ListCreateAPIView):
    """
    View all the comments for the given restaurant and create a new one.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = CommentSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return Comment.objects.filter(restaurant=self.kwargs['pk'])

    def perform_create(self, serializer):
        #create notification for restaurant owner that a user posted a comment
        Notification.objects.create(sender=self.request.user,
                                    recipient=get_user_model().objects.get(username=self.kwargs['pk']), message='2')
        serializer.save(restaurant=Restaurant.objects.get(owner=self.kwargs['pk']), owner=self.request.user)


class FeedView(ListAPIView):
    """
    View the current user's feed.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = BlogSerializer
    pagination_class = BlogPagination

    def get_queryset(self):
        all_followed_restaurants = self.request.user.followed_restaurant.all()
        followed_restaurant_owners = []
        for res in all_followed_restaurants:
            followed_restaurant_owners.append(str(res.owner.username))
        return BlogPost.objects.filter(restaurant_owner__username__in=followed_restaurant_owners)


class SearchView(ListAPIView):
    """
    List the search results, order by restaurant with the largest number of likes.
    """
    pagination_class = SmallPagination
    serializer_class = SearchSerializer
    queryset = Restaurant.objects.annotate(num_likes=Count('likes'))
    filter_backends = (DynamicSearchFilter, filters.OrderingFilter,)
    ordering = ['-num_likes']


class FollowView(viewsets.ViewSet):
    """
    Follow or unfollow a restaurant.
    """
    permission_classes = [permissions.IsAuthenticated]
    User = get_user_model()
    queryset = User.objects.all()

    def follow(self, request, pk):
        """
        Follow the given restaurant.
        """
        restaurant_to_follow = get_object_or_404(Restaurant, owner=pk)
        if restaurant_to_follow not in request.user.followed_restaurant.all():
            request.user.followed_restaurant.add(restaurant_to_follow)
            #create notification for restaurant owner that a user followed their restaurant
            Notification.objects.create(sender=self.request.user,
                                        recipient=get_user_model().objects.get(username=self.kwargs['pk']), message='1')
            return Response({'message': 'followed restaurant'}, status=status.HTTP_200_OK)
        else:
            request.user.followed_restaurant.remove(restaurant_to_follow)
            return Response({'message': 'unfollowed restaurant'}, status=status.HTTP_200_OK)


class HasFollowedView(viewsets.ViewSet):
    """
    Follow or unfollow a restaurant.
    """
    permission_classes = [permissions.IsAuthenticated]
    User = get_user_model()
    queryset = User.objects.all()

    def checkfollow(self, request, pk):
        """
        Follow the given restaurant.
        """
        restaurant_to_follow = get_object_or_404(Restaurant, owner=pk)
        if restaurant_to_follow not in request.user.followed_restaurant.all():
            return Response({'message': 'false'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'true'}, status=status.HTTP_200_OK)


class LikeView(viewsets.ViewSet):
    """
    Like or unlike a restaurant.
    """
    permission_classes = [permissions.IsAuthenticated]
    User = get_user_model()
    queryset = User.objects.all()

    def like(self, request, pk):
        """
        Like the given restaurant.
        """
        restaurant_to_like = get_object_or_404(Restaurant, owner=pk)
        if restaurant_to_like not in request.user.liked_restaurant.all():
            request.user.liked_restaurant.add(restaurant_to_like)
            #create notification for restaurant owner that a user liked their restaurant
            Notification.objects.create(sender=self.request.user,
                                        recipient=get_user_model().objects.get(username=self.kwargs['pk']), message='0')
            return Response({'message': 'true'}, status=status.HTTP_200_OK)
        else:
            request.user.liked_restaurant.remove(restaurant_to_like)
            return Response({'message': 'false'}, status=status.HTTP_200_OK)


class HasLikedView(viewsets.ViewSet):
    """
    Like or unlike a restaurant.
    """
    permission_classes = [permissions.IsAuthenticated]
    User = get_user_model()
    queryset = User.objects.all()

    def checklike(self, request, pk):
        """
        Like the given restaurant.
        """
        restaurant_to_like = get_object_or_404(Restaurant, owner=pk)
        if restaurant_to_like not in request.user.liked_restaurant.all():
            return Response({'message': 'false'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'true'}, status=status.HTTP_200_OK)


class LikeBlogPostView(viewsets.ViewSet):
    """
    Like or unlike a blog post.
    """
    permission_classes = [permissions.IsAuthenticated]
    User = get_user_model()
    queryset = User.objects.all()

    def like(self, request, pk):
        """
        Like the given blog post.
        """
        blogpost_to_like = get_object_or_404(BlogPost, id=pk)
        if blogpost_to_like not in request.user.liked_post.all():
            request.user.liked_post.add(blogpost_to_like)
            #create notification for restaurant owner that a user liked their blog post
            Notification.objects.create(sender=request.user, recipient=blogpost_to_like.restaurant_owner, message='3')
            return Response({'message': 'true'}, status=status.HTTP_200_OK)
        else:
            request.user.liked_post.remove(blogpost_to_like)
            return Response({'message': 'false'}, status=status.HTTP_200_OK)


class HasLikedBlogPostView(viewsets.ViewSet):
    """
    Like or unlike a blog post.
    """
    permission_classes = [permissions.IsAuthenticated]
    User = get_user_model()
    queryset = User.objects.all()

    def checklike(self, request, pk):
        """
        Like the given blog post.
        """
        blogpost_to_like = get_object_or_404(BlogPost, id=pk)
        if blogpost_to_like not in request.user.liked_post.all():
            return Response({'message': 'false'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': 'true'}, status=status.HTTP_200_OK)
