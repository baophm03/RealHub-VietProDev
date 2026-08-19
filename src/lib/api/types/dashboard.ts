export interface DashboardSummary {
  success: true;
  data: {
    properties: number;
    customers: number;
    leads: number;
    dealsThisMonth: number;
    month: {
      start: string;
      end: string;
      label: string;
    };
  }
  timestamp: string;
}
