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
import { entityTypeLabel, type VisibilityPolicy } from "./types";

interface Props {
  target: VisibilityPolicy | null;
  onOpenChange: (o: boolean) => void;
  isSubmitting: boolean;
  onConfirm: () => Promise<void>;
}

export function DeletePolicyDialog({
  target,
  onOpenChange,
  isSubmitting,
  onConfirm,
}: Props) {
  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa chính sách hiển thị</DialogTitle>
            <DialogDescription>Hành động này không thể hoàn tác.</DialogDescription>
          </DialogHeader>
          {target && (
            <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm">
              <p className="font-medium">{target.name}</p>
              <p className="mt-1 text-xs text-foreground-muted">
                {entityTypeLabel[target.entityType] ?? target.entityType} ·{" "}
                {target.rules.length} rules
              </p>
            </div>
          )}
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={onConfirm} disabled={isSubmitting}>
              {isSubmitting ? (
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
