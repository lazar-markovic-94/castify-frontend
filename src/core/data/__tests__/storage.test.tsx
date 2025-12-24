import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storageService } from '../storage';
import { UserRole } from '../../domain/enums';
import { AuthCredentials } from '../../domain/entities';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('storageService', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  describe('Token Management', () => {
    it('should return null when token does not exist', () => {
      // Explicitly clear before checking
      storageService.removeToken();
      expect(storageService.getToken()).toBeNull();
    });

    it('should set and get token', () => {
      const token = 'test-token-123';
      storageService.setToken(token);

      expect(storageService.getToken()).toBe(token);
    });

    it('should remove token', () => {
      storageService.setToken('test-token');
      storageService.removeToken();

      expect(storageService.getToken()).toBeNull();
    });
  });

  describe('User Management', () => {
    it('should return null when user does not exist', () => {
      // Explicitly clear before checking
      storageService.removeUser();
      expect(storageService.getUser()).toBeNull();
    });

    it('should set and get user', () => {
      const user = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.TALENT,
        phone: null,
        isActive: true,
      };

      storageService.setUser(user);
      const retrievedUser = storageService.getUser();

      expect(retrievedUser).toEqual(user);
    });

    it('should return null when user data is corrupted', () => {
      // Clear first, then set invalid data
      storageService.removeUser();
      localStorageMock.setItem('castify_user', 'invalid-json');

      expect(storageService.getUser()).toBeNull();
    });

    it('should remove user', () => {
      const user = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.CLIENT,
        phone: null,
        isActive: true,
      };

      storageService.setUser(user);
      storageService.removeUser();

      expect(storageService.getUser()).toBeNull();
    });
  });

  describe('Auth Management', () => {
    it('should set auth credentials and user', () => {
      const credentials: AuthCredentials = {
        token: 'test-token',
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.TALENT,
      };

      storageService.setAuth(credentials);

      expect(storageService.getToken()).toBe('test-token');

      const user = storageService.getUser();
      expect(user).toEqual({
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.TALENT,
        phone: null,
        isActive: true,
      });
    });

    it('should clear all auth data', () => {
      const credentials: AuthCredentials = {
        token: 'test-token',
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.CLIENT,
      };

      storageService.setAuth(credentials);
      storageService.clearAuth();

      expect(storageService.getToken()).toBeNull();
      expect(storageService.getUser()).toBeNull();
    });

    it('should check if user is authenticated', () => {
      expect(storageService.isAuthenticated()).toBe(false);

      storageService.setToken('test-token');
      expect(storageService.isAuthenticated()).toBe(true);

      storageService.removeToken();
      expect(storageService.isAuthenticated()).toBe(false);
    });
  });
});
