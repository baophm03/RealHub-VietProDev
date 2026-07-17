/**
 * Custom hooks for Auth API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type { LoginDto, RegisterDto } from '../model';

// Types
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  roles: string[];
  permissions: string[];
  activeTenantId?: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// API Functions
const authApi = {
  login: async (credentials: LoginDto) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterDto) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
    return data;
  },

  me: async () => {
    const { data } = await apiClient.get<AuthUser>('/auth/me');
    return data;
  },

  refresh: async (refreshToken: string) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  },
};

// Hooks
export function useAuth() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authApi.me(),
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginDto) => authApi.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (userData: RegisterDto) => authApi.register(userData),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.clear();
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: (refreshToken: string) => authApi.refresh(refreshToken),
  });
}
