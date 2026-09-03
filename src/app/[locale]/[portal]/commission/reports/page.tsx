"use client";

import { useState, useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Loader2, RefreshCw, TrendingUp, Wallet, CheckCircle2, Percent } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useGetApiCommissionReport } from "@/lib/api/endpoints/reports";

// ---------- Types ----------
interface ByRoleEntry {
  estimated: number;
  confirmed: number;
  count: number;
}
interface CommissionReport {
  total: number;
  byStatus: Record<string, number>;
  totalEstimated: number;
  totalConfirmed: number;
  byRole: Record<string, ByRoleEntry>;
}

// ---------- Constants ----------
const statusConfig: Record<
  string,
  { label: string; variant: "default" | "blue" | "yellow" | "green" | "purple" | "red"; color: string }
> = {
  DRAFT: { label: "Nháp", variant: "default", color: "#787774" },
  ESTIMATED: { label: "Đã ước tính", variant: "blue", color: "var(--accent-blue-text)" },
  PENDING_CONFIRMATION: { label: "Chờ xác nhận", variant: "yellow", color: "var(--accent-yellow-text)" },
  CONFIRMED: { label: "Đã xác nhận", variant: "green", color: "var(--accent-green-text)" },
  ADJUSTED: { label: "Đã điều chỉnh", variant: "purple", color: "var(--accent-purple-text)" },
  CANCELLED: { label: "Đã hủy", variant: "red", color: "var(--accent-red-text)" },
};

const roleLabels: Record<string, string> = {
  SALES: "Sales",
  COLLABORATOR: "CTV",
  TEAM_LEADER: "Team Leader",
  AGENCY: "Agency",
  OWNER: "Owner",
  UNKNOWN: "Khác",
};

const chartConfig = {
  estimated: { label: "Ước tính", color: "var(--accent-blue-text)" },
  confirmed: { label: "Đã xác nhận", color: "var(--accent-green-text)" },
} satisfies ChartConfig;

// ---------- Helpers ----------
const formatVnd = (v: number | string | null | undefined) => {
  if (v === null || v === undefined) return "—";
  const n = Number(v);
  if (isNaN(n)) return String(v);
  if (n === 0) return "0 ₫";
  return n.toLocaleString("vi-VN") + " ₫";
};

