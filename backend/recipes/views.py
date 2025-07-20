from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Avg, Count
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Region, Cuisine, Ingredient, Recipe, RecipeRating,
    UserRecipe, RecipeCollection, CookingTip
)
from .serializers import (
    RegionSerializer, CuisineSerializer, IngredientSerializer,
    RecipeListSerializer, RecipeDetailSerializer, RecipeCreateUpdateSerializer,
    RecipeRatingSerializer, UserRecipeSerializer, UserRecipeUpdateSerializer,
    RecipeCollectionSerializer, CookingTipSerializer, RecipeSearchSerializer,
    RecipeRecommendationSerializer
)
from .filters import RecipeFilter
import random


class RegionListView(generics.ListAPIView):
    """List all African regions"""
    queryset = Region.objects.all()
    serializer_class = RegionSerializer
    permission_classes = [permissions.IsAuthenticated]


class CuisineListView(generics.ListAPIView):
    """List all cuisines, optionally filtered by region"""
    queryset = Cuisine.objects.select_related('region')
    serializer_class = CuisineSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['region']


class IngredientListView(generics.ListAPIView):
    """List all ingredients"""
    queryset = Ingredient.objects.filter(is_active=True).prefetch_related('common_regions')
    serializer_class = IngredientSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'local_names', 'description']
    filterset_fields = ['category']


class RecipeListView(generics.ListAPIView):
    """List recipes with filtering and search"""
    queryset = Recipe.objects.filter(is_published=True).select_related('cuisine__region')
    serializer_class = RecipeListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = RecipeFilter
    search_fields = ['name', 'description', 'tags', 'ingredients']
    ordering_fields = ['created_at', 'average_rating', 'total_time', 'difficulty']
    ordering = ['-created_at']


class RecipeDetailView(generics.RetrieveAPIView):
    """Get recipe details"""
    queryset = Recipe.objects.filter(is_published=True).select_related('cuisine__region')
    serializer_class = RecipeDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'


class RecipeCreateView(generics.CreateAPIView):
    """Create a new recipe"""
    queryset = Recipe.objects.all()
    serializer_class = RecipeCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class RecipeUpdateView(generics.UpdateAPIView):
    """Update a recipe (only by creator)"""
    queryset = Recipe.objects.all()
    serializer_class = RecipeCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'
    
    def get_queryset(self):
        return Recipe.objects.filter(created_by=self.request.user)


class FeaturedRecipesView(generics.ListAPIView):
    """List featured recipes"""
    queryset = Recipe.objects.filter(is_published=True, is_featured=True).select_related('cuisine__region')
    serializer_class = RecipeListSerializer
    permission_classes = [permissions.IsAuthenticated]


