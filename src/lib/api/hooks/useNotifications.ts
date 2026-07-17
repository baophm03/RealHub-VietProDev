/**
 * Custom hooks for Notifications API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type { NotificationsControllerFindMyNotificationsParams } from '../model';

// Types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface NotificationRule {
  id: string;
  name: string;
  event: string;
  channels: string[];
  userRoles?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  type: string;
  subject?: string;
  body: string;
  channels: string[];
  createdAt: string;
  updatedAt: string;
}

// API Functions
const notificationsApi = {
  findNotifications: async (params?: NotificationsControllerFindMyNotificationsParams) => {
    const { data } = await apiClient.get<Notification[]>('/notifications', { params });
    return data;
  },

  getUnreadCount: async () => {
    const { data } = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return data;
  },

  markAsRead: async (id: string) => {
    const { data } = await apiClient.patch(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await apiClient.post('/notifications/mark-all-read');
    return data;
  },

  // Rules
  findRules: async () => {
    const { data } = await apiClient.get<NotificationRule[]>('/notifications/rules');
    return data;
  },

  createRule: async (rule: Partial<NotificationRule>) => {
    const { data } = await apiClient.post<NotificationRule>('/notifications/rules', rule);
    return data;
  },

  updateRule: async ({ id, ...rule }: Partial<NotificationRule> & { id: string }) => {
    const { data } = await apiClient.patch<NotificationRule>(`/notifications/rules/${id}`, rule);
    return data;
  },

  deleteRule: async (id: string) => {
    const { data } = await apiClient.delete(`/notifications/rules/${id}`);
    return data;
  },

  // Templates
  findTemplates: async () => {
    const { data } = await apiClient.get<NotificationTemplate[]>('/notifications/templates');
    return data;
  },

  createTemplate: async (template: Partial<NotificationTemplate>) => {
    const { data } = await apiClient.post<NotificationTemplate>('/notifications/templates', template);
    return data;
  },

  updateTemplate: async ({ id, ...template }: Partial<NotificationTemplate> & { id: string }) => {
    const { data } = await apiClient.patch<NotificationTemplate>(`/notifications/templates/${id}`, template);
    return data;
  },

  deleteTemplate: async (id: string) => {
    const { data } = await apiClient.delete(`/notifications/templates/${id}`);
    return data;
  },
};

// Hooks
export function useNotifications(params?: NotificationsControllerFindMyNotificationsParams) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationsApi.findNotifications(params),
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useNotificationRules() {
  return useQuery({
    queryKey: ['notification-rules'],
    queryFn: () => notificationsApi.findRules(),
  });
}

export function useCreateNotificationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rule: Partial<NotificationRule>) => notificationsApi.createRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-rules'] });
    },
  });
}

export function useUpdateNotificationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...rule }: Partial<NotificationRule> & { id: string }) =>
      notificationsApi.updateRule({ id, ...rule }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-rules'] });
    },
  });
}

export function useDeleteNotificationRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-rules'] });
    },
  });
}

export function useNotificationTemplates() {
  return useQuery({
    queryKey: ['notification-templates'],
    queryFn: () => notificationsApi.findTemplates(),
  });
}

export function useCreateNotificationTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (template: Partial<NotificationTemplate>) => notificationsApi.createTemplate(template),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
    },
  });
}

export function useUpdateNotificationTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...template }: Partial<NotificationTemplate> & { id: string }) =>
      notificationsApi.updateTemplate({ id, ...template }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
    },
  });
}

export function useDeleteNotificationTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
    },
  });
}
