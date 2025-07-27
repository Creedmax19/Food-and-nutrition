import openai
import json
import time
from typing import Dict, List, Any, Optional
from django.conf import settings
from django.contrib.auth import get_user_model
from recipes.models import Recipe, Cuisine, Ingredient
from .models import AIRecommendation, UserPreferenceProfile, AIInteraction, CulturalInsight

User = get_user_model()

# Initialize OpenAI
openai.api_key = settings.OPENAI_API_KEY


class AIRecommendationEngine:
    """AI-powered recommendation engine for African cuisine"""
    
    def __init__(self):
        self.model = "gpt-4"
        self.max_tokens = 2000
        self.temperature = 0.7
    
    def get_personalized_recommendations(self, user: User, request_data: Dict) -> Dict:
        """Generate personalized meal recommendations"""
        start_time = time.time()
        
        # Build user context
        user_context = self._build_user_context(user)
        
        # Create AI prompt
        prompt = self._create_recommendation_prompt(user_context, request_data)
        
        try:
            # Call OpenAI API
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert African cuisine nutritionist and cultural food advisor. Provide personalized meal recommendations that respect cultural traditions while meeting health goals."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            processing_time = int((time.time() - start_time) * 1000)
            
            # Parse AI response
            ai_content = response.choices[0].message.content
            recommendations = self._parse_recommendations(ai_content)
            
            # Log interaction
            self._log_ai_interaction(
                user=user,
                interaction_type='recommendation_request',
                user_input=request_data,
                context_data=user_context,
                ai_response=recommendations,
                processing_time_ms=processing_time,
                tokens_used=response.usage.total_tokens
            )
            
            # Save recommendations
            self._save_recommendations(user, recommendations, user_context)
            
            return {
                'recommendations': recommendations,
                'confidence_score': 0.85,  # This would be calculated based on various factors
                'processing_time_ms': processing_time
            }
            
        except Exception as e:
            print(f"AI recommendation error: {str(e)}")
            # Fallback to rule-based recommendations
            return self._get_fallback_recommendations(user, request_data)
    
    def generate_meal_plan(self, user: User, plan_data: Dict) -> Dict:
        """Generate AI-powered weekly meal plan"""
        user_context = self._build_user_context(user)
        
        prompt = f"""
        Create a 7-day African meal plan for a user with the following profile:
        
        User Profile:
        - Cooking Level: {user_context.get('cooking_level', 'intermediate')}
        - Family Size: {user_context.get('family_size', 1)}
        - Health Goals: {', '.join(user_context.get('health_goals', []))}
        - Dietary Restrictions: {', '.join(user_context.get('dietary_restrictions', []))}
        - Preferred Regions: {', '.join(user_context.get('preferred_regions', ['West Africa']))}
        - Budget: {plan_data.get('budget', 'moderate')}
        - Prep Time Preference: {plan_data.get('max_prep_time', 60)} minutes max
        
        Requirements:
        1. Include breakfast, lunch, and dinner for each day
        2. Ensure nutritional balance and variety
        3. Respect cultural authenticity
        4. Consider seasonal ingredients
        5. Provide shopping list organization
        6. Include prep tips for busy days
        
        Format the response as JSON with the following structure:
        {{
            "meal_plan": {{
                "monday": {{"breakfast": "...", "lunch": "...", "dinner": "..."}},
                ...
            }},
            "shopping_list": [
                {{"category": "Proteins", "items": [...]}},
                ...
            ],
            "prep_tips": [...],
            "nutritional_summary": {{...}},
            "cultural_notes": [...]
        }}
        """
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert African cuisine meal planner with deep knowledge of traditional recipes, nutrition, and cultural food practices."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=3000,
                temperature=0.6
            )
            
            meal_plan = json.loads(response.choices[0].message.content)
            
            # Log interaction
            self._log_ai_interaction(
                user=user,
                interaction_type='meal_plan_generation',
                user_input=plan_data,
                context_data=user_context,
                ai_response=meal_plan,
                tokens_used=response.usage.total_tokens
            )
            
            return meal_plan
            
        except Exception as e:
            print(f"Meal plan generation error: {str(e)}")
            return self._get_fallback_meal_plan(user, plan_data)
    
    def get_ingredient_substitutes(self, ingredient: str, user: User, context: Dict) -> Dict:
        """Get AI-powered ingredient substitutions"""
        user_context = self._build_user_context(user)
        
        prompt = f"""
        Find suitable African ingredient substitutes for "{ingredient}" considering:
        
        User Context:
        - Location: {user_context.get('location', 'Africa')}
        - Dietary Restrictions: {', '.join(user_context.get('dietary_restrictions', []))}
        - Allergies: {', '.join(user_context.get('allergies', []))}
        - Recipe Context: {context.get('recipe_name', 'General cooking')}
        - Cooking Method: {context.get('cooking_method', 'Various')}
        
        Provide:
        1. 3-5 authentic African alternatives
        2. Availability in different African regions
        3. Flavor profile comparison
        4. Quantity conversion ratios
        5. Cultural significance of alternatives
        
        Format as JSON:
        {{
            "substitutes": [
                {{
                    "name": "...",
                    "availability": "...",
                    "flavor_profile": "...",
                    "conversion_ratio": "...",
                    "cultural_note": "...",
                    "confidence": 0.9
                }}
            ],
            "general_tips": [...],
            "cultural_context": "..."
        }}
        """
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert in African ingredients and traditional cooking methods with deep knowledge of regional availability and cultural significance."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=1500,
                temperature=0.5
            )
            
            substitutes = json.loads(response.choices[0].message.content)
            
            # Log interaction
            self._log_ai_interaction(
                user=user,
                interaction_type='ingredient_substitution',
                user_input={'ingredient': ingredient, 'context': context},
                context_data=user_context,
                ai_response=substitutes,
                tokens_used=response.usage.total_tokens
            )
            
            return substitutes
            
        except Exception as e:
            print(f"Ingredient substitution error: {str(e)}")
            return self._get_fallback_substitutes(ingredient)
    
    def generate_cultural_insight(self, recipe: Recipe) -> Dict:
        """Generate cultural insights for a recipe"""
        prompt = f"""
        Provide rich cultural context for the African dish "{recipe.name}" from {recipe.cuisine.region.name}:
        
        Recipe Details:
        - Name: {recipe.name}
        - Region: {recipe.cuisine.region.name}
        - Country: {recipe.cuisine.name}
        - Ingredients: {', '.join([ing.get('name', '') for ing in recipe.ingredients[:10]])}
        
        Please provide:
        1. Historical origins and evolution
        2. Cultural significance and traditions
        3. Regional variations
        4. Traditional occasions when served
        5. Cooking techniques and their cultural importance
        6. Nutritional and medicinal properties in traditional context
        7. Modern adaptations and fusion possibilities
        
        Format as JSON:
        {{
            "title": "Cultural Heritage of [Recipe Name]",
            "historical_origin": "...",
            "cultural_significance": "...",
            "traditional_occasions": [...],
            "regional_variations": {{...}},
            "cooking_traditions": "...",
            "nutritional_wisdom": "...",
            "modern_adaptations": "...",
            "interesting_facts": [...]
        }}
        """
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a cultural anthropologist and food historian specializing in African cuisine with deep knowledge of traditional food practices, cultural significance, and historical context."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=2000,
                temperature=0.6
            )
            
            insight_data = json.loads(response.choices[0].message.content)
            
            # Save cultural insight
            cultural_insight = CulturalInsight.objects.create(
                recipe=recipe,
                title=insight_data.get('title', f'Cultural Heritage of {recipe.name}'),
                content=json.dumps(insight_data),
                cultural_context=insight_data,
                generated_by_ai=True,
                ai_confidence=0.8
            )
            
            return insight_data
            
        except Exception as e:
            print(f"Cultural insight generation error: {str(e)}")
            return self._get_fallback_cultural_insight(recipe)
    
    def _build_user_context(self, user: User) -> Dict:
        """Build comprehensive user context for AI"""
        profile = getattr(user, 'profile', None)
        ai_profile = getattr(user, 'ai_profile', None)
        
        context = {
            'cooking_level': user.cooking_level,
            'family_size': user.family_size,
            'location': user.location or user.country,
            'age': user.age,
            'health_goals': [],
            'dietary_restrictions': [],
            'allergies': [],
            'preferred_regions': [],
        }
        
        if profile:
            context.update({
                'health_goals': [goal.name for goal in profile.fitness_goals.all()],
                'dietary_restrictions': [pref.name for pref in profile.dietary_preferences.all()],
                'allergies': [allergy.name for allergy in profile.allergies.all()],
                'daily_calorie_target': profile.daily_calorie_target,
                'activity_level': profile.activity_level,
            })
        
        if ai_profile:
            context.update({
                'preferred_flavors': ai_profile.preferred_flavors,
                'cuisine_preferences': ai_profile.cuisine_preferences,
                'complexity_preference': ai_profile.recipe_complexity_preference,
            })
        
        return context
    
    def _create_recommendation_prompt(self, user_context: Dict, request_data: Dict) -> str:
        """Create AI prompt for recommendations"""
        return f"""
        Recommend {request_data.get('count', 5)} African recipes for a user with this profile:
        
        User Profile:
        - Cooking Level: {user_context.get('cooking_level', 'intermediate')}
        - Family Size: {user_context.get('family_size', 1)} people
        - Location: {user_context.get('location', 'Africa')}
        - Health Goals: {', '.join(user_context.get('health_goals', []))}
        - Dietary Restrictions: {', '.join(user_context.get('dietary_restrictions', []))}
        - Allergies to avoid: {', '.join(user_context.get('allergies', []))}
        
        Request Specifics:
        - Meal Type: {request_data.get('meal_type', 'any')}
        - Max Prep Time: {request_data.get('max_prep_time', 60)} minutes
        - Preferred Regions: {', '.join(request_data.get('preferred_regions', ['Any']))}
        
        For each recipe, provide:
        1. Recipe name and origin
        2. Brief description
        3. Estimated prep/cook time
        4. Difficulty level
        5. Key ingredients
        6. Health benefits
        7. Cultural significance
        8. Why it matches the user's profile
        
        Format as JSON array of recipe objects.
        """
    
    def _parse_recommendations(self, ai_content: str) -> List[Dict]:
        """Parse AI response into structured recommendations"""
        try:
            return json.loads(ai_content)
        except json.JSONDecodeError:
            # Fallback parsing logic
            return []
    
    def _save_recommendations(self, user: User, recommendations: List[Dict], context: Dict):
        """Save AI recommendations to database"""
        for rec in recommendations:
            AIRecommendation.objects.create(
                user=user,
                recommendation_type='recipe',
                content=rec,
                user_context=context,
                confidence_score=rec.get('confidence', 0.8)
            )
    
    def _log_ai_interaction(self, **kwargs):
        """Log AI interaction for learning and analytics"""
        AIInteraction.objects.create(**kwargs)
    
    def _get_fallback_recommendations(self, user: User, request_data: Dict) -> Dict:
        """Fallback recommendations when AI fails"""
        # Rule-based fallback logic
        recipes = Recipe.objects.filter(is_published=True)
        
        if request_data.get('meal_type'):
            recipes = recipes.filter(meal_type=request_data['meal_type'])
        
        if request_data.get('max_prep_time'):
            recipes = recipes.filter(prep_time__lte=request_data['max_prep_time'])
        
        recommendations = []
        for recipe in recipes[:request_data.get('count', 5)]:
            recommendations.append({
                'name': recipe.name,
                'description': recipe.description,
                'prep_time': recipe.prep_time,
                'cook_time': recipe.cook_time,
                'difficulty': recipe.difficulty,
                'cuisine': recipe.cuisine.name,
                'region': recipe.cuisine.region.name,
                'confidence': 0.6
            })
        
        return {
            'recommendations': recommendations,
            'confidence_score': 0.6,
            'fallback': True
        }
    
    def _get_fallback_meal_plan(self, user: User, plan_data: Dict) -> Dict:
        """Fallback meal plan when AI fails"""
        return {
            'meal_plan': {
                'monday': {'breakfast': 'Akara with Pap', 'lunch': 'Jollof Rice', 'dinner': 'Grilled Fish'},
                'tuesday': {'breakfast': 'Injera with Honey', 'lunch': 'Couscous', 'dinner': 'Tagine'},
                # ... more days
            },
            'shopping_list': [],
            'prep_tips': ['Prepare ingredients in advance', 'Batch cook grains'],
            'fallback': True
        }
    
    def _get_fallback_substitutes(self, ingredient: str) -> Dict:
        """Fallback ingredient substitutes"""
        return {
            'substitutes': [
                {
                    'name': f'Alternative to {ingredient}',
                    'availability': 'Common',
                    'flavor_profile': 'Similar',
                    'conversion_ratio': '1:1',
                    'confidence': 0.5
                }
            ],
            'fallback': True
        }
    
    def _get_fallback_cultural_insight(self, recipe: Recipe) -> Dict:
        """Fallback cultural insight"""
        return {
            'title': f'Cultural Heritage of {recipe.name}',
            'historical_origin': f'{recipe.name} is a traditional dish from {recipe.cuisine.region.name}.',
            'cultural_significance': 'This dish holds special meaning in local traditions.',
            'fallback': True
        }


# Initialize the AI engine
ai_engine = AIRecommendationEngine()