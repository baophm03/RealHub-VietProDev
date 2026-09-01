"use client";

import { Loader2 } from "lucide-react";
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

export interface StatusConfirmData {
  title: string;
  description: string;
  confirmLabel: string;
  action: () => Promise<void>;
}

interface StatusConfirmDialogProps {
  data: StatusConfirmData | null;
  onOpenChange: (open: boolean) => void;
  isPending?: boolean;
}

export function StatusConfirmDialog({ data, onOpenChange, isPending }: StatusConfirmDialogProps) {
  return (
    <Dialog open={!!data} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{data?.title ?? ""}</DialogTitle>
          <DialogDescription>{data?.description ?? ""}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Hủy</DialogClose>
          <Button onClick={() => data?.action()} disabled={isPending}>
            {isPending ? "Đang xử lý..." : data?.confirmLabel ?? "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
