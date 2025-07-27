import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check,
  User,
  Target,
  ChefHat,
  Users,
  Heart,
  MapPin
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    personalInfo: {
      height: '',
      weight: '',
      age: '',
      gender: '',
    },
    healthConditions: [],
    allergies: [],
    dietaryPreferences: [],
    fitnessGoals: [],
    cookingLevel: '',
    familySize: 1,
    location: '',
  });
  
  const { completeOnboarding } = useAuth();

  const steps = [
    {
      id: 'personal',
      title: 'Tell us about yourself',
      subtitle: 'Help us personalize your experience',
      icon: User,
    },
    {
      id: 'health',
      title: 'Health & Wellness',
      subtitle: 'Share your health goals and conditions',
      icon: Heart,
    },
    {
      id: 'dietary',
      title: 'Dietary Preferences',
      subtitle: 'What foods do you love or avoid?',
      icon: Target,
    },
    {
      id: 'cooking',
      title: 'Cooking Experience',
      subtitle: 'How comfortable are you in the kitchen?',
      icon: ChefHat,
    },
    {
      id: 'family',
      title: 'Family & Location',
      subtitle: 'Help us suggest the right portions and local ingredients',
      icon: Users,
    },
  ];

  const healthConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'High Cholesterol',
    'Kidney Disease', 'Liver Disease', 'Thyroid Issues', 'None'
  ];

  const allergies = [
    'Peanuts', 'Tree Nuts', 'Shellfish', 'Fish', 'Eggs', 'Dairy',
    'Soy', 'Wheat/Gluten', 'Sesame', 'None'
  ];

  const dietaryPreferences = [
    'Vegetarian', 'Vegan', 'Pescatarian', 'Halal', 'Kosher',
    'Low Carb', 'Keto', 'Paleo', 'Mediterranean', 'No Restrictions'
  ];

  const fitnessGoals = [
    'Weight Loss', 'Weight Gain', 'Muscle Building', 'Heart Health',
    'Diabetes Management', 'General Wellness', 'Athletic Performance'
  ];

  const cookingLevels = [
    { id: 'beginner', label: 'Beginner', description: 'I\'m just starting out' },
    { id: 'intermediate', label: 'Intermediate', description: 'I can follow recipes well' },
    { id: 'advanced', label: 'Advanced', description: 'I love experimenting in the kitchen' },
    { id: 'expert', label: 'Expert', description: 'I could teach others to cook' }
  ];

  const genders = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCompleteOnboarding();
    }
  };
  
  const handleCompleteOnboarding = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      // Prepare onboarding data
      // Ensure all required fields have values
      const onboardingData = {
        height: parseFloat(userData.personalInfo.height) || 170, // Default height
        weight: parseFloat(userData.personalInfo.weight) || 70,  // Default weight
        age: parseInt(userData.personalInfo.age) || 30,          // Default age
        gender: userData.personalInfo.gender ? userData.personalInfo.gender.charAt(0).toUpperCase() : 'O',  // First letter uppercase for backend validation
        cooking_level: userData.cookingLevel || 'beginner',      // Default cooking level
        family_size: userData.familySize || 1,                   // Default family size
        location: userData.location || 'Unknown',                // Default location
        activity_level: 'moderate',                              // Default activity level
        // Initialize empty arrays for optional fields
        health_condition_ids: [],
        allergy_ids: [],
        dietary_preference_ids: [],
        fitness_goal_ids: [],
      };
      
      await completeOnboarding(onboardingData);
      onComplete();
    } catch (error) {
      Alert.alert(
        'Onboarding Error',
        error instanceof Error ? error.message : 'Failed to complete onboarding'
      );
    } finally {
      setLoading(false);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleSelection = (category: string, item: string) => {
    setUserData(prev => ({
      ...prev,
      [category]: prev[category].includes(item)
        ? prev[category].filter(i => i !== item)
        : [...prev[category], item]
    }));
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setUserData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const renderPersonalInfoStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Height (cm)</Text>
        <TextInput
          style={styles.textInput}
          value={userData.personalInfo.height}
          onChangeText={(value) => updatePersonalInfo('height', value)}
          placeholder="170"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Weight (kg)</Text>
        <TextInput
          style={styles.textInput}
          value={userData.personalInfo.weight}
          onChangeText={(value) => updatePersonalInfo('weight', value)}
          placeholder="70"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Age</Text>
        <TextInput
          style={styles.textInput}
          value={userData.personalInfo.age}
          onChangeText={(value) => updatePersonalInfo('age', value)}
          placeholder="25"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Gender</Text>
        <View style={styles.optionsGrid}>
          {genders.map((gender) => (
            <TouchableOpacity
              key={gender}
              style={[
                styles.optionButton,
                userData.personalInfo.gender === gender && styles.selectedOption
              ]}
              onPress={() => updatePersonalInfo('gender', gender)}>
              <Text style={[
                styles.optionText,
                userData.personalInfo.gender === gender && styles.selectedOptionText
              ]}>
                {gender}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderHealthStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Health Conditions</Text>
        <Text style={styles.sectionSubtitle}>Select any that apply to you</Text>
        <View style={styles.optionsGrid}>
          {healthConditions.map((condition) => (
            <TouchableOpacity
              key={condition}
              style={[
                styles.optionButton,
                userData.healthConditions.includes(condition) && styles.selectedOption
              ]}
              onPress={() => toggleSelection('healthConditions', condition)}>
              <Text style={[
                styles.optionText,
                userData.healthConditions.includes(condition) && styles.selectedOptionText
              ]}>
                {condition}
              </Text>
              {userData.healthConditions.includes(condition) && (
                <Check size={16} color="#FFFFFF" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Allergies</Text>
        <Text style={styles.sectionSubtitle}>Let us know what to avoid</Text>
        <View style={styles.optionsGrid}>
          {allergies.map((allergy) => (
            <TouchableOpacity
              key={allergy}
              style={[
                styles.optionButton,
                userData.allergies.includes(allergy) && styles.selectedOption
              ]}
              onPress={() => toggleSelection('allergies', allergy)}>
              <Text style={[
                styles.optionText,
                userData.allergies.includes(allergy) && styles.selectedOptionText
              ]}>
                {allergy}
              </Text>
              {userData.allergies.includes(allergy) && (
                <Check size={16} color="#FFFFFF" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderDietaryStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Dietary Preferences</Text>
        <Text style={styles.sectionSubtitle}>Choose your eating style</Text>
        <View style={styles.optionsGrid}>
          {dietaryPreferences.map((preference) => (
            <TouchableOpacity
              key={preference}
              style={[
                styles.optionButton,
                userData.dietaryPreferences.includes(preference) && styles.selectedOption
              ]}
              onPress={() => toggleSelection('dietaryPreferences', preference)}>
              <Text style={[
                styles.optionText,
                userData.dietaryPreferences.includes(preference) && styles.selectedOptionText
              ]}>
                {preference}
              </Text>
              {userData.dietaryPreferences.includes(preference) && (
                <Check size={16} color="#FFFFFF" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Fitness Goals</Text>
        <Text style={styles.sectionSubtitle}>What are you working towards?</Text>
        <View style={styles.optionsGrid}>
          {fitnessGoals.map((goal) => (
            <TouchableOpacity
              key={goal}
              style={[
                styles.optionButton,
                userData.fitnessGoals.includes(goal) && styles.selectedOption
              ]}
              onPress={() => toggleSelection('fitnessGoals', goal)}>
              <Text style={[
                styles.optionText,
                userData.fitnessGoals.includes(goal) && styles.selectedOptionText
              ]}>
                {goal}
              </Text>
              {userData.fitnessGoals.includes(goal) && (
                <Check size={16} color="#FFFFFF" style={styles.checkIcon} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderCookingStep = () => (
    <View style={styles.stepContent}>
      <Text style={styles.sectionTitle}>What's your cooking experience?</Text>
      <Text style={styles.sectionSubtitle}>This helps us suggest appropriate recipes</Text>
      
      <View style={styles.cookingLevels}>
        {cookingLevels.map((level) => (
          <TouchableOpacity
            key={level.id}
            style={[
              styles.levelCard,
              userData.cookingLevel === level.id && styles.selectedLevelCard
            ]}
            onPress={() => setUserData(prev => ({ ...prev, cookingLevel: level.id }))}>
            <View style={styles.levelHeader}>
              <Text style={[
                styles.levelTitle,
                userData.cookingLevel === level.id && styles.selectedLevelText
              ]}>
                {level.label}
              </Text>
              {userData.cookingLevel === level.id && (
                <Check size={20} color="#E07A5F" />
              )}
            </View>
            <Text style={[
              styles.levelDescription,
              userData.cookingLevel === level.id && styles.selectedLevelDescription
            ]}>
              {level.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFamilyStep = () => (
    <View style={styles.stepContent}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Family Size</Text>
        <Text style={styles.inputSubtitle}>How many people do you usually cook for?</Text>
        <View style={styles.familySizeContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.familySizeButton,
                userData.familySize === size && styles.selectedFamilySize
              ]}
              onPress={() => setUserData(prev => ({ ...prev, familySize: size }))}>
              <Text style={[
                styles.familySizeText,
                userData.familySize === size && styles.selectedFamilySizeText
              ]}>
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Location</Text>
        <Text style={styles.inputSubtitle}>Help us suggest local ingredients and markets</Text>
        <TextInput
          style={styles.textInput}
          value={userData.location}
          onChangeText={(value) => setUserData(prev => ({ ...prev, location: value }))}
          placeholder="e.g., Lagos, Nigeria"
        />
      </View>
    </View>
  );

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case 'personal':
        return renderPersonalInfoStep();
      case 'health':
        return renderHealthStep();
      case 'dietary':
        return renderDietaryStep();
      case 'cooking':
        return renderCookingStep();
      case 'family':
        return renderFamilyStep();
      default:
        return null;
    }
  };

  const IconComponent = steps[currentStep].icon;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E07A5F', '#F4A261']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep + 1) / steps.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {steps.length}
          </Text>
        </View>

        {/* Step Header */}
        <View style={styles.stepHeader}>
          <View style={styles.iconContainer}>
            <IconComponent size={32} color="#2C1810" />
          </View>
          <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
          <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStepContent()}
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, styles.backButton, currentStep === 0 && styles.disabledButton]}
          onPress={previousStep}
          disabled={currentStep === 0}>
          <ArrowLeft size={20} color={currentStep === 0 ? "#C4C4C4" : "#8B7355"} />
          <Text style={[styles.navButtonText, currentStep === 0 && styles.disabledText]}>
            Back
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={nextStep}>
          <Text style={styles.navButtonText}>
            {currentStep === steps.length - 1 
              ? (loading ? 'Setting up...' : 'Get Started')
              : 'Next'
            }
          </Text>
          <ArrowRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2C1810',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#2C1810',
    opacity: 0.8,
    textAlign: 'center',
  },
  stepHeader: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#2C1810',
    opacity: 0.8,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepContent: {
    paddingBottom: 100,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 4,
  },
  inputSubtitle: {
    fontSize: 14,
    color: '#8B7355',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minWidth: (width - 64) / 2,
    justifyContent: 'center',
  },
  selectedOption: {
    backgroundColor: '#E07A5F',
    borderColor: '#E07A5F',
  },
  optionText: {
    fontSize: 14,
    color: '#2C1810',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  checkIcon: {
    marginLeft: 8,
  },
  cookingLevels: {
    gap: 16,
  },
  levelCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  selectedLevelCard: {
    borderColor: '#E07A5F',
    backgroundColor: '#FFF8F3',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  selectedLevelText: {
    color: '#E07A5F',
  },
  levelDescription: {
    fontSize: 14,
    color: '#8B7355',
  },
  selectedLevelDescription: {
    color: '#2C1810',
  },
  familySizeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  familySizeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFamilySize: {
    backgroundColor: '#E07A5F',
    borderColor: '#E07A5F',
  },
  familySizeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
  },
  selectedFamilySizeText: {
    color: '#FFFFFF',
  },
  navigation: {
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
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#C4C4C4',
  },
});