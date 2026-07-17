/**
 * Custom hooks for Properties API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type {
  CreatePropertyDto,
  PropertiesControllerFindManyParams,
} from '../model';

// Types
export interface Property {
  id: string;
  title: string;
  description?: string;
  propertyType: string;
  transactionType: string;
  sellingMode: string;
  price?: number;
  priceUnit?: string;
  area?: number;
  areaUnit?: string;
  address?: string;
  provinceId?: string;
  districtId?: string;
  wardId?: string;
  projectId?: string;
  businessStatus?: string;
  publicationStatus?: string;
  verificationStatus?: string;
  ownerId?: string;
  assignedToId?: string;
  source?: string;
  media?: PropertyMedia[];
  dynamicValues?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyMedia {
  id: string;
  propertyId: string;
  url: string;
  type: string;
  isPrimary?: boolean;
  sortOrder?: number;
}

// API Functions
const propertiesApi = {
  findProperties: async (params?: PropertiesControllerFindManyParams) => {
    const { data } = await apiClient.get<Property[]>('/properties', { params });
    return data;
  },

  findPropertyById: async (id: string) => {
    const { data } = await apiClient.get<Property>(`/properties/${id}`);
    return data;
  },

  createProperty: async (property: CreatePropertyDto) => {
    const { data } = await apiClient.post<Property>('/properties', property);
    return data;
  },

  updateProperty: async ({ id, ...property }: CreatePropertyDto & { id: string }) => {
    const { data } = await apiClient.patch<Property>(`/properties/${id}`, property);
    return data;
  },

  deleteProperty: async (id: string) => {
    const { data } = await apiClient.delete(`/properties/${id}`);
    return data;
  },

  getPropertyTypes: async () => {
    const { data } = await apiClient.get('/properties/types');
    return data;
  },
};

// Hooks
export function useProperties(params?: PropertiesControllerFindManyParams) {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => propertiesApi.findProperties(params),
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesApi.findPropertyById(id),
    enabled: !!id,
  });
}

export function usePropertyTypes() {
  return useQuery({
    queryKey: ['property-types'],
    queryFn: () => propertiesApi.getPropertyTypes(),
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (property: CreatePropertyDto) => propertiesApi.createProperty(property),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}

export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...property }: CreatePropertyDto & { id: string }) =>
      propertiesApi.updateProperty({ id, ...property }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', variables.id] });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertiesApi.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}
