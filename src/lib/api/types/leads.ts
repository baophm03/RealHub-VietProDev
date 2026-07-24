export interface GetLeadsResponse {
  items: Lead[];
  total: number;
  limit: number;
  offset: number;
  nextCursor: string | null;
}

export interface Lead {
  id: string;
  leadCode: string;
  tenantId: string;
  customerId: string | null;
  customerNeedId: string | null;
  propertyId: string | null;
  assignmentId: string | null;
  source: string;
  sourceUserId: string | null;
  ownerUserId: string | null;
  assignedSalesId: string | null;
  assignedTeamId: string | null;
  phoneNormalized: string | null;
  protectionUntil: string | null;
  status: string;
  duplicateStatus: string | null;
  metadata: Record<string, unknown> | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  customer: { id: string; fullName: string; phone: string } | null;
  property: { id: string; title: string; propertyCode: string } | null;
  assignedSales: { id: string; fullName: string } | null;
}
