from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import (
    User, UserProfile, HealthCondition, Allergy, 
    DietaryPreference, FitnessGoal, Achievement, UserAchievement
)


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'password_confirm',
            'first_name', 'last_name'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        # Create user profile
        UserProfile.objects.create(user=user)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return attrs


class HealthConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthCondition
        fields = ['id', 'name', 'description', 'dietary_restrictions']


class AllergySerializer(serializers.ModelSerializer):
    class Meta:
        model = Allergy
        fields = ['id', 'name', 'description', 'severity_level', 'common_foods']


class DietaryPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DietaryPreference
        fields = ['id', 'name', 'description', 'allowed_foods', 'restricted_foods']


class FitnessGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = FitnessGoal
        fields = ['id', 'name', 'description', 'target_calories_adjustment', 'recommended_macros']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    health_conditions = HealthConditionSerializer(many=True, read_only=True)
    allergies = AllergySerializer(many=True, read_only=True)
    dietary_preferences = DietaryPreferenceSerializer(many=True, read_only=True)
    fitness_goals = FitnessGoalSerializer(many=True, read_only=True)
    
    health_condition_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    allergy_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    dietary_preference_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    fitness_goal_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )
    
    bmr = serializers.ReadOnlyField(source='calculate_bmr')
    daily_calories = serializers.ReadOnlyField(source='calculate_daily_calories')
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'daily_calorie_target', 'daily_water_target', 'activity_level',
            'preferred_meal_times', 'favorite_cuisines', 'disliked_ingredients',
            'onboarding_completed', 'health_conditions', 'allergies',
            'dietary_preferences', 'fitness_goals', 'health_condition_ids',
            'allergy_ids', 'dietary_preference_ids', 'fitness_goal_ids',
            'bmr', 'daily_calories', 'created_at', 'updated_at'
        ]
    
    def update(self, instance, validated_data):
        # Handle many-to-many relationships
        health_condition_ids = validated_data.pop('health_condition_ids', None)
        allergy_ids = validated_data.pop('allergy_ids', None)
        dietary_preference_ids = validated_data.pop('dietary_preference_ids', None)
        fitness_goal_ids = validated_data.pop('fitness_goal_ids', None)
        
        # Update regular fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update many-to-many relationships
        if health_condition_ids is not None:
            instance.health_conditions.set(health_condition_ids)
        if allergy_ids is not None:
            instance.allergies.set(allergy_ids)
        if dietary_preference_ids is not None:
            instance.dietary_preferences.set(dietary_preference_ids)
        if fitness_goal_ids is not None:
            instance.fitness_goals.set(fitness_goal_ids)
        
        return instance


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details"""
    profile = UserProfileSerializer(read_only=True)
    age = serializers.ReadOnlyField()
    bmi = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'date_of_birth', 'gender', 'height', 'weight',
            'country', 'city', 'location', 'cooking_level', 'family_size',
            'bio', 'avatar', 'notifications_enabled', 'location_enabled',
            'offline_mode', 'age', 'bmi', 'profile', 'date_joined', 'last_active'
        ]
        read_only_fields = ['id', 'date_joined']


class UserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating user information"""
    
    class Meta:
        model = User
        fields = [
            'first_name', 'last_name', 'phone_number', 'date_of_birth',
            'gender', 'height', 'weight', 'country', 'city', 'location',
            'cooking_level', 'family_size', 'bio', 'avatar',
            'notifications_enabled', 'location_enabled', 'offline_mode'
        ]


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = [
            'id', 'name', 'description', 'icon', 'category',
            'points', 'requirements', 'is_active'
        ]


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'earned_at', 'progress']


class OnboardingSerializer(serializers.Serializer):
    """Serializer for onboarding data"""
    # Personal Information
    height = serializers.FloatField(required=False)
    weight = serializers.FloatField(required=False)
    age = serializers.IntegerField(required=False)
    gender = serializers.ChoiceField(choices=User.GENDER_CHOICES, required=False)
    
    # Health & Dietary
    health_condition_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    allergy_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    dietary_preference_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    fitness_goal_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    
    # Preferences
    cooking_level = serializers.ChoiceField(choices=User.COOKING_LEVEL_CHOICES)
    family_size = serializers.IntegerField()
    location = serializers.CharField(max_length=200)
    activity_level = serializers.ChoiceField(choices=UserProfile.ACTIVITY_LEVELS)
    
    def save(self, user):
        """Save onboarding data to user and profile"""
        from datetime import date
        from django.utils import timezone
        
        # Calculate date of birth from age
        age = self.validated_data.get('age')
        if age:
            current_year = date.today().year
            birth_year = current_year - age
            user.date_of_birth = date(birth_year, 1, 1)
        
        # Update user fields
        user_fields = ['height', 'weight', 'gender', 'cooking_level', 'family_size', 'location']
        for field in user_fields:
            if field in self.validated_data:
                setattr(user, field, self.validated_data[field])
        user.save()
        
        # Update profile
        profile = user.profile
        profile.activity_level = self.validated_data.get('activity_level', 'moderate')
        profile.onboarding_completed = True
        profile.onboarding_completed_at = timezone.now()
        
        # Calculate daily calorie target
        profile.daily_calorie_target = profile.calculate_daily_calories()
        profile.save()
        
        # Set many-to-many relationships
        if 'health_condition_ids' in self.validated_data:
            profile.health_conditions.set(self.validated_data['health_condition_ids'])
        if 'allergy_ids' in self.validated_data:
            profile.allergies.set(self.validated_data['allergy_ids'])
        if 'dietary_preference_ids' in self.validated_data:
            profile.dietary_preferences.set(self.validated_data['dietary_preference_ids'])
        if 'fitness_goal_ids' in self.validated_data:
            profile.fitness_goals.set(self.validated_data['fitness_goal_ids'])
        
        return user


class PasswordChangeSerializer(serializers.Serializer):
    """Serializer for password change"""
    old_password = serializers.CharField()
    new_password = serializers.CharField(validators=[validate_password])
    new_password_confirm = serializers.CharField()
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New passwords don't match")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value