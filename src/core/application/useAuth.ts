import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authRepository } from '../data/repositories';
import { storageService } from '../data/storage';
import { RegisterRequest, LoginRequest } from '../domain/dtos';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: (request: LoginRequest) => authRepository.login(request),
    onSuccess: (data) => {
      storageService.setAuth(data);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      navigate('/');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (request: RegisterRequest) => authRepository.register(request),
    onSuccess: (data) => {
      storageService.setAuth(data);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      navigate('/');
    },
  });

  const logout = () => {
    storageService.clearAuth();
    queryClient.clear();
    navigate('/login');
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authRepository.getCurrentUser(),
    enabled: storageService.isAuthenticated(),
    retry: false,
  });
};
