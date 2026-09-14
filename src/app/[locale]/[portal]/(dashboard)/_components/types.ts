export interface ChartPoint {
  label: string;
  value: number;
}

export interface ChartsData {
  dealsTrend: ChartPoint[];
  leadsTrend: ChartPoint[];
  propertiesByVerification: ChartPoint[];
  dealsByStatus: ChartPoint[];
  leadsByStatus: ChartPoint[];
  myPropertiesByPublication: ChartPoint[];
}

export interface DashboardLead {
  id: string;
  status: string;
  phoneNormalized?: string;
  customer?: { fullName?: string; phone?: string };
  property?: { title?: string };
}
