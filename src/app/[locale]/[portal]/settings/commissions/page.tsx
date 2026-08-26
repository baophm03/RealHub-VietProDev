"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ability } from "@/config/casl/ability";
import {
  useGetApiCommissionPlans,
  usePostApiCommissionPlan,
  usePatchApiCommissionPlanStatus,
  getGetApiCommissionPlansQueryKey,
} from "@/lib/api/endpoints/commission";
import type { CreateCommissionPlanDto } from "@/lib/api/models/createCommissionPlanDto";
import { PlanCard } from "./_components/plan-card";
import { CreatePlanDialog } from "./_components/create-plan-dialog";
import { ConfirmStatusDialog } from "./_components/confirm-status-dialog";
import { statusConfig, statusFilters, statusOrder, type Plan } from "./_components/types";

export default function CommissionsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    title: string;
    description: string;
    confirmLabel: string;
    action: () => Promise<void>;
  } | null>(null);

  const queryClient = useQueryClient();

  const canCreate = ability.can("CREATE", "COMMISSION");
  const canApprove = ability.can("APPROVE", "COMMISSION");

  const { data: plansRaw, isLoading } = useGetApiCommissionPlans(
    statusFilter ? { status: statusFilter as any } : undefined,
  );
  const plans = ((plansRaw as { data?: Plan[] } | undefined)?.data) ?? [];

  const { mutateAsync: createPlan, isPending: isCreating } = usePostApiCommissionPlan({
    mutation: {
      onSuccess: () => {
        toast.success("Tạo plan hoa hồng thành công");
        queryClient.invalidateQueries({ queryKey: getGetApiCommissionPlansQueryKey() });
        setDialogOpen(false);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.error?.message?.[0] || "Có lỗi khi tạo plan";
        toast.error(msg);
      },
    },
  });

  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = usePatchApiCommissionPlanStatus({
    mutation: {
      onSuccess: () => {
        toast.success("Cập nhật trạng thái thành công");
        queryClient.invalidateQueries({ queryKey: getGetApiCommissionPlansQueryKey() });
        setConfirmDialog(null);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.error?.message?.[0] || "Có lỗi khi đổi trạng thái";
        toast.error(msg);
      },
    },
  });

  const handleAdvanceStatus = (plan: Plan) => {
    const idx = statusOrder.indexOf(plan.status);
    const next = statusOrder[idx + 1];
    if (!next) return;
    setConfirmDialog({
      title: `Đổi trạng thái plan`,
      description: `Đổi plan "${plan.name}" thành "${statusConfig[next].label}"?`,
      confirmLabel: plan.status === "DRAFT" ? "Gửi duyệt" : "Kích hoạt",
      action: async () => {
        await updateStatus({ id: plan.id, data: { status: next } });
      },
    });
  };

  const handleArchive = (plan: Plan) => {
    setConfirmDialog({
      title: "Lưu trữ plan",
      description: `Lưu trữ plan "${plan.name}"? Plan sẽ không còn hiệu lực.`,
      confirmLabel: "Lưu trữ",
      action: async () => {
        await updateStatus({ id: plan.id, data: { status: "ARCHIVED" } });
      },
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cài đặt"
        title="Hoa hồng"
        description="Quản lý các chính sách hoa hồng — plan, rule, split cho sales/CTV/team/agency"
        actions={
          <div className="flex items-center gap-2">
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter((v as string) ?? "")}
            >
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Tất cả trạng thái">
                  {(value: string) =>
                    statusFilters.find((s) => s.value === value)?.label || "Tất cả trạng thái"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map((s) => (
                  <SelectItem key={s.value} value={s.value} label={s.label}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {canCreate && (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus size={16} />
                Tạo plan
              </Button>
            )}
          </div>
        }
      />

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <EmptyState
          icon={<TrendingUp size={24} />}
          title="Chưa có plan hoa hồng"
          description="Tạo plan đầu tiên để cấu hình % hoa hồng cho sales, CTV, team leader, agency"
          action={
            canCreate ? (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus size={16} />
                Tạo plan đầu tiên
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              canApprove={canApprove}
              onAdvance={() => handleAdvanceStatus(plan)}
              onArchive={() => handleArchive(plan)}
            />
          ))}
        </div>
      )}

      <CreatePlanDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={async (dto: CreateCommissionPlanDto) => {
          await createPlan({ data: dto });
        }}
        isSubmitting={isCreating}
      />

      <ConfirmStatusDialog
        open={!!confirmDialog}
        onOpenChange={(open) => {
          if (!open) setConfirmDialog(null);
        }}
        title={confirmDialog?.title ?? ""}
        description={confirmDialog?.description ?? ""}
        confirmLabel={confirmDialog?.confirmLabel ?? ""}
        onConfirm={() => confirmDialog?.action()}
        isPending={isUpdatingStatus}
      />
    </div>
  );
}
