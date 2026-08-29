"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";

interface CreateReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isCreating?: boolean;
  onSubmit: (data: {
    reservationType: string;
    startsAt: string;
    expiresAt: string;
    note?: string;
  }) => Promise<void> | void;
}

export function CreateReservationDialog({
  open,
  onOpenChange,
  isCreating,
  onSubmit,
}: CreateReservationDialogProps) {
  const [resvType, setResvType] = useState("SOFT");
  const [resvStartsAt, setResvStartsAt] = useState("");
  const [resvExpiresAt, setResvExpiresAt] = useState("");
  const [resvNote, setResvNote] = useState("");

  const handleClose = (open: boolean) => {
    if (!open) {
      setResvStartsAt("");
      setResvExpiresAt("");
      setResvNote("");
    }
    onOpenChange(open);
  };

  const handleSubmit = async () => {
    if (!resvStartsAt || !resvExpiresAt) return;
    await onSubmit({
      reservationType: resvType,
      startsAt: resvStartsAt,
      expiresAt: resvExpiresAt,
      note: resvNote || undefined,
    });
    setResvStartsAt("");
    setResvExpiresAt("");
    setResvNote("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo reservation</DialogTitle>
            <DialogDescription>
              Đặt giữ BĐS cho giao dịch này.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">Loại reservation</label>
              <Select
                value={resvType}
                items={{ SOFT: "Cọc mềm", HARD: "Cọc cứng" }}
                onValueChange={(v) => v && setResvType(v)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue placeholder="Chọn loại reservation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOFT" label="Cọc mềm">Cọc mềm</SelectItem>
                  <SelectItem value="HARD" label="Cọc cứng">Cọc cứng</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">Bắt đầu</label>
                <Input
                  type="datetime-local"
                  value={resvStartsAt}
                  onChange={(e) => setResvStartsAt(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold tracking-wide text-foreground-muted">Hết hạn</label>
                <Input
                  type="datetime-local"
                  value={resvExpiresAt}
                  onChange={(e) => setResvExpiresAt(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold tracking-wide text-foreground-muted">Ghi chú</label>
              <Textarea
                value={resvNote}
                onChange={(e) => setResvNote(e.target.value)}
                placeholder="Ghi chú (tùy chọn)"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => handleClose(false)}>Hủy</Button>
            <Button
              disabled={isCreating || !resvStartsAt || !resvExpiresAt}
              onClick={handleSubmit}
            >
              {isCreating ? "Đang lưu..." : "Tạo reservation"}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
