from rest_framework import filters


class DynamicSearchFilter(filters.SearchFilter):
    """
    Custom filter to allow the different fields to be searched.
    """
    def get_search_fields(self, view, request):
        search_term = request.GET.get('search_fields')
        if search_term == 'menu':
            return ['restaurant_menu__name', 'restaurant_menu__menu_item__name', 'restaurant_menu__menu_item__menu_subitem__name']
        elif search_term == 'address':
            return ['address']
        else:
            return ['name']