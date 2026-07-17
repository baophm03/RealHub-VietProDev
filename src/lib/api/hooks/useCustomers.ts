/**
 * Custom hooks for Customers API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type {
  CreateCustomerDto,
  UpdateCustomerDto,
  CustomersControllerFindCustomersParams,
  CreateCustomerNeedDto,
} from '../model';

// Types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  type: string;
  status: string;
  needs?: string;
  budget?: string;
  assignedToId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerNeed {
  id: string;
  customerId: string;
  purpose: string;
  transactionType: string;
  propertyTypes?: string[];
  provinces?: string[];
  districts?: string[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  description?: string;
  dynamicValues?: Record<string, unknown>;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// API Functions
const customersApi = {
  findCustomers: async (params?: CustomersControllerFindCustomersParams) => {
    const { data } = await apiClient.get<Customer[]>('/customers', { params });
    return data;
  },

  findCustomerById: async (id: string) => {
    const { data } = await apiClient.get<Customer>(`/customers/${id}`);
    return data;
  },

  createCustomer: async (customer: CreateCustomerDto) => {
    const { data } = await apiClient.post<Customer>('/customers', customer);
    return data;
  },

  updateCustomer: async ({ id, ...customer }: UpdateCustomerDto & { id: string }) => {
    const { data } = await apiClient.patch<Customer>(`/customers/${id}`, customer);
    return data;
  },

  deleteCustomer: async (id: string) => {
    const { data } = await apiClient.delete(`/customers/${id}`);
    return data;
  },

  findNeeds: async (customerId?: string) => {
    const { data } = await apiClient.get<CustomerNeed[]>('/customer-needs', {
      params: customerId ? { customerId } : undefined,
    });
    return data;
  },

  createNeed: async (need: CreateCustomerNeedDto) => {
    const { data } = await apiClient.post<CustomerNeed>('/customer-needs', need);
    return data;
  },
};

// Hooks
export function useCustomers(params?: CustomersControllerFindCustomersParams) {
  return useQuery({
    queryKey: ['customers', params],
    queryFn: () => customersApi.findCustomers(params),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => customersApi.findCustomerById(id),
    enabled: !!id,
  });
}

export function useCustomerNeeds(customerId?: string) {
  return useQuery({
    queryKey: ['customer-needs', customerId],
    queryFn: () => customersApi.findNeeds(customerId),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customer: CreateCustomerDto) => customersApi.createCustomer(customer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...customer }: UpdateCustomerDto & { id: string }) =>
      customersApi.updateCustomer({ id, ...customer }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['customer', variables.id] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => customersApi.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useCreateCustomerNeed() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (need: CreateCustomerNeedDto) => customersApi.createNeed(need),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-needs'] });
    },
  });
}
