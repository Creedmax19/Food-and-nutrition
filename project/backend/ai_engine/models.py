from django.db import models
from django.contrib.auth import get_user_model
from recipes.models import Recipe, Cuisine, Ingredient

User = get_user_model()


class AIRecommendation(models.Model):
    """Track AI recommendations for users"""
    RECOMMENDATION_TYPES = [
        ('meal_plan', 'Meal Plan'),
        ('recipe', 'Recipe'),
        ('ingredient_substitute', 'Ingredient Substitute'),
        ('cooking_tip', 'Cooking Tip'),
        ('cultural_insight', 'Cultural Insight'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_recommendations')
    recommendation_type = models.CharField(max_length=22, choices=RECOMMENDATION_TYPES)
    content = models.JSONField(help_text="AI recommendation content")
    confidence_score = models.FloatField(default=0.0, help_text="AI confidence score (0-1)")
    
    # Context that led to this recommendation
    user_context = models.JSONField(
        default=dict,
        help_text="User context used for recommendation (preferences, health goals, etc.)"
    )
    
    # User feedback
    user_rating = models.IntegerField(null=True, blank=True, help_text="User rating 1-5")
    user_feedback = models.TextField(blank=True)
    was_helpful = models.BooleanField(null=True, blank=True)
    
    # Tracking
    created_at = models.DateTimeField(auto_now_add=True)
    viewed_at = models.DateTimeField(null=True, blank=True)
    acted_upon_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'ai_recommendations'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.get_recommendation_type_display()}"


class UserPreferenceProfile(models.Model):
    """AI-learned user preferences"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='ai_profile')
    
    # Learned preferences
    preferred_flavors = models.JSONField(
        default=list,
        help_text="AI-learned flavor preferences (spicy, sweet, savory, etc.)"
    )
    preferred_cooking_methods = models.JSONField(
        default=list,
        help_text="Preferred cooking methods (grilling, stewing, frying, etc.)"
    )
    preferred_meal_times = models.JSONField(
        default=dict,
        help_text="Preferred meal timing patterns"
    )
    ingredient_preferences = models.JSONField(
        default=dict,
        help_text="Ingredient preference scores"
    )
    cuisine_preferences = models.JSONField(
        default=dict,
        help_text="Cuisine preference scores by region"
    )
    
    # Behavioral patterns
    cooking_frequency = models.JSONField(
        default=dict,
        help_text="Cooking frequency patterns"
    )
    recipe_complexity_preference = models.FloatField(
        default=0.5,
        help_text="Preferred recipe complexity (0=simple, 1=complex)"
    )
    seasonal_preferences = models.JSONField(
        default=dict,
        help_text="Seasonal food preferences"
    )
    
    # Health-focused preferences
    nutrition_priorities = models.JSONField(
        default=list,
        help_text="Prioritized nutritional goals"
    )
    portion_preferences = models.JSONField(
        default=dict,
        help_text="Preferred portion sizes"
    )
    
    # Cultural preferences
    cultural_openness_score = models.FloatField(
        default=0.5,
        help_text="Openness to trying new cultural dishes (0-1)"
    )
    traditional_vs_modern_preference = models.FloatField(
        default=0.5,
        help_text="Preference for traditional vs modern recipes (0=traditional, 1=modern)"
    )
    
    # Model metadata
    last_updated = models.DateTimeField(auto_now=True)
    confidence_score = models.FloatField(
        default=0.0,
        help_text="Overall confidence in the preference model"
    )
    
    class Meta:
        db_table = 'user_preference_profiles'
    
    def __str__(self):
        return f"{self.user.username}'s AI Profile"


class AIInteraction(models.Model):
    """Track all AI interactions for learning"""
    INTERACTION_TYPES = [
        ('recommendation_request', 'Recommendation Request'),
        ('recipe_search', 'Recipe Search'),
        ('meal_plan_generation', 'Meal Plan Generation'),
        ('ingredient_substitution', 'Ingredient Substitution'),
        ('cooking_assistance', 'Cooking Assistance'),
        ('cultural_query', 'Cultural Query'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_interactions')
    interaction_type = models.CharField(max_length=30, choices=INTERACTION_TYPES)
    
    # Input data
    user_input = models.JSONField(help_text="User's input/query")
    context_data = models.JSONField(
        default=dict,
        help_text="Context data (user profile, current meal plan, etc.)"
    )
    
    # AI processing
    ai_model_used = models.CharField(max_length=50, default='gpt-4')
    processing_time_ms = models.IntegerField(null=True, blank=True)
    tokens_used = models.IntegerField(null=True, blank=True)
    
    # Output
    ai_response = models.JSONField(help_text="AI's response")
    confidence_score = models.FloatField(default=0.0)
    
    # User feedback
    user_satisfaction = models.IntegerField(
        null=True, 
        blank=True,
        help_text="User satisfaction rating 1-5"
    )
    user_followed_suggestion = models.BooleanField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_interactions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.get_interaction_type_display()}"


class CulturalInsight(models.Model):
    """AI-generated cultural insights about recipes and ingredients"""
    recipe = models.ForeignKey(
        Recipe, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='cultural_insights'
    )
    ingredient = models.ForeignKey(
        Ingredient,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='cultural_insights'
    )
    cuisine = models.ForeignKey(
        Cuisine,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='cultural_insights'
    )
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    cultural_context = models.JSONField(
        default=dict,
        help_text="Cultural context data (region, traditions, occasions, etc.)"
    )
    
    # AI metadata
    generated_by_ai = models.BooleanField(default=True)
    ai_confidence = models.FloatField(default=0.0)
    verified_by_expert = models.BooleanField(default=False)
    
    # Engagement metrics
    view_count = models.PositiveIntegerField(default=0)
    helpful_votes = models.PositiveIntegerField(default=0)
    not_helpful_votes = models.PositiveIntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'cultural_insights'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title