import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/api';

/**
 * Custom hook for fetching data from API
 * @param {string} url - API endpoint (optional, can be set later with execute)
 * @param {Object} options - Fetch options
 * @param {boolean} options.immediate - Whether to fetch immediately on mount (default: true)
 * @param {string} options.method - HTTP method (default: 'GET')
 * @param {Object} options.body - Request body for POST/PUT requests
 * @param {Object} options.params - Query parameters
 * @returns {Object} - { data, loading, error, execute, refetch }
 */
const useFetch = (url = null, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(options.immediate !== false && url !== null);
  const [error, setError] = useState(null);

  const {
    immediate = true,
    method = 'GET',
    body = null,
    params = null,
  } = options;

  const execute = useCallback(async (executeUrl = url, executeOptions = {}) => {
    if (!executeUrl) {
      setError('No URL provided');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const config = {
        method: executeOptions.method || method,
        url: executeUrl,
        ...(executeOptions.params || params ? { params: executeOptions.params || params } : {}),
        ...(executeOptions.body || body ? { data: executeOptions.body || body } : {}),
      };

      const response = await apiClient(config);
      const responseData = response.data?.data || response.data;
      
      setData(responseData);
      setLoading(false);
      return responseData;
    } catch (err) {
      console.error('useFetch error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  }, [url, method, body, params]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  useEffect(() => {
    if (immediate && url) {
      execute();
    }
  }, [url, immediate]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, execute, refetch };
};

export default useFetch;
