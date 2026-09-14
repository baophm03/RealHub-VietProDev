"use client";

import {
  useGetApiDashboardSummary,
  useGetApiDashboardRecentLeads,
  useGetApiDashboardCharts,
} from "@/lib/api/endpoints/dashboard";
import type { DashboardSummary } from "@/lib/api/types/dashboard";
import { usePortalSlug } from "@/lib/hooks/use-portal";
import { StatsCards } from "./_components/stats-cards";
import { DashboardCharts } from "./_components/dashboard-charts";
import { RecentLeads } from "./_components/recent-leads";
import type { ChartsData, DashboardLead } from "./_components/types";

export default function DashboardPage() {
  const portalSlug = usePortalSlug();

  const { data: summaryData } = useGetApiDashboardSummary();
  const summary = (summaryData as unknown as DashboardSummary)?.data;

  const { data: leadsData } = useGetApiDashboardRecentLeads();
  const leads = ((leadsData as unknown as { data?: DashboardLead[] })?.data) || [];

  const { data: chartsRaw, isLoading: chartsLoading } = useGetApiDashboardCharts();
  const charts = (chartsRaw as unknown as { data?: ChartsData })?.data;

  const isOwnerPortal = portalSlug === "owner-portal";
  const isSalesPortal = portalSlug === "sales-portal";

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
          {isOwnerPortal
            ? "Tổng quan BĐS của bạn, lượt liên hệ và trạng thái xuất bản"
            : isSalesPortal
              ? "Tổng quan giao dịch, nguồn khách hàng và hiệu suất bán hàng của bạn"
              : "Tổng quan hoạt động bất động sản, khách hàng và giao dịch"}
        </p>
      </div>

      <StatsCards summary={summary} />

      <DashboardCharts
        charts={charts}
        isLoading={chartsLoading}
        isOwnerPortal={isOwnerPortal}
        isSalesPortal={isSalesPortal}
      />

      <RecentLeads leads={leads} />
    </div>
  );
}