class PopularRecipesView(generics.ListAPIView):
    """List popular recipes based on ratings"""
    serializer_class = RecipeListSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Recipe.objects.filter(
            is_published=True,
            total_ratings__gte=5
        ).select_related('cuisine__region').order_by('-average_rating', '-total_ratings')[:20]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def search_recipes(request):
    """Advanced recipe search"""
    serializer = RecipeSearchSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    queryset = Recipe.objects.filter(is_published=True).select_related('cuisine__region')
    
    # Text search
    if data.get('query'):
        queryset = queryset.filter(
            Q(name__icontains=data['query']) |
            Q(description__icontains=data['query']) |
            Q(tags__icontains=data['query'])
        )
    
    # Filter by cuisine/region
    if data.get('cuisine'):
        queryset = queryset.filter(cuisine_id=data['cuisine'])
    if data.get('region'):
        queryset = queryset.filter(cuisine__region_id=data['region'])
    
    # Filter by difficulty and meal type
    if data.get('difficulty'):
        queryset = queryset.filter(difficulty=data['difficulty'])
    if data.get('meal_type'):
        queryset = queryset.filter(meal_type=data['meal_type'])
    
    # Filter by time constraints
    if data.get('max_prep_time'):
        queryset = queryset.filter(prep_time__lte=data['max_prep_time'])
    if data.get('max_cook_time'):
        queryset = queryset.filter(cook_time__lte=data['max_cook_time'])
    if data.get('max_total_time'):
        queryset = queryset.filter(total_time__lte=data['max_total_time'])
    
    # Filter by dietary labels
    if data.get('dietary_labels'):
        for label in data['dietary_labels']:
            queryset = queryset.filter(dietary_labels__icontains=label)
    
    # Exclude allergens
    if data.get('exclude_allergens'):
        for allergen in data['exclude_allergens']:
            queryset = queryset.exclude(allergen_warnings__icontains=allergen)
    
    # Filter by minimum rating
    if data.get('min_rating'):
        queryset = queryset.filter(average_rating__gte=data['min_rating'])
    
    # Filter by ingredients
    if data.get('ingredients'):
        for ingredient in data['ingredients']:
            queryset = queryset.filter(ingredients__icontains=ingredient)
    
    # Exclude ingredients
    if data.get('exclude_ingredients'):
        for ingredient in data['exclude_ingredients']:
            queryset = queryset.exclude(ingredients__icontains=ingredient)
    
    # Order by relevance (rating and popularity)
    queryset = queryset.order_by('-average_rating', '-total_ratings')
    
    # Paginate results
    page = request.query_params.get('page', 1)
    page_size = min(int(request.query_params.get('page_size', 20)), 50)
    
    start = (int(page) - 1) * page_size
    end = start + page_size
    
    recipes = queryset[start:end]
    serializer = RecipeListSerializer(recipes, many=True)
    
    return Response({
        'results': serializer.data,
        'count': queryset.count(),
        'page': int(page),
        'page_size': page_size
    })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def get_recommendations(request):
    """Get personalized recipe recommendations"""
    serializer = RecipeRecommendationSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    user = request.user
    profile = user.profile
    
    # Start with published recipes
    queryset = Recipe.objects.filter(is_published=True).select_related('cuisine__region')
    
    # Filter by user's dietary preferences and allergies
    user_allergies = [allergy.name.lower() for allergy in profile.allergies.all()]
    for allergy in user_allergies:
        queryset = queryset.exclude(allergen_warnings__icontains=allergy)
    
    user_dietary_prefs = [pref.name.lower() for pref in profile.dietary_preferences.all()]
    for pref in user_dietary_prefs:
        queryset = queryset.filter(dietary_labels__icontains=pref)
    
    # Filter by request parameters
    if data.get('meal_type'):
        queryset = queryset.filter(meal_type=data['meal_type'])
    
    if data.get('max_prep_time'):
        queryset = queryset.filter(prep_time__lte=data['max_prep_time'])
    
    # Filter by cooking level
    cooking_level = data.get('cooking_level', user.cooking_level)
    difficulty_map = {
        'beginner': ['easy'],
        'intermediate': ['easy', 'medium'],
        'advanced': ['easy', 'medium', 'hard'],
        'expert': ['easy', 'medium', 'hard']
    }
    allowed_difficulties = difficulty_map.get(cooking_level, ['easy', 'medium'])
    queryset = queryset.filter(difficulty__in=allowed_difficulties)
    
    # Prefer user's favorite cuisines
    favorite_cuisines = data.get('favorite_cuisines', profile.favorite_cuisines)
    if favorite_cuisines:
        queryset = queryset.filter(cuisine_id__in=favorite_cuisines)
    
    # Exclude recipes user has already cooked recently
    recently_cooked = UserRecipe.objects.filter(
        user=user,
        status='completed',
        last_cooked__isnull=False
    ).values_list('recipe_id', flat=True)[:10]
    
    queryset = queryset.exclude(id__in=recently_cooked)
    
    # Order by rating and randomize for variety
    queryset = queryset.filter(average_rating__gte=3.0).order_by('-average_rating')
    
    # Get requested count
    count = data.get('count', 10)
    recipes = list(queryset[:count * 2])  # Get more than needed for randomization
    
    # Randomize and limit to requested count
    random.shuffle(recipes)
    recipes = recipes[:count]
    
    serializer = RecipeListSerializer(recipes, many=True)
    return Response(serializer.data)


class RecipeRatingListCreateView(generics.ListCreateAPIView):
    """List and create recipe ratings"""
    serializer_class = RecipeRatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        recipe_id = self.kwargs['recipe_id']
        return RecipeRating.objects.filter(recipe_id=recipe_id).select_related('user')
    
    def perform_create(self, serializer):
        recipe_id = self.kwargs['recipe_id']
        recipe = get_object_or_404(Recipe, id=recipe_id)
        serializer.save(recipe=recipe)


class RecipeRatingUpdateView(generics.UpdateAPIView):
    """Update user's recipe rating"""
    serializer_class = RecipeRatingSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return RecipeRating.objects.filter(user=self.request.user)


