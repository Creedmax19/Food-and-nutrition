import { useState, useEffect } from 'react';
import { recipesAPI, userRecipesAPI } from '@/services/api';

export interface Recipe {
  id: number;
  name: string;
  slug: string;
  description: string;
  cuisine: {
    name: string;
    region: {
      name: string;
    };
  };
  prep_time: number;
  cook_time: number;
  total_time: number;
  servings: number;
  difficulty: string;
  meal_type: string;
  calories_per_serving?: number;
  image?: string;
  average_rating: number;
  total_ratings: number;
  is_featured: boolean;
  ingredients?: any[];
  instructions?: any[];
  cultural_significance?: string;
  tags: string[];
  dietary_labels: string[];
}

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipesAPI.getRecipes(params);
      setRecipes(response.results || response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipesAPI.getFeaturedRecipes();
      setRecipes(response.results || response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch featured recipes');
    } finally {
      setLoading(false);
    }
  };

  const searchRecipes = async (searchData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipesAPI.searchRecipes(searchData);
      setRecipes(response.results || response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search recipes');
    } finally {
      setLoading(false);
    }
  };

  return {
    recipes,
    loading,
    error,
    fetchRecipes,
    fetchFeaturedRecipes,
    searchRecipes,
  };
};

export const useRecipe = (slug: string) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchRecipe();
    }
  }, [slug]);

  const fetchRecipe = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipesAPI.getRecipe(slug);
      setRecipe(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipe');
    } finally {
      setLoading(false);
    }
  };

  const saveRecipe = async () => {
    if (!recipe) return;
    try {
      await recipesAPI.saveRecipe(recipe.id);
    } catch (err) {
      console.error('Failed to save recipe:', err);
    }
  };

  const toggleFavorite = async () => {
    if (!recipe) return;
    try {
      await recipesAPI.toggleFavorite(recipe.id);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const rateRecipe = async (rating: number, review?: string) => {
    if (!recipe) return;
    try {
      await recipesAPI.rateRecipe(recipe.id, rating, review);
      // Refresh recipe to get updated rating
      await fetchRecipe();
    } catch (err) {
      console.error('Failed to rate recipe:', err);
    }
  };

  return {
    recipe,
    loading,
    error,
    saveRecipe,
    toggleFavorite,
    rateRecipe,
    refetch: fetchRecipe,
  };
};

export const useUserRecipes = () => {
  const [userRecipes, setUserRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRecipes = async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userRecipesAPI.getUserRecipes(filters);
      setUserRecipes(response.results || response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user recipes');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRecipe = async (recipeId: number, data: any) => {
    try {
      await userRecipesAPI.updateUserRecipe(recipeId, data);
      // Refresh user recipes
      await fetchUserRecipes();
    } catch (err) {
      console.error('Failed to update user recipe:', err);
    }
  };

  return {
    userRecipes,
    loading,
    error,
    fetchUserRecipes,
    updateUserRecipe,
  };
};

export const useRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (params?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipesAPI.getRecommendations(params);
      setRecommendations(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recommendations');
    } finally {
      setLoading(false);
    }
  };

  return {
    recommendations,
    loading,
    error,
    fetchRecommendations,
  };
};