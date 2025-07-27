import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import AuthScreen from '@/components/AuthScreen';
import OnboardingScreen from '@/components/OnboardingScreen';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function IndexScreen() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  const handleAuthComplete = () => {
    // Auth context will handle the state update
  };

  const handleOnboardingComplete = () => {
    // Auth context will handle the state update
  };

  if (isLoading) {
    return <View style={styles.container} />;
  }

  if (!isAuthenticated) {
    return <AuthScreen onAuthComplete={handleAuthComplete} />;
  }

  if (!user?.profile?.onboarding_completed) {
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