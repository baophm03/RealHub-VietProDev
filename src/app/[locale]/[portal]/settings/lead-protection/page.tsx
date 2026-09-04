"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shield, Plus, AlertTriangle } from "lucide-react";
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
  useGetApiLeadProtectionPolicies,
  usePostApiLeadProtectionPolicy,
  usePatchApiLeadProtectionPolicy,
  useDeleteApiLeadProtectionPolicy,
  getGetApiLeadProtectionPoliciesQueryKey,
  useGetApiLeadDisputes,
  usePatchApiResolveLeadDispute,
  getGetApiLeadDisputesQueryKey,
} from "@/lib/api/endpoints/lead-protection";
import type { CreateLeadProtectionPolicyDto } from "@/lib/api/models/createLeadProtectionPolicyDto";
import type { UpdateLeadProtectionPolicyDto } from "@/lib/api/models/updateLeadProtectionPolicyDto";
import { GetApiLeadDisputesStatus } from "@/lib/api/models/getApiLeadDisputesStatus";
import {
  disputeStatusLabel,
  type LeadProtectionPolicy,
  type LeadDispute,
  type PolicyFormValues,
} from "./_components/types";
import { PoliciesGrid } from "./_components/policies-grid";
import { DisputesList } from "./_components/disputes-list";
import { PolicyFormDialog } from "./_components/policy-form-dialog";
import { DeletePolicyDialog } from "./_components/delete-policy-dialog";

