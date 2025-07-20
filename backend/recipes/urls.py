from django.urls import path
from . import views

app_name = 'recipes'

urlpatterns = [
    # Reference Data
    path('regions/', views.RegionListView.as_view(), name='regions'),
    path('cuisines/', views.CuisineListView.as_view(), name='cuisines'),
    path('ingredients/', views.IngredientListView.as_view(), name='ingredients'),
    
    # Recipes
    path('', views.RecipeListView.as_view(), name='recipe_list'),
    path('create/', views.RecipeCreateView.as_view(), name='recipe_create'),
    path('featured/', views.FeaturedRecipesView.as_view(), name='featured_recipes'),
    path('popular/', views.PopularRecipesView.as_view(), name='popular_recipes'),
    path('search/', views.search_recipes, name='search_recipes'),
    path('recommendations/', views.get_recommendations, name='get_recommendations'),
    path('stats/', views.recipe_stats, name='recipe_stats'),
    
    # Recipe Details
    path('<slug:slug>/', views.RecipeDetailView.as_view(), name='recipe_detail'),
    path('<slug:slug>/update/', views.RecipeUpdateView.as_view(), name='recipe_update'),
    
    # Recipe Ratings
    path('<int:recipe_id>/ratings/', views.RecipeRatingListCreateView.as_view(), name='recipe_ratings'),
    path('ratings/<int:pk>/update/', views.RecipeRatingUpdateView.as_view(), name='update_rating'),
    
    # User Recipe Interactions
    path('user/', views.UserRecipeListView.as_view(), name='user_recipes'),
    path('<int:recipe_id>/save/', views.save_recipe, name='save_recipe'),
    path('<int:recipe_id>/favorite/', views.toggle_favorite, name='toggle_favorite'),
    path('<int:recipe_id>/update-interaction/', views.update_user_recipe, name='update_user_recipe'),
    
    # Recipe Collections
    path('collections/', views.RecipeCollectionListCreateView.as_view(), name='recipe_collections'),
    path('collections/<int:pk>/', views.RecipeCollectionDetailView.as_view(), name='recipe_collection_detail'),
    path('collections/<int:collection_id>/recipes/<int:recipe_id>/add/', 
         views.add_recipe_to_collection, name='add_recipe_to_collection'),
    path('collections/<int:collection_id>/recipes/<int:recipe_id>/remove/', 
         views.remove_recipe_from_collection, name='remove_recipe_from_collection'),
    
    # Cooking Tips
    path('tips/', views.CookingTipListView.as_view(), name='cooking_tips'),
]