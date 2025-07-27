from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Region, Cuisine, Ingredient, Recipe, RecipeRating,
    UserRecipe, RecipeCollection, CookingTip
)


@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']


@admin.register(Cuisine)
class CuisineAdmin(admin.ModelAdmin):
    list_display = ['name', 'region', 'created_at']
    list_filter = ['region']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at']


@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'is_active', 'created_at']
    list_filter = ['category', 'is_active', 'common_regions']
    search_fields = ['name', 'local_names', 'description']
    filter_horizontal = ['common_regions', 'substitutes']
    readonly_fields = ['created_at']


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'cuisine', 'difficulty', 'meal_type', 'total_time',
        'average_rating', 'total_ratings', 'is_published', 'is_featured'
    ]
    list_filter = [
        'difficulty', 'meal_type', 'cuisine__region', 'is_published',
        'is_featured', 'created_at'
    ]
    search_fields = ['name', 'description', 'tags']
    readonly_fields = [
        'slug', 'average_rating', 'total_ratings', 'total_time',
        'created_at', 'updated_at'
    ]
    prepopulated_fields = {'slug': ('name',)}
    
    fieldsets = (
        ('Basic Information', {
            'fields': (
                'name', 'slug', 'description', 'cuisine', 'created_by'
            )
        }),
        ('Recipe Details', {
            'fields': (
                'prep_time', 'cook_time', 'total_time', 'servings',
                'difficulty', 'meal_type'
            )
        }),
        ('Content', {
            'fields': ('ingredients', 'instructions')
        }),
        ('Nutrition', {
            'fields': ('calories_per_serving', 'nutritional_info')
        }),
        ('Media', {
            'fields': ('image', 'video_url')
        }),
        ('Cultural Information', {
            'fields': (
                'cultural_significance', 'origin_story', 'traditional_occasions'
            ),
            'classes': ('collapse',)
        }),
        ('Metadata', {
            'fields': (
                'tags', 'dietary_labels', 'allergen_warnings', 'chef_notes'
            )
        }),
        ('Status', {
            'fields': (
                'is_published', 'is_featured', 'average_rating', 'total_ratings'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('cuisine__region', 'created_by')


@admin.register(RecipeRating)
class RecipeRatingAdmin(admin.ModelAdmin):
    list_display = ['recipe', 'user', 'rating', 'created_at']
    list_filter = ['rating', 'created_at']
    search_fields = ['recipe__name', 'user__username', 'review']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('recipe', 'user')


@admin.register(UserRecipe)
class UserRecipeAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'recipe', 'status', 'is_favorite', 'times_cooked',
        'last_cooked', 'created_at'
    ]
    list_filter = ['status', 'is_favorite', 'created_at']
    search_fields = ['user__username', 'recipe__name']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'recipe')


@admin.register(RecipeCollection)
class RecipeCollectionAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'recipe_count', 'is_public', 'created_at']
    list_filter = ['is_public', 'created_at']
    search_fields = ['name', 'description', 'user__username']
    filter_horizontal = ['recipes']
    readonly_fields = ['created_at', 'updated_at']
    
    def recipe_count(self, obj):
        return obj.recipes.count()
    recipe_count.short_description = 'Recipe Count'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user').prefetch_related('recipes')


@admin.register(CookingTip)
class CookingTipAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_featured', 'created_at']
    list_filter = ['category', 'is_featured', 'created_at']
    search_fields = ['title', 'content']
    filter_horizontal = ['related_recipes', 'related_ingredients']
    readonly_fields = ['created_at']