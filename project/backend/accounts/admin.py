from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import (
    User, UserProfile, HealthCondition, Allergy, 
    DietaryPreference, FitnessGoal, Achievement, UserAchievement
)


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom User Admin"""
    list_display = [
        'username', 'email', 'first_name', 'last_name', 
        'cooking_level', 'family_size', 'is_active', 'date_joined'
    ]
    list_filter = [
        'is_active', 'is_staff', 'cooking_level', 'gender', 
        'country', 'date_joined'
    ]
    search_fields = ['username', 'email', 'first_name', 'last_name']
    ordering = ['-date_joined']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Personal Information', {
            'fields': (
                'phone_number', 'date_of_birth', 'gender', 
                'height', 'weight', 'bio', 'avatar'
            )
        }),
        ('Location', {
            'fields': ('country', 'city', 'location')
        }),
        ('Preferences', {
            'fields': ('cooking_level', 'family_size')
        }),
        ('Settings', {
            'fields': (
                'notifications_enabled', 'location_enabled', 'offline_mode'
            )
        }),
        ('Timestamps', {
            'fields': ('last_active',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ['last_active']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('profile')


class UserProfileInline(admin.StackedInline):
    """Inline for UserProfile"""
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    
    filter_horizontal = [
        'health_conditions', 'allergies', 
        'dietary_preferences', 'fitness_goals'
    ]


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    """UserProfile Admin"""
    list_display = [
        'user', 'activity_level', 'daily_calorie_target', 
        'onboarding_completed', 'created_at'
    ]
    list_filter = [
        'activity_level', 'onboarding_completed', 
        'health_conditions', 'dietary_preferences'
    ]
    search_fields = ['user__username', 'user__email']
    
    filter_horizontal = [
        'health_conditions', 'allergies', 
        'dietary_preferences', 'fitness_goals'
    ]
    
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Health Information', {
            'fields': (
                'health_conditions', 'allergies', 'daily_calorie_target',
                'daily_water_target', 'activity_level'
            )
        }),
        ('Dietary Preferences', {
            'fields': ('dietary_preferences', 'fitness_goals')
        }),
        ('Preferences', {
            'fields': (
                'preferred_meal_times', 'favorite_cuisines', 
                'disliked_ingredients'
            )
        }),
        ('Onboarding', {
            'fields': ('onboarding_completed', 'onboarding_completed_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(HealthCondition)
class HealthConditionAdmin(admin.ModelAdmin):
    """HealthCondition Admin"""
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(Allergy)
class AllergyAdmin(admin.ModelAdmin):
    """Allergy Admin"""
    list_display = ['name', 'severity_level', 'created_at']
    list_filter = ['severity_level']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(DietaryPreference)
class DietaryPreferenceAdmin(admin.ModelAdmin):
    """DietaryPreference Admin"""
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(FitnessGoal)
class FitnessGoalAdmin(admin.ModelAdmin):
    """FitnessGoal Admin"""
    list_display = ['name', 'target_calories_adjustment', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    """Achievement Admin"""
    list_display = ['name', 'category', 'points', 'is_active', 'created_at']
    list_filter = ['category', 'is_active']
    search_fields = ['name', 'description']
    ordering = ['category', 'name']
    
    def icon_display(self, obj):
        return format_html('<span style="font-size: 20px;">{}</span>', obj.icon)
    icon_display.short_description = 'Icon'


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    """UserAchievement Admin"""
    list_display = ['user', 'achievement', 'earned_at']
    list_filter = ['achievement__category', 'earned_at']
    search_fields = ['user__username', 'achievement__name']
    ordering = ['-earned_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'achievement')


# Customize admin site
admin.site.site_header = "African Meal Planner Admin"
admin.site.site_title = "African Meal Planner"
admin.site.index_title = "Welcome to African Meal Planner Administration"