export interface AuthMeResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  phoneNormalized: string | null;
  avatarUrl: string | null;
  status: string;
  tokenVersion: number;
  memberships: Array<{
    id: string;
    tenantId: string;
    userId: string;
    roleId: string;
    roleCode: string;
    status: string;
    joinedAt: string;
    invitedBy: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
}

export interface GetAuthMeResponse {
  success: boolean;
  data: AuthMeResponse;
  timestamp: string;
}