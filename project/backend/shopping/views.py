"""
Views for the shopping app.
"""
from rest_framework import generics, permissions
from .models import ShoppingList, ShoppingListItem
from .serializers import ShoppingListSerializer, ShoppingListItemSerializer

class ShoppingListListCreateView(generics.ListCreateAPIView):
    """
    API endpoint that allows shopping lists to be viewed or created.
    """
    serializer_class = ShoppingListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ShoppingList.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ShoppingListDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that allows a single shopping list to be viewed, updated or deleted.
    """
    serializer_class = ShoppingListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ShoppingList.objects.filter(user=self.request.user)

class ShoppingListItemListCreateView(generics.ListCreateAPIView):
    """
    API endpoint that allows shopping list items to be viewed or created.
    """
    serializer_class = ShoppingListItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ShoppingListItem.objects.filter(
            shopping_list_id=self.kwargs['shopping_list_id'],
            shopping_list__user=self.request.user
        )

    def perform_create(self, serializer):
        shopping_list = ShoppingList.objects.get(
            id=self.kwargs['shopping_list_id'],
            user=self.request.user
        )
        serializer.save(shopping_list=shopping_list)

class ShoppingListItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    API endpoint that allows a single shopping list item to be viewed, updated or deleted.
    """
    serializer_class = ShoppingListItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ShoppingListItem.objects.filter(
            shopping_list__user=self.request.user
        )
