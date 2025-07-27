from django.urls import path
from . import views

app_name = 'nutrition'

urlpatterns = [
    path('analyze/', views.analyze_nutrition, name='analyze_nutrition'),
    path('daily-intake/', views.daily_intake, name='daily_intake'),
    path('goals/', views.nutrition_goals, name='nutrition_goals'),
]