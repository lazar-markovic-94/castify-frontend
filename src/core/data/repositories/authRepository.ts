import { apiClient } from '../apiClient';
import { AuthCredentials, User } from '../../domain/entities';
import { RegisterRequest, LoginRequest } from '../../domain/dtos';
import { AuthCredentialsSchema, UserSchema, validateApiResponse } from '../../domain/schemas';

class AuthRepository {
  /**
   * Register a new user
   * Validates the API response to ensure it matches the expected schema
   */
  async register(request: RegisterRequest): Promise<AuthCredentials> {
    const response = await apiClient.post('/api/auth/register', request);
    return validateApiResponse(AuthCredentialsSchema, response.data);
  }

  /**
   * Login a user
   * Validates the API response to ensure it matches the expected schema
   */
  async login(request: LoginRequest): Promise<AuthCredentials> {
    const response = await apiClient.post('/api/auth/login', request);
    return validateApiResponse(AuthCredentialsSchema, response.data);
  }

  /**
   * Get current authenticated user
   * Validates the API response to ensure it matches the expected schema
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/api/auth/me');
    return validateApiResponse(UserSchema, response.data);
  }
}

export const authRepository = new AuthRepository();
