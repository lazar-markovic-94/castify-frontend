import { AuthCredentials, User } from '../domain/entities';

const STORAGE_KEYS = {
  TOKEN: 'castify_token',
  USER: 'castify_user',
} as const;

class StorageService {
  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
  }

  // Token management
  setToken(token: string): void {
    this.storage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  getToken(): string | null {
    return this.storage.getItem(STORAGE_KEYS.TOKEN);
  }

  removeToken(): void {
    this.storage.removeItem(STORAGE_KEYS.TOKEN);
  }

  // User management
  setUser(user: User): void {
    this.storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  getUser(): User | null {
    const userData = this.storage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;
    try {
      return JSON.parse(userData) as User;
    } catch {
      return null;
    }
  }

  removeUser(): void {
    this.storage.removeItem(STORAGE_KEYS.USER);
  }

  // Auth management
  setAuth(credentials: AuthCredentials): void {
    this.setToken(credentials.token);
    const user: User = {
      userId: credentials.userId,
      email: credentials.email,
      role: credentials.role,
      phone: null,
      isActive: true,
    };
    this.setUser(user);
  }

  clearAuth(): void {
    this.removeToken();
    this.removeUser();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const storageService = new StorageService();