class UserRecipeListView(generics.ListAPIView):
    """List user's recipe interactions"""
    serializer_class = UserRecipeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status', 'is_favorite']
    
    def get_queryset(self):
        return UserRecipe.objects.filter(user=self.request.user).select_related('recipe__cuisine__region')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def save_recipe(request, recipe_id):
    """Save a recipe to user's collection"""
    recipe = get_object_or_404(Recipe, id=recipe_id, is_published=True)
    user_recipe, created = UserRecipe.objects.get_or_create(
        user=request.user,
        recipe=recipe,
        defaults={'status': 'saved'}
    )
    
    if not created:
        user_recipe.status = 'saved'
        user_recipe.save()
    
    serializer = UserRecipeSerializer(user_recipe)
    return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_favorite(request, recipe_id):
    """Toggle recipe favorite status"""
    recipe = get_object_or_404(Recipe, id=recipe_id, is_published=True)
    user_recipe, created = UserRecipe.objects.get_or_create(
        user=request.user,
        recipe=recipe,
        defaults={'is_favorite': True}
    )
    
    if not created:
        user_recipe.is_favorite = not user_recipe.is_favorite
        user_recipe.save()
    
    serializer = UserRecipeSerializer(user_recipe)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_user_recipe(request, recipe_id):
    """Update user recipe interaction"""
    user_recipe = get_object_or_404(
        UserRecipe,
        user=request.user,
        recipe_id=recipe_id
    )
    
    serializer = UserRecipeUpdateSerializer(
        user_recipe,
        data=request.data,
        partial=request.method == 'PATCH'
    )
    
    if serializer.is_valid():
        serializer.save()
        return Response(UserRecipeSerializer(user_recipe).data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RecipeCollectionListCreateView(generics.ListCreateAPIView):
    """List and create recipe collections"""
    serializer_class = RecipeCollectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return RecipeCollection.objects.filter(user=self.request.user).prefetch_related('recipes')


class RecipeCollectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Get, update, or delete a recipe collection"""
    serializer_class = RecipeCollectionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return RecipeCollection.objects.filter(user=self.request.user).prefetch_related('recipes')


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_recipe_to_collection(request, collection_id, recipe_id):
    """Add a recipe to a collection"""
    collection = get_object_or_404(
        RecipeCollection,
        id=collection_id,
        user=request.user
    )
    recipe = get_object_or_404(Recipe, id=recipe_id, is_published=True)
    
    collection.recipes.add(recipe)
    
    serializer = RecipeCollectionSerializer(collection)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_recipe_from_collection(request, collection_id, recipe_id):
    """Remove a recipe from a collection"""
    collection = get_object_or_404(
        RecipeCollection,
        id=collection_id,
        user=request.user
    )
    recipe = get_object_or_404(Recipe, id=recipe_id)
    
    collection.recipes.remove(recipe)
    
    serializer = RecipeCollectionSerializer(collection)
    return Response(serializer.data)


class CookingTipListView(generics.ListAPIView):
    """List cooking tips"""
    queryset = CookingTip.objects.all().prefetch_related('related_recipes', 'related_ingredients')
    serializer_class = CookingTipSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'is_featured']


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def recipe_stats(request):
    """Get recipe statistics"""
    user = request.user
    
    # Overall stats
    total_recipes = Recipe.objects.filter(is_published=True).count()
    user_recipes = UserRecipe.objects.filter(user=user)
    
    stats = {
        'total_recipes_available': total_recipes,
        'saved_recipes': user_recipes.filter(status='saved').count(),
        'planned_recipes': user_recipes.filter(status='planned').count(),
        'completed_recipes': user_recipes.filter(status='completed').count(),
        'favorite_recipes': user_recipes.filter(is_favorite=True).count(),
        'total_cooking_time': sum(
            ur.cooking_duration or 0 for ur in user_recipes.filter(cooking_duration__isnull=False)
        ),
        'recipes_by_difficulty': {
            'easy': user_recipes.filter(recipe__difficulty='easy').count(),
            'medium': user_recipes.filter(recipe__difficulty='medium').count(),
            'hard': user_recipes.filter(recipe__difficulty='hard').count(),
        },
        'recipes_by_cuisine': {}
    }
    
    # Recipes by cuisine
    cuisine_stats = user_recipes.values('recipe__cuisine__name').annotate(
        count=Count('id')
    ).order_by('-count')[:5]
    
    for stat in cuisine_stats:
        stats['recipes_by_cuisine'][stat['recipe__cuisine__name']] = stat['count']
    
    return Response(stats)