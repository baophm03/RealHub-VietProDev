"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetApiCommissionPlanId } from "@/lib/api/endpoints/commission";

interface CommissionPlan {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority?: number;
  effectiveFrom: string;
  effectiveTo?: string;
  version?: number;
  rules?: Array<{
    name: string;
    calculationType: string;
    calculationValue: number;
    calculationBase: string;
    splits?: Array<{
      receiverType: string;
      receiverRole?: string;
      splitType: string;
      splitValue: number;
    }>;
  }>;
}

const statusVariant: Record<string, "green" | "yellow" | "default" | "red"> = {
  ACTIVE: "green",
  PENDING_APPROVAL: "yellow",
  DRAFT: "default",
  ARCHIVED: "default",
};

const statusLabel: Record<string, string> = {
  ACTIVE: "Hoat dong",
  PENDING_APPROVAL: "Cho duyet",
  DRAFT: "Ban nhap",
  ARCHIVED: "Luu tru",
};

export default function CommissionPlanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: planData, isLoading } = useGetApiCommissionPlanId(id);
  const plan = (planData as unknown as { data: CommissionPlan })?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-md bg-surface-muted" />
          <div className="h-8 w-64 animate-pulse rounded-lg bg-surface-muted" />
        </div>
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard/commission/plans")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="Hoa hong" title="Khong tim thay" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/dashboard/commission/plans")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
          <ArrowLeft size={20} />
        </button>
        <PageHeader
          eyebrow="Hoa hong"
          title={plan.name}
          actions={
            <Button variant="outline" onClick={() => router.push(`/dashboard/commission/plans/${id}/edit`)}>
              <Pencil size={16} />
              Chỉnh sửa
            </Button>
          }
        />
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={statusVariant[plan.status] ?? "default"}>
              {statusLabel[plan.status] ?? plan.status}
            </Badge>
            {plan.priority != null && (
              <Badge variant="default">Uu tien: {plan.priority}</Badge>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Ngay hieu luc</span>
              <p className="text-sm tabular-nums">{plan.effectiveFrom ? new Date(plan.effectiveFrom).toLocaleDateString("vi-VN") : "-"}</p>
            </div>
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Ngay ket thuc</span>
              <p className="text-sm tabular-nums">{plan.effectiveTo ? new Date(plan.effectiveTo).toLocaleDateString("vi-VN") : "-"}</p>
            </div>
            {plan.version != null && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Phien ban</span>
                <p className="text-sm">{plan.version}</p>
              </div>
            )}
          </div>
          {plan.description && (
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Mo ta</span>
              <p className="text-sm whitespace-pre-wrap">{plan.description}</p>
            </div>
          )}
        </div>
      </div>

      {plan.rules && plan.rules.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-6">
          <h3 className="text-sm font-semibold mb-4">Quy tac hoa hong</h3>
          <div className="flex flex-col gap-4">
            {plan.rules.map((rule, i) => (
              <div key={i} className="border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium">{rule.name}</span>
                  <Badge variant="blue">{rule.calculationType}</Badge>
                  <span className="text-xs text-foreground-muted">{rule.calculationBase}</span>
                </div>
                {rule.splits && rule.splits.length > 0 && (
                  <div className="ml-4 flex flex-col gap-1">
                    {rule.splits.map((split, j) => (
                      <div key={j} className="flex items-center justify-between text-sm">
                        <span className="text-foreground-muted">{split.receiverRole || split.receiverType}</span>
                        <span className="tabular-nums font-medium">
                          {split.splitType === "PERCENT" ? `${split.splitValue}%` : split.splitValue.toLocaleString("vi-VN")}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
