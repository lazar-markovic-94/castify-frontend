import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { storageService } from './storage';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = storageService.getToken();

        console.log('🔑 Token from storage:', token ? `${token.substring(0, 20)}...` : 'NULL');

        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        } else if (!token) {
          console.error('❌ NO TOKEN FOUND IN STORAGE!');
        }

        // If sending FormData, remove Content-Type header to let axios set it automatically
        if (config.data instanceof FormData && config.headers) {
          delete config.headers['Content-Type'];
        }

        // Log request details
        console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
          data: config.data,
          hasAuthHeader: !!config.headers?.Authorization,
          authHeaderPreview: config.headers?.Authorization?.substring(0, 30) + '...',
        });

        return config;
      },
      (error) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling errors
    this.client.interceptors.response.use(
      (response) => {
        console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`, response.data);
        return response;
      },
      (error) => {
        console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
        console.error('❌ Status:', error.response?.status);
        console.error('❌ Status Text:', error.response?.statusText);
        console.error('❌ Response Data:', JSON.stringify(error.response?.data, null, 2));
        console.error('❌ Error Message:', error.message);

        if (error.response?.status === 401) {
          // Clear auth data on 401
          storageService.clearAuth();
          // Optionally redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

// Authenticated API client (includes JWT token)
export const apiClient = new ApiClient().instance;

// Public API client (no authentication required)
export const publicApiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
