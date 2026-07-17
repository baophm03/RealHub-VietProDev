/**
 * RealHub API Client
 * Axios-based client with auth and tenant support
 */

import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get tokens from localStorage (or your auth store)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      const tenantCode = localStorage.getItem('tenantCode') || 'DEMO';

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['x-tenant-code'] = tenantCode;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(`${baseURL}/auth/refresh`, {
            refreshToken,
          });

          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
