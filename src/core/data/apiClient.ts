/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import { storageService } from './storage';
import { env } from '../../config/env';
import { logger } from '../../shared/utils/logger';

/**
 * Custom event for unauthorized access
 * Allows components to handle 401 errors without hard redirects
 */
export const UNAUTHORIZED_EVENT = 'api:unauthorized';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 second timeout
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = storageService.getToken();

        // Add token to request if available
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // If sending FormData, remove Content-Type header to let axios set it automatically
        if (config.data instanceof FormData && config.headers) {
          delete config.headers['Content-Type'];
        }

        // Log request in development (without sensitive data)
        logger.api(
          config.method || 'unknown',
          config.url || 'unknown',
          config.data instanceof FormData ? '[FormData]' : config.data
        );

        return config;
      },
      (error) => {
        logger.error('[API Request Error]', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor for handling errors
    this.client.interceptors.response.use(
      (response) => {
        // Log successful responses in development
        logger.log(
          `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`
        );
        return response;
      },
      (error: AxiosError) => {
        const status = error.response?.status;
        const method = error.config?.method?.toUpperCase();
        const url = error.config?.url;

        // Log error without exposing sensitive data
        logger.error(`[API Error] ${method} ${url}`, {
          status,
          statusText: error.response?.statusText,
          message: error.message,
        });

        // Handle specific error cases
        if (status === 401) {
          // Clear auth data on unauthorized
          storageService.clearAuth();

          // Dispatch custom event instead of hard redirect
          // This allows components to handle the redirect gracefully
          window.dispatchEvent(new CustomEvent(UNAUTHORIZED_EVENT));

          // Only redirect if not already on auth pages
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
            // Use a small delay to allow event handlers to complete
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
          }
        }

        // Enhance error message for better debugging
        const enhancedError = {
          ...error,
          message: this.getErrorMessage(error),
        };

        return Promise.reject(enhancedError);
      }
    );
  }

  /**
   * Extract user-friendly error message from API error
   */
  private getErrorMessage(error: AxiosError): string {
    if (error.response?.data && typeof error.response.data === 'object') {
      const data = error.response.data as any;
      return data.message || data.error || error.message;
    }
    return error.message;
  }

  get instance(): AxiosInstance {
    return this.client;
  }
}

// Authenticated API client (includes JWT token)
export const apiClient = new ApiClient().instance;

// Public API client (no authentication required)
export const publicApiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});
