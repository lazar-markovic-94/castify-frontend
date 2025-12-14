import { apiClient } from '../apiClient';
import { AuthCredentials, User } from '../../domain/entities';
import { RegisterRequest, LoginRequest } from '../../domain/dtos';

class AuthRepository {
  async register(request: RegisterRequest): Promise<AuthCredentials> {
    const response = await apiClient.post<AuthCredentials>('/api/auth/register', request);
    return response.data;
  }

  async login(request: LoginRequest): Promise<AuthCredentials> {
    const response = await apiClient.post<AuthCredentials>('/api/auth/login', request);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/api/auth/me');
    return response.data;
  }
}

export const authRepository = new AuthRepository();
