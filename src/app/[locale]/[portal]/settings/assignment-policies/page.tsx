"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Handshake, Plus, Loader2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { ability } from "@/config/casl/ability";
import {
  useGetApiAssignmentPolicies,
  usePostApiAssignmentPolicy,
  usePatchApiAssignmentPolicy,
  useDeleteApiAssignmentPolicy,
  getGetApiAssignmentPoliciesQueryKey,
} from "@/lib/api/endpoints/assignments";
import type { CreateAssignmentPolicyDto } from "@/lib/api/models/createAssignmentPolicyDto";
import type { UpdateAssignmentPolicyDto } from "@/lib/api/models/updateAssignmentPolicyDto";
import {
  statusFilters,
  type AssignmentPolicy,
  type PoliciesResponse,
  type CreatePolicyDto,
} from "./_components/types";
import { PolicyCard } from "./_components/policy-card";
import { PolicyFormDialog } from "./_components/policy-form-dialog";

export default function AssignmentPoliciesPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<AssignmentPolicy | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AssignmentPolicy | null>(null);

  const queryClient = useQueryClient();
  const canCreate = ability.can("CREATE", "SETTING");

  const { data: policiesRaw, isLoading } = useGetApiAssignmentPolicies();
  const allPolicies: AssignmentPolicy[] =
    (policiesRaw as unknown as PoliciesResponse)?.data ?? [];
  const policies = statusFilter
    ? allPolicies.filter((p) => p.status === statusFilter)
    : allPolicies;

  const { mutateAsync: createPolicy, isPending: isCreating } = usePostApiAssignmentPolicy({
    mutation: {
      onSuccess: () => {
        toast.success("Tạo chính sách thành công");
        queryClient.invalidateQueries({ queryKey: getGetApiAssignmentPoliciesQueryKey() });
        setDialogOpen(false);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.error?.message?.[0] || "Có lỗi khi tạo";
        toast.error(msg);
      },
    },
  });

  const { mutateAsync: updatePolicy, isPending: isUpdating } = usePatchApiAssignmentPolicy({
    mutation: {
      onSuccess: () => {
        toast.success("Cập nhật thành công");
        queryClient.invalidateQueries({ queryKey: getGetApiAssignmentPoliciesQueryKey() });
        setEditTarget(null);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.error?.message?.[0] || "Có lỗi khi cập nhật";
        toast.error(msg);
      },
    },
  });

  const { mutateAsync: deletePolicy, isPending: isDeleting } = useDeleteApiAssignmentPolicy({
    mutation: {
      onSuccess: () => {
        toast.success("Đã xóa chính sách");
        queryClient.invalidateQueries({ queryKey: getGetApiAssignmentPoliciesQueryKey() });
        setDeleteTarget(null);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.error?.message?.[0] || "Có lỗi khi xóa";
        toast.error(msg);
      },
    },
  });

  const handleCreate = async (dto: CreatePolicyDto) => {
    await createPolicy({ data: dto as CreateAssignmentPolicyDto });
  };

  const handleEdit = async (dto: CreatePolicyDto) => {
    if (!editTarget) return;
    await updatePolicy({ id: editTarget.id, data: dto as UpdateAssignmentPolicyDto });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deletePolicy({ id: deleteTarget.id });
  };

  const editInitial: CreatePolicyDto | null = editTarget
    ? {
      name: editTarget.name,
      propertyTypeId: editTarget.propertyTypeId,
      transactionType: editTarget.transactionType,
      sellingMode: editTarget.sellingMode,
      projectId: editTarget.projectId,
      zoneId: editTarget.zoneId,
      maxAssignedUsers: editTarget.maxAssignedUsers,
      durationDays: editTarget.durationDays,
      autoExtendEnabled: editTarget.autoExtendEnabled,
      expireBehavior: editTarget.expireBehavior,
      priority: editTarget.priority,
    }
    : null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cài đặt"
        title="Cài đặt phụ trách sản phẩm"
        description="Chính sách nhận phụ trách: số sales tối đa, thời hạn, hành vi hết hạn. Policy cụ thể hơn được ưu tiên áp dụng."
        actions={
          canCreate && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus size={16} />
              Tạo chính sách
            </Button>
          )
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground-muted">
          <span className="font-medium text-foreground">{policies.length}</span> chính sách
        </p>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter((v as string) ?? "")}
          >
            <SelectTrigger className="w-[200px]">
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
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-surface-muted" />
          ))}
        </div>
      ) : policies.length === 0 ? (
        <EmptyState
          icon={<Handshake size={24} />}
          title="Chưa có chính sách phụ trách"
          description="Tạo chính sách để cấu hình số sales tối đa, thời hạn phụ trách, và hành vi khi hết hạn."
          action={
            canCreate ? (
              <Button onClick={() => setDialogOpen(true)}>
                <Plus size={16} />
                Tạo chính sách đầu tiên
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onEdit={() => setEditTarget(policy)}
              onDelete={() => setDeleteTarget(policy)}
            />
          ))}
        </div>
      )}

      <PolicyFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
        isSubmitting={isCreating}
        mode="create"
      />

      <PolicyFormDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onSubmit={handleEdit}
        isSubmitting={isUpdating}
        initial={editInitial}
        mode="edit"
      />

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Xóa chính sách</DialogTitle>
              <DialogDescription>
                Hành động này không thể hoàn tác.
              </DialogDescription>
            </DialogHeader>
            {deleteTarget && (
              <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm">
                <p className="font-medium">{deleteTarget.name}</p>
                <p className="mt-1 text-xs text-foreground-muted">
                  {deleteTarget.maxAssignedUsers} sales · {deleteTarget.durationDays} ngày
                </p>
              </div>
            )}
            <div className="rounded-lg bg-accent-red/10 px-4 py-3 text-sm text-accent-red">
              Bạn có chắc chắn muốn xóa chính sách này?
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa"
                )}
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
