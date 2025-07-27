from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils.text import slugify

User = get_user_model()


class Region(models.Model):
    """African regions for recipe categorization"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    countries = models.JSONField(
        default=list,
        help_text="List of countries in this region"
    )
    cultural_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'regions'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Cuisine(models.Model):
    """Specific cuisines within regions"""
    name = models.CharField(max_length=100, unique=True)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='cuisines')
    description = models.TextField(blank=True)
    characteristics = models.JSONField(
        default=list,
        help_text="Key characteristics of this cuisine"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cuisines'
        ordering = ['region', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.region.name})"


class Ingredient(models.Model):
    """Ingredients used in African cooking"""
    name = models.CharField(max_length=200, unique=True)
    local_names = models.JSONField(
        default=list,
        help_text="Local names in different languages"
    )
    category = models.CharField(
        max_length=50,
        choices=[
            ('vegetables', 'Vegetables'),
            ('fruits', 'Fruits'),
            ('grains', 'Grains & Cereals'),
            ('legumes', 'Legumes'),
            ('meat', 'Meat & Poultry'),
            ('fish', 'Fish & Seafood'),
            ('dairy', 'Dairy'),
            ('spices', 'Spices & Herbs'),
            ('oils', 'Oils & Fats'),
            ('nuts', 'Nuts & Seeds'),
            ('other', 'Other'),
        ]
    )
    description = models.TextField(blank=True)
    nutritional_info = models.JSONField(
        default=dict,
        help_text="Nutritional information per 100g"
    )
    common_regions = models.ManyToManyField(
        Region,
        blank=True,
        help_text="Regions where this ingredient is commonly used"
    )
    seasonality = models.JSONField(
        default=list,
        help_text="Months when ingredient is in season"
    )
    storage_tips = models.TextField(blank=True)
    substitutes = models.ManyToManyField(
        'self',
        blank=True,
        symmetrical=False,
        help_text="Alternative ingredients"
    )
    allergen_info = models.JSONField(
        default=list,
        help_text="List of allergens this ingredient contains"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ingredients'
        ordering = ['category', 'name']
    
    def __str__(self):
        return self.name


class Recipe(models.Model):
    """African recipes"""
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    MEAL_TYPE_CHOICES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack'),
        ('dessert', 'Dessert'),
        ('beverage', 'Beverage'),
    ]
    
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    description = models.TextField()
    cuisine = models.ForeignKey(Cuisine, on_delete=models.CASCADE, related_name='recipes')
    
    # Recipe Details
    prep_time = models.PositiveIntegerField(help_text="Preparation time in minutes")
    cook_time = models.PositiveIntegerField(help_text="Cooking time in minutes")
    total_time = models.PositiveIntegerField(help_text="Total time in minutes")
    servings = models.PositiveIntegerField(default=4)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)
    
    # Content
    ingredients = models.JSONField(
        help_text="List of ingredients with quantities"
    )
    instructions = models.JSONField(
        help_text="Step-by-step cooking instructions"
    )
    
    # Nutritional Information
    calories_per_serving = models.PositiveIntegerField(null=True, blank=True)
    nutritional_info = models.JSONField(
        default=dict,
        help_text="Detailed nutritional information per serving"
    )
    
    # Media
    image = models.ImageField(upload_to='recipes/', null=True, blank=True)
    video_url = models.URLField(blank=True)
    
    # Cultural Information
    cultural_significance = models.TextField(blank=True)
    origin_story = models.TextField(blank=True)
    traditional_occasions = models.JSONField(
        default=list,
        help_text="Occasions when this dish is traditionally served"
    )
    
    # Recipe Metadata
    tags = models.JSONField(
        default=list,
        help_text="Tags for categorization and search"
    )
    dietary_labels = models.JSONField(
        default=list,
        help_text="Dietary labels (vegetarian, vegan, gluten-free, etc.)"
    )
    allergen_warnings = models.JSONField(
        default=list,
        help_text="Allergen warnings"
    )
    
    # Chef/Author Information
    created_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='created_recipes'
    )
    chef_notes = models.TextField(blank=True)
    
    # Status and Ratings
    is_published = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    average_rating = models.FloatField(
        default=0.0,
        validators=[MinValueValidator(0.0), MaxValueValidator(5.0)]
    )
    total_ratings = models.PositiveIntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'recipes'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['cuisine', 'difficulty']),
            models.Index(fields=['meal_type', 'is_published']),
            models.Index(fields=['average_rating', 'total_ratings']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        
        # Calculate total time if not provided
        if not self.total_time:
            self.total_time = self.prep_time + self.cook_time
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name
    
    @property
    def total_time_display(self):
        """Human readable total time"""
        hours = self.total_time // 60
        minutes = self.total_time % 60
        
        if hours > 0:
            return f"{hours}h {minutes}m" if minutes > 0 else f"{hours}h"
        return f"{minutes}m"


class RecipeRating(models.Model):
    """User ratings for recipes"""
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ratings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipe_ratings')
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'recipe_ratings'
        unique_together = ['recipe', 'user']
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.recipe.name} ({self.rating}/5)"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update recipe average rating
        self.recipe.update_rating()


class UserRecipe(models.Model):
    """User's interaction with recipes"""
    STATUS_CHOICES = [
        ('saved', 'Saved'),
        ('planned', 'Planned'),
        ('cooking', 'Currently Cooking'),
        ('completed', 'Completed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_recipes')
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='user_interactions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='saved')
    is_favorite = models.BooleanField(default=False)
    
    # Cooking History
    times_cooked = models.PositiveIntegerField(default=0)
    last_cooked = models.DateTimeField(null=True, blank=True)
    
    # Personal Notes
    personal_notes = models.TextField(blank=True)
    modifications = models.JSONField(
        default=list,
        help_text="User's modifications to the recipe"
    )
    
    # Cooking Session Data
    cooking_started_at = models.DateTimeField(null=True, blank=True)
    cooking_completed_at = models.DateTimeField(null=True, blank=True)
    cooking_duration = models.PositiveIntegerField(
        null=True, 
        blank=True,
        help_text="Actual cooking duration in minutes"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_recipes'
        unique_together = ['user', 'recipe']
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.recipe.name} ({self.status})"


class RecipeCollection(models.Model):
    """User-created recipe collections"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipe_collections')
    recipes = models.ManyToManyField(Recipe, blank=True)
    is_public = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'recipe_collections'
        ordering = ['-updated_at']
        unique_together = ['user', 'name']
    
    def __str__(self):
        return f"{self.user.username} - {self.name}"


class CookingTip(models.Model):
    """Cooking tips and techniques"""
    title = models.CharField(max_length=200)
    content = models.TextField()
    category = models.CharField(
        max_length=50,
        choices=[
            ('technique', 'Cooking Technique'),
            ('ingredient', 'Ingredient Tip'),
            ('equipment', 'Equipment'),
            ('safety', 'Safety'),
            ('cultural', 'Cultural Context'),
            ('nutrition', 'Nutrition'),
        ]
    )
    related_recipes = models.ManyToManyField(Recipe, blank=True)
    related_ingredients = models.ManyToManyField(Ingredient, blank=True)
    
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'cooking_tips'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title


# Add method to Recipe model to update rating
def update_rating(self):
    """Update recipe average rating"""
    ratings = self.ratings.all()
    if ratings:
        total_rating = sum(rating.rating for rating in ratings)
        self.average_rating = total_rating / len(ratings)
        self.total_ratings = len(ratings)
    else:
        self.average_rating = 0.0
        self.total_ratings = 0
    self.save(update_fields=['average_rating', 'total_ratings'])

Recipe.update_rating = update_rating