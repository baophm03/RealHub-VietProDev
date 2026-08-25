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
import { portalEntries } from "@/config/portal-entry";

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

const entryPortal = portalEntries["sales-portal"];

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
        href: `/${entryPortal?.slug}/properties`,
        icon: Building2,
        permission: { action: "READ", subject: "PROPERTY" },
      },
      {
        label: "Duyệt BĐS",
        href: `/${entryPortal?.slug}/verification`,
        icon: ShieldCheck,
        permission: { action: "APPROVE", subject: "PROPERTY" },
      },
      {
        label: "Dự án",
        href: `/${entryPortal?.slug}/projects`,
        icon: Building2,
        permission: { action: "READ", subject: "PROPERTY" },
      },
      {
        label: "Khách hàng",
        href: `/${entryPortal?.slug}/customers`,
        icon: Users,
        permission: { action: "READ", subject: "CUSTOMER" },
      },
      {
        label: "KH tiềm năng",
        href: `/${entryPortal?.slug}/leads`,
        icon: CircleUser,
        permission: { action: "READ", subject: "LEAD" },
      },
      {
        label: "Tư vấn",
        href: `/${entryPortal?.slug}/consultations`,
        icon: Headset,
        permission: { action: "READ", subject: "PROPERTY" },
      },
      {
        label: "Lịch hẹn",
        href: `/${entryPortal?.slug}/appointments`,
        icon: Calendar,
        permission: { action: "READ", subject: "APPOINTMENT" },
      },
      {
        label: "Giao dịch",
        href: `/${entryPortal?.slug}/deals`,
        icon: Handshake,
        permission: { action: "READ", subject: "DEAL" },
      },
      // {
      //   label: "Hoa hồng",
      //   href: `/${entryPortal?.slug}/commission`,
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
        href: `/${entryPortal?.slug}/news`,
        icon: Newspaper,
        permission: { action: "READ", subject: "NEWS" },
      },
      {
        label: "Tài liệu",
        href: `/${entryPortal?.slug}/files`,
        icon: Folder,
        permission: { action: "READ", subject: "FILE" },
      },
      {
        label: "Phân quyền",
        href: `/${entryPortal?.slug}/roles`,
        icon: Key,
        permission: { action: "READ", subject: "TENANT" },
      },
      {
        label: "Người dùng",
        href: `/${entryPortal?.slug}/users`,
        icon: UserCog,
        permission: { action: "READ", subject: "USER" },
      },
      {
        label: "Cài đặt",
        href: `/${entryPortal?.slug}/settings`,
        icon: Settings,
        permission: { action: "READ", subject: "TENANT" },
      },
    ],
  },
];
