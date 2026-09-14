"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SalesReportTab } from "./_components/sales-report-tab";
import { CommissionReportTab } from "./_components/commission-report-tab";
import { PropertiesReportTab } from "./_components/properties-report-tab";
import { TeamPerformanceTab } from "./_components/team-performance-tab";

const VALID_TABS = ["sales", "commission", "properties", "team"] as const;
type TabValue = (typeof VALID_TABS)[number];

export default function ReportsPage() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabValue | null) ?? "sales";
  const isValidTab = VALID_TABS.includes(initialTab);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tab, setTab] = useState<TabValue>(isValidTab ? initialTab : "sales");

  const showDateFilter = tab === "sales" || tab === "commission" || tab === "team";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Hệ thống"
        title="Báo cáo"
        description="Tổng hợp hiệu suất kinh doanh, hoa hồng, BĐS và thành viên theo khoảng thời gian"
      />

      {showDateFilter && (
        <Card size="sm">
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground-muted">Từ ngày</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-[180px]"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-foreground-muted">Đến ngày</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full sm:w-[180px]"
              />
            </div>
            {(startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
              >
                Xóa lọc
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <TabsList>
          <TabsTrigger value="sales">Kinh doanh</TabsTrigger>
          <TabsTrigger value="commission">Hoa hồng</TabsTrigger>
          <TabsTrigger value="properties">Bất động sản</TabsTrigger>
          <TabsTrigger value="team">Hiệu suất nhân sự</TabsTrigger>
        </TabsList>
        <TabsContent value="sales">
          <SalesReportTab startDate={startDate} endDate={endDate} />
        </TabsContent>
        <TabsContent value="commission">
          <CommissionReportTab startDate={startDate} endDate={endDate} />
        </TabsContent>
        <TabsContent value="properties">
          <PropertiesReportTab />
        </TabsContent>
        <TabsContent value="team">
          <TeamPerformanceTab startDate={startDate} endDate={endDate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
