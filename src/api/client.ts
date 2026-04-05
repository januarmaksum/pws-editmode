import axios from 'axios';

/**
 * Reusable Axios Instance
 * Configure base URL and common headers here.
 */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request Interceptor: Attach Authorization Token
apiClient.interceptors.request.use(
  async (config) => {
    // Universal Cookie Access (Server vs Client handled in the util)
    // TODO: Remove this when we have a better way to handle authentication
    const token = null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle Unauthorized (401) or other global errors here
    if (error.response?.status === 401) {
      // Logic for logout or token refresh
      console.error('Unauthorized access - potential token expiration');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
