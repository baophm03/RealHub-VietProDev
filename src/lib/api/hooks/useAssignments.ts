/**
 * Custom hooks for Assignments API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type { AssignmentsControllerFindAssignmentsParams } from '../model';

// Types
export interface Assignment {
  id: string;
  propertyId: string;
  propertyTitle?: string;
  userId: string;
  userName?: string;
  teamId?: string;
  teamName?: string;
  status: string;
  startDate: string;
  endDate?: string;
  isExclusive: boolean;
  maxLeads?: number;
  currentLeads?: number;
  createdById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentPolicy {
  id: string;
  name: string;
  description?: string;
  maxAssignmentsPerUser?: number;
  maxAssignmentsPerTeam?: number;
  assignmentDuration?: number;
  autoExpire: boolean;
  requireApproval: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Functions
const assignmentsApi = {
  // Assignments
  findAssignments: async (params?: AssignmentsControllerFindAssignmentsParams) => {
    const { data } = await apiClient.get<Assignment[]>('/assignments', { params });
    return data;
  },

  findAssignmentById: async (id: string) => {
    const { data } = await apiClient.get<Assignment>(`/assignments/${id}`);
    return data;
  },

  findExpiredAssignments: async () => {
    const { data } = await apiClient.get<Assignment[]>('/assignments/expired');
    return data;
  },

  createAssignment: async (assignment: { propertyId: string; userId: string; endDate?: string }) => {
    const { data } = await apiClient.post<Assignment>('/assignments', assignment);
    return data;
  },

  revokeAssignment: async (id: string) => {
    const { data } = await apiClient.patch<Assignment>(`/assignments/${id}/revoke`);
    return data;
  },

  extendAssignment: async ({ id, endDate }: { id: string; endDate: string }) => {
    const { data } = await apiClient.patch<Assignment>(`/assignments/${id}/extend`, { endDate });
    return data;
  },

  expireAssignment: async (id: string) => {
    const { data } = await apiClient.post(`/assignments/expire`, { assignmentId: id });
    return data;
  },

  getAssignmentByCode: async (code: string) => {
    const { data } = await apiClient.get<Assignment>(`/assignments/link/${code}`);
    return data;
  },

  // Policies
  findPolicies: async () => {
    const { data } = await apiClient.get<AssignmentPolicy[]>('/assignments/policies');
    return data;
  },

  findPolicyById: async (id: string) => {
    const { data } = await apiClient.get<AssignmentPolicy>(`/assignments/policies/${id}`);
    return data;
  },

  createPolicy: async (policy: Partial<AssignmentPolicy>) => {
    const { data } = await apiClient.post<AssignmentPolicy>('/assignments/policies', policy);
    return data;
  },

  updatePolicy: async ({ id, ...policy }: Partial<AssignmentPolicy> & { id: string }) => {
    const { data } = await apiClient.patch<AssignmentPolicy>(`/assignments/policies/${id}`, policy);
    return data;
  },

  deletePolicy: async (id: string) => {
    const { data } = await apiClient.delete(`/assignments/policies/${id}`);
    return data;
  },
};

// Hooks
export function useAssignments(params?: AssignmentsControllerFindAssignmentsParams) {
  return useQuery({
    queryKey: ['assignments', params],
    queryFn: () => assignmentsApi.findAssignments(params),
  });
}

export function useAssignment(id: string) {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: () => assignmentsApi.findAssignmentById(id),
    enabled: !!id,
  });
}

export function useExpiredAssignments() {
  return useQuery({
    queryKey: ['assignments', 'expired'],
    queryFn: () => assignmentsApi.findExpiredAssignments(),
  });
}

export function useAssignmentByCode(code: string) {
  return useQuery({
    queryKey: ['assignment', 'code', code],
    queryFn: () => assignmentsApi.getAssignmentByCode(code),
    enabled: !!code,
  });
}

export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignment: { propertyId: string; userId: string; endDate?: string }) =>
      assignmentsApi.createAssignment(assignment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}

export function useRevokeAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentsApi.revokeAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}

export function useExtendAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, endDate }: { id: string; endDate: string }) =>
      assignmentsApi.extendAssignment({ id, endDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}

export function useExpireAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentsApi.expireAssignment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}

// Policy hooks
export function useAssignmentPolicies() {
  return useQuery({
    queryKey: ['assignment-policies'],
    queryFn: () => assignmentsApi.findPolicies(),
  });
}

export function useAssignmentPolicy(id: string) {
  return useQuery({
    queryKey: ['assignment-policy', id],
    queryFn: () => assignmentsApi.findPolicyById(id),
    enabled: !!id,
  });
}

export function useCreateAssignmentPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (policy: Partial<AssignmentPolicy>) => assignmentsApi.createPolicy(policy),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-policies'] });
    },
  });
}

export function useUpdateAssignmentPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...policy }: Partial<AssignmentPolicy> & { id: string }) =>
      assignmentsApi.updatePolicy({ id, ...policy }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-policies'] });
    },
  });
}

export function useDeleteAssignmentPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => assignmentsApi.deletePolicy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment-policies'] });
    },
  });
}
