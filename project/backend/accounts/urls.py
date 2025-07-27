from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Authentication
    path('register/', views.register, name='register'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    
    # Profile Management
    path('profile/', views.profile, name='profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('profile/details/', views.UserProfileDetailView.as_view(), name='profile_details'),
    path('profile/stats/', views.user_stats, name='user_stats'),
    
    # Onboarding
    path('onboarding/complete/', views.complete_onboarding, name='complete_onboarding'),
    
    # Password Management
    path('password/change/', views.change_password, name='change_password'),
    
    # Reference Data
    path('health-conditions/', views.HealthConditionListView.as_view(), name='health_conditions'),
    path('allergies/', views.AllergyListView.as_view(), name='allergies'),
    path('dietary-preferences/', views.DietaryPreferenceListView.as_view(), name='dietary_preferences'),
    path('fitness-goals/', views.FitnessGoalListView.as_view(), name='fitness_goals'),
    
    # Achievements
    path('achievements/', views.AchievementListView.as_view(), name='achievements'),
    path('achievements/earned/', views.UserAchievementListView.as_view(), name='user_achievements'),
    
    # Account Management
    path('delete/', views.delete_account, name='delete_account'),
]