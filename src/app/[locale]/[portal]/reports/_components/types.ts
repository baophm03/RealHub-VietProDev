export interface SalesReport {
  deals: {
    total: number;
    byStatus: Record<string, number>;
    totalExpectedValue: number;
    totalFinalValue: number;
    bySales: Record<string, number>;
  };
  leads: {
    total: number;
    byStatus: Record<string, number>;
    bySource: Record<string, number>;
  };
  appointments: {
    total: number;
    byStatus: Record<string, number>;
  };
  reservations: {
    total: number;
    byStatus: Record<string, number>;
  };
}

export interface ByRoleEntry {
  estimated: number;
  confirmed: number;
  count: number;
}

export interface CommissionReport {
  total: number;
  byStatus: Record<string, number>;
  totalEstimated: number;
  totalConfirmed: number;
  byRole: Record<string, ByRoleEntry>;
}

export interface PropertiesReport {
  total: number;
  bySellingMode: Record<string, number>;
  byVerification: Record<string, number>;
  byPublication: Record<string, number>;
  byBusiness: Record<string, number>;
  totalValue: number;
}

export interface TeamMember {
  user: { id: string; fullName: string; email: string };
  roles: string[];
  stats: { deals: number; leads: number; appointments: number };
}
