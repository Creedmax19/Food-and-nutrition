from django.urls import path
from . import views

app_name = 'meal_planning'

urlpatterns = [
    path('', views.MealPlanListCreateView.as_view(), name='meal_plans'),
    path('<int:pk>/', views.MealPlanDetailView.as_view(), name='meal_plan_detail'),
    path('<int:meal_plan_id>/entries/', views.MealPlanEntryListCreateView.as_view(), name='meal_plan_entries'),
    path('entries/<int:pk>/', views.MealPlanEntryDetailView.as_view(), name='meal_plan_entry_detail'),
]