"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { mockCommissionDeals } from "@/lib/mock";
import { Percent, TrendUp, CurrencyDollar } from "@phosphor-icons/react";

const statusVariant: Record<string, "green" | "yellow" | "blue" | "red" | "purple"> = {
  CONFIRMED: "green",
  ESTIMATED: "blue",
  PENDING_CONFIRMATION: "yellow",
  ADJUSTED: "purple",
  CANCELLED: "red",
};

const statusLabel: Record<string, string> = {
  CONFIRMED: "Đã xác nhận",
  ESTIMATED: "Dự kiến",
  PENDING_CONFIRMATION: "Chờ xác nhận",
  ADJUSTED: "Đã điều chỉnh",
  CANCELLED: "Đã hủy",
};

export default function CommissionReportsPage() {
  const totalConfirmed = mockCommissionDeals
    .filter((d) => d.status === "CONFIRMED")
    .reduce((sum, d) => sum + parseInt(d.amount.replace(/\D/g, "")), 0);

  const totalEstimated = mockCommissionDeals
    .filter((d) => d.status === "ESTIMATED")
    .reduce((sum, d) => sum + parseInt(d.amount.replace(/\D/g, "")), 0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Hoa hồng"
        title="Báo cáo hoa hồng"
        description="Thống kê hoa hồng theo sales và giao dịch"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent-green/20">
            <CurrencyDollar size={20} className="text-accent-green-text" />
          </div>
          <div>
            <span className="text-2xl font-semibold tabular-nums">
              {totalConfirmed.toLocaleString("vi-VN")}đ
            </span>
            <p className="text-xs text-foreground-muted">Đã xác nhận</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent-blue/20">
            <TrendUp size={20} className="text-accent-blue-text" />
          </div>
          <div>
            <span className="text-2xl font-semibold tabular-nums">
              {totalEstimated.toLocaleString("vi-VN")}đ
            </span>
            <p className="text-xs text-foreground-muted">Dự kiến</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Percent size={20} className="text-primary" />
          </div>
          <div>
            <span className="text-2xl font-semibold tabular-nums">{mockCommissionDeals.length}</span>
            <p className="text-xs text-foreground-muted">Tổng giao dịch</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-muted/50 text-left text-xs font-medium uppercase tracking-wide text-foreground-muted">
              <th className="px-4 py-3">Giao dịch</th>
              <th className="px-4 py-3">Sales</th>
              <th className="px-4 py-3">Số tiền</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Ngày</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockCommissionDeals.map((d) => (
              <tr key={d.id} className="transition-colors hover:bg-surface-muted/30">
                <td className="px-4 py-3 font-medium">{d.deal}</td>
                <td className="px-4 py-3 text-foreground-muted">{d.sales}</td>
                <td className="px-4 py-3 font-medium text-primary">{d.amount}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusVariant[d.status] ?? "blue"}>
                    {statusLabel[d.status] ?? d.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-foreground-muted tabular-nums">
                  {new Date(d.date).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
