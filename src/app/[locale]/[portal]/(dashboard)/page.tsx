"use client";

import {
  ArrowUpRight,
  Building2,
  CircleUser,
  Handshake,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetApiLeads } from "@/lib/api/endpoints/leads";
import { useGetApiDashboardSummary } from "@/lib/api/endpoints/dashboard";
import type { GetLeadsResponse } from "@/lib/api/types/leads";
import type { DashboardSummary } from "@/lib/api/types/dashboard";

function formatNumber(n: number): string {
  return new Intl.NumberFormat("vi-VN").format(n);
}

const leadStatusConfig: Record<string, { label: string; variant: "blue" | "yellow" | "purple" | "green" | "red" | "default" }> = {
  NEW: { label: "Mới", variant: "blue" },
  CONTACTED: { label: "Đã liên hệ", variant: "yellow" },
  INTERESTED: { label: "Quan tâm", variant: "purple" },
  NEGOTIATING: { label: "Đàm phán", variant: "default" },
  CONVERTED: { label: "Chuyển đổi", variant: "green" },
  LOST: { label: "Mất", variant: "red" },
};

export default function DashboardPage() {
  const { data: summaryData } = useGetApiDashboardSummary();
  const summary = (summaryData as unknown as DashboardSummary)?.data;

  const { data: leadsData } = useGetApiLeads({
    limit: "5",
    offset: "0",
  });

  const leads = ((leadsData as unknown as GetLeadsResponse)?.data) || [];

  const stats = [
    {
      label: "Tổng bất động sản",
      value: summary ? formatNumber(summary.properties) : "—",
      icon: Building2,
    },
    {
      label: "Khách hàng",
      value: summary ? formatNumber(summary.customers) : "—",
      icon: Users,
    },
    {
      label: "Khách hàng tiềm năng",
      value: summary ? formatNumber(summary.leads) : "—",
      icon: CircleUser,
    },
    {
      label: `Giao dịch ${summary?.month?.label ?? "tháng này"}`,
      value: summary ? formatNumber(summary.dealsThisMonth) : "—",
      icon: Handshake,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 animate-fade-up">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Tổng quan
        </p>
        <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
          Dashboard
        </h1>
        <p className="text-sm text-foreground-muted leading-relaxed max-w-[60ch] md:max-w-none">
          Tổng quan hoạt động bất động sản, khách hàng và giao dịch
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up-delay-1">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-[0_1px_3px_rgba(42,37,32,0.02),0_8px_24px_-12px_rgba(45,95,63,0.06)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(45,95,63,0.06),0_16px_40px_-12px_rgba(45,95,63,0.12)] md:gap-4 md:p-6 md:rounded-[1.25rem]"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 md:size-11">
                  <Icon size={18} className="text-primary md:size-5" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-semibold tabular-nums tracking-tight md:text-3xl">
                  {stat.value}
                </span>
                <span className="text-xs text-foreground-muted">{stat.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 animate-fade-up-delay-2">
        <Card className="lg:col-span-3">
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle>Khách hàng tiềm năng</CardTitle>
            <a
              href="/dashboard/leads"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground shrink-0"
            >
              Xem tất cả
              <span className="inline-flex size-5 items-center justify-center rounded-lg bg-surface-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={10} />
              </span>
            </a>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col divide-y divide-border">
              {leads.length > 0 ? (
                leads.map((lead) => {
                  const statusCfg = leadStatusConfig[lead.status] ?? { label: lead.status, variant: "default" as const };
                  return (
                    <div
                      key={lead.id}
                      className="group flex flex-col gap-2 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between transition-colors"
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium">{lead.customer?.fullName ?? lead.phoneNormalized ?? "Khach vang"}</span>
                        <span className="text-xs text-foreground-muted tabular-nums">
                          {lead.customer?.phone ?? lead.phoneNormalized ?? "-"}
                          {lead.property ? ` · ${lead.property.title}` : ""}
                        </span>
                      </div>
                      <Badge variant={statusCfg.variant} className="self-start sm:self-auto">{statusCfg.label}</Badge>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-sm text-foreground-muted">Chưa có khách hàng tiềm năng nào</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
