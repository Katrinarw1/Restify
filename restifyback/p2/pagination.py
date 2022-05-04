from rest_framework.pagination import PageNumberPagination


class SmallPagination(PageNumberPagination):
    page_size = 10


class BlogPagination(PageNumberPagination):
    page_size = 9
