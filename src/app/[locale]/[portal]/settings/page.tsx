"use client";

import { usePortalPath } from "@/lib/hooks/use-portal";
import { PageHeader } from "@/components/shared/page-header";
import { Link } from "@/i18n/navigation";
import {
  Columns2,
  TrendingUp,
  MapPin,
  Handshake,
} from "lucide-react";

const settingModules = [
  {
    href: "/settings/dynamic-fields",
    icon: Columns2,
    title: "Trường động",
    description: "Cấu hình dữ liệu động cho các đối tượng",
  },
  {
    href: "/settings/commissions",
    icon: TrendingUp,
    title: "Hoa hồng",
    description: "Cấu hình hoa hồng cho các đối tượng",
  },
  {
    href: "/settings/locations",
    icon: MapPin,
    title: "Vị trí",
    description: "Cấu hình vị trí, địa chỉ",
  },
  {
    href: "/settings/assignment-policies",
    icon: Handshake,
    title: "Phụ trách sản phẩm",
    description: "Chính sách nhận phụ trách: số sales, thời hạn, khu vực",
  },
];

export default function SettingsPage() {
  const portalPath = usePortalPath();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Cài đặt" title="Cài đặt tenant" description="Quản lý thông tin tenant, branding và feature flags" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {settingModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={portalPath(mod.href)}
              className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                <Icon size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold">{mod.title}</h3>
                <p className="text-sm text-foreground-muted">{mod.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