const formatCompact = (v: number) => {
  if (v >= 1_000_000_000) return (v / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + " tỷ";
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(0) + " tr";
  if (v >= 1_000) return (v / 1_000).toFixed(0) + "k";
  return String(v);
};

const roleLabel = (role: string) => roleLabels[role] ?? role;

// ---------- Page ----------
export default function CommissionReportsPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const params = useMemo(
    () => ({
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    }),
    [startDate, endDate],
  );

  const { data: raw, isLoading, isFetching, refetch } = useGetApiCommissionReport(params);
  const report = (raw as unknown as { data?: CommissionReport })?.data;

  const byStatusData = useMemo(() => {
    if (!report?.byStatus) return [];
    return Object.entries(report.byStatus).map(([status, count]) => ({
      status,
      label: statusConfig[status]?.label ?? status,
      value: count,
      fill: statusConfig[status]?.color ?? "var(--color-draft)",
    }));
  }, [report]);

  const byRoleData = useMemo(() => {
    if (!report?.byRole) return [];
    return Object.entries(report.byRole).map(([role, entry]) => ({
      role,
      label: roleLabel(role),
      estimated: Number(entry.estimated) || 0,
      confirmed: Number(entry.confirmed) || 0,
      count: entry.count,
    }));
  }, [report]);

  const confirmedRate =
    report && report.totalEstimated > 0
      ? Math.round((report.totalConfirmed / report.totalEstimated) * 100)
      : 0;

  const stats = [
    {
      label: "Tổng hoa hồng",
      value: report ? String(report.total) : "—",
      sub: "deal có hoa hồng",
      icon: BarChart3,
    },
    {
      label: "Hoa hồng ước tính",
      value: report ? formatCompact(report.totalEstimated) : "—",
      sub: report ? formatVnd(report.totalEstimated) : "",
      icon: TrendingUp,
    },
    {
      label: "Hoa hồng đã xác nhận",
      value: report ? formatCompact(report.totalConfirmed) : "—",
      sub: report ? formatVnd(report.totalConfirmed) : "",
      icon: CheckCircle2,
    },
    {
      label: "Tỷ lệ xác nhận",
      value: report ? `${confirmedRate}%` : "—",
      sub: "confirmed / estimated",
      icon: Percent,
    },
  ];

  const hasData = report && report.total > 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Hoa hồng"
        title="Báo cáo hoa hồng"
        description="Tổng quan hoa hồng theo trạng thái, vai trò và thời gian"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Làm mới
          </Button>
        }
      />

      {/* Date range filter */}
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

      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-[0_1px_3px_rgba(42,37,32,0.02),0_8px_24px_-12px_rgba(45,95,63,0.06)] md:p-6 md:rounded-[1.25rem]"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 md:size-11">
                <Icon size={18} className="text-primary md:size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-2xl font-semibold tabular-nums tracking-tight md:text-3xl">
                  {stat.value}
                </span>
                <span className="text-xs text-foreground-muted">{stat.label}</span>
                {stat.sub && (
                  <span className="text-[10px] text-foreground-muted/70 tabular-nums">
                    {stat.sub}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : !hasData ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-surface-muted">
              <Wallet size={20} className="text-foreground-muted" />
            </div>
            <div>
              <p className="font-medium">Chưa có dữ liệu hoa hồng</p>
              <p className="text-sm text-foreground-muted">
                Tạo ước tính hoa hồng cho giao dịch để xem báo cáo tại đây
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Pie chart — by status */}
          <Card>
            <CardHeader>
              <CardTitle>Phân bố theo trạng thái</CardTitle>
              <CardDescription>
                {report?.total ?? 0} deal có hoa hồng, chia theo trạng thái xử lý
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square w-[200px] sm:w-[240px]"
                >
                  <PieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          nameKey="label"
                          labelKey="label"
                          hideLabel
                        />
                      }
                    />
                    <Pie
                      data={byStatusData}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {byStatusData.map((entry) => (
                        <Cell key={entry.status} fill={entry.fill} />
                      ))}
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-2xl font-semibold tabular-nums"
                                >
                                  {report?.total ?? 0}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy ?? 0) + 18}
                                  className="fill-muted-foreground text-[10px]"
                                >
                                  tổng deal
                                </tspan>
                              </text>
                            );
                          }
                          return null;
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
                <div className="flex flex-1 flex-col gap-2">
                  {byStatusData.map((entry) => (
                    <div
                      key={entry.status}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full"
                          style={{ backgroundColor: entry.fill }}
                        />
                        <span className="text-foreground-muted">{entry.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="tabular-nums font-medium">{entry.value}</span>
                        <span className="text-xs text-foreground-muted tabular-nums">
                          ({report?.total ? Math.round((entry.value / report.total) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bar chart — by role */}
          <Card>
            <CardHeader>
              <CardTitle>Hoa hồng theo vai trò</CardTitle>
              <CardDescription>
                So sánh ước tính vs đã xác nhận cho từng vai trò nhận hoa hồng
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="aspect-[4/3] w-full"
              >
                <BarChart
                  data={byRoleData}
                  margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={12}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    fontSize={11}
                    tickFormatter={formatCompact}
                    width={56}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value) => formatVnd(Number(value))}
                      />
                    }
                  />
                  <Bar
                    dataKey="estimated"
                    fill="var(--accent-blue-text)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                  <Bar
                    dataKey="confirmed"
                    fill="var(--accent-green-text)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                  />
                </BarChart>
              </ChartContainer>
              <div className="flex items-center justify-center gap-6 pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="size-2.5 rounded-sm"
                    style={{ backgroundColor: "var(--accent-blue-text)" }}
                  />
                  <span className="text-foreground-muted">Ước tính</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="size-2.5 rounded-sm"
                    style={{ backgroundColor: "var(--accent-green-text)" }}
                  />
                  <span className="text-foreground-muted">Đã xác nhận</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Table — by role breakdown */}
      {hasData && byRoleData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết theo vai trò</CardTitle>
            <CardDescription>
              Phân bổ hoa hồng cho từng vai trò tham gia giao dịch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-foreground-muted">
                    <th className="py-2 pr-4 font-medium">Vai trò</th>
                    <th className="py-2 px-4 font-medium text-right">Số deal</th>
                    <th className="py-2 px-4 font-medium text-right">Ước tính</th>
                    <th className="py-2 px-4 font-medium text-right">Đã xác nhận</th>
                    <th className="py-2 pl-4 font-medium text-right">Tỷ lệ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {byRoleData.map((row) => {
                    const rate =
                      row.estimated > 0
                        ? Math.round((row.confirmed / row.estimated) * 100)
                        : 0;
                    return (
                      <tr key={row.role} className="transition-colors hover:bg-surface-muted/40">
                        <td className="py-3 pr-4">
                          <Badge variant="outline">{row.label}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums">{row.count}</td>
                        <td className="py-3 px-4 text-right tabular-nums text-foreground-muted">
                          {formatVnd(row.estimated)}
                        </td>
                        <td className="py-3 px-4 text-right tabular-nums font-medium text-primary">
                          {formatVnd(row.confirmed)}
                        </td>
                        <td className="py-3 pl-4 text-right tabular-nums">
                          <span
                            className={
                              rate >= 70
                                ? "text-accent-green-text"
                                : rate >= 30
                                  ? "text-accent-yellow-text"
                                  : "text-foreground-muted"
                            }
                          >
                            {rate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-border-strong text-sm font-semibold">
                    <td className="py-3 pr-4">Tổng</td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {report?.total ?? 0}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums">
                      {formatVnd(report?.totalEstimated)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-primary">
                      {formatVnd(report?.totalConfirmed)}
                    </td>
                    <td className="py-3 pl-4 text-right tabular-nums">{confirmedRate}%</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
