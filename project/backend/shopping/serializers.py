"""
Serializers for the shopping API.
"""
from rest_framework import serializers
from .models import ShoppingList, ShoppingListItem

class ShoppingListSerializer(serializers.ModelSerializer):
    """Serializer for the ShoppingList model."""
    class Meta:
        model = ShoppingList
        fields = ['id', 'user', 'name', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class ShoppingListItemSerializer(serializers.ModelSerializer):
    """Serializer for the ShoppingListItem model."""
    class Meta:
        model = ShoppingListItem
        fields = ['id', 'shopping_list', 'ingredient', 'quantity', 'unit', 'purchased', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
