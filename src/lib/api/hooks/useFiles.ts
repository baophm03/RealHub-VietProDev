/**
 * Custom hooks for Files API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type { FileUploadControllerListFilesParams } from '../model';

// Types
export interface FileRecord {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url?: string;
  visibility: string;
  entityType?: string;
  entityId?: string;
  uploadedById?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileUploadResponse {
  id: string;
  name: string;
  url: string;
  mimeType: string;
  size: number;
}

// API Functions
const filesApi = {
  listFiles: async (params?: FileUploadControllerListFilesParams) => {
    const { data } = await apiClient.get<FileRecord[]>('/files', { params });
    return data;
  },

  getFileById: async (id: string) => {
    const { data } = await apiClient.get<FileRecord>(`/files/${id}`);
    return data;
  },

  uploadFile: async (file: File, entityType?: string, entityId?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (entityType) formData.append('entityType', entityType);
    if (entityId) formData.append('entityId', entityId);

    const { data } = await apiClient.post<FileRecord>('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  uploadFiles: async (files: File[], entityType?: string, entityId?: string) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    if (entityType) formData.append('entityType', entityType);
    if (entityId) formData.append('entityId', entityId);

    const { data } = await apiClient.post<FileRecord[]>('/files/upload-multiple', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  deleteFile: async (id: string) => {
    const { data } = await apiClient.delete(`/files/${id}`);
    return data;
  },

  updateVisibility: async ({ id, visibility }: { id: string; visibility: string }) => {
    const { data } = await apiClient.patch<FileRecord>(`/files/${id}/visibility`, { visibility });
    return data;
  },

  getDownloadUrl: async (id: string) => {
    const { data } = await apiClient.get<{ url: string }>(`/files/${id}/download`);
    return data;
  },
};

// Hooks
export function useFiles(params?: FileUploadControllerListFilesParams) {
  return useQuery({
    queryKey: ['files', params],
    queryFn: () => filesApi.listFiles(params),
  });
}

export function useFile(id: string) {
  return useQuery({
    queryKey: ['file', id],
    queryFn: () => filesApi.getFileById(id),
    enabled: !!id,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ file, entityType, entityId }: { file: File; entityType?: string; entityId?: string }) =>
      filesApi.uploadFile(file, entityType, entityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useUploadFiles() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ files, entityType, entityId }: { files: File[]; entityType?: string; entityId?: string }) =>
      filesApi.uploadFiles(files, entityType, entityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => filesApi.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}

export function useUpdateFileVisibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, visibility }: { id: string; visibility: string }) =>
      filesApi.updateVisibility({ id, visibility }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
  });
}
