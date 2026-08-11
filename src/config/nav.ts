import {
  House,
  Buildings,
  Building,
  Users,
  UserCircle,
  Calendar,
  Handshake,
  Percent,
  Gear,
  FolderSimple,
  Newspaper,
  Headset,
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
        href: "/dashboard/properties",
        icon: Buildings,
        permission: "properties:read",
      },
      {
        label: "Dự án",
        href: "/dashboard/projects",
        icon: Building,
        permission: "properties:read",
      },
      {
        label: "Khách hàng",
        href: "/dashboard/customers",
        icon: Users,
        permission: "customers:read",
      },
      {
        label: "Leads",
        href: "/dashboard/leads",
        icon: UserCircle,
        permission: "leads:read",
      },
      {
        label: "Tư vấn",
        href: "/dashboard/consultations",
        icon: Headset,
        permission: "properties:read",
      },
      {
        label: "Lịch hẹn",
        href: "/dashboard/appointments",
        icon: Calendar,
        permission: "appointments:read",
      },
      {
        label: "Giao dịch",
        href: "/dashboard/deals",
        icon: Handshake,
        permission: "deals:read",
      },
      {
        label: "Hoa hồng",
        href: "/dashboard/commission",
        icon: Percent,
        permission: "commission:read",
      },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      {
        label: "Tin tức",
        href: "/dashboard/news",
        icon: Newspaper,
        permission: "news:read",
      },
      {
        label: "Tài liệu",
        href: "/dashboard/files",
        icon: FolderSimple,
      },
      {
        label: "Cài đặt",
        href: "/dashboard/settings",
        icon: Gear,
        permission: "tenants:read",
      },
    ],
  },
];
