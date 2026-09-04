"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Eye, Plus, Trash2, Pencil, Shield } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ability } from "@/config/casl/ability";
import {
  useGetApiVisibilityPolicies,
  usePostApiVisibilityPolicy,
  usePatchApiVisibilityPolicy,
  useDeleteApiVisibilityPolicy,
  usePostApiVisibilityRule,
  useDeleteApiVisibilityRule,
  getGetApiVisibilityPoliciesQueryKey,
} from "@/lib/api/endpoints/visibility-policies";
import type { CreateVisibilityPolicyDto } from "@/lib/api/models/createVisibilityPolicyDto";
import type { UpdateVisibilityPolicyDto } from "@/lib/api/models/updateVisibilityPolicyDto";
import type { AddVisibilityRuleDto } from "@/lib/api/models/addVisibilityRuleDto";
import { CreateVisibilityPolicyDtoEntityType } from "@/lib/api/models/createVisibilityPolicyDtoEntityType";
import {
  entityTypeLabel,
  visibilityLevelLabel,
  maskTypeLabel,
  type VisibilityPolicy,
  type PolicyFormValues,
  type RuleFormValues,
} from "./_components/types";
import { PolicyFormDialog } from "./_components/policy-form-dialog";
import { RuleFormDialog } from "./_components/rule-form-dialog";
import { DeletePolicyDialog } from "./_components/delete-policy-dialog";

const entityTypeOptions = Object.entries(CreateVisibilityPolicyDtoEntityType).map(([k]) => ({
  value: k,
  label: entityTypeLabel[k] ?? k,
}));

