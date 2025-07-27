import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Users, 
  Star,
  ChefHat,
  MapPin,
  Heart
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRecommendations } from '@/hooks/useRecipes';
import { useAIRecommendations } from '@/hooks/useAI';
import { recipesAPI, statsAPI } from '@/services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user } = useAuth();
  const { recommendations, fetchRecommendations } = useRecommendations();
  const { recommendations: aiRecommendations, getRecommendations: getAIRecommendations } = useAIRecommendations();
  const [stats, setStats] = useState({
    mealsPlanned: 0,
    recipesCooked: 0,
    caloriesTarget: 2200,
    caloriesConsumed: 1850,
  });
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  
  const userName = user?.first_name || user?.username || 'Friend';

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      // Load user stats
      const userStats = await statsAPI.getUserStats();
      setStats({
        mealsPlanned: userStats.profile?.meal_plans_created || 0,
        recipesCooked: userStats.profile?.recipes_cooked || 0,
        caloriesTarget: userStats.health?.daily_calorie_target || 2200,
        caloriesConsumed: 1850, // This would come from daily tracking
      });

      // Load featured recipes
      const featured = await recipesAPI.getFeaturedRecipes();
      setFeaturedRecipes(featured.slice(0, 3));

      // Load AI recommendations
      await fetchRecommendations({
        meal_type: 'lunch',
        count: 2
      });

      // Load AI-powered recommendations
      await getAIRecommendations({
        meal_type: 'dinner',
        count: 3,
        max_prep_time: 60
      });
    } catch (error) {
      console.error('Failed to load home data:', error);
    }
  };

  const [todaysMeals, setTodaysMeals] = useState([
    {
      id: 1,
      name: 'Jollof Rice with Grilled Chicken',
      type: 'Lunch',
      time: '12:30 PM',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
      region: 'West Africa',
      cookTime: '45 min',
      difficulty: 'Medium',
    },
    {
      id: 2,
      name: 'Injera with Doro Wat',
      type: 'Dinner',
      time: '7:00 PM',
      image: 'https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg',
      region: 'East Africa',
      cookTime: '2 hours',
      difficulty: 'Hard',
    },
  ]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with Greeting */}
      <LinearGradient
        colors={['#E07A5F', '#F4A261']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Sannu, {userName}! 👋</Text>
            <Text style={styles.subGreeting}>Ready to explore African flavors today?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Sparkles size={24} color="#2C1810" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <TrendingUp size={20} color="#E07A5F" />
          <Text style={styles.statNumber}>{stats.mealsPlanned}</Text>
          <Text style={styles.statLabel}>Meals Planned</Text>
        </View>
        <View style={styles.statCard}>
          <ChefHat size={20} color="#3D5A80" />
          <Text style={styles.statNumber}>{stats.recipesCooked}</Text>
          <Text style={styles.statLabel}>Recipes Cooked</Text>
        </View>
        <View style={styles.statCard}>
          <Heart size={20} color="#F4A261" />
          <Text style={styles.statNumber}>{Math.round((stats.caloriesConsumed / stats.caloriesTarget) * 100)}%</Text>
          <Text style={styles.statLabel}>Daily Goal</Text>
        </View>
      </View>

      {/* Today's Meals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {todaysMeals.map((meal) => (
          <TouchableOpacity key={meal.id} style={styles.mealCard}>
            <Image source={{ uri: meal.image }} style={styles.mealImage} />
            <View style={styles.mealInfo}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealType}>{meal.type}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <Text style={styles.mealName}>{meal.name}</Text>
              <View style={styles.mealMeta}>
                <View style={styles.metaItem}>
                  <MapPin size={14} color="#8B7355" />
                  <Text style={styles.metaText}>{meal.region}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Clock size={14} color="#8B7355" />
                  <Text style={styles.metaText}>{meal.cookTime}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI Recommendations */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>AI Recommendations</Text>
          <Sparkles size={20} color="#E07A5F" />
        </View>
        
        <TouchableOpacity style={styles.aiCard}>
          <LinearGradient
            colors={['#3D5A80', '#264653']}
            style={styles.aiGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <Text style={styles.aiTitle}>Perfect for Your Goals</Text>
            <Text style={styles.aiDescription}>
              {aiRecommendations.length > 0 
                ? `Based on your preferences, we recommend ${aiRecommendations[0]?.name}. ${aiRecommendations[0]?.why_recommended || 'Perfect for your dietary goals!'}`
                : 'Getting personalized recommendations based on your preferences and health goals...'
              }
            </Text>
            <View style={styles.aiButton}>
              <Text style={styles.aiButtonText}>Explore Recipe</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* AI Recommendation Cards */}
        {aiRecommendations.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.aiRecommendationsScroll}>
            {aiRecommendations.map((recommendation, index) => (
              <TouchableOpacity key={index} style={styles.aiRecommendationCard}>
                <View style={styles.aiRecHeader}>
                  <Text style={styles.aiRecName}>{recommendation.name}</Text>
                  <View style={styles.confidenceScore}>
                    <Text style={styles.confidenceText}>{Math.round(recommendation.confidence * 100)}%</Text>
                  </View>
                </View>
                <Text style={styles.aiRecRegion}>{recommendation.region}</Text>
                <Text style={styles.aiRecDescription} numberOfLines={2}>
                  {recommendation.description}
                </Text>
                <View style={styles.aiRecMeta}>
                  <Text style={styles.aiRecTime}>{recommendation.prep_time + recommendation.cook_time} min</Text>
                  <Text style={styles.aiRecDifficulty}>{recommendation.difficulty}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* Featured Recipes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Recipes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recipesScroll}>
          {featuredRecipes.map((recipe) => (
            <TouchableOpacity key={recipe.id} style={styles.recipeCard}>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <View style={styles.recipeOverlay}>
                <View style={styles.recipeRating}>
                  <Star size={12} color="#F2CC8F" fill="#F2CC8F" />
                  <Text style={styles.ratingText}>{recipe.rating}</Text>
                </View>
              </View>
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeRegion}>{recipe.region}</Text>
                <View style={styles.recipeTime}>
                  <Clock size={12} color="#8B7355" />
                  <Text style={styles.recipeTimeText}>{recipe.cookTime}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Cultural Tip */}
      <View style={styles.section}>
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>🌍 Cultural Tip of the Day</Text>
          <Text style={styles.tipText}>
            In Ethiopian culture, coffee ceremonies are sacred rituals that bring communities together. 
            The process involves roasting, grinding, and brewing coffee beans while sharing stories and bonding.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#2C1810',
    opacity: 0.8,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -15,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#8B7355',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  seeAll: {
    fontSize: 14,
    color: '#E07A5F',
    fontWeight: '600',
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  mealImage: {
    width: '100%',
    height: 120,
  },
  mealInfo: {
    padding: 16,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealType: {
    fontSize: 12,
    color: '#E07A5F',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  mealTime: {
    fontSize: 12,
    color: '#8B7355',
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  mealMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#8B7355',
  },
  aiCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  aiGradient: {
    padding: 20,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
    marginBottom: 16,
  },
  aiButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  aiButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  recipesScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  recipeCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeImage: {
    width: '100%',
    height: 120,
  },
  recipeOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  recipeRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  recipeInfo: {
    padding: 12,
  },
  recipeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  recipeRegion: {
    fontSize: 12,
    color: '#E07A5F',
    marginBottom: 8,
  },
  recipeTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeTimeText: {
    fontSize: 12,
    color: '#8B7355',
  },
  tipCard: {
    backgroundColor: '#F2CC8F',
    borderRadius: 16,
    padding: 20,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#2C1810',
    lineHeight: 20,
    opacity: 0.8,
  },
  aiRecommendationsScroll: {
    marginTop: 16,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  aiRecommendationCard: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E07A5F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiRecHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  aiRecName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C1810',
    flex: 1,
  },
  confidenceScore: {
    backgroundColor: '#E07A5F',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  aiRecRegion: {
    fontSize: 12,
    color: '#E07A5F',
    marginBottom: 8,
  },
  aiRecDescription: {
    fontSize: 12,
    color: '#8B7355',
    lineHeight: 16,
    marginBottom: 8,
  },
  aiRecMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aiRecTime: {
    fontSize: 11,
    color: '#8B7355',
  },
  aiRecDifficulty: {
    fontSize: 11,
    color: '#3D5A80',
    fontWeight: '600',
  },
});