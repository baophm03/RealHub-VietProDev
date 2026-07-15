import {
  House,
  Buildings,
  Users,
  UserCircle,
  Calendar,
  Handshake,
  Percent,
  Gear,
  FolderSimple,
} from "@phosphor-icons/react";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof House;
  permission?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: "Tổng quan",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: House,
      },
    ],
  },
  {
    label: "Kinh doanh",
    items: [
      {
        label: "Bất động sản",
        href: "/properties",
        icon: Buildings,
        permission: "properties:read",
      },
      {
        label: "Khách hàng",
        href: "/customers",
        icon: Users,
        permission: "customers:read",
      },
      {
        label: "Leads",
        href: "/leads",
        icon: UserCircle,
        permission: "leads:read",
      },
      {
        label: "Lịch hẹn",
        href: "/appointments",
        icon: Calendar,
        permission: "appointments:read",
      },
      {
        label: "Giao dịch",
        href: "/deals",
        icon: Handshake,
        permission: "deals:read",
      },
      {
        label: "Hoa hồng",
        href: "/commission",
        icon: Percent,
        permission: "commission:read",
      },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      {
        label: "Tài liệu",
        href: "/files",
        icon: FolderSimple,
      },
      {
        label: "Cài đặt",
        href: "/settings",
        icon: Gear,
        permission: "tenants:read",
      },
    ],
  },
];