export default function VisibilityPoliciesPage() {
  const queryClient = useQueryClient();
  const canCreate = ability.can("CREATE", "SETTING");
  const canUpdate = ability.can("UPDATE", "SETTING");
  const canDelete = ability.can("DELETE", "SETTING");

  const [entityFilter, setEntityFilter] = useState<string>("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<VisibilityPolicy | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<VisibilityPolicy | null>(null);
  const [ruleTarget, setRuleTarget] = useState<VisibilityPolicy | null>(null);

  const { data: raw, isLoading } = useGetApiVisibilityPolicies({
    entityType: (entityFilter || undefined) as any,
  });
  const policies: VisibilityPolicy[] =
    (raw as unknown as { data?: VisibilityPolicy[] })?.data ?? [];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getGetApiVisibilityPoliciesQueryKey() });

  const { mutateAsync: createPolicy, isPending: isCreating } = usePostApiVisibilityPolicy({
    mutation: {
      onSuccess: () => {
        toast.success("Tạo chính sách thành công");
        invalidate();
        setCreateOpen(false);
      },
      onError: (e: any) => toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi tạo"),
    },
  });
  const { mutateAsync: updatePolicy, isPending: isUpdating } = usePatchApiVisibilityPolicy({
    mutation: {
      onSuccess: () => {
        toast.success("Cập nhật thành công");
        invalidate();
        setEditTarget(null);
      },
      onError: (e: any) => toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi cập nhật"),
    },
  });
  const { mutateAsync: deletePolicy, isPending: isDeleting } = useDeleteApiVisibilityPolicy({
    mutation: {
      onSuccess: () => {
        toast.success("Đã xóa chính sách");
        invalidate();
        setDeleteTarget(null);
      },
      onError: (e: any) => toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi xóa"),
    },
  });
  const { mutateAsync: addRule, isPending: isAddingRule } = usePostApiVisibilityRule({
    mutation: {
      onSuccess: () => {
        toast.success("Đã thêm rule");
        invalidate();
        setRuleTarget(null);
      },
      onError: (e: any) => toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi thêm rule"),
    },
  });
  const { mutateAsync: deleteRule } = useDeleteApiVisibilityRule({
    mutation: {
      onSuccess: () => {
        toast.success("Đã xóa rule");
        invalidate();
      },
      onError: (e: any) => toast.error(e?.response?.data?.error?.message?.[0] || "Lỗi xóa rule"),
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Cài đặt"
        title="Chính sách hiển thị"
        description="Quy định role nào thấy trường gì, có được mask hay không. Áp dụng cho BĐS, khách hàng, lead, deal, owner."
        actions={
          canCreate && (
            <Button onClick={() => setCreateOpen(true)}>
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
            value={entityFilter}
            onValueChange={(v) => setEntityFilter((v as string) ?? "")}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Tất cả đối tượng">
                {(value: string) =>
                  entityTypeOptions.find((o) => o.value === value)?.label ?? "Tất cả đối tượng"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {entityTypeOptions.map((o) => (
                <SelectItem key={o.value} value={o.value} label={o.label}>
                  {o.label}
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
          icon={<Shield size={24} />}
          title="Chưa có chính sách hiển thị"
          description="Tạo chính sách để quy định role nào thấy trường nào, có mask dữ liệu nhạy cảm hay không."
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Eye size={14} className="text-foreground-muted" />
                      {p.name}
                    </CardTitle>
                    <CardDescription>
                      {entityTypeLabel[p.entityType] ?? p.entityType} · priority {p.priority}
                    </CardDescription>
                  </div>
                  <Badge variant={p.status === "ACTIVE" ? "green" : "default"}>
                    {p.status === "ACTIVE" ? "Active" : p.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {p.rules.length === 0 ? (
                  <p className="text-xs text-foreground-muted">Chưa có rule nào</p>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    {p.rules.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between gap-2 rounded-md bg-surface-muted/40 px-2 py-1.5 text-xs"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono font-medium">{r.fieldKey}</span>
                          <span className="text-foreground-muted">
                            {r.roleCode} ·{" "}
                            {visibilityLevelLabel[r.visibilityLevel] ?? r.visibilityLevel}
                            {r.maskType ? ` · ${maskTypeLabel[r.maskType] ?? r.maskType}` : ""}
                          </span>
                        </div>
                        {canDelete && (
                          <button
                            className="rounded p-1 text-foreground-muted hover:bg-surface-muted hover:text-destructive"
                            onClick={async () => {
                              await deleteRule({ ruleId: r.id });
                            }}
                            aria-label="Xóa rule"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 pt-3">
                  {canUpdate && (
                    <Button variant="outline" size="sm" onClick={() => setEditTarget(p)}>
                      <Pencil size={12} />
                      Đổi tên
                    </Button>
                  )}
                  {canCreate && (
                    <Button variant="outline" size="sm" onClick={() => setRuleTarget(p)}>
                      <Plus size={12} />
                      Thêm rule
                    </Button>
                  )}
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-destructive"
                      onClick={() => setDeleteTarget(p)}
                    >
                      <Trash2 size={12} />
                      Xóa
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PolicyFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Tạo chính sách hiển thị"
        submitLabel="Tạo"
        isSubmitting={isCreating}
        initial={null}
        onSubmit={async (v: PolicyFormValues) => {
          await createPolicy({
            data: {
              name: v.name,
              entityType: v.entityType as CreateVisibilityPolicyDto["entityType"],
              priority: v.priority,
            } as CreateVisibilityPolicyDto,
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
            ? { name: editTarget.name, entityType: editTarget.entityType, priority: editTarget.priority }
            : null
        }
        onSubmit={async (v: PolicyFormValues) => {
          if (!editTarget) return;
          await updatePolicy({
            id: editTarget.id,
            data: { name: v.name, priority: v.priority } as UpdateVisibilityPolicyDto,
          });
        }}
      />

      <RuleFormDialog
        open={!!ruleTarget}
        onOpenChange={(o) => !o && setRuleTarget(null)}
        isSubmitting={isAddingRule}
        onSubmit={async (v: RuleFormValues) => {
          if (!ruleTarget) return;
          await addRule({
            id: ruleTarget.id,
            data: {
              fieldKey: v.fieldKey,
              roleCode: v.roleCode,
              visibilityLevel: v.visibilityLevel as AddVisibilityRuleDto["visibilityLevel"],
              maskType: v.maskType as AddVisibilityRuleDto["maskType"],
            } as AddVisibilityRuleDto,
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
