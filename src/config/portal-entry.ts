import { Building2, LayoutDashboard, Store, UserCircle } from "lucide-react";
import type { UserRole } from "@/lib/types";

export const dashboardRoles: UserRole[] = ["SUPER_ADMIN", "OPERATOR", "AGENCY_ADMIN", "TEAM_LEADER"];
export const salesRoles: UserRole[] = ["SALES", "COLLABORATOR"];
export const customerRoles: UserRole[] = ["CUSTOMER"];
export const ownerRoles: UserRole[] = ["OWNER"];

export type PortalSlug = "dashboard" | "sales-portal" | "customer-portal" | "owner-portal";

export interface PortalEntry {
  slug: PortalSlug;
  label: string;
  icon: typeof LayoutDashboard;
  roles: UserRole[];
}

export const portalEntries: Record<PortalSlug, PortalEntry> = {
  "dashboard": {
    slug: "dashboard",
    label: "Bảng điều khiển",
    icon: LayoutDashboard,
    roles: dashboardRoles,
  },
  "sales-portal": {
    slug: "sales-portal",
    label: "Sales Portal",
    icon: Store,
    roles: salesRoles,
  },
  "customer-portal": {
    slug: "customer-portal",
    label: "Customer Portal",
    icon: UserCircle,
    roles: customerRoles,
  },
  "owner-portal": {
    slug: "owner-portal",
    label: "Owner Portal",
    icon: Building2,
    roles: ownerRoles,
  },
};

export function isValidPortalSlug(slug: string): slug is PortalSlug {
  return slug in portalEntries;
}

export function getPortalEntry(roleCode?: string | null): PortalEntry | null {
  if (!roleCode) return null;
  if (dashboardRoles.includes(roleCode as UserRole)) {
    return portalEntries["dashboard"];
  }
  if (salesRoles.includes(roleCode as UserRole)) {
    return portalEntries["sales-portal"];
  }
  if (customerRoles.includes(roleCode as UserRole)) {
    return portalEntries["customer-portal"];
  }
  if (ownerRoles.includes(roleCode as UserRole)) {
    return portalEntries["owner-portal"];
  }
  return null;
}

export function canAccessPortal(portal: string, roleCode?: string | null): boolean {
  if (!roleCode) return false;
  const slug = portal.startsWith("/") ? (portal.slice(1) as PortalSlug) : (portal as PortalSlug);
  if (!isValidPortalSlug(slug)) return false;
  return portalEntries[slug].roles.includes(roleCode as UserRole);
}
