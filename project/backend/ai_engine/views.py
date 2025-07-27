from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from recipes.models import Recipe
from .services import ai_engine
from .models import AIRecommendation, UserPreferenceProfile


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_ai_recommendations(request):
    """Get AI-powered recipe recommendations"""
    try:
        user = request.user
        request_data = request.data
        
        # Validate request data
        meal_type = request_data.get('meal_type')
        max_prep_time = request_data.get('max_prep_time')
        count = min(request_data.get('count', 5), 20)  # Limit to 20 recommendations
        
        # Get AI recommendations
        recommendations = ai_engine.get_personalized_recommendations(
            user=user,
            request_data={
                'meal_type': meal_type,
                'max_prep_time': max_prep_time,
                'count': count,
                'preferred_regions': request_data.get('preferred_regions', []),
                'dietary_preferences': request_data.get('dietary_preferences', []),
                'exclude_allergens': request_data.get('exclude_allergens', []),
            }
        )
        
        return Response(recommendations, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to generate recommendations',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_meal_plan(request):
    """Generate AI-powered meal plan"""
    try:
        user = request.user
        plan_data = request.data
        
        # Validate plan data
        days = min(plan_data.get('days', 7), 14)  # Limit to 2 weeks
        budget = plan_data.get('budget', 'moderate')
        max_prep_time = plan_data.get('max_prep_time', 60)
        
        # Generate meal plan
        meal_plan = ai_engine.generate_meal_plan(
            user=user,
            plan_data={
                'days': days,
                'budget': budget,
                'max_prep_time': max_prep_time,
                'dietary_preferences': plan_data.get('dietary_preferences', []),
                'exclude_allergens': plan_data.get('exclude_allergens', []),
                'preferred_regions': plan_data.get('preferred_regions', []),
                'family_size': plan_data.get('family_size', user.family_size),
            }
        )
        
        return Response(meal_plan, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to generate meal plan',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_ingredient_substitutes(request):
    """Get AI-powered ingredient substitutions"""
    try:
        user = request.user
        ingredient = request.data.get('ingredient')
        
        if not ingredient:
            return Response({
                'error': 'Ingredient name is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        context = {
            'recipe_name': request.data.get('recipe_name'),
            'cooking_method': request.data.get('cooking_method'),
            'cuisine_type': request.data.get('cuisine_type'),
        }
        
        # Get substitutes
        substitutes = ai_engine.get_ingredient_substitutes(
            ingredient=ingredient,
            user=user,
            context=context
        )
        
        return Response(substitutes, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to get ingredient substitutes',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def generate_cultural_insight(request):
    """Generate cultural insight for a recipe"""
    try:
        recipe_id = request.data.get('recipe_id')
        
        if not recipe_id:
            return Response({
                'error': 'Recipe ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        recipe = get_object_or_404(Recipe, id=recipe_id, is_published=True)
        
        # Generate cultural insight
        insight = ai_engine.generate_cultural_insight(recipe)
        
        return Response(insight, status=status.HTTP_200_OK)
        
    except Recipe.DoesNotExist:
        return Response({
            'error': 'Recipe not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': 'Failed to generate cultural insight',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def provide_feedback(request):
    """Provide feedback on AI recommendations"""
    try:
        recommendation_id = request.data.get('recommendation_id')
        rating = request.data.get('rating')  # 1-5
        feedback = request.data.get('feedback', '')
        was_helpful = request.data.get('was_helpful')
        
        if not recommendation_id:
            return Response({
                'error': 'Recommendation ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        recommendation = get_object_or_404(
            AIRecommendation, 
            id=recommendation_id, 
            user=request.user
        )
        
        # Update recommendation with feedback
        recommendation.user_rating = rating
        recommendation.user_feedback = feedback
        recommendation.was_helpful = was_helpful
        recommendation.save()
        
        # Update user preference profile based on feedback
        ai_profile, created = UserPreferenceProfile.objects.get_or_create(
            user=request.user
        )
        
        # This would include logic to update preferences based on feedback
        # For now, we'll just acknowledge the feedback
        
        return Response({
            'message': 'Feedback received successfully',
            'recommendation_id': recommendation_id
        }, status=status.HTTP_200_OK)
        
    except AIRecommendation.DoesNotExist:
        return Response({
            'error': 'Recommendation not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': 'Failed to process feedback',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_ai_profile(request):
    """Get user's AI preference profile"""
    try:
        ai_profile, created = UserPreferenceProfile.objects.get_or_create(
            user=request.user
        )
        
        profile_data = {
            'preferred_flavors': ai_profile.preferred_flavors,
            'preferred_cooking_methods': ai_profile.preferred_cooking_methods,
            'cuisine_preferences': ai_profile.cuisine_preferences,
            'recipe_complexity_preference': ai_profile.recipe_complexity_preference,
            'cultural_openness_score': ai_profile.cultural_openness_score,
            'confidence_score': ai_profile.confidence_score,
            'last_updated': ai_profile.last_updated,
        }
        
        return Response(profile_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to get AI profile',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendation_history(request):
    """Get user's AI recommendation history"""
    try:
        recommendations = AIRecommendation.objects.filter(
            user=request.user
        ).order_by('-created_at')[:50]  # Last 50 recommendations
        
        history = []
        for rec in recommendations:
            history.append({
                'id': rec.id,
                'type': rec.recommendation_type,
                'content': rec.content,
                'confidence_score': rec.confidence_score,
                'user_rating': rec.user_rating,
                'was_helpful': rec.was_helpful,
                'created_at': rec.created_at,
                'viewed_at': rec.viewed_at,
                'acted_upon_at': rec.acted_upon_at,
            })
        
        return Response({
            'recommendations': history,
            'total_count': recommendations.count()
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': 'Failed to get recommendation history',
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)