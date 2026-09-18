export type TenantType = "AGENCY" | "DEVELOPER" | "DISTRIBUTOR";

export interface Tenant {
  id: string;
  name: string;
  code: string;
  type: TenantType;
  logoUrl?: string;
  primaryColor?: string;
  domains: string[];
}

export interface TenantSettings {
  [key: string]: unknown;
}
