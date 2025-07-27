from django.urls import path
from . import views

app_name = 'shopping'

urlpatterns = [
    path('lists/', views.ShoppingListListCreateView.as_view(), name='shopping_lists'),
    path('lists/<int:pk>/', views.ShoppingListDetailView.as_view(), name='shopping_list_detail'),
    path('lists/<int:shopping_list_id>/items/', views.ShoppingListItemListCreateView.as_view(), name='shopping_list_items'),
    path('items/<int:pk>/', views.ShoppingListItemDetailView.as_view(), name='shopping_list_item_detail'),
]