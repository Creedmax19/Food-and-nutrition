import { useState } from 'react';
import { aiAPI } from '@/services/api';

export interface AIRecommendation {
  name: string;
  description: string;
  prep_time: number;
  cook_time: number;
  difficulty: string;
  cuisine: string;
  region: string;
  confidence: number;
  health_benefits?: string[];
  cultural_significance?: string;
  why_recommended?: string;
}

export interface MealPlan {
  meal_plan: {
    [day: string]: {
      breakfast: string;
      lunch: string;
      dinner: string;
    };
  };
  shopping_list: Array<{
    category: string;
    items: string[];
  }>;
  prep_tips: string[];
  nutritional_summary: any;
  cultural_notes: string[];
}

export interface IngredientSubstitute {
  name: string;
  availability: string;
  flavor_profile: string;
  conversion_ratio: string;
  cultural_note: string;
  confidence: number;
}

export const useAIRecommendations = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecommendations = async (params: {
    meal_type?: string;
    max_prep_time?: number;
    count?: number;
    preferred_regions?: string[];
    dietary_preferences?: string[];
    exclude_allergens?: string[];
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.getRecommendations(params);
      setRecommendations(response.recommendations || []);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI recommendations';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const provideFeedback = async (recommendationId: number, feedback: {
    rating?: number;
    feedback?: string;
    was_helpful?: boolean;
  }) => {
    try {
      await aiAPI.provideFeedback({
        recommendation_id: recommendationId,
        ...feedback
      });
    } catch (err) {
      console.error('Failed to provide feedback:', err);
    }
  };

  return {
    recommendations,
    loading,
    error,
    getRecommendations,
    provideFeedback,
  };
};

export const useAIMealPlan = () => {
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateMealPlan = async (params: {
    days?: number;
    budget?: string;
    max_prep_time?: number;
    dietary_preferences?: string[];
    exclude_allergens?: string[];
    preferred_regions?: string[];
    family_size?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.generateMealPlan(params);
      setMealPlan(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate meal plan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mealPlan,
    loading,
    error,
    generateMealPlan,
  };
};

export const useIngredientSubstitutes = () => {
  const [substitutes, setSubstitutes] = useState<IngredientSubstitute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSubstitutes = async (params: {
    ingredient: string;
    recipe_name?: string;
    cooking_method?: string;
    cuisine_type?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.getIngredientSubstitutes(params);
      setSubstitutes(response.substitutes || []);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get ingredient substitutes';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    substitutes,
    loading,
    error,
    getSubstitutes,
  };
};

export const useCulturalInsights = () => {
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateInsight = async (recipeId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.generateCulturalInsight(recipeId);
      setInsight(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate cultural insight';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    insight,
    loading,
    error,
    generateInsight,
  };
};

export const useAIProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiAPI.getUserAIProfile();
      setProfile(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get AI profile';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    getProfile,
  };
};