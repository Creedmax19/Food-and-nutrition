from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from django.utils import timezone
from .models import (
    User, UserProfile, HealthCondition, Allergy, 
    DietaryPreference, FitnessGoal, Achievement, UserAchievement
)
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer,
    UserUpdateSerializer, UserProfileSerializer, OnboardingSerializer,
    PasswordChangeSerializer, HealthConditionSerializer, AllergySerializer,
    DietaryPreferenceSerializer, FitnessGoalSerializer, AchievementSerializer,
    UserAchievementSerializer
)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register(request):
    """User registration endpoint"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """User login endpoint"""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        
        # Update last active timestamp
        user.last_active = timezone.now()
        user.save(update_fields=['last_active'])
        
        login(request, user)
        
        return Response({
            'user': UserSerializer(user).data,
            'token': token.key,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    """User logout endpoint"""
    try:
        # Delete the user's token
        request.user.auth_token.delete()
    except:
        pass
    
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def profile(request):
    """Get current user profile"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    """Update user profile"""
    serializer = UserUpdateSerializer(
        request.user, 
        data=request.data, 
        partial=request.method == 'PATCH'
    )
    if serializer.is_valid():
        serializer.save()
        return Response(UserSerializer(request.user).data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def complete_onboarding(request):
    """Complete user onboarding"""
    serializer = OnboardingSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save(request.user)
        return Response({
            'user': UserSerializer(user).data,
            'message': 'Onboarding completed successfully'
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def change_password(request):
    """Change user password"""
    serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        # Create new token
        Token.objects.filter(user=user).delete()
        token = Token.objects.create(user=user)
        
        return Response({
            'token': token.key,
            'message': 'Password changed successfully'
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileDetailView(generics.RetrieveUpdateAPIView):
    """Get and update user profile details"""
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        profile, created = UserProfile.objects.get_or_create(user=self.request.user)
        return profile


class HealthConditionListView(generics.ListAPIView):
    """List all health conditions"""
    queryset = HealthCondition.objects.all()
    serializer_class = HealthConditionSerializer
    permission_classes = [permissions.IsAuthenticated]


class AllergyListView(generics.ListAPIView):
    """List all allergies"""
    queryset = Allergy.objects.all()
    serializer_class = AllergySerializer
    permission_classes = [permissions.IsAuthenticated]


class DietaryPreferenceListView(generics.ListAPIView):
    """List all dietary preferences"""
    queryset = DietaryPreference.objects.all()
    serializer_class = DietaryPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]


class FitnessGoalListView(generics.ListAPIView):
    """List all fitness goals"""
    queryset = FitnessGoal.objects.all()
    serializer_class = FitnessGoalSerializer
    permission_classes = [permissions.IsAuthenticated]


class AchievementListView(generics.ListAPIView):
    """List all achievements"""
    queryset = Achievement.objects.filter(is_active=True)
    serializer_class = AchievementSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserAchievementListView(generics.ListAPIView):
    """List user's earned achievements"""
    serializer_class = UserAchievementSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return UserAchievement.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_stats(request):
    """Get user statistics"""
    user = request.user
    profile = user.profile
    
    # Calculate various stats
    from recipes.models import Recipe, UserRecipe
    from meal_planning.models import MealPlan
    
    total_recipes = Recipe.objects.count()
    user_recipes = UserRecipe.objects.filter(user=user)
    cooked_recipes = user_recipes.filter(status='completed').count()
    favorite_recipes = user_recipes.filter(is_favorite=True).count()
    
    meal_plans = MealPlan.objects.filter(user=user)
    total_meal_plans = meal_plans.count()
    
    # Achievement stats
    total_achievements = Achievement.objects.filter(is_active=True).count()
    earned_achievements = UserAchievement.objects.filter(user=user).count()
    
    # Cooking streak (simplified calculation)
    cooking_streak = 0  # This would need more complex logic
    
    stats = {
        'profile': {
            'total_recipes_available': total_recipes,
            'recipes_cooked': cooked_recipes,
            'favorite_recipes': favorite_recipes,
            'meal_plans_created': total_meal_plans,
            'cooking_streak_days': cooking_streak,
            'achievements_earned': earned_achievements,
            'total_achievements': total_achievements,
            'achievement_percentage': round((earned_achievements / total_achievements) * 100) if total_achievements > 0 else 0,
        },
        'health': {
            'bmi': user.bmi,
            'daily_calorie_target': profile.daily_calorie_target,
            'daily_water_target': profile.daily_water_target,
            'activity_level': profile.get_activity_level_display(),
        },
        'preferences': {
            'cooking_level': user.get_cooking_level_display(),
            'family_size': user.family_size,
            'dietary_preferences_count': profile.dietary_preferences.count(),
            'allergies_count': profile.allergies.count(),
            'health_conditions_count': profile.health_conditions.count(),
        }
    }
    
    return Response(stats)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_account(request):
    """Delete user account"""
    user = request.user
    
    # Perform any cleanup operations here
    # (e.g., anonymize data, delete files, etc.)
    
    user.delete()
    
    return Response({
        'message': 'Account deleted successfully'
    }, status=status.HTTP_204_NO_CONTENT)