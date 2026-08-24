"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useGetApiCommissionReport } from "@/lib/api/endpoints/reports";
import { DollarSign, Percent, TrendingUp } from "lucide-react";

interface CommissionReport {
  totalConfirmed?: string;
  totalEstimated?: string;
  totalDeals?: number;
  items?: Array<{
    id: string;
    deal: string;
    sales: string;
    amount: string;
    status: string;
    date: string;
  }>;
}

const statusVariant: Record<string, "green" | "yellow" | "blue" | "red" | "purple"> = {
  CONFIRMED: "green",
  ESTIMATED: "blue",
  PENDING_CONFIRMATION: "yellow",
  ADJUSTED: "purple",
  CANCELLED: "red",
};

const statusLabel: Record<string, string> = {
  CONFIRMED: "Da xac nhan",
  ESTIMATED: "Du kien",
  PENDING_CONFIRMATION: "Cho xac nhan",
  ADJUSTED: "Da dieu chinh",
  CANCELLED: "Da huy",
};

export default function CommissionReportsPage() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const [startDate, setStartDate] = useState(firstDay.toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(today.toISOString().slice(0, 10));
  const [queryKey, setQueryKey] = useState({ startDate, endDate });

  const { data: reportData, isLoading } = useGetApiCommissionReport(queryKey);
  const report = (reportData as unknown as { data: CommissionReport })?.data;

  const items = report?.items || [];
  const totalConfirmed = report?.totalConfirmed || "0";
  const totalEstimated = report?.totalEstimated || "0";
  const totalDeals = report?.totalDeals || items.length;

  const handleFilter = () => {
    setQueryKey({ startDate, endDate });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Hoa hong"
        title="Bao cao hoa hong"
        description="Thong ke hoa hong theo sales va giao dich"
      />

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-foreground-muted">Tu ngay</label>
          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-auto" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-foreground-muted">Den ngay</label>
          <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-auto" />
        </div>
        <Button onClick={handleFilter}>Loc</Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent-green/20">
            <DollarSign size={20} className="text-accent-green-text" />
          </div>
          <div>
            <span className="text-2xl font-semibold tabular-nums">{totalConfirmed}</span>
            <p className="text-xs text-foreground-muted">Da xac nhan</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent-blue/20">
            <TrendingUp size={20} className="text-accent-blue-text" />
          </div>
          <div>
            <span className="text-2xl font-semibold tabular-nums">{totalEstimated}</span>
            <p className="text-xs text-foreground-muted">Du kien</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Percent size={20} className="text-primary" />
          </div>
          <div>
            <span className="text-2xl font-semibold tabular-nums">{totalDeals}</span>
            <p className="text-xs text-foreground-muted">Tong giao dich</p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border bg-surface">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-surface-muted/50 text-left text-xs font-medium uppercase tracking-wide text-foreground-muted">
                <th className="px-4 py-3">Giao dich</th>
                <th className="px-4 py-3">Sales</th>
                <th className="px-4 py-3">So tien</th>
                <th className="px-4 py-3">Trang thai</th>
                <th className="px-4 py-3">Ngay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.length > 0 ? (
                items.map((d) => (
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
                      {d.date ? new Date(d.date).toLocaleDateString("vi-VN") : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-foreground-muted">Khong co du lieu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
