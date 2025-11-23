import apiClient from './api';

/**
 * Channel Service
 * Handles all channel-related API calls
 */

const channelService = {
  /**
   * Get all channels
   * @returns {Promise} List of channels
   */
  getAllChannels: async () => {
    try {
      const response = await apiClient.get('/channel');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get channel by ID
   * @param {string} channelId - Channel ID
   * @returns {Promise} Channel details
   */
  getChannelById: async (channelId) => {
    try {
      const response = await apiClient.get(`/channel/${channelId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Create new channel
   * @param {Object} channelData - { name, description }
   * @returns {Promise} Created channel
   */
  createChannel: async (channelData) => {
    try {
      const response = await apiClient.post('/channel', channelData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Update channel
   * @param {string} channelId - Channel ID
   * @param {Object} channelData - Updated channel data
   * @returns {Promise} Updated channel
   */
  updateChannel: async (channelId, channelData) => {
    try {
      const response = await apiClient.put(`/channel/${channelId}`, channelData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Delete channel
   * @param {string} channelId - Channel ID
   * @returns {Promise} Deletion confirmation
   */
  deleteChannel: async (channelId) => {
    try {
      const response = await apiClient.delete(`/channel/${channelId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Add questions in bulk to a channel
   * @param {string} channelId - Channel ID
   * @param {Array} questions - Array of question objects
   * @returns {Promise} Created questions
   */
  addBulkQuestions: async (channelId, questions) => {
    try {
      const response = await apiClient.post(`/quiz/channel/${channelId}/bulk`, { questions });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Add single question to a channel
   * @param {string} channelId - Channel ID
   * @param {Object} questionData - Question object
   * @returns {Promise} Created question
   */
  addQuestion: async (channelId, questionData) => {
    try {
      const response = await apiClient.post(`/questions/channel/${channelId}`, questionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Add user to a channel by email
   * @param {string} channelId - Channel ID
   * @param {Object} userData - { email }
   * @returns {Promise} Response with user addition status
   */
  addUserToChannel: async (channelId, userData) => {
    try {
      const response = await apiClient.post(`/channel/${channelId}/invite`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Get users in a channel
   * @param {string} channelId - Channel ID
   * @returns {Promise} List of users in the channel
   */
  getChannelUsers: async (channelId) => {
    try {
      const response = await apiClient.get(`/channel/${channelId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default channelService;
