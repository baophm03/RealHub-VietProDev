"use client";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import type { Plan } from "./types";

interface DeletePlanDialogProps {
  plan: Plan | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeletePlanDialog({ plan, onOpenChange, onConfirm, isPending }: DeletePlanDialogProps) {
  const ruleCount = plan?.rules?.length ?? 0;
  const splitCount = plan?.rules?.reduce((acc, r) => acc + (r.splits?.length ?? 0), 0) ?? 0;

  return (
    <Dialog open={!!plan} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa kế hoạch hoa hồng</DialogTitle>
            <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
          </DialogHeader>
          {plan && (
            <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm">
              <p className="font-medium">{plan.name}</p>
              <p className="mt-1 text-xs text-foreground-muted">
                {ruleCount} rule · {splitCount} split
              </p>
            </div>
          )}
          <div className="rounded-lg bg-accent-red/20 px-4 py-3 text-sm text-accent-red-text">
            Kế hoạch chỉ có thể xóa nếu không có giao dịch nào đang dùng. Bạn có chắc muốn xóa?
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
              {isPending ? (
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
  );
}
