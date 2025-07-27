import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

interface AuthScreenProps {
  onAuthComplete: () => void;
}

export default function AuthScreen({ onAuthComplete }: AuthScreenProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const { login, register } = useAuth();

  const handleAuth = async () => {
    if (loading) return;
    
    // Basic validation
    if (!formData.email || !formData.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    try {
      setLoading(true);
      
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          username: formData.email, // Using email as username
          email: formData.email,
          password: formData.password,
          password_confirm: formData.password, // Use the same password for confirmation
          first_name: formData.name.split(' ')[0] || '',
          last_name: formData.name.split(' ').slice(1).join(' ') || '',
        });
      }
      
      onAuthComplete();
    } catch (error: any) {
      console.error('Auth error:', error);
      let errorMessage = 'An error occurred during authentication';
      
      // Handle API validation errors
      if (error.response) {
        // Server responded with an error status
        const errorData = error.response.data;
        if (typeof errorData === 'object' && errorData !== null) {
          // If the error is an object with field errors
          const errorMessages = Object.entries(errorData)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(', ')}`;
              }
              return `${field}: ${errors}`;
            })
            .join('\n');
          errorMessage = `Validation Error:\n${errorMessages}`;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.request) {
        // Request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      } else if (error.message) {
        // Something happened in setting up the request
        errorMessage = error.message;
      }
      
      Alert.alert('Authentication Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient
        colors={['#E07A5F', '#F4A261']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          
          {/* Logo and Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🍽️</Text>
            </View>
            <Text style={styles.appName}>ChopLocker</Text>
            <Text style={styles.tagline}>
              Discover the rich flavors of African cuisine
            </Text>
          </View>

          {/* Auth Form */}
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.formTitle}>
                {isLogin ? 'Welcome Back!' : 'Join Our Community'}
              </Text>
              <Text style={styles.formSubtitle}>
                {isLogin 
                  ? 'Sign in to continue your culinary journey' 
                  : 'Start exploring authentic African recipes'
                }
              </Text>
            </View>

            <View style={styles.form}>
              {!isLogin && (
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <User size={20} color="#8B7355" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#8B7355"
                      value={formData.name}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Mail size={20} color="#8B7355" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#8B7355"
                    value={formData.email}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Lock size={20} color="#8B7355" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#8B7355"
                    value={formData.password}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? 
                      <EyeOff size={20} color="#8B7355" /> : 
                      <Eye size={20} color="#8B7355" />
                    }
                  </TouchableOpacity>
                </View>
              </View>

              {!isLogin && (
                <View style={styles.inputContainer}>
                  <View style={styles.inputWrapper}>
                    <Lock size={20} color="#8B7355" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor="#8B7355"
                      value={formData.confirmPassword}
                      onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                      secureTextEntry={!showPassword}
                    />
                  </View>
                </View>
              )}

              {isLogin && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.authButton} onPress={handleAuth}>
                <LinearGradient
                  colors={['#3D5A80', '#264653']}
                  style={styles.authButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}>
                  <Text style={styles.authButtonText}>
                    {loading 
                      ? (isLogin ? 'Signing In...' : 'Creating Account...') 
                      : (isLogin ? 'Sign In' : 'Create Account')
                    }
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <View style={styles.switchAuth}>
                <Text style={styles.switchAuthText}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </Text>
                <TouchableOpacity onPress={toggleAuthMode}>
                  <Text style={styles.switchAuthLink}>
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Features Preview */}
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>What awaits you:</Text>
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🤖</Text>
                <Text style={styles.featureText}>AI-powered meal planning</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📚</Text>
                <Text style={styles.featureText}>Authentic African recipes</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🛒</Text>
                <Text style={styles.featureText}>Smart shopping lists</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>👨‍🍳</Text>
                <Text style={styles.featureText}>Step-by-step cooking guides</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 40,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#2C1810',
    opacity: 0.8,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  formHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#8B7355',
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F3',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2C1810',
  },
  eyeButton: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#E07A5F',
    fontWeight: '600',
  },
  authButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  authButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#8B7355',
  },
  socialButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  socialButtonText: {
    fontSize: 16,
    color: '#2C1810',
    fontWeight: '600',
  },
  switchAuth: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  switchAuthText: {
    fontSize: 14,
    color: '#8B7355',
  },
  switchAuthLink: {
    fontSize: 14,
    color: '#E07A5F',
    fontWeight: '600',
  },
  featuresContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
    textAlign: 'center',
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureIcon: {
    fontSize: 20,
  },
  featureText: {
    fontSize: 14,
    color: '#2C1810',
    opacity: 0.8,
  },
});