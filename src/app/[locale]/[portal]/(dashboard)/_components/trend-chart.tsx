import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { tooltipStyle } from "./constants";
import type { ChartPoint } from "./types";

interface TrendChartProps {
  data: ChartPoint[];
  color?: string;
  label: string;
}

export function TrendChart({ data, color = "#2a5f3f", label }: TrendChartProps) {
  if (!data || data.length === 0) {
    return <div className="flex h-[260px] items-center justify-center text-sm text-foreground-muted">Chưa có dữ liệu</div>;
  }
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="var(--foreground-muted)" />
        <YAxis tick={{ fontSize: 11 }} stroke="var(--foreground-muted)" allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#grad-${label})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
