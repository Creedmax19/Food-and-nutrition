import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000/api' 
  : 'https://your-production-api.com/api';

// Token management
export const TokenManager = {
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  async setToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error setting token:', error);
    }
  },

  async removeToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error removing token:', error);
    }
  }
};

// API client with automatic token handling
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const token = await TokenManager.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Token ${token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getHeaders();

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const responseData = await response.json().catch(() => ({}));
      
      if (!response.ok) {
        // Create an error object with the response data
        const error = new Error(responseData.message || `HTTP ${response.status}`) as any;
        error.response = {
          status: response.status,
          data: responseData,
        };
        throw error;
      }

      return responseData;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      // Re-throw the error so it can be handled by the calling code
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

// Authentication API
export const authAPI = {
  async register(userData: {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
  }) {
    const response = await apiClient.post<{
      user: any;
      token: string;
      message: string;
    }>('/auth/register/', userData);
    
    if (response.token) {
      await TokenManager.setToken(response.token);
    }
    
    return response;
  },

  async login(credentials: { email: string; password: string }) {
    const response = await apiClient.post<{
      user: any;
      token: string;
      message: string;
    }>('/auth/login/', credentials);
    
    if (response.token) {
      await TokenManager.setToken(response.token);
    }
    
    return response;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout/');
    } finally {
      await TokenManager.removeToken();
    }
  },

  async getProfile() {
    return apiClient.get<any>('/auth/profile/');
  },

  async updateProfile(profileData: any) {
    return apiClient.patch<any>('/auth/profile/update/', profileData);
  },

  async completeOnboarding(onboardingData: any) {
    return apiClient.post<any>('/auth/onboarding/complete/', onboardingData);
  }
};

// Recipes API
export const recipesAPI = {
  async getRecipes(params?: any) {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return apiClient.get<any>(`/recipes/${queryString}`);
  },

  async getRecipe(slug: string) {
    return apiClient.get<any>(`/recipes/${slug}/`);
  },

  async getFeaturedRecipes() {
    return apiClient.get<any>('/recipes/featured/');
  },

  async getPopularRecipes() {
    return apiClient.get<any>('/recipes/popular/');
  },

  async searchRecipes(searchData: any) {
    return apiClient.post<any>('/recipes/search/', searchData);
  },

  async getRecommendations(params?: any) {
    return apiClient.post<any>('/recipes/recommendations/', params || {});
  },

  async saveRecipe(recipeId: number) {
    return apiClient.post<any>(`/recipes/${recipeId}/save/`);
  },

  async toggleFavorite(recipeId: number) {
    return apiClient.post<any>(`/recipes/${recipeId}/favorite/`);
  },

  async rateRecipe(recipeId: number, rating: number, review?: string) {
    return apiClient.post<any>(`/recipes/${recipeId}/ratings/`, {
      rating,
      review
    });
  }
};

// User Recipes API
export const userRecipesAPI = {
  async getUserRecipes(filters?: any) {
    const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return apiClient.get<any>(`/recipes/user/${queryString}`);
  },

  async updateUserRecipe(recipeId: number, data: any) {
    return apiClient.patch<any>(`/recipes/${recipeId}/update-interaction/`, data);
  }
};

// Reference Data API
export const referenceAPI = {
  async getRegions() {
    return apiClient.get<any>('/recipes/regions/');
  },

  async getCuisines() {
    return apiClient.get<any>('/recipes/cuisines/');
  },

  async getIngredients() {
    return apiClient.get<any>('/recipes/ingredients/');
  },

  async getHealthConditions() {
    return apiClient.get<any>('/auth/health-conditions/');
  },

  async getAllergies() {
    return apiClient.get<any>('/auth/allergies/');
  },

  async getDietaryPreferences() {
    return apiClient.get<any>('/auth/dietary-preferences/');
  },

  async getFitnessGoals() {
    return apiClient.get<any>('/auth/fitness-goals/');
  }
};

// User Stats API
export const statsAPI = {
  async getUserStats() {
    return apiClient.get<any>('/auth/profile/stats/');
  },

  async getRecipeStats() {
    return apiClient.get<any>('/recipes/stats/');
  }
};

// AI Engine API
export const aiAPI = {
  async getRecommendations(params: {
    meal_type?: string;
    max_prep_time?: number;
    count?: number;
    preferred_regions?: string[];
    dietary_preferences?: string[];
    exclude_allergens?: string[];
  }) {
    return apiClient.post<any>('/ai/recommendations/', params);
  },

  async generateMealPlan(params: {
    days?: number;
    budget?: string;
    max_prep_time?: number;
    dietary_preferences?: string[];
    exclude_allergens?: string[];
    preferred_regions?: string[];
    family_size?: number;
  }) {
    return apiClient.post<any>('/ai/meal-plan/generate/', params);
  },

  async getIngredientSubstitutes(params: {
    ingredient: string;
    recipe_name?: string;
    cooking_method?: string;
    cuisine_type?: string;
  }) {
    return apiClient.post<any>('/ai/ingredient-substitutes/', params);
  },

  async generateCulturalInsight(recipeId: number) {
    return apiClient.post<any>('/ai/cultural-insight/', { recipe_id: recipeId });
  },

  async provideFeedback(params: {
    recommendation_id: number;
    rating?: number;
    feedback?: string;
    was_helpful?: boolean;
  }) {
    return apiClient.post<any>('/ai/feedback/', params);
  },

  async getUserAIProfile() {
    return apiClient.get<any>('/ai/profile/');
  },

  async getRecommendationHistory() {
    return apiClient.get<any>('/ai/history/');
  }
};

export default apiClient;