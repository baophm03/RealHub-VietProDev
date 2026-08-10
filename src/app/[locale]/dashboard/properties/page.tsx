"use client";

import { PageHeader } from "@/components/shared/page-header";
import { PropertiesList } from "./_components/properties-list";

export default function PropertiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Bất động sản"
        title="Quản lý bất động sản"
        description="Quản lý toàn bộ bất động sản trong hệ thống"
      />
      <PropertiesList />
    </div>
  );
}
