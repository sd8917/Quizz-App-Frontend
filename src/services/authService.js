import apiClient from './api';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

const authService = {
  /**
   * Login user with credentials
   * @param {Object} credentials - { email, password }
   * @returns {Promise} Response with user data and tokens
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/login', credentials);
      // Store access token if login successful
      if (response.data?.data.accessToken) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - { name, email, password, confirmPassword }
   * @returns {Promise} Response with user data
   */
  register: async (userData) => {
    try {
      const response = await apiClient.post('/register', userData);
      
      // Optionally auto-login after registration
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Logout user
   * @returns {Promise} Logout response
   */
  logout: async () => {
    try {
      // Call logout endpoint if exists
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  /**
   * Get stored access token
   * @returns {string|null} Access token
   */
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },
};

export default authService;
