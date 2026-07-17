/**
 * Custom hooks for Leads API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type {
  CreateLeadDto,
  UpdateLeadDto,
  LeadsControllerFindLeadsParams,
  CreateLeadActivityDto,
} from '../model';

// Types
export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  status: string;
  propertyId?: string;
  assignedToId?: string;
  createdById?: string;
  customerId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface LeadActivity {
  id: string;
  leadId: string;
  type: string;
  content: string;
  metadata?: Record<string, unknown>;
  createdById: string;
  createdAt: string;
}

// API Functions
const leadsApi = {
  findLeads: async (params?: LeadsControllerFindLeadsParams) => {
    const { data } = await apiClient.get<Lead[]>('/leads', { params });
    return data;
  },

  findLeadById: async (id: string) => {
    const { data } = await apiClient.get<Lead>(`/leads/${id}`);
    return data;
  },

  createLead: async (lead: CreateLeadDto) => {
    const { data } = await apiClient.post<Lead>('/leads', lead);
    return data;
  },

  updateLead: async ({ id, ...lead }: UpdateLeadDto & { id: string }) => {
    const { data } = await apiClient.patch<Lead>(`/leads/${id}`, lead);
    return data;
  },

  deleteLead: async (id: string) => {
    const { data } = await apiClient.delete(`/leads/${id}`);
    return data;
  },

  getActivities: async (leadId: string) => {
    const { data } = await apiClient.get<LeadActivity[]>(`/leads/${leadId}/activities`);
    return data;
  },

  addActivity: async ({ leadId, ...activity }: CreateLeadActivityDto & { leadId: string }) => {
    const { data } = await apiClient.post<LeadActivity>(`/leads/${leadId}/activities`, activity);
    return data;
  },
};

// Hooks
export function useLeads(params?: LeadsControllerFindLeadsParams) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: () => leadsApi.findLeads(params),
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadsApi.findLeadById(id),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (lead: CreateLeadDto) => leadsApi.createLead(lead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useUpdateLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...lead }: UpdateLeadDto & { id: string }) =>
      leadsApi.updateLead({ id, ...lead }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', variables.id] });
    },
  });
}

export function useDeleteLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useLeadActivities(leadId: string) {
  return useQuery({
    queryKey: ['lead-activities', leadId],
    queryFn: () => leadsApi.getActivities(leadId),
    enabled: !!leadId,
  });
}

export function useAddLeadActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leadId, ...activity }: CreateLeadActivityDto & { leadId: string }) =>
      leadsApi.addActivity({ leadId, ...activity }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['lead-activities', variables.leadId] });
    },
  });
}
