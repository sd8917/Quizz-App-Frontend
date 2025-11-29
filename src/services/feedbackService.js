import apiClient from './api';

const feedbackService = {
  /**
   * Get feedback list
   * @returns {Promise}
   */
  getFeedback: async () => {
    try {
      const response = await apiClient.get('/feedback');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Submit feedback
   * @param {Object} payload - { name, email, rating, message, anonymous }
   * @returns {Promise}
   */
  submitFeedback: async (payload) => {
    try {
      const response = await apiClient.post('/feedback', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default feedbackService;
