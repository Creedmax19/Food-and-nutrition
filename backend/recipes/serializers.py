from rest_framework import serializers
from .models import (
    Region, Cuisine, Ingredient, Recipe, RecipeRating, 
    UserRecipe, RecipeCollection, CookingTip
)


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name', 'description', 'countries', 'cultural_notes']


class CuisineSerializer(serializers.ModelSerializer):
    region = RegionSerializer(read_only=True)
    
    class Meta:
        model = Cuisine
        fields = ['id', 'name', 'region', 'description', 'characteristics']


class IngredientSerializer(serializers.ModelSerializer):
    common_regions = RegionSerializer(many=True, read_only=True)
    substitutes = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = Ingredient
        fields = [
            'id', 'name', 'local_names', 'category', 'description',
            'nutritional_info', 'common_regions', 'seasonality',
            'storage_tips', 'substitutes', 'allergen_info'
        ]


class RecipeListSerializer(serializers.ModelSerializer):
    """Serializer for recipe list view"""
    cuisine = CuisineSerializer(read_only=True)
    total_time_display = serializers.ReadOnlyField()
    
    class Meta:
        model = Recipe
        fields = [
            'id', 'name', 'slug', 'description', 'cuisine', 'prep_time',
            'cook_time', 'total_time', 'total_time_display', 'servings',
            'difficulty', 'meal_type', 'calories_per_serving', 'image',
            'average_rating', 'total_ratings', 'is_featured', 'created_at'
        ]


class RecipeDetailSerializer(serializers.ModelSerializer):
    """Serializer for recipe detail view"""
    cuisine = CuisineSerializer(read_only=True)
    total_time_display = serializers.ReadOnlyField()
    created_by = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Recipe
        fields = [
            'id', 'name', 'slug', 'description', 'cuisine', 'prep_time',
            'cook_time', 'total_time', 'total_time_display', 'servings',
            'difficulty', 'meal_type', 'ingredients', 'instructions',
            'calories_per_serving', 'nutritional_info', 'image', 'video_url',
            'cultural_significance', 'origin_story', 'traditional_occasions',
            'tags', 'dietary_labels', 'allergen_warnings', 'created_by',
            'chef_notes', 'average_rating', 'total_ratings', 'is_featured',
            'created_at', 'updated_at'
        ]


class RecipeCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer for creating/updating recipes"""
    
    class Meta:
        model = Recipe
        fields = [
            'name', 'description', 'cuisine', 'prep_time', 'cook_time',
            'servings', 'difficulty', 'meal_type', 'ingredients',
            'instructions', 'calories_per_serving', 'nutritional_info',
            'image', 'video_url', 'cultural_significance', 'origin_story',
            'traditional_occasions', 'tags', 'dietary_labels',
            'allergen_warnings', 'chef_notes'
        ]
    
    def validate_ingredients(self, value):
        """Validate ingredients format"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Ingredients must be a list")
        
        for ingredient in value:
            if not isinstance(ingredient, dict):
                raise serializers.ValidationError("Each ingredient must be an object")
            
            required_fields = ['name', 'quantity']
            for field in required_fields:
                if field not in ingredient:
                    raise serializers.ValidationError(f"Ingredient missing required field: {field}")
        
        return value
    
    def validate_instructions(self, value):
        """Validate instructions format"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Instructions must be a list")
        
        for i, instruction in enumerate(value):
            if not isinstance(instruction, dict):
                raise serializers.ValidationError(f"Instruction {i+1} must be an object")
            
            required_fields = ['step', 'description']
            for field in required_fields:
                if field not in instruction:
                    raise serializers.ValidationError(f"Instruction {i+1} missing required field: {field}")
        
        return value


class RecipeRatingSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = RecipeRating
        fields = ['id', 'user', 'rating', 'review', 'created_at', 'updated_at']
        read_only_fields = ['user']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class UserRecipeSerializer(serializers.ModelSerializer):
    recipe = RecipeListSerializer(read_only=True)
    
    class Meta:
        model = UserRecipe
        fields = [
            'id', 'recipe', 'status', 'is_favorite', 'times_cooked',
            'last_cooked', 'personal_notes', 'modifications',
            'cooking_started_at', 'cooking_completed_at', 'cooking_duration',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['times_cooked', 'last_cooked']


class UserRecipeUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user recipe interactions"""
    
    class Meta:
        model = UserRecipe
        fields = [
            'status', 'is_favorite', 'personal_notes', 'modifications',
            'cooking_started_at', 'cooking_completed_at'
        ]
    
    def update(self, instance, validated_data):
        # Handle cooking completion
        if (validated_data.get('cooking_completed_at') and 
            instance.cooking_started_at and 
            not instance.cooking_completed_at):
            
            # Calculate cooking duration
            duration = validated_data['cooking_completed_at'] - instance.cooking_started_at
            instance.cooking_duration = int(duration.total_seconds() / 60)
            instance.times_cooked += 1
            instance.last_cooked = validated_data['cooking_completed_at']
            instance.status = 'completed'
        
        return super().update(instance, validated_data)


class RecipeCollectionSerializer(serializers.ModelSerializer):
    recipes = RecipeListSerializer(many=True, read_only=True)
    recipe_count = serializers.SerializerMethodField()
    
    class Meta:
        model = RecipeCollection
        fields = [
            'id', 'name', 'description', 'recipes', 'recipe_count',
            'is_public', 'created_at', 'updated_at'
        ]
        read_only_fields = ['user']
    
    def get_recipe_count(self, obj):
        return obj.recipes.count()
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class CookingTipSerializer(serializers.ModelSerializer):
    related_recipes = RecipeListSerializer(many=True, read_only=True)
    related_ingredients = IngredientSerializer(many=True, read_only=True)
    
    class Meta:
        model = CookingTip
        fields = [
            'id', 'title', 'content', 'category', 'related_recipes',
            'related_ingredients', 'is_featured', 'created_at'
        ]


class RecipeSearchSerializer(serializers.Serializer):
    """Serializer for recipe search parameters"""
    query = serializers.CharField(required=False, allow_blank=True)
    cuisine = serializers.IntegerField(required=False)
    region = serializers.IntegerField(required=False)
    difficulty = serializers.ChoiceField(
        choices=Recipe.DIFFICULTY_CHOICES,
        required=False
    )
    meal_type = serializers.ChoiceField(
        choices=Recipe.MEAL_TYPE_CHOICES,
        required=False
    )
    max_prep_time = serializers.IntegerField(required=False, min_value=1)
    max_cook_time = serializers.IntegerField(required=False, min_value=1)
    max_total_time = serializers.IntegerField(required=False, min_value=1)
    dietary_labels = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    exclude_allergens = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    min_rating = serializers.FloatField(required=False, min_value=0, max_value=5)
    ingredients = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    exclude_ingredients = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )


class RecipeRecommendationSerializer(serializers.Serializer):
    """Serializer for recipe recommendation parameters"""
    meal_type = serializers.ChoiceField(
        choices=Recipe.MEAL_TYPE_CHOICES,
        required=False
    )
    max_prep_time = serializers.IntegerField(required=False, min_value=1)
    dietary_preferences = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    exclude_allergens = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    favorite_cuisines = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    cooking_level = serializers.ChoiceField(
        choices=[
            ('beginner', 'Beginner'),
            ('intermediate', 'Intermediate'),
            ('advanced', 'Advanced'),
            ('expert', 'Expert'),
        ],
        required=False
    )
    family_size = serializers.IntegerField(required=False, min_value=1)
    count = serializers.IntegerField(default=10, min_value=1, max_value=50)