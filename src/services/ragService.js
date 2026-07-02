import apiClient from './api';

/**
 * RAG Search Service
 * Handles retrieval-augmented generation search queries and chat sessions
 */

const ragService = {
  /**
   * Perform a RAG search query
   * @param {string} query - The search query
   * @param {string} [sessionId] - Optional session ID to maintain chat context
   * @returns {Promise<Object>} - Response containing answer, sources, and metadata
   */
  search: async (query, sessionId) => {
    try {
      const response = await apiClient.post('/rag/search', {
        query,
        sessionId,
      });
      return response.data;
    } catch (error) {
      console.error('RAG search error:', error);
      throw error;
    }
  },

  /**
   * Get all chat sessions for the current user
   * @returns {Promise<Object>} - List of chat sessions
   */
  getSessions: async () => {
    try {
      const response = await apiClient.get('/rag/sessions');
      return response.data;
    } catch (error) {
      console.error('RAG getSessions error:', error);
      throw error;
    }
  },

  /**
   * Get message history for a specific chat session
   * @param {string} sessionId - The session identifier
   * @returns {Promise<Object>} - The chat session details and message history
   */
  getSession: async (sessionId) => {
    try {
      const response = await apiClient.get(`/rag/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error(`RAG getSession (${sessionId}) error:`, error);
      throw error;
    }
  },

  /**
   * Clear/delete a specific chat session
   * @param {string} sessionId - The session identifier
   * @returns {Promise<Object>} - Deletion success message
   */
  deleteSession: async (sessionId) => {
    try {
      const response = await apiClient.delete(`/rag/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error(`RAG deleteSession (${sessionId}) error:`, error);
      throw error;
    }
  }
};

export default ragService;

