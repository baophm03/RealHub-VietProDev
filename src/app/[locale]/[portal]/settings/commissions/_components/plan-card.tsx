"use client";

import { Calendar, CheckCircle2, Layers, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, statusConfig, type Plan } from "./types";

export function PlanCard({
  plan,
  canApprove,
  onAdvance,
  onArchive,
}: {
  plan: Plan;
  canApprove: boolean;
  onAdvance: () => void;
  onArchive: () => void;
}) {
  const status = statusConfig[plan.status] ?? statusConfig.DRAFT;
  const StatusIcon = status.icon;
  const canAdvance = plan.status !== "ACTIVE" && plan.status !== "ARCHIVED";
  const canArchive = plan.status === "ACTIVE";
  const ruleCount = plan.rules?.length ?? 0;
  const splitCount = plan.rules?.reduce((acc, r) => acc + (r.splits?.length ?? 0), 0) ?? 0;

  return (
    <Card className="py-1">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base truncate">{plan.name}</h3>
              {plan.version && (
                <Badge variant="default" className="shrink-0">
                  v{plan.version}
                </Badge>
              )}
            </div>
            {plan.description && (
              <p className="text-sm text-foreground-muted line-clamp-2">{plan.description}</p>
            )}
          </div>
          <Badge variant={status.variant} className="shrink-0">
            <StatusIcon size={12} />
            {status.label}
          </Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-foreground-muted">
          <div className="flex items-center gap-1.5">
            <Calendar size={12} />
            <span>
              {formatDate(plan.effectiveFrom)} → {formatDate(plan.effectiveTo)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Layers size={12} />
            <span>{ruleCount} rule · {splitCount} split</span>
          </div>
          {plan.priority !== undefined && plan.priority !== 0 && (
            <div className="flex items-center gap-1.5">
              <span className="font-medium">Ưu tiên: {plan.priority}</span>
            </div>
          )}
        </div>

        {ruleCount > 0 && (
          <div className="mt-3 flex flex-col gap-1.5">
            {plan.rules!.slice(0, 3).map((rule, i) => (
              <div
                key={rule.id ?? i}
                className="flex items-center gap-2 rounded-md border border-border bg-surface-muted/50 px-3 py-1.5"
              >
                <span className="text-sm font-medium truncate">{rule.name}</span>
                <Badge variant="blue" className="shrink-0">
                  {rule.calculationType === "PERCENT"
                    ? `${rule.calculationValue}%`
                    : rule.calculationType === "FIXED_AMOUNT"
                      ? `${Number(rule.calculationValue).toLocaleString("vi-VN")}đ`
                      : rule.calculationType === "ONE_MONTH_RENT"
                        ? "1 tháng thuê"
                        : "0.5 tháng thuê"}
                </Badge>
                <span className="ml-auto text-[10px] text-foreground-muted">
                  {rule.splits?.length ?? 0} split
                </span>
              </div>
            ))}
            {ruleCount > 3 && (
              <p className="text-xs text-foreground-muted pl-3">
                +{ruleCount - 3} rule khác
              </p>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          {canApprove && canAdvance && (
            <Button size="sm" variant="outline" onClick={onAdvance}>
              <CheckCircle2 size={14} />
              {plan.status === "DRAFT" ? "Gửi duyệt" : "Kích hoạt"}
            </Button>
          )}
          {canApprove && canArchive && (
            <Button size="sm" variant="ghost" onClick={onArchive}>
              <Layers size={14} />
              Lưu trữ
            </Button>
          )}
          <Button size="sm" variant="ghost" className="ml-auto" disabled>
            <Pencil size={14} />
            Sửa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
