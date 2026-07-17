/**
 * Custom hooks for Deals API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type {
  CreateDealDto,
  UpdateDealDto,
  DealsControllerFindDealsParams,
  CreateDealActivityDto,
  CreateReservationDto,
} from '../model';

// Types
export interface Deal {
  id: string;
  title: string;
  customerId: string;
  customerName?: string;
  propertyId?: string;
  propertyTitle?: string;
  transactionType: string;
  expectedValue?: number;
  actualValue?: number;
  status: string;
  assignedToId?: string;
  assignedToName?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DealActivity {
  id: string;
  dealId: string;
  type: string;
  content: string;
  metadata?: Record<string, unknown>;
  createdById: string;
  createdByName?: string;
  createdAt: string;
}

export interface Reservation {
  id: string;
  dealId: string;
  type: string;
  status: string;
  expiresAt?: string;
  approvedById?: string;
  approvedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// API Functions
const dealsApi = {
  findDeals: async (params?: DealsControllerFindDealsParams) => {
    const { data } = await apiClient.get<Deal[]>('/deals', { params });
    return data;
  },

  findDealById: async (id: string) => {
    const { data } = await apiClient.get<Deal>(`/deals/${id}`);
    return data;
  },

  createDeal: async (deal: CreateDealDto) => {
    const { data } = await apiClient.post<Deal>('/deals', deal);
    return data;
  },

  updateDeal: async ({ id, ...deal }: UpdateDealDto & { id: string }) => {
    const { data } = await apiClient.patch<Deal>(`/deals/${id}`, deal);
    return data;
  },

  deleteDeal: async (id: string) => {
    const { data } = await apiClient.delete(`/deals/${id}`);
    return data;
  },

  getActivities: async (dealId: string) => {
    const { data } = await apiClient.get<DealActivity[]>(`/deals/${dealId}/activities`);
    return data;
  },

  addActivity: async ({ dealId, ...activity }: CreateDealActivityDto & { dealId: string }) => {
    const { data } = await apiClient.post<DealActivity>(`/deals/${dealId}/activities`, activity);
    return data;
  },

  findReservations: async (params?: DealsControllerFindDealsParams) => {
    const { data } = await apiClient.get<Reservation[]>('/reservations', { params });
    return data;
  },

  createReservation: async (reservation: CreateReservationDto) => {
    const { data } = await apiClient.post<Reservation>('/reservations', reservation);
    return data;
  },

  approveReservation: async (id: string) => {
    const { data } = await apiClient.patch<Reservation>(`/reservations/${id}/approve`);
    return data;
  },

  rejectReservation: async (id: string) => {
    const { data } = await apiClient.patch<Reservation>(`/reservations/${id}/reject`);
    return data;
  },
};

// Hooks
export function useDeals(params?: DealsControllerFindDealsParams) {
  return useQuery({
    queryKey: ['deals', params],
    queryFn: () => dealsApi.findDeals(params),
  });
}

export function useDeal(id: string) {
  return useQuery({
    queryKey: ['deal', id],
    queryFn: () => dealsApi.findDealById(id),
    enabled: !!id,
  });
}

export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deal: CreateDealDto) => dealsApi.createDeal(deal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...deal }: UpdateDealDto & { id: string }) =>
      dealsApi.updateDeal({ id, ...deal }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['deal', variables.id] });
    },
  });
}

export function useDeleteDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dealsApi.deleteDeal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
    },
  });
}

export function useDealActivities(dealId: string) {
  return useQuery({
    queryKey: ['deal-activities', dealId],
    queryFn: () => dealsApi.getActivities(dealId),
    enabled: !!dealId,
  });
}

export function useAddDealActivity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dealId, ...activity }: CreateDealActivityDto & { dealId: string }) =>
      dealsApi.addActivity({ dealId, ...activity }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['deal-activities', variables.dealId] });
    },
  });
}

export function useReservations(params?: DealsControllerFindDealsParams) {
  return useQuery({
    queryKey: ['reservations', params],
    queryFn: () => dealsApi.findReservations(params),
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservation: CreateReservationDto) => dealsApi.createReservation(reservation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useApproveReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dealsApi.approveReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}

export function useRejectReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => dealsApi.rejectReservation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
    },
  });
}
