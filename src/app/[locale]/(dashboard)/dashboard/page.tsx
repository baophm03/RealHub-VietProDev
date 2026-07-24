"use client";

import { TrendUp, TrendDown, Buildings, Users, Handshake, UserCircle, ArrowUpRight } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetApiLeads } from "@/lib/api/endpoints/leads";
import { useGetApiAuditLogs } from "@/lib/api/endpoints/audit-logs";
import type { GetLeadsResponse } from "@/lib/api/types/leads";
import type { GetAuditLogsResponse } from "@/lib/api/types/audit-logs";

const stats = [
  {
    label: "Tong bat dong san",
    value: "1,247",
    change: "+12.4%",
    trend: "up" as const,
    icon: Buildings,
  },
  {
    label: "Khach hang",
    value: "3,891",
    change: "+8.2%",
    trend: "up" as const,
    icon: Users,
  },
  {
    label: "Leads moi",
    value: "156",
    change: "+23.1%",
    trend: "up" as const,
    icon: UserCircle,
  },
  {
    label: "Giao dich thang",
    value: "42",
    change: "-3.5%",
    trend: "down" as const,
    icon: Handshake,
  },
];

const leadStatusConfig: Record<string, { label: string; variant: "blue" | "yellow" | "purple" | "green" | "red" | "default" }> = {
  NEW: { label: "Moi", variant: "blue" },
  CONTACTED: { label: "Da lien he", variant: "yellow" },
  INTERESTED: { label: "Quan tam", variant: "purple" },
  NEGOTIATING: { label: "Dam phan", variant: "default" },
  CONVERTED: { label: "Chuyen doi", variant: "green" },
  LOST: { label: "Mat", variant: "red" },
};

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "Vua xong";
  if (diffMin < 60) return `${diffMin} phut truoc`;
  if (diffHour < 24) return `${diffHour} gio truoc`;
  if (diffDay < 30) return `${diffDay} ngay truoc`;
  return date.toLocaleDateString("vi-VN");
}

export default function DashboardPage() {
  const { data: leadsData } = useGetApiLeads({
    limit: "5",
    offset: "0",
  });
  const { data: auditLogsData } = useGetApiAuditLogs({
    pageSize: "5",
  });

  const leads = ((leadsData as unknown as GetLeadsResponse)?.items) || [];
  const auditLogs = ((auditLogsData as unknown as GetAuditLogsResponse)?.items) || [];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 animate-fade-up">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
          Tong quan
        </p>
        <h1 className="font-serif text-3xl font-medium tracking-tight md:text-4xl">
          Dashboard
        </h1>
        <p className="text-sm text-foreground-muted leading-relaxed max-w-[60ch] md:max-w-none">
          Tong quan hoat dong bat dong san, khach hang va giao dich
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up-delay-1">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? TrendUp : TrendDown;
          return (
            <div
              key={stat.label}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-[0_1px_3px_rgba(42,37,32,0.02),0_8px_24px_-12px_rgba(45,95,63,0.06)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-[2px] hover:shadow-[0_4px_12px_rgba(45,95,63,0.06),0_16px_40px_-12px_rgba(45,95,63,0.12)] md:gap-4 md:p-6 md:rounded-[1.25rem]"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 md:size-11">
                  <Icon size={18} weight="duotone" className="text-primary md:size-5" />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-medium tabular-nums ${stat.trend === "up" ? "text-accent-green-text" : "text-accent-red-text"
                    }`}
                >
                  <TrendIcon size={12} weight="bold" />
                  {stat.change}
                </span>
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
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between gap-2">
            <CardTitle>Leads gan day</CardTitle>
            <a
              href="/leads"
              className="group inline-flex items-center gap-1.5 text-xs font-medium text-foreground-muted transition-colors hover:text-foreground shrink-0"
            >
              Xem tat ca
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
                <div className="py-8 text-center text-sm text-foreground-muted">Chua co lead nao</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoat dong</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <div key={log.id} className="flex flex-col gap-0.5 border-l-2 border-border pl-4">
                    <span className="text-sm leading-snug">
                      {log.user?.fullName ?? "He thong"} - {log.action} ({log.entityType})
                    </span>
                    <span className="text-xs text-foreground-muted tabular-nums">{formatRelativeTime(log.createdAt)}</span>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-sm text-foreground-muted">Chua co hoat dong nao</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
