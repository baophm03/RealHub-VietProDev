/**
 * Custom hooks for Locations API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type {
  CreateLocationDto,
  LocationsControllerFindManyParams,
} from '../model';

// Types
export interface Location {
  id: string;
  name: string;
  code: string;
  type: string;
  slug?: string;
  parentId?: string;
  parentName?: string;
  sortOrder?: number;
  status: string;
  children?: Location[];
  createdAt: string;
  updatedAt: string;
}

export interface LocationTree {
  id: string;
  name: string;
  code: string;
  type: string;
  children?: LocationTree[];
}

// API Functions
const locationsApi = {
  findLocations: async (params?: LocationsControllerFindManyParams) => {
    const { data } = await apiClient.get<Location[]>('/locations', { params });
    return data;
  },

  findLocationById: async (id: string) => {
    const { data } = await apiClient.get<Location>(`/locations/${id}`);
    return data;
  },

  getTree: async (type?: string) => {
    const { data } = await apiClient.get<LocationTree[]>('/locations/tree', {
      params: type ? { type } : undefined,
    });
    return data;
  },

  createLocation: async (location: CreateLocationDto) => {
    const { data } = await apiClient.post<Location>('/locations', location);
    return data;
  },

  updateLocation: async ({ id, ...location }: CreateLocationDto & { id: string }) => {
    const { data } = await apiClient.patch<Location>(`/locations/${id}`, location);
    return data;
  },

  deleteLocation: async (id: string) => {
    const { data } = await apiClient.delete(`/locations/${id}`);
    return data;
  },
};

// Hooks
export function useLocations(params?: LocationsControllerFindManyParams) {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => locationsApi.findLocations(params),
  });
}

export function useLocation(id: string) {
  return useQuery({
    queryKey: ['location', id],
    queryFn: () => locationsApi.findLocationById(id),
    enabled: !!id,
  });
}

export function useLocationTree(type?: string) {
  return useQuery({
    queryKey: ['location-tree', type],
    queryFn: () => locationsApi.getTree(type),
  });
}

export function useCreateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (location: CreateLocationDto) => locationsApi.createLocation(location),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['location-tree'] });
    },
  });
}

export function useUpdateLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...location }: CreateLocationDto & { id: string }) =>
      locationsApi.updateLocation({ id, ...location }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['location', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['location-tree'] });
    },
  });
}

export function useDeleteLocation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => locationsApi.deleteLocation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
      queryClient.invalidateQueries({ queryKey: ['location-tree'] });
    },
  });
}
