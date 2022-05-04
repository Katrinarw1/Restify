"""p2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.views import CurrentUserDetail, NotificationView, ReadNotificationView, SignUp, UserDetail
from restaurants.views import AllMenuView, BlogPostView, BlogView, CommentView, CreateBlogPostView, \
    FeedView, FollowView, HasFollowedView, HasLikedBlogPostView, HasLikedView, LikeBlogPostView, \
    LikeView, \
    MenuView, \
    RestaurantDeleteImageView, RestaurantImagesView, RestaurantView, SearchView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('login/', TokenObtainPairView.as_view()),  #login
    
    path('ckeditor/', include('ckeditor_uploader.urls')),
    
    path('profile/<pk>/', UserDetail.as_view()),
    path('currentuser/', CurrentUserDetail.as_view()),

    path('signup/', SignUp.as_view(), name='signpip install pyyaml uritemplateup'),
    #path('logout/', name='logout'),
    
    path('notifications/', NotificationView.as_view()),
    path('notifications/<pk>/', ReadNotificationView.as_view({'post': 'read'})),
    path('restaurant/<pk>/follow/', FollowView.as_view({'post': 'follow'})),
    path('restaurant/<pk>/hasfollowed/', HasFollowedView.as_view({'get': 'checkfollow'})),
    path('restaurant/<pk>/like/', LikeView.as_view({'post': 'like'})),
    path('restaurant/<pk>/hasliked/', HasLikedView.as_view({'get': 'checklike'})),
    path('restaurant/blogpost/<str:pk>/like/', LikeBlogPostView.as_view({'post': 'like'})),
    path('restaurant/blogpost/<str:pk>/hasliked/', HasLikedBlogPostView.as_view({'get': 'checklike'})),
    
    path('home/', SearchView.as_view()),
    path('feed/', FeedView.as_view()),
    path('<pk>/restaurant/', RestaurantView.as_view()),
    #path('restaurant/add/', CreateRestaurantView.as_view()),
    path('<pk>/restaurant/images/', RestaurantImagesView.as_view()),
    path('images/<pk>/delete/', RestaurantDeleteImageView.as_view()),
    path('restaurant/menu/<pk>/', MenuView.as_view()),
    path('<pk>/restaurant/menu/', AllMenuView.as_view()),
    path('restaurant/blogpost/add/', CreateBlogPostView.as_view()),
    path('<username>/restaurant/blog/', BlogView.as_view()),
    path('restaurant/blogpost/<str:pk>/', BlogPostView.as_view()),
    path('<pk>/restaurant/comments/', CommentView.as_view()),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
