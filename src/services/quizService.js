import apiClient from './api';

/**
 * Quiz Service
 * Handles all quiz-related API calls
 */

const quizService = {
  /**
   * Get all quizzes
   * @param {Object} params - Query parameters (page, limit, category, etc.)
   * @returns {Promise} List of quizzes
   */
  getAllQuizzes: async (params = {}) => {
    try {
      const response = await apiClient.get('/quizzes', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get quiz by ID
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Quiz details
   */
  getQuizById: async (quizId) => {
    try {
      const response = await apiClient.get(`/quizzes/${quizId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create new quiz
   * @param {Object} quizData - Quiz data
   * @returns {Promise} Created quiz
   */
  createQuiz: async (quizData) => {
    try {
      const response = await apiClient.post('/quizzes', quizData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update quiz
   * @param {string} quizId - Quiz ID
   * @param {Object} quizData - Updated quiz data
   * @returns {Promise} Updated quiz
   */
  updateQuiz: async (quizId, quizData) => {
    try {
      const response = await apiClient.put(`/quizzes/${quizId}`, quizData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete quiz
   * @param {string} quizId - Quiz ID
   * @returns {Promise} Deletion confirmation
   */
  deleteQuiz: async (quizId) => {
    try {
      const response = await apiClient.delete(`/quizzes/${quizId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Submit quiz answers
   * @param {string} quizId - Quiz ID
   * @param {Object} answers - User answers
   * @returns {Promise} Quiz results
   */
  submitQuiz: async (quizId, answers) => {
    try {
      const response = await apiClient.post(`/quizzes/${quizId}/submit`, { answers });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get user's quiz attempts
   * @returns {Promise} List of quiz attempts
   */
  getUserAttempts: async () => {
    try {
      const response = await apiClient.get('/quizzes/attempts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default quizService;
