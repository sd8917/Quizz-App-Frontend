import apiClient from './api';

/**
 * RAG Search Service
 * Handles retrieval-augmented generation search queries
 */

const ragService = {
  /**
   * Perform a RAG search query
   * @param {string} query - The search query
   * @returns {Promise<Object>} - Response with success, data containing answer, sources, and metadata
   */
  search: async (query) => {
    try {
      const response = await apiClient.post('/rag/search', {
        query: query
      });

      // The response should match the specified format
      return {
        success: true,
        data: {
          answer: response.data.data?.answer || '',
          sources: response.data.data?.sources || [],
          metadata: {
            query: query
          }
        }
      };
    } catch (error) {
      console.error('RAG search error:', error);
      throw error;
    }
  }
};

export default ragService;
