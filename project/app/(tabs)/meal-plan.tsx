import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Calendar,
  Plus,
  Clock,
  Users,
  ChefHat,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  X
} from 'lucide-react-native';

export default function MealPlanScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('');

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const [weeklyMeals, setWeeklyMeals] = useState({
    '2024-01-15': {
      breakfast: {
        name: 'Akara with Pap',
        image: 'https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg',
        calories: 320,
        cookTime: '30 min',
        region: 'West Africa'
      },
      lunch: {
        name: 'Jollof Rice with Chicken',
        image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
        calories: 580,
        cookTime: '45 min',
        region: 'West Africa'
      },
      dinner: {
        name: 'Grilled Tilapia with Ugali',
        image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
        calories: 420,
        cookTime: '35 min',
        region: 'East Africa'
      }
    },
    '2024-01-16': {
      breakfast: {
        name: 'Injera with Honey',
        image: 'https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg',
        calories: 280,
        cookTime: '15 min',
        region: 'East Africa'
      },
      lunch: {
        name: 'Moroccan Couscous',
        image: 'https://images.pexels.com/photos/6419733/pexels-photo-6419733.jpeg',
        calories: 520,
        cookTime: '40 min',
        region: 'North Africa'
      }
    }
  });

  const [suggestedMeals] = useState([
    {
      id: 1,
      name: 'Thieboudienne',
      image: 'https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg',
      calories: 650,
      cookTime: '2 hours',
      region: 'West Africa',
      difficulty: 'Hard',
      type: 'lunch'
    },
    {
      id: 2,
      name: 'Biltong Breakfast Bowl',
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
      calories: 380,
      cookTime: '20 min',
      region: 'Southern Africa',
      difficulty: 'Easy',
      type: 'breakfast'
    },
    {
      id: 3,
      name: 'Tagine with Vegetables',
      image: 'https://images.pexels.com/photos/6419733/pexels-photo-6419733.jpeg',
      calories: 420,
      cookTime: '1.5 hours',
      region: 'North Africa',
      difficulty: 'Medium',
      type: 'dinner'
    }
  ]);

  const getCurrentWeek = () => {
    const startOfWeek = new Date(selectedDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayMeals = (date) => {
    const dateStr = formatDate(date);
    return weeklyMeals[dateStr] || {};
  };

  const getTotalCalories = (date) => {
    const meals = getDayMeals(date);
    return Object.values(meals).reduce((total, meal) => total + (meal.calories || 0), 0);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

  const addMealToPlan = (meal, date, mealType) => {
    const dateStr = formatDate(date);
    setWeeklyMeals(prev => ({
      ...prev,
      [dateStr]: {
        ...prev[dateStr],
        [mealType.toLowerCase()]: {
          name: meal.name,
          image: meal.image,
          calories: meal.calories,
          cookTime: meal.cookTime,
          region: meal.region
        }
      }
    }));
    setShowAddMeal(false);
  };

  const currentWeek = getCurrentWeek();

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#3D5A80', '#264653']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Meal Planner</Text>
          <Text style={styles.headerSubtitle}>Plan your African culinary journey</Text>
        </View>
        <TouchableOpacity style={styles.aiButton}>
          <Sparkles size={20} color="#F2CC8F" />
          <Text style={styles.aiButtonText}>AI Suggest</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Week Navigation */}
      <View style={styles.weekNavigation}>
        <TouchableOpacity onPress={() => navigateWeek(-1)} style={styles.navButton}>
          <ArrowLeft size={20} color="#E07A5F" />
        </TouchableOpacity>
        <Text style={styles.weekTitle}>
          {currentWeek[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
          {currentWeek[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </Text>
        <TouchableOpacity onPress={() => navigateWeek(1)} style={styles.navButton}>
          <ArrowRight size={20} color="#E07A5F" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Week Calendar */}
        <View style={styles.weekCalendar}>
          {currentWeek.map((date, index) => {
            const isToday = formatDate(date) === formatDate(new Date());
            const totalCalories = getTotalCalories(date);
            
            return (
              <TouchableOpacity
                key={index}
                style={[styles.dayCard, isToday && styles.todayCard]}
                onPress={() => setSelectedDate(date)}>
                <Text style={[styles.dayName, isToday && styles.todayText]}>
                  {weekDays[index]}
                </Text>
                <Text style={[styles.dayNumber, isToday && styles.todayText]}>
                  {date.getDate()}
                </Text>
                <Text style={[styles.dayCalories, isToday && styles.todayText]}>
                  {totalCalories} cal
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Selected Day Meals */}
        <View style={styles.selectedDaySection}>
          <Text style={styles.selectedDayTitle}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Text>

          {mealTypes.map((mealType) => {
            const meal = getDayMeals(selectedDate)[mealType.toLowerCase()];
            
            return (
              <View key={mealType} style={styles.mealSlot}>
                <View style={styles.mealSlotHeader}>
                  <Text style={styles.mealTypeTitle}>{mealType}</Text>
                  <TouchableOpacity 
                    style={styles.addMealButton}
                    onPress={() => {
                      setSelectedMealType(mealType);
                      setShowAddMeal(true);
                    }}>
                    <Plus size={16} color="#E07A5F" />
                  </TouchableOpacity>
                </View>

                {meal ? (
                  <TouchableOpacity style={styles.plannedMeal}>
                    <Image source={{ uri: meal.image }} style={styles.plannedMealImage} />
                    <View style={styles.plannedMealInfo}>
                      <Text style={styles.plannedMealName}>{meal.name}</Text>
                      <Text style={styles.plannedMealRegion}>{meal.region}</Text>
                      <View style={styles.plannedMealMeta}>
                        <View style={styles.metaItem}>
                          <Clock size={12} color="#8B7355" />
                          <Text style={styles.metaText}>{meal.cookTime}</Text>
                        </View>
                        <Text style={styles.caloriesText}>{meal.calories} cal</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity 
                    style={styles.emptyMealSlot}
                    onPress={() => {
                      setSelectedMealType(mealType);
                      setShowAddMeal(true);
                    }}>
                    <Plus size={24} color="#C4C4C4" />
                    <Text style={styles.emptyMealText}>Add {mealType.toLowerCase()}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Weekly Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Weekly Summary</Text>
          <View style={styles.summaryCards}>
            <View style={styles.summaryCard}>
              <ChefHat size={20} color="#E07A5F" />
              <Text style={styles.summaryNumber}>12</Text>
              <Text style={styles.summaryLabel}>Meals Planned</Text>
            </View>
            <View style={styles.summaryCard}>
              <Users size={20} color="#3D5A80" />
              <Text style={styles.summaryNumber}>4</Text>
              <Text style={styles.summaryLabel}>Family Servings</Text>
            </View>
            <View style={styles.summaryCard}>
              <Calendar size={20} color="#F4A261" />
              <Text style={styles.summaryNumber}>2.5h</Text>
              <Text style={styles.summaryLabel}>Avg Cook Time</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Add Meal Modal */}
      <Modal
        visible={showAddMeal}
        animationType="slide"
        presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add {selectedMealType}</Text>
            <TouchableOpacity onPress={() => setShowAddMeal(false)}>
              <X size={24} color="#2C1810" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.suggestionsTitle}>Suggested Meals</Text>
            {suggestedMeals
              .filter(meal => meal.type === selectedMealType.toLowerCase())
              .map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={styles.suggestionCard}
                  onPress={() => addMealToPlan(meal, selectedDate, selectedMealType)}>
                  <Image source={{ uri: meal.image }} style={styles.suggestionImage} />
                  <View style={styles.suggestionInfo}>
                    <Text style={styles.suggestionName}>{meal.name}</Text>
                    <Text style={styles.suggestionRegion}>{meal.region}</Text>
                    <View style={styles.suggestionMeta}>
                      <Text style={styles.suggestionCalories}>{meal.calories} cal</Text>
                      <Text style={styles.suggestionTime}>{meal.cookTime}</Text>
                      <Text style={styles.suggestionDifficulty}>{meal.difficulty}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  aiButtonText: {
    color: '#F2CC8F',
    fontWeight: '600',
    fontSize: 14,
  },
  weekNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  content: {
    flex: 1,
  },
  weekCalendar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  dayCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  todayCard: {
    backgroundColor: '#E07A5F',
  },
  dayName: {
    fontSize: 12,
    color: '#8B7355',
    fontWeight: '600',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  dayCalories: {
    fontSize: 10,
    color: '#8B7355',
  },
  todayText: {
    color: '#FFFFFF',
  },
  selectedDaySection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  selectedDayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 20,
  },
  mealSlot: {
    marginBottom: 20,
  },
  mealSlotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mealTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
  },
  addMealButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF8F3',
    borderWidth: 1,
    borderColor: '#E07A5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plannedMeal: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  plannedMealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  plannedMealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  plannedMealName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  plannedMealRegion: {
    fontSize: 12,
    color: '#E07A5F',
    marginBottom: 8,
  },
  plannedMealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  caloriesText: {
    fontSize: 12,
    color: '#3D5A80',
    fontWeight: '600',
  },
  emptyMealSlot: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMealText: {
    fontSize: 14,
    color: '#C4C4C4',
    marginTop: 8,
  },
  summarySection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 16,
  },
  suggestionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  suggestionImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  suggestionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  suggestionRegion: {
    fontSize: 12,
    color: '#E07A5F',
    marginBottom: 8,
  },
  suggestionMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  suggestionCalories: {
    fontSize: 12,
    color: '#3D5A80',
    fontWeight: '600',
  },
  suggestionTime: {
    fontSize: 12,
    color: '#8B7355',
  },
  suggestionDifficulty: {
    fontSize: 12,
    color: '#F4A261',
    fontWeight: '600',
  },
});