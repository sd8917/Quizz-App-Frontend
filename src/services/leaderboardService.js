import apiClient from './api';

/**
 * Leaderboard Service
 * Handles all leaderboard-related API calls
 */

const leaderboardService = {
  /**
   * Get global leaderboard
   * @param {Object} params - { timeframe, limit, page }
   * @returns {Promise} Leaderboard data
   */
  getGlobalLeaderboard: async (params = {}) => {
    try {
      const response = await apiClient.get('/leaderboard', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get quiz-specific leaderboard
   * @param {string} quizId - Quiz ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Quiz leaderboard data
   */
  getQuizLeaderboard: async (quizId, params = {}) => {
    try {
      const response = await apiClient.get(`/leaderboard/quiz/${quizId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get user's rank
   * @returns {Promise} User rank data
   */
  getUserRank: async () => {
    try {
      const response = await apiClient.get('/leaderboard/rank');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default leaderboardService;
