// Shared types for roles page & dialogs
// BE wraps responses via TransformInterceptor: { success, data, timestamp }

export interface RolePermission {
  id: string;
  module: string;
  action: string;
  createdAt: string;
}

export interface Role {
  id: string;
  code: string;
  name: string;
  description: string | null;
  status: string;
  permissions: RolePermission[];
  _count?: { membershipRoles: number; permissions: number };
  createdAt: string;
  updatedAt: string;
}

export interface RolesResponse {
  success: boolean;
  data: Role[];
  timestamp: string;
}

export interface RoleDetailResponse {
  success: boolean;
  data: Role;
  timestamp: string;
}

export interface PermissionActionDef {
  action: string;
  label: string;
  description?: string;
}

export interface PermissionModuleDef {
  module: string;
  label: string;
  description?: string;
  actions: PermissionActionDef[];
}

export interface PermissionsResponse {
  success: boolean;
  data: PermissionModuleDef[];
  timestamp: string;
}

export interface RoleUser {
  membershipRoleId: string;
  membershipId: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  userStatus: string;
  roleCode: string;
  assignedAt: string;
}

export interface RoleUsersResponse {
  success: boolean;
  data: RoleUser[];
  timestamp: string;
}

export interface TenantUser {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  phoneNormalized: string | null;
  avatarUrl: string | null;
  status: string;
  lastLoginAt: string | null;
  createdAt: string;
  roles: { id: string; code: string; name: string }[];
}

export interface TenantUsersResponse {
  success: boolean;
  data: TenantUser[];
  meta: { total: number; limit: number; offset: number; page: number; totalPages: number };
  timestamp: string;
}
