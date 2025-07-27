from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class ShoppingList(models.Model):
    """User shopping lists"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shopping_lists')
    name = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'shopping_lists'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"


class ShoppingListItem(models.Model):
    """Items in shopping lists"""
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=200)
    quantity = models.CharField(max_length=50)
    category = models.CharField(max_length=50, blank=True)
    is_purchased = models.BooleanField(default=False)
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'shopping_list_items'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.shopping_list.name} - {self.name}"