"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSection, FormField } from "@/components/shared/form-section";
import { Switch } from "@radix-ui/react-switch";

const features = [
  { key: "CRM", label: "CRM module", enabled: true },
  { key: "COMMISSION", label: "Hoa hong", enabled: true },
  { key: "LEAD_PROTECTION", label: "Bao ho lead", enabled: true },
  { key: "WORKFLOW", label: "Workflow engine", enabled: true },
  { key: "DYNAMIC_FIELDS", label: "Truong dong", enabled: true },
  { key: "VISIBILITY_MASKING", label: "Masking du lieu", enabled: false },
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
      <PageHeader eyebrow="Cai dat" title="Cai dat tenant" description="Quan ly thong tin tenant, branding va feature flags" />

      <FormSection title="Thong tin tenant">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField label="Ten tenant">
            <Input defaultValue="ABC Real Estate" />
          </FormField>
          <FormField label="Ma tenant">
            <Input defaultValue="ABC" disabled />
          </FormField>
          <FormField label="Logo URL">
            <Input defaultValue="https://cdn.realhub.vn/logo.png" />
          </FormField>
          <FormField label="Mau chinh">
            <Input defaultValue="#1a73e8" />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Feature flags" description="Bat/tat tinh nang theo tenant">
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
        <Button>Luu cai dat</Button>
      </div>
    </div>
  );
}
