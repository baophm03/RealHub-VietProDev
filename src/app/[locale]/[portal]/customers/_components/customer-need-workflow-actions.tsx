"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, GitBranch, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  useGetApiCustomerNeedTransitions,
  usePostApiCustomerNeedTransition,
} from "@/lib/api/endpoints/customers";
import { useGetApiWorkflowEntityStatusFields } from "@/lib/api/endpoints/workflow";

interface AvailableTransition {
  transitionId: string;
  actionCode: string;
  actionLabel: string;
  fromStateName: string;
  toStateName: string;
  fromColumnName: string;
  toColumnName: string;
  requireReason: boolean;
  requireAttachment: boolean;
}

interface StatusField {
  fieldKey: string;
  label: string;
  values: { code: string; label: string; color?: string }[];
}

export function CustomerNeedWorkflowActions({ needId }: { needId: string }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<AvailableTransition | null>(null);
  const [reason, setReason] = useState("");
  const [executing, setExecuting] = useState(false);

  const { data: transData, isLoading } = useGetApiCustomerNeedTransitions(needId, {
    query: { enabled: open },
  });
  const rawTrans = transData as any;
  const actions: AvailableTransition[] = rawTrans?.data ?? rawTrans ?? [];

  const { data: fieldsData } = useGetApiWorkflowEntityStatusFields(
    { entityType: "CUSTOMER_NEED" as any },
  );
  const rawFields = fieldsData as any;
  const fields: StatusField[] = rawFields?.data ?? rawFields ?? [];
  const fieldLabelMap = new Map<string, string>();
  const valueLabelMap = new Map<string, Map<string, string>>();
  for (const f of fields) {
    fieldLabelMap.set(f.fieldKey, f.label);
    const inner = new Map<string, string>();
    for (const v of f.values) inner.set(v.code, v.label);
    valueLabelMap.set(f.fieldKey, inner);
  }
  const getStateLabel = (col: string, name: string) =>
    valueLabelMap.get(col)?.get(name) ?? name;
  const getColumnLabel = (col: string) => fieldLabelMap.get(col) ?? col;

  const { mutateAsync: executeTransition } = usePostApiCustomerNeedTransition({
    mutation: {
      onSuccess: () => {
        toast.success("Chuyển trạng thái thành công");
        queryClient.invalidateQueries();
        setSelectedAction(null);
        setReason("");
        setOpen(false);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Có lỗi khi chuyển trạng thái";
        toast.error(msg);
      },
    },
  });

  const handleExecute = async () => {
    if (!selectedAction) return;
    if (selectedAction.requireReason && !reason.trim()) {
      toast.error("Hành động này yêu cầu lý do");
      return;
    }
    setExecuting(true);
    try {
      await executeTransition({
        id: needId,
        data: {
          transitionId: selectedAction.transitionId,
          reason: reason || undefined,
        },
      });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-xs"
      >
        <GitBranch size={12} className="mr-1" />
        Hành động
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hành động nhu cầu</DialogTitle>
            <DialogDescription>
              Chọn một hành động để chuyển trạng thái nhu cầu.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-foreground-muted py-4">
              <Loader2 size={14} className="animate-spin" />
              Đang tải hành động...
            </div>
          ) : actions.length === 0 ? (
            <p className="text-xs text-foreground-muted py-4">
              Không có hành động nào khả dụng từ trạng thái hiện tại.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {actions.map((a) => (
                <button
                  key={a.transitionId}
                  onClick={() => {
                    setSelectedAction(a);
                    setReason("");
                  }}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-left transition-colors hover:border-foreground/20 hover:bg-surface-muted/50"
                >
                  <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <span className="text-sm font-medium truncate">{a.actionLabel}</span>
                    <span className="text-[10px] text-foreground-muted truncate">
                      {getStateLabel(a.fromColumnName, a.fromStateName)} → {getStateLabel(a.toColumnName, a.toStateName)}
                      {a.fromColumnName !== a.toColumnName && (
                        <span className="ml-1">({getColumnLabel(a.toColumnName)})</span>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {a.requireReason && (
                      <Badge variant="yellow" className="text-[9px]">Lý do</Badge>
                    )}
                    {a.requireAttachment && (
                      <Badge variant="yellow" className="text-[9px]">Tệp</Badge>
                    )}
                    <ArrowRight size={12} className="text-foreground-muted" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Confirm sub-dialog */}
          {selectedAction && (
            <div className="mt-2 rounded-lg border border-border bg-surface-muted/40 p-3">
              <p className="text-xs text-foreground-muted mb-2">
                Trạng thái sẽ chuyển từ{" "}
                <span className="font-medium text-foreground">
                  {getStateLabel(selectedAction.fromColumnName, selectedAction.fromStateName)}
                </span>{" "}
                sang{" "}
                <span className="font-medium text-foreground">
                  {getStateLabel(selectedAction.toColumnName, selectedAction.toStateName)}
                </span>
                {selectedAction.fromColumnName !== selectedAction.toColumnName && (
                  <>
                    {" "}trên cột{" "}
                    <span className="font-medium text-foreground">
                      {getColumnLabel(selectedAction.toColumnName)}
                    </span>
                  </>
                )}
                .
              </p>
              {selectedAction.requireReason && (
                <div className="flex flex-col gap-1.5 mb-2">
                  <label className="text-xs font-medium text-foreground-muted">
                    Lý do <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Nhập lý do chuyển trạng thái..."
                    rows={3}
                  />
                </div>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedAction(null)}>
                  Hủy
                </Button>
                <Button size="sm" onClick={handleExecute} disabled={executing}>
                  {executing ? "Đang xử lý..." : "Xác nhận"}
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Đóng</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
