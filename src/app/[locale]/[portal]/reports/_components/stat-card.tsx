import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, sub, icon: Icon }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-[0_1px_3px_rgba(42,37,32,0.02),0_8px_24px_-12px_rgba(45,95,63,0.06)] md:p-6 md:rounded-[1.25rem]">
      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 md:size-11">
        <Icon size={18} className="text-primary md:size-5" />
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-semibold tabular-nums tracking-tight md:text-3xl">{value}</span>
        <span className="text-xs text-foreground-muted">{label}</span>
        {sub && <span className="text-[10px] text-foreground-muted/70 tabular-nums">{sub}</span>}
      </div>
    </div>
  );
}
