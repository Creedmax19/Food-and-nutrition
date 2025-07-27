import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Star, Clock, Users, ChefHat, Heart, Sparkles } from 'lucide-react-native';
import { useAIRecommendations } from '@/hooks/useAI';

interface AIRecommendationModalProps {
  visible: boolean;
  onClose: () => void;
  recommendation: any;
  recommendationId?: number;
}

export default function AIRecommendationModal({ 
  visible, 
  onClose, 
  recommendation,
  recommendationId 
}: AIRecommendationModalProps) {
  const [userRating, setUserRating] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const { provideFeedback } = useAIRecommendations();

  const handleRating = async (rating: number) => {
    setUserRating(rating);
    if (recommendationId) {
      await provideFeedback(recommendationId, { 
        rating, 
        was_helpful: rating >= 4 
      });
    }
    setShowFeedback(true);
  };

  const handleHelpfulFeedback = async (helpful: boolean) => {
    if (recommendationId) {
      await provideFeedback(recommendationId, { was_helpful: helpful });
    }
    setShowFeedback(true);
  };

  if (!recommendation) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={['#3D5A80', '#264653']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Sparkles size={24} color="#F2CC8F" />
              <Text style={styles.headerTitle}>AI Recommendation</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>AI Confidence</Text>
            <View style={styles.confidenceBar}>
              <View 
                style={[
                  styles.confidenceFill, 
                  { width: `${(recommendation.confidence || 0.8) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.confidenceText}>
              {Math.round((recommendation.confidence || 0.8) * 100)}% match
            </Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Recipe Details */}
          <View style={styles.recipeCard}>
            <Text style={styles.recipeName}>{recommendation.name}</Text>
            <Text style={styles.recipeRegion}>{recommendation.region} • {recommendation.cuisine}</Text>
            
            <View style={styles.recipeMeta}>
              <View style={styles.metaItem}>
                <Clock size={16} color="#E07A5F" />
                <Text style={styles.metaText}>
                  {(recommendation.prep_time || 0) + (recommendation.cook_time || 0)} min
                </Text>
              </View>
              <View style={styles.metaItem}>
                <ChefHat size={16} color="#3D5A80" />
                <Text style={styles.metaText}>{recommendation.difficulty}</Text>
              </View>
              <View style={styles.metaItem}>
                <Users size={16} color="#F4A261" />
                <Text style={styles.metaText}>4 servings</Text>
              </View>
            </View>

            <Text style={styles.recipeDescription}>
              {recommendation.description}
            </Text>
          </View>

          {/* Why Recommended */}
          {recommendation.why_recommended && (
            <View style={styles.whyCard}>
              <Text style={styles.whyTitle}>🎯 Why We Recommend This</Text>
              <Text style={styles.whyText}>{recommendation.why_recommended}</Text>
            </View>
          )}

          {/* Health Benefits */}
          {recommendation.health_benefits && recommendation.health_benefits.length > 0 && (
            <View style={styles.benefitsCard}>
              <Text style={styles.benefitsTitle}>💚 Health Benefits</Text>
              {recommendation.health_benefits.map((benefit: string, index: number) => (
                <View key={index} style={styles.benefitItem}>
                  <View style={styles.benefitBullet} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Cultural Significance */}
          {recommendation.cultural_significance && (
            <View style={styles.culturalCard}>
              <Text style={styles.culturalTitle}>🌍 Cultural Significance</Text>
              <Text style={styles.culturalText}>{recommendation.cultural_significance}</Text>
            </View>
          )}

          {/* Feedback Section */}
          <View style={styles.feedbackCard}>
            <Text style={styles.feedbackTitle}>How helpful was this recommendation?</Text>
            
            {!showFeedback ? (
              <>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      style={styles.starButton}
                      onPress={() => handleRating(star)}>
                      <Star
                        size={32}
                        color={star <= userRating ? "#F2CC8F" : "#E0E0E0"}
                        fill={star <= userRating ? "#F2CC8F" : "transparent"}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.helpfulButtons}>
                  <TouchableOpacity
                    style={styles.helpfulButton}
                    onPress={() => handleHelpfulFeedback(true)}>
                    <Text style={styles.helpfulButtonText}>👍 Helpful</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.helpfulButton}
                    onPress={() => handleHelpfulFeedback(false)}>
                    <Text style={styles.helpfulButtonText}>👎 Not Helpful</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.thankYouContainer}>
                <Text style={styles.thankYouText}>
                  Thank you for your feedback! This helps us improve our recommendations.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.saveButton}>
            <Heart size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Recipe</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cookButton}>
            <ChefHat size={20} color="#FFFFFF" />
            <Text style={styles.cookButtonText}>Start Cooking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  confidenceBar: {
    width: 200,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  confidenceFill: {
    height: '100%',
    backgroundColor: '#F2CC8F',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 14,
    color: '#F2CC8F',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recipeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 4,
  },
  recipeRegion: {
    fontSize: 14,
    color: '#E07A5F',
    marginBottom: 16,
  },
  recipeMeta: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF8F3',
    borderRadius: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#8B7355',
    fontWeight: '600',
  },
  recipeDescription: {
    fontSize: 16,
    color: '#2C1810',
    lineHeight: 24,
  },
  whyCard: {
    backgroundColor: '#E07A5F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  whyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  whyText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
    opacity: 0.9,
  },
  benefitsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#2C1810',
    flex: 1,
  },
  culturalCard: {
    backgroundColor: '#F2CC8F',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  culturalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 8,
  },
  culturalText: {
    fontSize: 14,
    color: '#2C1810',
    lineHeight: 20,
    opacity: 0.8,
  },
  feedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 16,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  starButton: {
    padding: 4,
  },
  helpfulButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  helpfulButton: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  helpfulButtonText: {
    fontSize: 14,
    color: '#2C1810',
    fontWeight: '600',
  },
  thankYouContainer: {
    alignItems: 'center',
  },
  thankYouText: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 12,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4A261',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E07A5F',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  cookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});