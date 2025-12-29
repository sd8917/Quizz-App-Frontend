import axios from 'axios';

// Base API configuration
const BASE_URL = 'https://api.triviaverse.site/api';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 10 seconds
  // temp fixe
  // withCredentials: true,
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
  Promise.reject
);

// Response interceptor - Handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    // If 401 & not already retried
    if (error.response?.status === 401) {
      
      if (isRefreshing) {
        // Queue pending requests
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(Promise.reject);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.get(`${BASE_URL}/refresh`, {
          withCredentials: true,
        });

        const newAccessToken = data?.data?.accessToken;

        if (!newAccessToken) throw new Error("No access token");

        localStorage.setItem("accessToken", newAccessToken);
        apiClient.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");

        window.dispatchEvent(
          new CustomEvent("auth:logout", {
            detail: { reason: "Session expired" },
          })
        );

        window.location.href = "/login?session=expired";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { BASE_URL };
