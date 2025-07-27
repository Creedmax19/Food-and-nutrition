import React, { useState, useEffect } from 'react';
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
import { Play, Pause, RotateCcw, Timer, ChefHat, Volume2, VolumeX, ArrowLeft, ArrowRight, CircleCheck as CheckCircle, CircleAlert as AlertCircle, X } from 'lucide-react-native';

export default function CookingScreen() {
  const [activeRecipe, setActiveRecipe] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [showCookingModal, setShowCookingModal] = useState(false);

  const [currentRecipes] = useState([
    {
      id: 1,
      name: 'Jollof Rice with Chicken',
      image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg',
      totalTime: '45 min',
      difficulty: 'Medium',
      servings: 6,
      region: 'West Africa',
      steps: [
        {
          id: 1,
          title: 'Prepare the Chicken',
          description: 'Season chicken pieces with salt, pepper, curry powder, and thyme. Let marinate for 15 minutes.',
          duration: 15,
          tips: 'For best flavor, marinate the chicken for at least 30 minutes if you have time.',
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'
        },
        {
          id: 2,
          title: 'Brown the Chicken',
          description: 'Heat oil in a large pot and brown the chicken pieces on all sides. Remove and set aside.',
          duration: 10,
          tips: 'Don\'t overcrowd the pot. Brown in batches if necessary for even cooking.',
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'
        },
        {
          id: 3,
          title: 'Prepare the Base',
          description: 'In the same pot, sauté onions until translucent. Add tomato paste and cook for 2 minutes.',
          duration: 5,
          tips: 'Cooking the tomato paste removes the raw taste and deepens the flavor.',
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'
        },
        {
          id: 4,
          title: 'Add Tomatoes and Spices',
          description: 'Add blended tomatoes, bay leaves, curry powder, and thyme. Cook for 10 minutes.',
          duration: 10,
          tips: 'Let the tomato mixture reduce to concentrate the flavors.',
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'
        },
        {
          id: 5,
          title: 'Cook the Rice',
          description: 'Add rice and chicken stock. Bring to boil, then reduce heat and simmer covered for 25 minutes.',
          duration: 25,
          tips: 'Don\'t lift the lid during cooking to maintain steam and even cooking.',
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'
        },
        {
          id: 6,
          title: 'Final Assembly',
          description: 'Add chicken back to the pot and cook for 10 more minutes. Let rest for 5 minutes before serving.',
          duration: 15,
          tips: 'Letting it rest allows the flavors to meld and the rice to finish absorbing moisture.',
          image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg'
        }
      ],
      culturalNote: 'Jollof Rice is a beloved dish across West Africa, with each country having its own special variation. In Nigeria, it\'s often served at celebrations and family gatherings.'
    },
    {
      id: 2,
      name: 'Moroccan Tagine',
      image: 'https://images.pexels.com/photos/6419733/pexels-photo-6419733.jpeg',
      totalTime: '2 hours',
      difficulty: 'Medium',
      servings: 6,
      region: 'North Africa',
      steps: [
        {
          id: 1,
          title: 'Prepare the Meat',
          description: 'Cut lamb into chunks and season with salt, pepper, and ras el hanout spice blend.',
          duration: 10,
          tips: 'Ras el hanout is a complex spice blend that gives tagine its distinctive flavor.',
          image: 'https://images.pexels.com/photos/6419733/pexels-photo-6419733.jpeg'
        },
        {
          id: 2,
          title: 'Brown the Meat',
          description: 'Heat oil in tagine or heavy pot and brown meat on all sides.',
          duration: 15,
          tips: 'Browning creates a rich base flavor for the stew.',
          image: 'https://images.pexels.com/photos/6419733/pexels-photo-6419733.jpeg'
        },
        {
          id: 3,
          title: 'Add Aromatics',
          description: 'Add onions, garlic, ginger, and cinnamon stick. Cook until fragrant.',
          duration: 5,
          tips: 'The aromatics form the flavor foundation of the tagine.',
          image: 'https://images.pexels.com/photos/6419733/pexels-photo-6419733.jpeg'
        },
        {
          id: 4,
          title: 'Slow Cook',
          description: 'Add liquid, cover and simmer on low heat for 1.5 hours until meat is tender.',
          duration: 90,
          tips: 'Low and slow cooking is key to tender, flavorful meat.',
          image: 'https://images.pexels.com/photos/6419733/pexels-photo-6419733.jpeg'
        },
        {
          id: 5,
          title: 'Add Fruits and Nuts',
          description: 'Add dried apricots and almonds. Cook for 15 more minutes.',
          duration: 15,
          tips: 'The dried fruits add sweetness that balances the savory spices.',
          image: 'https://images.pexels.com/photos/6419733/pexels-photo-6419733.jpeg'
        },
        {
          id: 6,
          title: 'Garnish and Serve',
          description: 'Garnish with fresh cilantro and preserved lemons. Serve with couscous.',
          duration: 5,
          tips: 'Preserved lemons add a unique tangy flavor that\'s essential to authentic tagine.',
          image: 'https://images.pexels.com/photos/6419733/pexels-photo-6419733.jpeg'
        }
      ],
      culturalNote: 'Tagine cooking dates back centuries in Morocco. The conical lid of the tagine pot creates a unique steam circulation that keeps the food moist and flavorful.'
    }
  ]);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => {
          if (time <= 1) {
            setIsTimerRunning(false);
            // Timer finished - could trigger notification here
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isTimerRunning) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  const startCooking = (recipe) => {
    setActiveRecipe(recipe);
    setCurrentStep(0);
    setShowCookingModal(true);
    setTimeRemaining(recipe.steps[0].duration * 60); // Convert to seconds
  };

  const nextStep = () => {
    if (currentStep < activeRecipe.steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setTimeRemaining(activeRecipe.steps[newStep].duration * 60);
      setIsTimerRunning(false);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      setTimeRemaining(activeRecipe.steps[newStep].duration * 60);
      setIsTimerRunning(false);
    }
  };

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeRemaining(activeRecipe.steps[currentStep].duration * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!activeRecipe) return 0;
    return ((currentStep + 1) / activeRecipe.steps.length) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#F4A261', '#E07A5F']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.headerTitle}>Cooking Assistant</Text>
        <Text style={styles.headerSubtitle}>Step-by-step guidance for perfect results</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Active Cooking Session */}
        {activeRecipe && (
          <View style={styles.activeSession}>
            <Text style={styles.sectionTitle}>Currently Cooking</Text>
            <TouchableOpacity 
              style={styles.activeRecipeCard}
              onPress={() => setShowCookingModal(true)}>
              <Image source={{ uri: activeRecipe.image }} style={styles.activeRecipeImage} />
              <View style={styles.activeRecipeInfo}>
                <Text style={styles.activeRecipeName}>{activeRecipe.name}</Text>
                <Text style={styles.activeRecipeStep}>
                  Step {currentStep + 1} of {activeRecipe.steps.length}
                </Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} 
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.resumeButton}>
                <Play size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        {/* Recipe Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ready to Cook</Text>
          <Text style={styles.sectionSubtitle}>
            Select a recipe to start your guided cooking experience
          </Text>

          {currentRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              style={styles.recipeCard}
              onPress={() => startCooking(recipe)}>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <View style={styles.recipeInfo}>
                <Text style={styles.recipeName}>{recipe.name}</Text>
                <Text style={styles.recipeRegion}>{recipe.region}</Text>
                
                <View style={styles.recipeMeta}>
                  <View style={styles.metaItem}>
                    <Timer size={14} color="#8B7355" />
                    <Text style={styles.metaText}>{recipe.totalTime}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <ChefHat size={14} color="#8B7355" />
                    <Text style={styles.metaText}>{recipe.difficulty}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaText}>{recipe.servings} servings</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.startButton}>
                  <Play size={16} color="#FFFFFF" />
                  <Text style={styles.startButtonText}>Start Cooking</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Cooking Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cooking Tips</Text>
          
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>🔥 Heat Control</Text>
            <Text style={styles.tipText}>
              Most African dishes benefit from starting with high heat to develop flavors, 
              then reducing to low heat for slow cooking.
            </Text>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>🧂 Seasoning</Text>
            <Text style={styles.tipText}>
              Taste and adjust seasoning throughout cooking. African cuisine relies on 
              building layers of flavor at each step.
            </Text>
          </View>

          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>⏰ Timing</Text>
            <Text style={styles.tipText}>
              Use our built-in timers for each step, but trust your senses too. 
              Cooking times can vary based on your equipment and ingredients.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Cooking Modal */}
      <Modal
        visible={showCookingModal}
        animationType="slide"
        presentationStyle="fullScreen">
        {activeRecipe && (
          <View style={styles.cookingModal}>
            {/* Modal Header */}
            <LinearGradient
              colors={['#3D5A80', '#264653']}
              style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowCookingModal(false)}>
                <X size={24} color="#FFFFFF" />
              </TouchableOpacity>
              
              <View style={styles.modalHeaderInfo}>
                <Text style={styles.modalRecipeName}>{activeRecipe.name}</Text>
                <Text style={styles.modalStepInfo}>
                  Step {currentStep + 1} of {activeRecipe.steps.length}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.soundButton}
                onPress={() => setIsSoundEnabled(!isSoundEnabled)}>
                {isSoundEnabled ? 
                  <Volume2 size={24} color="#FFFFFF" /> : 
                  <VolumeX size={24} color="#FFFFFF" />
                }
              </TouchableOpacity>
            </LinearGradient>

            {/* Progress Bar */}
            <View style={styles.modalProgressContainer}>
              <View style={styles.modalProgressBar}>
                <View 
                  style={[styles.modalProgressFill, { width: `${getProgressPercentage()}%` }]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.round(getProgressPercentage())}% Complete
              </Text>
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Current Step */}
              <View style={styles.currentStep}>
                <Image 
                  source={{ uri: activeRecipe.steps[currentStep].image }} 
                  style={styles.stepImage} 
                />
                
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>
                    {activeRecipe.steps[currentStep].title}
                  </Text>
                  <Text style={styles.stepDescription}>
                    {activeRecipe.steps[currentStep].description}
                  </Text>
                  
                  {/* Timer */}
                  <View style={styles.timerContainer}>
                    <View style={styles.timerDisplay}>
                      <Timer size={24} color="#E07A5F" />
                      <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
                    </View>
                    
                    <View style={styles.timerControls}>
                      <TouchableOpacity style={styles.timerButton} onPress={toggleTimer}>
                        {isTimerRunning ? 
                          <Pause size={20} color="#FFFFFF" /> : 
                          <Play size={20} color="#FFFFFF" />
                        }
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.timerButton} onPress={resetTimer}>
                        <RotateCcw size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Tip */}
                  <View style={styles.tipContainer}>
                    <AlertCircle size={16} color="#F4A261" />
                    <Text style={styles.tipText}>
                      {activeRecipe.steps[currentStep].tips}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Cultural Note */}
              {currentStep === activeRecipe.steps.length - 1 && (
                <View style={styles.culturalNote}>
                  <Text style={styles.culturalNoteTitle}>🌍 Cultural Context</Text>
                  <Text style={styles.culturalNoteText}>
                    {activeRecipe.culturalNote}
                  </Text>
                </View>
              )}
            </ScrollView>

            {/* Navigation Controls */}
            <View style={styles.navigationControls}>
              <TouchableOpacity
                style={[styles.navButton, currentStep === 0 && styles.disabledButton]}
                onPress={previousStep}
                disabled={currentStep === 0}>
                <ArrowLeft size={20} color={currentStep === 0 ? "#C4C4C4" : "#FFFFFF"} />
                <Text style={[styles.navButtonText, currentStep === 0 && styles.disabledText]}>
                  Previous
                </Text>
              </TouchableOpacity>

              {currentStep === activeRecipe.steps.length - 1 ? (
                <TouchableOpacity style={styles.finishButton}>
                  <CheckCircle size={20} color="#FFFFFF" />
                  <Text style={styles.finishButtonText}>Finish Cooking</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.navButton} onPress={nextStep}>
                  <Text style={styles.navButtonText}>Next</Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>
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
  content: {
    flex: 1,
  },
  activeSession: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 16,
  },
  activeRecipeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#E07A5F',
  },
  activeRecipeImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  activeRecipeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  activeRecipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  activeRecipeStep: {
    fontSize: 12,
    color: '#8B7355',
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#E07A5F',
    borderRadius: 2,
  },
  resumeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E07A5F',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  recipeCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  recipeImage: {
    width: 120,
    height: 120,
  },
  recipeInfo: {
    flex: 1,
    padding: 16,
  },
  recipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  recipeRegion: {
    fontSize: 12,
    color: '#E07A5F',
    marginBottom: 12,
  },
  recipeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
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
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E07A5F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    gap: 4,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F2CC8F',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipTitle: {
    fontSize: 14,
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
  cookingModal: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalHeaderInfo: {
    flex: 1,
    alignItems: 'center',
  },
  modalRecipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  modalStepInfo: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  soundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalProgressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  modalProgressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  modalProgressFill: {
    height: '100%',
    backgroundColor: '#E07A5F',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#8B7355',
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  currentStep: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  stepImage: {
    width: '100%',
    height: 200,
  },
  stepContent: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: '#2C1810',
    lineHeight: 24,
    marginBottom: 20,
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF8F3',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  timerDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E07A5F',
  },
  timerControls: {
    flexDirection: 'row',
    gap: 8,
  },
  timerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E07A5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F2CC8F',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  culturalNote: {
    backgroundColor: '#3D5A80',
    borderRadius: 16,
    padding: 20,
    marginVertical: 16,
  },
  culturalNoteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  culturalNoteText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    opacity: 0.9,
  },
  navigationControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E07A5F',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#C4C4C4',
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  finishButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});