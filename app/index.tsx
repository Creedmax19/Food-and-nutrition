import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AuthScreen from '@/components/AuthScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import { Redirect } from 'expo-router';

export default function IndexScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking authentication and onboarding status
    // In a real app, you would check AsyncStorage or your auth provider
    const checkAuthStatus = async () => {
      try {
        // Simulate API call or storage check
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For demo purposes, we'll start with unauthenticated state
        setIsAuthenticated(false);
        setHasCompletedOnboarding(false);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const handleAuthComplete = () => {
    setIsAuthenticated(true);
  };

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  if (isLoading) {
    return <View style={styles.container} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthComplete={handleAuthComplete} />;
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  // User is authenticated and has completed onboarding, redirect to main app
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
  },
});