"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Link } from "@/i18n/navigation";
import { Percent, ChartBar } from "@phosphor-icons/react";

export default function CommissionPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Hoa hồng"
        title="Hoa hồng"
        description="Quản lý hoa hồng và báo cáo"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/commission/plans"
          className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
        >
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
            <Percent size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold">Gói hoa hồng</h3>
            <p className="text-sm text-foreground-muted">Tạo và quản lý các gói hoa hồng</p>
          </div>
        </Link>

        <Link
          href="/commission/reports"
          className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
        >
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
            <ChartBar size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold">Báo cáo hoa hồng</h3>
            <p className="text-sm text-foreground-muted">Thống kê hoa hồng theo sales và giao dịch</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
