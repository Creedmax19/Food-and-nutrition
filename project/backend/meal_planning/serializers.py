"""
Serializers for the meal_planning API.
"""
from rest_framework import serializers
from .models import MealPlan, MealPlanEntry

class MealPlanSerializer(serializers.ModelSerializer):
    """Serializer for the MealPlan model."""
    class Meta:
        model = MealPlan
        fields = ['id', 'user', 'name', 'start_date', 'end_date', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

class MealPlanEntrySerializer(serializers.ModelSerializer):
    """Serializer for the MealPlanEntry model."""
    class Meta:
        model = MealPlanEntry
        fields = ['id', 'meal_plan', 'recipe', 'meal_type', 'day', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
