/**
 * Custom hooks for Commission API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type {
  CreateCommissionPlanDto,
  UpdatePlanStatusDto,
  CommissionControllerFindPlansParams,
  CommissionControllerFindDealCommissionsParams,
  EstimateCommissionDto,
} from '../model';

// Types
export interface CommissionPlan {
  id: string;
  name: string;
  description?: string;
  status: string;
  calcType: string;
  calcBase: string;
  rate: number;
  rules?: CommissionRule[];
  splits?: CommissionSplit[];
  effectiveFrom: string;
  effectiveTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionRule {
  id: string;
  planId: string;
  name: string;
  conditions?: Record<string, unknown>;
  calcType?: string;
  rate?: number;
  priority: number;
}

export interface CommissionSplit {
  id: string;
  planId: string;
  role: string;
  type: string;
  value: number;
}

export interface DealCommission {
  id: string;
  dealId: string;
  dealTitle: string;
  planId: string;
  planName: string;
  salesId: string;
  salesName: string;
  expectedAmount?: number;
  confirmedAmount?: number;
  status: string;
  calculatedAt?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommissionEstimate {
  dealId: string;
  planId: string;
  expectedAmount: number;
  splits: {
    role: string;
    amount: number;
  }[];
}

// API Functions
const commissionApi = {
  // Plans
  findPlans: async (params?: CommissionControllerFindPlansParams) => {
    const { data } = await apiClient.get<CommissionPlan[]>('/commission/plans', { params });
    return data;
  },

  findPlanById: async (id: string) => {
    const { data } = await apiClient.get<CommissionPlan>(`/commission/plans/${id}`);
    return data;
  },

  createPlan: async (plan: CreateCommissionPlanDto) => {
    const { data } = await apiClient.post<CommissionPlan>('/commission/plans', plan);
    return data;
  },

  updatePlanStatus: async ({ id, status }: UpdatePlanStatusDto & { id: string }) => {
    const { data } = await apiClient.patch<CommissionPlan>(`/commission/plans/${id}/status`, { status });
    return data;
  },

  // Deal Commissions
  findDealCommissions: async (params?: CommissionControllerFindDealCommissionsParams) => {
    const { data } = await apiClient.get<DealCommission[]>('/commission/deals', { params });
    return data;
  },

  findDealCommissionById: async (id: string) => {
    const { data } = await apiClient.get<DealCommission>(`/commission/deals/${id}`);
    return data;
  },

  // Estimate
  estimateCommission: async (estimate: EstimateCommissionDto) => {
    const { data } = await apiClient.post<CommissionEstimate>('/commission/estimate', estimate);
    return data;
  },
};

// Hooks
export function useCommissionPlans(params?: CommissionControllerFindPlansParams) {
  return useQuery({
    queryKey: ['commission-plans', params],
    queryFn: () => commissionApi.findPlans(params),
  });
}

export function useCommissionPlan(id: string) {
  return useQuery({
    queryKey: ['commission-plan', id],
    queryFn: () => commissionApi.findPlanById(id),
    enabled: !!id,
  });
}

export function useCreateCommissionPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (plan: CreateCommissionPlanDto) => commissionApi.createPlan(plan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-plans'] });
    },
  });
}

export function useUpdateCommissionPlanStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: UpdatePlanStatusDto & { id: string }) =>
      commissionApi.updatePlanStatus({ id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission-plans'] });
    },
  });
}

export function useDealCommissions(params?: CommissionControllerFindDealCommissionsParams) {
  return useQuery({
    queryKey: ['deal-commissions', params],
    queryFn: () => commissionApi.findDealCommissions(params),
  });
}

export function useDealCommission(id: string) {
  return useQuery({
    queryKey: ['deal-commission', id],
    queryFn: () => commissionApi.findDealCommissionById(id),
    enabled: !!id,
  });
}

export function useEstimateCommission() {
  return useMutation({
    mutationFn: (estimate: EstimateCommissionDto) => commissionApi.estimateCommission(estimate),
  });
}
