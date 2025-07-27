from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class User(AbstractUser):
    """Custom User model with additional fields for African Meal Planner"""
    
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
        ('P', 'Prefer not to say'),
    ]
    
    COOKING_LEVEL_CHOICES = [
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced'),
        ('expert', 'Expert'),
    ]
    
    # Personal Information
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    
    # Physical Information
    height = models.FloatField(
        null=True, 
        blank=True, 
        validators=[MinValueValidator(50), MaxValueValidator(300)],
        help_text="Height in centimeters"
    )
    weight = models.FloatField(
        null=True, 
        blank=True, 
        validators=[MinValueValidator(20), MaxValueValidator(500)],
        help_text="Weight in kilograms"
    )
    
    # Location
    country = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=200, blank=True)
    
    # Preferences
    cooking_level = models.CharField(
        max_length=20, 
        choices=COOKING_LEVEL_CHOICES, 
        default='beginner'
    )
    family_size = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(20)]
    )
    
    # Profile
    bio = models.TextField(max_length=500, blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    # Settings
    notifications_enabled = models.BooleanField(default=True)
    location_enabled = models.BooleanField(default=True)
    offline_mode = models.BooleanField(default=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_active = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
    
    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.email})"
    
    @property
    def age(self):
        """Calculate age from date of birth"""
        if self.date_of_birth:
            from datetime import date
            today = date.today()
            return today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        return None
    
    @property
    def bmi(self):
        """Calculate BMI if height and weight are available"""
        if self.height and self.weight:
            height_m = self.height / 100  # Convert cm to meters
            return round(self.weight / (height_m ** 2), 1)
        return None


class HealthCondition(models.Model):
    """Health conditions that affect meal planning"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    dietary_restrictions = models.TextField(
        blank=True,
        help_text="Comma-separated list of dietary restrictions"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'health_conditions'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Allergy(models.Model):
    """Food allergies and intolerances"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    severity_level = models.CharField(
        max_length=20,
        choices=[
            ('mild', 'Mild'),
            ('moderate', 'Moderate'),
            ('severe', 'Severe'),
            ('life_threatening', 'Life Threatening'),
        ],
        default='moderate'
    )
    common_foods = models.TextField(
        blank=True,
        help_text="Comma-separated list of common foods containing this allergen"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'allergies'
        ordering = ['name']
        verbose_name_plural = 'Allergies'
    
    def __str__(self):
        return self.name


class DietaryPreference(models.Model):
    """Dietary preferences and restrictions"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    allowed_foods = models.TextField(
        blank=True,
        help_text="Comma-separated list of allowed food categories"
    )
    restricted_foods = models.TextField(
        blank=True,
        help_text="Comma-separated list of restricted food categories"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'dietary_preferences'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class FitnessGoal(models.Model):
    """Fitness and health goals"""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    target_calories_adjustment = models.IntegerField(
        default=0,
        help_text="Daily calorie adjustment for this goal (+/- calories)"
    )
    recommended_macros = models.JSONField(
        default=dict,
        help_text="Recommended macro ratios (protein, carbs, fat percentages)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'fitness_goals'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class UserProfile(models.Model):
    """Extended user profile with health and dietary information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    # Health Information
    health_conditions = models.ManyToManyField(HealthCondition, blank=True)
    allergies = models.ManyToManyField(Allergy, blank=True)
    dietary_preferences = models.ManyToManyField(DietaryPreference, blank=True)
    fitness_goals = models.ManyToManyField(FitnessGoal, blank=True)
    
    # Calculated Fields
    daily_calorie_target = models.PositiveIntegerField(null=True, blank=True)
    daily_water_target = models.FloatField(
        null=True, 
        blank=True,
        help_text="Daily water intake target in liters"
    )
    
    # Activity Level
    ACTIVITY_LEVELS = [
        ('sedentary', 'Sedentary (little or no exercise)'),
        ('light', 'Lightly active (light exercise 1-3 days/week)'),
        ('moderate', 'Moderately active (moderate exercise 3-5 days/week)'),
        ('very', 'Very active (hard exercise 6-7 days/week)'),
        ('extra', 'Extra active (very hard exercise, physical job)'),
    ]
    activity_level = models.CharField(
        max_length=20,
        choices=ACTIVITY_LEVELS,
        default='moderate'
    )
    
    # Preferences
    preferred_meal_times = models.JSONField(
        default=dict,
        help_text="Preferred times for breakfast, lunch, dinner"
    )
    favorite_cuisines = models.JSONField(
        default=list,
        help_text="List of favorite African cuisine regions"
    )
    disliked_ingredients = models.JSONField(
        default=list,
        help_text="List of ingredients the user dislikes"
    )
    
    # Tracking
    onboarding_completed = models.BooleanField(default=False)
    onboarding_completed_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_profiles'
    
    def __str__(self):
        return f"{self.user.get_full_name()}'s Profile"
    
    def calculate_bmr(self):
        """Calculate Basal Metabolic Rate using Mifflin-St Jeor Equation"""
        if not all([self.user.weight, self.user.height, self.user.age, self.user.gender]):
            return None
        
        # BMR calculation
        if self.user.gender == 'M':
            bmr = 10 * self.user.weight + 6.25 * self.user.height - 5 * self.user.age + 5
        else:
            bmr = 10 * self.user.weight + 6.25 * self.user.height - 5 * self.user.age - 161
        
        return round(bmr)
    
    def calculate_daily_calories(self):
        """Calculate daily calorie needs based on BMR and activity level"""
        bmr = self.calculate_bmr()
        if not bmr:
            return None
        
        activity_multipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'very': 1.725,
            'extra': 1.9,
        }
        
        multiplier = activity_multipliers.get(self.activity_level, 1.55)
        daily_calories = bmr * multiplier
        
        # Apply fitness goal adjustments
        for goal in self.fitness_goals.all():
            daily_calories += goal.target_calories_adjustment
        
        return round(daily_calories)


class Achievement(models.Model):
    """User achievements and badges"""
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.CharField(max_length=10, default='🏆')
    category = models.CharField(
        max_length=50,
        choices=[
            ('cooking', 'Cooking'),
            ('planning', 'Meal Planning'),
            ('health', 'Health & Nutrition'),
            ('cultural', 'Cultural Explorer'),
            ('social', 'Social'),
        ]
    )
    points = models.PositiveIntegerField(default=10)
    requirements = models.JSONField(
        default=dict,
        help_text="Requirements to unlock this achievement"
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'achievements'
        ordering = ['category', 'name']
    
    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    """Track user achievements"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='achievements')
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    progress = models.JSONField(
        default=dict,
        help_text="Progress towards achievement requirements"
    )
    
    class Meta:
        db_table = 'user_achievements'
        unique_together = ['user', 'achievement']
        ordering = ['-earned_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"