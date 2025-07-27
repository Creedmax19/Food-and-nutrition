from django.urls import path
from . import views

app_name = 'ai_engine'

urlpatterns = [
    path('recommendations/', views.get_ai_recommendations, name='ai_recommendations'),
    path('meal-plan/generate/', views.generate_meal_plan, name='generate_meal_plan'),
    path('ingredient-substitutes/', views.get_ingredient_substitutes, name='ingredient_substitutes'),
    path('cultural-insight/', views.generate_cultural_insight, name='cultural_insight'),
    path('feedback/', views.provide_feedback, name='ai_feedback'),
    path('profile/', views.get_user_ai_profile, name='user_ai_profile'),
    path('history/', views.get_recommendation_history, name='recommendation_history'),
]