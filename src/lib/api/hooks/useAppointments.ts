/**
 * Custom hooks for Appointments API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentsControllerFindAppointmentsParams,
} from '../model';

// Types
export interface Appointment {
  id: string;
  title: string;
  type: string;
  status: string;
  scheduledAt: string;
  duration?: number;
  location?: string;
  meetingUrl?: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  propertyId?: string;
  propertyTitle?: string;
  assignedToId?: string;
  assignedToName?: string;
  notes?: string;
  createdById?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// API Functions
const appointmentsApi = {
  findAppointments: async (params?: AppointmentsControllerFindAppointmentsParams) => {
    const { data } = await apiClient.get<Appointment[]>('/appointments', { params });
    return data;
  },

  findAppointmentById: async (id: string) => {
    const { data } = await apiClient.get<Appointment>(`/appointments/${id}`);
    return data;
  },

  createAppointment: async (appointment: CreateAppointmentDto) => {
    const { data } = await apiClient.post<Appointment>('/appointments', appointment);
    return data;
  },

  updateAppointment: async ({ id, ...appointment }: UpdateAppointmentDto & { id: string }) => {
    const { data } = await apiClient.patch<Appointment>(`/appointments/${id}`, appointment);
    return data;
  },

  deleteAppointment: async (id: string) => {
    const { data } = await apiClient.delete(`/appointments/${id}`);
    return data;
  },
};

// Hooks
export function useAppointments(params?: AppointmentsControllerFindAppointmentsParams) {
  return useQuery({
    queryKey: ['appointments', params],
    queryFn: () => appointmentsApi.findAppointments(params),
  });
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsApi.findAppointmentById(id),
    enabled: !!id,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointment: CreateAppointmentDto) => appointmentsApi.createAppointment(appointment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...appointment }: UpdateAppointmentDto & { id: string }) =>
      appointmentsApi.updateAppointment({ id, ...appointment }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment', variables.id] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appointmentsApi.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
