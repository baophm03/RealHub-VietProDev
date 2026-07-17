/**
 * Custom hooks for Dynamic Fields API using axios
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../realhub-client';
import type {
  CreateFieldGroupDto,
  CreateFieldDefinitionDto,
  CreateFormSchemaDto,
  DynamicFieldsControllerFindGroupsParams,
  DynamicFieldsControllerFindDefinitionsParams,
  DynamicFieldsControllerFindFormSchemasParams,
} from '../model';

// Types
export interface FieldGroup {
  id: string;
  name: string;
  entityType: string;
  description?: string;
  sortOrder?: number;
  fields?: FieldDefinition[];
  createdAt: string;
  updatedAt: string;
}

export interface FieldDefinition {
  id: string;
  groupId: string;
  name: string;
  label: string;
  fieldType: string;
  isRequired?: boolean;
  isEditable?: boolean;
  defaultValue?: unknown;
  options?: FieldOption[];
  validation?: Record<string, unknown>;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FieldOption {
  value: string;
  label: string;
}

export interface FormSchema {
  id: string;
  name: string;
  entityType: string;
  description?: string;
  fields?: FormSchemaField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormSchemaField {
  fieldDefinitionId: string;
  name: string;
  label: string;
  fieldType: string;
  isRequired?: boolean;
  sortOrder?: number;
  layout?: Record<string, unknown>;
  conditions?: Record<string, unknown>;
}

// API Functions
const dynamicFieldsApi = {
  // Groups
  findGroups: async (params?: DynamicFieldsControllerFindGroupsParams) => {
    const { data } = await apiClient.get<FieldGroup[]>('/dynamic-fields/groups', { params });
    return data;
  },

  createGroup: async (group: CreateFieldGroupDto) => {
    const { data } = await apiClient.post<FieldGroup>('/dynamic-fields/groups', group);
    return data;
  },

  // Definitions
  findDefinitions: async (params?: DynamicFieldsControllerFindDefinitionsParams) => {
    const { data } = await apiClient.get<FieldDefinition[]>('/dynamic-fields/definitions', { params });
    return data;
  },

  createDefinition: async (definition: CreateFieldDefinitionDto) => {
    const { data } = await apiClient.post<FieldDefinition>('/dynamic-fields/definitions', definition);
    return data;
  },

  updateDefinition: async ({ id, ...definition }: CreateFieldDefinitionDto & { id: string }) => {
    const { data } = await apiClient.patch<FieldDefinition>(`/dynamic-fields/definitions/${id}`, definition);
    return data;
  },

  // Form Schemas
  findFormSchemas: async (params?: DynamicFieldsControllerFindFormSchemasParams) => {
    const { data } = await apiClient.get<FormSchema[]>('/dynamic-fields/form-schemas', { params });
    return data;
  },

  createFormSchema: async (schema: CreateFormSchemaDto) => {
    const { data } = await apiClient.post<FormSchema>('/dynamic-fields/form-schemas', schema);
    return data;
  },
};

// Hooks
export function useFieldGroups(params?: DynamicFieldsControllerFindGroupsParams) {
  return useQuery({
    queryKey: ['field-groups', params],
    queryFn: () => dynamicFieldsApi.findGroups(params),
  });
}

export function useCreateFieldGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (group: CreateFieldGroupDto) => dynamicFieldsApi.createGroup(group),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-groups'] });
    },
  });
}

export function useFieldDefinitions(params?: DynamicFieldsControllerFindDefinitionsParams) {
  return useQuery({
    queryKey: ['field-definitions', params],
    queryFn: () => dynamicFieldsApi.findDefinitions(params),
  });
}

export function useCreateFieldDefinition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (definition: CreateFieldDefinitionDto) =>
      dynamicFieldsApi.createDefinition(definition),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-definitions'] });
    },
  });
}

export function useUpdateFieldDefinition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...definition }: CreateFieldDefinitionDto & { id: string }) =>
      dynamicFieldsApi.updateDefinition({ id, ...definition }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-definitions'] });
    },
  });
}

export function useFormSchemas(params?: DynamicFieldsControllerFindFormSchemasParams) {
  return useQuery({
    queryKey: ['form-schemas', params],
    queryFn: () => dynamicFieldsApi.findFormSchemas(params),
  });
}

export function useCreateFormSchema() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (schema: CreateFormSchemaDto) => dynamicFieldsApi.createFormSchema(schema),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['form-schemas'] });
    },
  });
}
