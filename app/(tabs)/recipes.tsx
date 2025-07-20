import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search,
  Filter,
  Star,
  Clock,
  Users,
  ChefHat,
  MapPin,
  Heart,
  BookOpen,
  Play,
  X
} from 'lucide-react-native';

export default function RecipesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [favorites, setFavorites] = useState(new Set([1, 3, 5]));

  const categories = [
    'All', 'West Africa', 'East Africa', 'North Africa', 'Southern Africa', 'Vegetarian', 'Quick Meals'
  ];

  const [recipes] = useState([
    {
      id: 1,
      name: 'Jollof Rice',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
      region: 'West Africa',
      country: 'Nigeria',
      rating: 4.8,
      reviews: 234,
      cookTime: '45 min',
      servings: 6,
      difficulty: 'Medium',
      calories: 420,
      description: 'A beloved West African dish with perfectly spiced rice, vegetables, and your choice of protein.',
      ingredients: [
        '2 cups jasmine rice',
        '1 lb chicken, cut into pieces',
        '1 large onion, diced',
        '3 tomatoes, blended',
        '2 tbsp tomato paste',
        '2 bay leaves',
        '1 tsp curry powder',
        '1 tsp thyme',
        'Salt and pepper to taste',
        '3 cups chicken stock'
      ],
      instructions: [
        'Season and brown the chicken pieces in a large pot',
        'Remove chicken and sauté onions until translucent',
        'Add tomato paste and cook for 2 minutes',
        'Add blended tomatoes and spices, cook for 10 minutes',
        'Add rice and stock, bring to boil',
        'Reduce heat, cover and simmer for 25 minutes',
        'Add chicken back and cook for 10 more minutes',
        'Let rest for 5 minutes before serving'
      ],
      tags: ['rice', 'chicken', 'one-pot', 'family-meal'],
      nutritionFacts: {
        protein: '25g',
        carbs: '65g',
        fat: '12g',
        fiber: '3g'
      }
    },
    {
      id: 2,
      name: 'Injera with Doro Wat',
      image: 'https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg',
      region: 'East Africa',
      country: 'Ethiopia',
      rating: 4.9,
      reviews: 189,
      cookTime: '3 hours',
      servings: 8,
      difficulty: 'Hard',
      calories: 520,
      description: 'Traditional Ethiopian sourdough flatbread served with spicy chicken stew.',
      ingredients: [
        '2 cups teff flour',
        '3 cups water',
        '1 whole chicken',
        '2 large onions',
        '4 tbsp berbere spice',
        '6 hard-boiled eggs',
        '1/4 cup niter kibbeh',
        'Ginger and garlic'
      ],
      instructions: [
        'Mix teff flour with water and let ferment for 3 days',
        'Cook injera batter on a mitad or non-stick pan',
        'Sauté onions until caramelized',
        'Add berbere spice and cook chicken',
        'Simmer with eggs for 1 hour',
        'Serve hot with injera'
      ],
      tags: ['traditional', 'fermented', 'spicy', 'cultural'],
      nutritionFacts: {
        protein: '35g',
        carbs: '45g',
        fat: '18g',
        fiber: '8g'
      }
    },
    {
      id: 3,
      name: 'Moroccan Tagine',
      image: 'https://images.pexels.com/photos/6419733/pexels-photo-6419733.jpeg',
      region: 'North Africa',
      country: 'Morocco',
      rating: 4.7,
      reviews: 156,
      cookTime: '2 hours',
      servings: 6,
      difficulty: 'Medium',
      calories: 380,
      description: 'Slow-cooked stew with tender meat, vegetables, and aromatic North African spices.',
      ingredients: [
        '2 lbs lamb shoulder',
        '2 onions, sliced',
        '1 cup dried apricots',
        '2 tsp ras el hanout',
        '1 cinnamon stick',
        '1/2 cup almonds',
        'Fresh cilantro',
        'Preserved lemons'
      ],
      instructions: [
        'Brown lamb in tagine or heavy pot',
        'Add onions and spices',
        'Add liquid and bring to simmer',
        'Cook covered for 1.5 hours',
        'Add apricots and almonds',
        'Garnish with herbs and serve'
      ],
      tags: ['slow-cooked', 'aromatic', 'dried-fruits', 'traditional'],
      nutritionFacts: {
        protein: '32g',
        carbs: '28g',
        fat: '15g',
        fiber: '6g'
      }
    },
    {
      id: 4,
      name: 'Bobotie',
      image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg',
      region: 'Southern Africa',
      country: 'South Africa',
      rating: 4.6,
      reviews: 98,
      cookTime: '1 hour',
      servings: 8,
      difficulty: 'Medium',
      calories: 450,
      description: 'South African spiced meat casserole with a golden egg topping.',
      ingredients: [
        '2 lbs ground beef',
        '2 onions, diced',
        '2 slices bread, soaked',
        '2 tbsp curry powder',
        '1/4 cup chutney',
        '3 eggs',
        '1 cup milk',
        'Bay leaves',
        'Almonds and raisins'
      ],
      instructions: [
        'Sauté onions and brown meat',
        'Add spices and bread mixture',
        'Transfer to baking dish',
        'Top with egg and milk mixture',
        'Bake until golden brown',
        'Serve with yellow rice'
      ],
      tags: ['casserole', 'spiced', 'comfort-food', 'baked'],
      nutritionFacts: {
        protein: '28g',
        carbs: '22g',
        fat: '24g',
        fiber: '2g'
      }
    },
    {
      id: 5,
      name: 'Thieboudienne',
      image: 'https://images.pexels.com/photos/5638732/pexels-photo-5638732.jpeg',
      region: 'West Africa',
      country: 'Senegal',
      rating: 4.9,
      reviews: 167,
      cookTime: '2.5 hours',
      servings: 10,
      difficulty: 'Hard',
      calories: 580,
      description: 'Senegal\'s national dish featuring fish, rice, and vegetables in a rich tomato sauce.',
      ingredients: [
        '2 lbs white fish',
        '3 cups broken rice',
        '1 large eggplant',
        '2 carrots',
        '1 cabbage',
        '4 tomatoes',
        '2 onions',
        'Tamarind paste',
        'Palm oil'
      ],
      instructions: [
        'Stuff fish with herbs and fry',
        'Make tomato base with vegetables',
        'Cook rice in the flavorful broth',
        'Layer fish and vegetables',
        'Simmer until rice is tender',
        'Serve family-style'
      ],
      tags: ['national-dish', 'fish', 'one-pot', 'celebration'],
      nutritionFacts: {
        protein: '35g',
        carbs: '72g',
        fat: '16g',
        fiber: '8g'
      }
    }
  ]);

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                           recipe.region === selectedCategory ||
                           (selectedCategory === 'Vegetarian' && recipe.tags.includes('vegetarian')) ||
                           (selectedCategory === 'Quick Meals' && parseInt(recipe.cookTime) <= 30);
    
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (recipeId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(recipeId)) {
      newFavorites.delete(recipeId);
    } else {
      newFavorites.add(recipeId);
    }
    setFavorites(newFavorites);
  };

  const openRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowRecipeModal(true);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      default: return '#8B7355';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#F4A261', '#E07A5F']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>African Recipes</Text>
        <Text style={styles.headerSubtitle}>Discover authentic flavors from across the continent</Text>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#8B7355" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes, regions, or ingredients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8B7355"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#E07A5F" />
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}>
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Recipes Grid */}
      <ScrollView style={styles.recipesContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.recipesGrid}>
          {filteredRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => openRecipe(recipe)}>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              
              {/* Recipe Overlay */}
              <View style={styles.recipeOverlay}>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(recipe.id)}>
                  <Heart 
                    size={16} 
                    color={favorites.has(recipe.id) ? "#E07A5F" : "#FFFFFF"} 
                    fill={favorites.has(recipe.id) ? "#E07A5F" : "transparent"}
                  />
                </TouchableOpacity>
                
                <View style={styles.ratingBadge}>
                  <Star size={12} color="#F2CC8F" fill="#F2CC8F" />
                  <Text style={styles.ratingText}>{recipe.rating}</Text>
                </View>
              </View>

              {/* Recipe Info */}
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeRegion}>{recipe.region} • {recipe.country}</Text>
                
                <View style={styles.recipeMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={12} color="#8B7355" />
                    <Text style={styles.metaText}>{recipe.cookTime}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Users size={12} color="#8B7355" />
                    <Text style={styles.metaText}>{recipe.servings}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <ChefHat size={12} color={getDifficultyColor(recipe.difficulty)} />
                    <Text style={[styles.metaText, { color: getDifficultyColor(recipe.difficulty) }]}>
                      {recipe.difficulty}
                    </Text>
                  </View>
                </View>

                <Text style={styles.caloriesText}>{recipe.calories} calories</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Recipe Detail Modal */}
      <Modal
        visible={showRecipeModal}
        animationType="slide"
        presentationStyle="pageSheet">
        {selectedRecipe && (
          <ScrollView style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Image source={{ uri: selectedRecipe.image }} style={styles.modalImage} />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.modalImageOverlay}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowRecipeModal(false)}>
                  <X size={24} color="#FFFFFF" />
                </TouchableOpacity>
                
                <View style={styles.modalHeaderInfo}>
                  <Text style={styles.modalRecipeName}>{selectedRecipe.name}</Text>
                  <Text style={styles.modalRecipeRegion}>
                    {selectedRecipe.region} • {selectedRecipe.country}
                  </Text>
                  
                  <View style={styles.modalRating}>
                    <Star size={16} color="#F2CC8F" fill="#F2CC8F" />
                    <Text style={styles.modalRatingText}>
                      {selectedRecipe.rating} ({selectedRecipe.reviews} reviews)
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* Recipe Details */}
            <View style={styles.modalContent}>
              {/* Quick Info */}
              <View style={styles.quickInfo}>
                <View style={styles.quickInfoItem}>
                  <Clock size={20} color="#E07A5F" />
                  <Text style={styles.quickInfoLabel}>Cook Time</Text>
                  <Text style={styles.quickInfoValue}>{selectedRecipe.cookTime}</Text>
                </View>
                <View style={styles.quickInfoItem}>
                  <Users size={20} color="#3D5A80" />
                  <Text style={styles.quickInfoLabel}>Servings</Text>
                  <Text style={styles.quickInfoValue}>{selectedRecipe.servings}</Text>
                </View>
                <View style={styles.quickInfoItem}>
                  <ChefHat size={20} color={getDifficultyColor(selectedRecipe.difficulty)} />
                  <Text style={styles.quickInfoLabel}>Difficulty</Text>
                  <Text style={[styles.quickInfoValue, { color: getDifficultyColor(selectedRecipe.difficulty) }]}>
                    {selectedRecipe.difficulty}
                  </Text>
                </View>
              </View>

              {/* Description */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About This Dish</Text>
                <Text style={styles.description}>{selectedRecipe.description}</Text>
              </View>

              {/* Nutrition Facts */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Nutrition Facts</Text>
                <View style={styles.nutritionGrid}>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{selectedRecipe.calories}</Text>
                    <Text style={styles.nutritionLabel}>Calories</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{selectedRecipe.nutritionFacts.protein}</Text>
                    <Text style={styles.nutritionLabel}>Protein</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{selectedRecipe.nutritionFacts.carbs}</Text>
                    <Text style={styles.nutritionLabel}>Carbs</Text>
                  </View>
                  <View style={styles.nutritionItem}>
                    <Text style={styles.nutritionValue}>{selectedRecipe.nutritionFacts.fat}</Text>
                    <Text style={styles.nutritionLabel}>Fat</Text>
                  </View>
                </View>
              </View>

              {/* Ingredients */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ingredients</Text>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.ingredientItem}>
                    <View style={styles.ingredientBullet} />
                    <Text style={styles.ingredientText}>{ingredient}</Text>
                  </View>
                ))}
              </View>

              {/* Instructions */}
              <View style={styles.section}>
                <View style={styles.instructionsHeader}>
                  <Text style={styles.sectionTitle}>Instructions</Text>
                  <TouchableOpacity style={styles.videoButton}>
                    <Play size={16} color="#FFFFFF" />
                    <Text style={styles.videoButtonText}>Watch Video</Text>
                  </TouchableOpacity>
                </View>
                
                {selectedRecipe.instructions.map((instruction, index) => (
                  <View key={index} style={styles.instructionItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.instructionText}>{instruction}</Text>
                  </View>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.primaryButton}>
                  <Text style={styles.primaryButtonText}>Start Cooking</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <BookOpen size={20} color="#E07A5F" />
                  <Text style={styles.secondaryButtonText}>Add to Meal Plan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        )}
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
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#2C1810',
    opacity: 0.8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2C1810',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoriesContainer: {
    maxHeight: 60,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedCategoryButton: {
    backgroundColor: '#E07A5F',
    borderColor: '#E07A5F',
  },
  categoryText: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  recipesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recipesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  recipeCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  recipeImage: {
    width: '100%',
    height: 120,
  },
  recipeOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  favoriteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBadge: {
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
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  metaText: {
    fontSize: 10,
    color: '#8B7355',
  },
  caloriesText: {
    fontSize: 12,
    color: '#3D5A80',
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  modalHeader: {
    height: 300,
    position: 'relative',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderInfo: {
    alignSelf: 'flex-start',
  },
  modalRecipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modalRecipeRegion: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 8,
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalRatingText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
  },
  quickInfo: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickInfoItem: {
    flex: 1,
    alignItems: 'center',
  },
  quickInfoLabel: {
    fontSize: 12,
    color: '#8B7355',
    marginTop: 4,
    marginBottom: 2,
  },
  quickInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#2C1810',
    lineHeight: 24,
    opacity: 0.8,
  },
  nutritionGrid: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  nutritionItem: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E07A5F',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#8B7355',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E07A5F',
    marginRight: 12,
  },
  ingredientText: {
    fontSize: 16,
    color: '#2C1810',
    flex: 1,
  },
  instructionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E07A5F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  videoButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E07A5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    fontSize: 16,
    color: '#2C1810',
    flex: 1,
    lineHeight: 24,
  },
  actionButtons: {
    gap: 12,
    marginTop: 20,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#E07A5F',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#E07A5F',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#E07A5F',
    fontSize: 16,
    fontWeight: '600',
  },
});