from django.db import models
from django.contrib.auth import get_user_model
from recipes.models import Recipe

User = get_user_model()


class MealPlan(models.Model):
    """User meal plans"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_plans')
    name = models.CharField(max_length=200, default='My Meal Plan')
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'meal_plans'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"


class MealPlanEntry(models.Model):
    """Individual meal entries in a meal plan"""
    MEAL_TYPE_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack'),
    ]
    
    meal_plan = models.ForeignKey(MealPlan, on_delete=models.CASCADE, related_name='entries')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    date = models.DateField()
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)
    servings = models.PositiveIntegerField(default=1)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'meal_plan_entries'
        unique_together = ['meal_plan', 'date', 'meal_type']
        ordering = ['date', 'meal_type']
    
    def __str__(self):
        return f"{self.meal_plan.name} - {self.date} {self.meal_type}"