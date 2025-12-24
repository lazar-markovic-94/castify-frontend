import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth, useCurrentUser } from '../useAuth';
import { createTestQueryClient } from '../../../test/utils';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { authRepository } from '../../data/repositories';
import { storageService } from '../../data/storage';
import { UserRole } from '../../domain/enums';

// Mock dependencies
vi.mock('../../data/repositories', () => ({
  authRepository: {
    login: vi.fn(),
    register: vi.fn(),
    getCurrentUser: vi.fn(),
  },
}));

vi.mock('../../data/storage', () => ({
  storageService: {
    setAuth: vi.fn(),
    clearAuth: vi.fn(),
    isAuthenticated: vi.fn(),
    getToken: vi.fn(),
  },
}));

// Mock react-router-dom navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('useAuth', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = createTestQueryClient();
    return (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should successfully login a user', async () => {
      const mockCredentials = {
        token: 'test-token',
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.TALENT,
      };

      vi.mocked(authRepository.login).mockResolvedValue(mockCredentials);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.login({ email: 'test@example.com', password: 'password123' });

      await waitFor(() => {
        expect(result.current.isLoginLoading).toBe(false);
      });

      expect(authRepository.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(storageService.setAuth).toHaveBeenCalledWith(mockCredentials);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should handle login failure', async () => {
      const mockError = new Error('Invalid credentials');
      vi.mocked(authRepository.login).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.login({ email: 'wrong@example.com', password: 'wrongpass' });

      await waitFor(() => {
        expect(result.current.isLoginLoading).toBe(false);
      });

      expect(result.current.loginError).toBeTruthy();
      expect(storageService.setAuth).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const mockCredentials = {
        token: 'new-token',
        userId: 'user-456',
        email: 'newuser@example.com',
        role: UserRole.CLIENT,
      };

      vi.mocked(authRepository.register).mockResolvedValue(mockCredentials);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.register({
        email: 'newuser@example.com',
        password: 'password123',
        role: UserRole.CLIENT,
      });

      await waitFor(() => {
        expect(result.current.isRegisterLoading).toBe(false);
      });

      expect(authRepository.register).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'password123',
        role: UserRole.CLIENT,
      });
      expect(storageService.setAuth).toHaveBeenCalledWith(mockCredentials);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('should handle registration failure', async () => {
      const mockError = new Error('Email already exists');
      vi.mocked(authRepository.register).mockRejectedValue(mockError);

      const { result } = renderHook(() => useAuth(), { wrapper });

      result.current.register({
        email: 'existing@example.com',
        password: 'password123',
        role: UserRole.TALENT,
      });

      await waitFor(() => {
        expect(result.current.isRegisterLoading).toBe(false);
      });

      expect(result.current.registerError).toBeTruthy();
      expect(storageService.setAuth).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should successfully logout user', () => {
      const queryClient = createTestQueryClient();
      const clearSpy = vi.spyOn(queryClient, 'clear');

      const customWrapper = ({ children }: { children: React.ReactNode }) => (
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </BrowserRouter>
      );

      const { result } = renderHook(() => useAuth(), { wrapper: customWrapper });

      result.current.logout();

      expect(storageService.clearAuth).toHaveBeenCalled();
      expect(clearSpy).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});

describe('useCurrentUser', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = createTestQueryClient();
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch current user when authenticated', async () => {
    const mockUser = {
      userId: 'user-123',
      email: 'test@example.com',
      role: UserRole.TALENT,
      phone: null,
      isActive: true,
    };

    vi.mocked(storageService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authRepository.getCurrentUser).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUser);
    expect(authRepository.getCurrentUser).toHaveBeenCalled();
  });

  it('should not fetch user when not authenticated', () => {
    vi.mocked(storageService.isAuthenticated).mockReturnValue(false);

    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBe(false);
    expect(authRepository.getCurrentUser).not.toHaveBeenCalled();
  });

  it('should handle fetch user error', async () => {
    vi.mocked(storageService.isAuthenticated).mockReturnValue(true);
    vi.mocked(authRepository.getCurrentUser).mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHook(() => useCurrentUser(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeTruthy();
  });
});
