import {
  Building2,
  Calendar,
  CircleUser,
  Folder,
  Handshake,
  Headset,
  House,
  Key,
  Newspaper,
  Percent,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import type { Actions, Features } from "@/config/casl/ability";

export interface NavItem {
  label: string;
  href: string;
  icon: typeof House;
  permission?: { action: Actions; subject: Features };
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
        icon: Building2,
        permission: { action: "READ", subject: "PROPERTY" },
      },
      {
        label: "Duyệt BĐS",
        href: "/dashboard/verification",
        icon: ShieldCheck,
        permission: { action: "APPROVE", subject: "PROPERTY" },
      },
      {
        label: "Dự án",
        href: "/dashboard/projects",
        icon: Building2,
        permission: { action: "READ", subject: "PROPERTY" },
      },
      {
        label: "Khách hàng",
        href: "/dashboard/customers",
        icon: Users,
        permission: { action: "READ", subject: "CUSTOMER" },
      },
      {
        label: "KH tiềm năng",
        href: "/dashboard/leads",
        icon: CircleUser,
        permission: { action: "READ", subject: "LEAD" },
      },
      {
        label: "Tư vấn",
        href: "/dashboard/consultations",
        icon: Headset,
        permission: { action: "READ", subject: "PROPERTY" },
      },
      {
        label: "Lịch hẹn",
        href: "/dashboard/appointments",
        icon: Calendar,
        permission: { action: "READ", subject: "APPOINTMENT" },
      },
      {
        label: "Giao dịch",
        href: "/dashboard/deals",
        icon: Handshake,
        permission: { action: "READ", subject: "DEAL" },
      },
      // {
      //   label: "Hoa hồng",
      //   href: "/dashboard/commission",
      //   icon: Percent,
      //   permission: { action: "READ", subject: "COMMISSION" },
      // },
    ],
  },
  {
    label: "Hệ thống",
    items: [
      {
        label: "Tin tức",
        href: "/dashboard/news",
        icon: Newspaper,
        permission: { action: "READ", subject: "NEWS" },
      },
      {
        label: "Tài liệu",
        href: "/dashboard/files",
        icon: Folder,
        permission: { action: "READ", subject: "FILE" },
      },
      {
        label: "Phân quyền",
        href: "/dashboard/roles",
        icon: Key,
        permission: { action: "READ", subject: "TENANT" },
      },
      {
        label: "Người dùng",
        href: "/dashboard/users",
        icon: UserCog,
        permission: { action: "READ", subject: "USER" },
      },
      {
        label: "Cài đặt",
        href: "/dashboard/settings",
        icon: Settings,
        permission: { action: "READ", subject: "TENANT" },
      },
    ],
  },
];
