import django_filters
from .models import Recipe, Cuisine, Region


class RecipeFilter(django_filters.FilterSet):
    """Filter for recipes"""
    
    # Text search
    name = django_filters.CharFilter(lookup_expr='icontains')
    description = django_filters.CharFilter(lookup_expr='icontains')
    
    # Cuisine and Region
    cuisine = django_filters.ModelChoiceFilter(queryset=Cuisine.objects.all())
    region = django_filters.ModelChoiceFilter(
        field_name='cuisine__region',
        queryset=Region.objects.all()
    )
    
    # Time filters
    max_prep_time = django_filters.NumberFilter(field_name='prep_time', lookup_expr='lte')
    max_cook_time = django_filters.NumberFilter(field_name='cook_time', lookup_expr='lte')
    max_total_time = django_filters.NumberFilter(field_name='total_time', lookup_expr='lte')
    
    # Difficulty and meal type
    difficulty = django_filters.ChoiceFilter(choices=Recipe.DIFFICULTY_CHOICES)
    meal_type = django_filters.ChoiceFilter(choices=Recipe.MEAL_TYPE_CHOICES)
    
    # Servings
    min_servings = django_filters.NumberFilter(field_name='servings', lookup_expr='gte')
    max_servings = django_filters.NumberFilter(field_name='servings', lookup_expr='lte')
    
    # Calories
    max_calories = django_filters.NumberFilter(field_name='calories_per_serving', lookup_expr='lte')
    
    # Rating
    min_rating = django_filters.NumberFilter(field_name='average_rating', lookup_expr='gte')
    
    # Dietary labels (contains any of the specified labels)
    dietary_labels = django_filters.CharFilter(method='filter_dietary_labels')
    
    # Exclude allergens
    exclude_allergens = django_filters.CharFilter(method='filter_exclude_allergens')
    
    # Featured recipes
    is_featured = django_filters.BooleanFilter()
    
    # Tags
    tags = django_filters.CharFilter(method='filter_tags')
    
    class Meta:
        model = Recipe
        fields = [
            'name', 'description', 'cuisine', 'region', 'difficulty', 'meal_type',
            'max_prep_time', 'max_cook_time', 'max_total_time', 'min_servings',
            'max_servings', 'max_calories', 'min_rating', 'dietary_labels',
            'exclude_allergens', 'is_featured', 'tags'
        ]
    
    def filter_dietary_labels(self, queryset, name, value):
        """Filter by dietary labels (comma-separated)"""
        if value:
            labels = [label.strip() for label in value.split(',')]
            for label in labels:
                queryset = queryset.filter(dietary_labels__icontains=label)
        return queryset
    
    def filter_exclude_allergens(self, queryset, name, value):
        """Exclude recipes containing specified allergens (comma-separated)"""
        if value:
            allergens = [allergen.strip() for allergen in value.split(',')]
            for allergen in allergens:
                queryset = queryset.exclude(allergen_warnings__icontains=allergen)
        return queryset
    
    def filter_tags(self, queryset, name, value):
        """Filter by tags (comma-separated)"""
        if value:
            tags = [tag.strip() for tag in value.split(',')]
            for tag in tags:
                queryset = queryset.filter(tags__icontains=tag)
        return queryset