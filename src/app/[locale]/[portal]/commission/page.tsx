"use client";

import { usePortalPath } from "@/lib/hooks/use-portal";
import { PageHeader } from "@/components/shared/page-header";
import { Link } from "@/i18n/navigation";
import { BarChart3, Receipt } from "lucide-react";

export default function CommissionPage() {
  const portalPath = usePortalPath();
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Hoa hồng"
        title="Hoa hồng"
        description="Tính toán, duyệt và báo cáo hoa hồng theo giao dịch"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href={portalPath("/commission/deals")}
          className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-6 transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]"
        >
          <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
            <Receipt size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold">Ước tính hoa hồng</h3>
            <p className="text-sm text-foreground-muted">Tạo ước tính, xác nhận, duyệt và thanh toán hoa hồng</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
