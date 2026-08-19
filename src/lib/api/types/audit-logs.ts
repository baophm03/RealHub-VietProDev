export interface GetAuditLogsMeta {
  total: number;
  limit: number;
  offset: number;
  page: number;
  totalPages: number;
}

export interface GetAuditLogsResponse {
  success: boolean;
  data: AuditLog[];
  meta: GetAuditLogsMeta;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  tenantId: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  beforeJson: Record<string, unknown> | null;
  afterJson: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  user: { id: string; fullName: string; email: string } | null;
}
