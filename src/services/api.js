import axios from 'axios';

// Base API configuration
const BASE_URL = 'https://api.triviaverse.site/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // If error is 401, clear storage and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Dispatch custom event for auth components to listen
      window.dispatchEvent(new CustomEvent('auth:logout', { 
        detail: { reason: 'Token expired' } 
      }));
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?session=expired';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { BASE_URL };
