export interface AuthMePermission {
  module: string;
  action: string;
}

export interface AuthMeRole {
  code: string;
  name: string;
  description: string | null;
  permissions: AuthMePermission[];
}

export interface AuthMeResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  avatarUrl: string | null;
  status: string;
  roles: AuthMeRole[];
  lastLoginAt: string | null;
  createdAt: string;
}

export interface GetAuthMeResponse {
  success: boolean;
  data: AuthMeResponse;
  timestamp: string;
}
