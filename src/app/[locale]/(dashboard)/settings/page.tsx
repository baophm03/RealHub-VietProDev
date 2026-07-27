"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSection, FormField } from "@/components/shared/form-section";
import { Switch } from "@radix-ui/react-switch";
import { Link } from "@/i18n/navigation";
import {
  TextColumns,
  Shield,
  MapPin,
  Eye,
  FlowArrow,
} from "@phosphor-icons/react";

const settingModules = [
  {
    href: "/settings/dynamic-fields",
    icon: TextColumns,
    title: "Trường động",
    description: "Nhóm trường, định nghĩa và form schema — render động theo đối tượng",
  },
  {
    href: "/settings/lead-protection",
    icon: Shield,
    title: "Bảo hộ lead",
    description: "Chính sách bảo hộ lead và xử lý tranh chấp",
  },
  {
    href: "/settings/locations",
    icon: MapPin,
    title: "Địa lý",
    description: "Cây địa lý: Tỉnh → Quận → Phường → Đường",
  },
  {
    href: "/settings/visibility",
    icon: Eye,
    title: "Chính sách hiển thị",
    description: "Ẩn/mask dữ liệu theo role và context",
  },
  {
    href: "/settings/workflows",
    icon: FlowArrow,
    title: "Workflow",
    description: "Định nghĩa luồng trạng thái cho deal, lead, property",
  },
];

const features = [
  { key: "CRM", label: "CRM module", enabled: true },
  { key: "COMMISSION", label: "Hoa hồng", enabled: true },
  { key: "LEAD_PROTECTION", label: "Bảo hộ lead", enabled: true },
  { key: "WORKFLOW", label: "Workflow engine", enabled: true },
  { key: "DYNAMIC_FIELDS", label: "Trường động", enabled: true },
  { key: "VISIBILITY_MASKING", label: "Masking dữ liệu", enabled: false },
];

export default function SettingsPage() {
  const [featureStates, setFeatureStates] = useState(features);

  const toggleFeature = (key: string) => {
    setFeatureStates((prev) =>
      prev.map((f) => (f.key === key ? { ...f, enabled: !f.enabled } : f))
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="Cài đặt" title="Cài đặt tenant" description="Quản lý thông tin tenant, branding và feature flags" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {settingModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.href}
              href={mod.href}
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

      <FormSection title="Thông tin tenant">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Tên tenant">
            <Input defaultValue="ABC Real Estate" />
          </FormField>
          <FormField label="Mã tenant">
            <Input defaultValue="ABC" disabled />
          </FormField>
          <FormField label="Logo URL">
            <Input defaultValue="https://cdn.realhub.vn/logo.png" />
          </FormField>
          <FormField label="Màu chính">
            <Input defaultValue="#1a73e8" />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Feature flags" description="Bật/tắt tính năng theo tenant">
        <div className="flex flex-col gap-3">
          {featureStates.map((feature) => (
            <div key={feature.key} className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
              <span className="text-sm font-medium">{feature.label}</span>
              <Switch
                checked={feature.enabled}
                onCheckedChange={() => toggleFeature(feature.key)}
              />
            </div>
          ))}
        </div>
      </FormSection>

      <div className="flex justify-end">
        <Button>Lưu cài đặt</Button>
      </div>
    </div>
  );
}