export default function LeadProtectionPage() {
  const queryClient = useQueryClient();
  const canCreate = ability.can("CREATE", "LEAD");
  const canUpdate = ability.can("UPDATE", "LEAD");
  const canDelete = ability.can("DELETE", "LEAD");
  const canApprove = ability.can("APPROVE", "LEAD");

  const [tab, setTab] = useState<"policies" | "disputes">("policies");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<LeadProtectionPolicy | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<LeadProtectionPolicy | null>(null);
  const [disputeStatusFilter, setDisputeStatusFilter] = useState<string>("");

  const { data: policiesRaw, isLoading: policiesLoading } = useGetApiLeadProtectionPolicies();
  const policies: LeadProtectionPolicy[] =
    (policiesRaw as unknown as { data?: LeadProtectionPolicy[] })?.data ?? [];

  const { data: disputesRaw, isLoading: disputesLoading } = useGetApiLeadDisputes({
    status: (disputeStatusFilter || undefined) as any,
  });
  const disputes: LeadDispute[] =
    (disputesRaw as unknown as { data?: LeadDispute[] })?.data ?? [];

  const invalidatePolicies = () =>
    queryClient.invalidateQueries({ queryKey: getGetApiLeadProtectionPoliciesQueryKey() });
  const invalidateDisputes = () =>
    queryClient.invalidateQueries({ queryKey: getGetApiLeadDisputesQueryKey() });

  const { mutateAsync: createPolicy, isPending: isCreating } = usePostApiLeadProtectionPolicy({
    mutation: {
      onSuccess: () => {
        toast.success("Tạo chính sách thành công");
        invalidatePolicies();
        setCreateOpen(false);
      },
      onError: (e: any) => toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi tạo"),
    },
  });
  const { mutateAsync: updatePolicy, isPending: isUpdating } = usePatchApiLeadProtectionPolicy({
    mutation: {
      onSuccess: () => {
        toast.success("Cập nhật thành công");
        invalidatePolicies();
        setEditTarget(null);
      },
      onError: (e: any) => toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi cập nhật"),
    },
  });
  const { mutateAsync: deletePolicy, isPending: isDeleting } = useDeleteApiLeadProtectionPolicy({
    mutation: {
      onSuccess: () => {
        toast.success("Đã xóa");
        invalidatePolicies();
        setDeleteTarget(null);
      },
      onError: (e: any) => toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi xóa"),
    },
  });
  const { mutateAsync: resolveDispute, isPending: isResolving } = usePatchApiResolveLeadDispute({
    mutation: {
      onSuccess: () => {
        toast.success("Đã xử lý dispute");
        invalidateDisputes();
      },
      onError: (e: any) => toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi xử lý"),
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cài đặt"
        title="Bảo vệ lead"
        description="Cấu hình thời gian bảo vệ lead theo nguồn, loại khách, selling mode. Quản lý tranh chấp phụ trách."
        actions={
          tab === "policies" && canCreate ? (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={16} />
              Tạo chính sách
            </Button>
          ) : undefined
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-muted p-1 text-sm w-fit">
        <button
          className={`rounded-md px-3 py-1.5 font-medium transition-colors ${tab === "policies" ? "bg-background text-foreground shadow-sm" : "text-foreground-muted"
            }`}
          onClick={() => setTab("policies")}
        >
          Chính sách ({policies.length})
        </button>
        <button
          className={`rounded-md px-3 py-1.5 font-medium transition-colors ${tab === "disputes" ? "bg-background text-foreground shadow-sm" : "text-foreground-muted"
            }`}
          onClick={() => setTab("disputes")}
        >
          Tranh chấp ({disputes.length})
        </button>
      </div>

      {tab === "policies" ? (
        <>
          {policiesLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg bg-surface-muted" />
              ))}
            </div>
          ) : policies.length === 0 ? (
            <EmptyState
              icon={<Shield size={24} />}
              title="Chưa có chính sách bảo vệ lead"
              description="Tạo chính sách để quy định thời gian bảo vệ, reclaim, và cho phép reassign hay không."
              action={
                canCreate ? (
                  <Button onClick={() => setCreateOpen(true)}>
                    <Plus size={16} />
                    Tạo chính sách
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <PoliciesGrid
              policies={policies}
              canUpdate={canUpdate}
              canDelete={canDelete}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Select
              value={disputeStatusFilter}
              onValueChange={(v) => setDisputeStatusFilter((v as string) ?? "")}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Tất cả trạng thái">
                  {(value: string) => disputeStatusLabel[value] ?? "Tất cả trạng thái"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Object.entries(GetApiLeadDisputesStatus).map(([k]) => (
                  <SelectItem key={k} value={k} label={disputeStatusLabel[k] ?? k}>
                    {disputeStatusLabel[k] ?? k}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-foreground-muted">
              <span className="font-medium text-foreground">{disputes.length}</span> tranh chấp
            </p>
          </div>

          {disputes.length === 0 && !disputesLoading ? (
            <EmptyState
              icon={<AlertTriangle size={24} />}
              title="Không có tranh chấp"
              description="Chưa có tranh chấp phụ trách nào trong trạng thái này."
            />
          ) : (
            <DisputesList
              disputes={disputes}
              isLoading={disputesLoading}
              canApprove={canApprove}
              isResolving={isResolving}
              onResolve={async (d, resolution) => {
                await resolveDispute({ id: d.id, data: { resolution } });
              }}
            />
          )}
        </>
      )}

      <PolicyFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Tạo chính sách bảo vệ lead"
        submitLabel="Tạo"
        isSubmitting={isCreating}
        initial={null}
        onSubmit={async (v: PolicyFormValues) => {
          await createPolicy({
            data: {
              name: v.name,
              source: v.source || undefined,
              sellingMode: v.sellingMode || undefined,
              customerType: v.customerType || undefined,
              protectionDays: v.protectionDays,
              inactiveReclaimDays: v.inactiveReclaimDays,
              allowReassign: v.allowReassign,
              priority: v.priority,
            } as CreateLeadProtectionPolicyDto,
          });
        }}
      />

      <PolicyFormDialog
        open={!!editTarget}
        onOpenChange={(o) => !o && setEditTarget(null)}
        title="Cập nhật chính sách"
        submitLabel="Lưu"
        isSubmitting={isUpdating}
        initial={
          editTarget
            ? {
              name: editTarget.name,
              source: editTarget.source ?? "",
              sellingMode: editTarget.sellingMode ?? "",
              customerType: editTarget.customerType ?? "",
              protectionDays: editTarget.protectionDays,
              inactiveReclaimDays: editTarget.inactiveReclaimDays,
              allowReassign: editTarget.allowReassign,
              priority: editTarget.priority,
            }
            : null
        }
        onSubmit={async (v: PolicyFormValues) => {
          if (!editTarget) return;
          await updatePolicy({
            id: editTarget.id,
            data: {
              name: v.name,
              protectionDays: v.protectionDays,
              inactiveReclaimDays: v.inactiveReclaimDays,
              allowReassign: v.allowReassign,
              priority: v.priority,
            } as UpdateLeadProtectionPolicyDto,
          });
        }}
      />

      <DeletePolicyDialog
        target={deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        isSubmitting={isDeleting}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await deletePolicy({ id: deleteTarget.id });
        }}
      />
    </div>
  );
}
