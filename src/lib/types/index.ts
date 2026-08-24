export type UserRole =
  | "SUPER_ADMIN"
  | "AGENCY_ADMIN"
  | "TEAM_LEADER"
  | "SALES"
  | "COLLABORATOR"
  | "OPERATOR"
  | "CUSTOMER"
  | "OWNER";

export type TenantType = "AGENCY" | "DEVELOPER" | "DISTRIBUTOR";

export type TransactionType = "SALE" | "RENT" | "TRANSFER" | "INVESTMENT";

export type BusinessStatus =
  | "AVAILABLE"
  | "RESERVED"
  | "SOLD"
  | "RENTED"
  | "OFF_MARKET";

export type PublicationStatus = "PRIVATE" | "PUBLIC" | "ARCHIVED";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "NEGOTIATING"
  | "CONVERTED"
  | "LOST"
  | "RECYCLED";

export type LeadSource =
  | "WEBSITE"
  | "PROPERTY_DETAIL"
  | "OWNER_PAGE"
  | "SALES_LINK"
  | "CTV_LINK"
  | "AGENCY_MARKETING"
  | "MANUAL_INPUT"
  | "LEAD_POOL"
  | "IMPORT";

export type AppointmentType = "MEETING" | "CALL" | "SITE_VISIT" | "SIGNING";

export type DealActivityType =
  | "NOTE"
  | "STATUS_CHANGE"
  | "CALL"
  | "EMAIL"
  | "MEETING"
  | "DOCUMENT";

export type ReservationType = "SOFT" | "HARD";

export type CommissionPlanStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "ARCHIVED";

export type CalculationType = "PERCENT" | "FIXED";

export type CalculationBase = "EXPECTED_VALUE" | "ACTUAL_VALUE" | "NET_VALUE";

export type SplitType = "PERCENT" | "FIXED";

export type FileVisibility =
  | "PUBLIC"
  | "TENANT"
  | "ASSIGNED"
  | "PRIVATE"
  | "SENSITIVE";

export type LocationType = "COUNTRY" | "PROVINCE" | "DISTRICT" | "WARD" | "STREET";

export interface RolePermission {
  module: string;
  action: string;
}

export interface Role {
  code: string;
  name: string;
  description: string | null;
  permissions: RolePermission[];
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  status: string;
  role: Role | null;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

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

export interface PaginatedResponse<T> {
  data: T[];
  limit: number;
  offset: number;
  hasMore?: boolean;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error: string;
}
