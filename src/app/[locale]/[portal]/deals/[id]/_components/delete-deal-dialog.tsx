"use client";

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

interface DeleteDealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal?: { dealCode: string; customer?: { fullName?: string } | null } | null;
  isDeleting?: boolean;
  onConfirm: () => void;
}

export function DeleteDealDialog({
  open,
  onOpenChange,
  deal,
  isDeleting,
  onConfirm,
}: DeleteDealDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa giao dịch</DialogTitle>
            <DialogDescription>
              Hành động này sẽ ẩn giao dịch (soft delete). Bạn có chắc chắn?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm">
            <p className="font-medium">{deal?.dealCode}</p>
            {deal?.customer?.fullName && (
              <p className="text-foreground-muted">{deal.customer.fullName}</p>
            )}
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button variant="destructive" disabled={isDeleting} onClick={onConfirm}>
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
