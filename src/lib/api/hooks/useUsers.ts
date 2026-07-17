/**
 * Custom hooks for Users & Tenants API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type { CreateUserDto } from '../model';

// Types
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  status: string;
  roles: string[];
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Tenant {
  id: string;
  name: string;
  code: string;
  type: string;
  logoUrl?: string;
  primaryColor?: string;
  domains?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSettings {
  [key: string]: unknown;
}

export interface TenantFeature {
  key: string;
  enabled: boolean;
}

// API Functions
const usersApi = {
  me: async () => {
    const { data } = await apiClient.get<UserProfile>('/users/me');
    return data;
  },

  createUser: async (user: CreateUserDto) => {
    const { data } = await apiClient.post<UserProfile>('/users', user);
    return data;
  },
};

const tenantsApi = {
  findTenantById: async (id: string) => {
    const { data } = await apiClient.get<Tenant>(`/tenants/${id}`);
    return data;
  },

  findTenantByDomain: async (domain: string) => {
    const { data } = await apiClient.get<Tenant>(`/tenants/domain/${domain}`);
    return data;
  },

  getSettings: async (id: string) => {
    const { data } = await apiClient.get<TenantSettings>(`/tenants/${id}/settings`);
    return data;
  },

  updateSettings: async ({ id, settings }: { id: string; settings: TenantSettings }) => {
    const { data } = await apiClient.patch<TenantSettings>(`/tenants/${id}/settings`, settings);
    return data;
  },

  getFeatures: async (id: string) => {
    const { data } = await apiClient.get<TenantFeature[]>(`/tenants/${id}/features`);
    return data;
  },

  toggleFeature: async ({ id, key, enabled }: { id: string; key: string; enabled: boolean }) => {
    const { data } = await apiClient.patch<TenantFeature[]>(`/tenants/${id}/features`, { key, enabled });
    return data;
  },
};

// Hooks
export function useCurrentUser() {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: () => usersApi.me(),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: CreateUserDto) => usersApi.createUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => tenantsApi.findTenantById(id),
    enabled: !!id,
  });
}

export function useTenantByDomain(domain: string) {
  return useQuery({
    queryKey: ['tenant', 'domain', domain],
    queryFn: () => tenantsApi.findTenantByDomain(domain),
    enabled: !!domain,
  });
}

export function useTenantSettings(id: string) {
  return useQuery({
    queryKey: ['tenant-settings', id],
    queryFn: () => tenantsApi.getSettings(id),
    enabled: !!id,
  });
}

export function useUpdateTenantSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, settings }: { id: string; settings: TenantSettings }) =>
      tenantsApi.updateSettings({ id, settings }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenant-settings', variables.id] });
    },
  });
}

export function useTenantFeatures(id: string) {
  return useQuery({
    queryKey: ['tenant-features', id],
    queryFn: () => tenantsApi.getFeatures(id),
    enabled: !!id,
  });
}

export function useToggleTenantFeature() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, key, enabled }: { id: string; key: string; enabled: boolean }) =>
      tenantsApi.toggleFeature({ id, key, enabled }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tenant-features', variables.id] });
    },
  });
}
