"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useDeleteApiAppointment,
  getGetApiAppointmentsAdminQueryKey,
} from "@/lib/api/endpoints/appointments";

export interface AppointmentDeleteTarget {
  id: string;
  title: string;
  scheduledAt?: string;
}

interface DeleteAppointmentDialogProps {
  appointment: AppointmentDeleteTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefetch?: () => void;
}

export function DeleteAppointmentDialog({
  appointment,
  open,
  onOpenChange,
  onRefetch,
}: DeleteAppointmentDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteAppointment, isPending } = useDeleteApiAppointment();
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!appointment) return;
    setDeleting(true);
    try {
      await deleteAppointment({ id: appointment.id });
      await queryClient.invalidateQueries({
        queryKey: getGetApiAppointmentsAdminQueryKey(),
      });
      toast.success(`Đã xóa "${appointment.title}"`);
      onOpenChange(false);
      onRefetch?.();
    } catch (err) {
      console.error(err);
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi xóa lịch hẹn");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa lịch hẹn</DialogTitle>
          <DialogDescription>
            {appointment && (
              <span className="flex flex-col gap-1">
                <span>
                  Bạn có chắc muốn xóa{" "}
                  <strong className="text-foreground">
                    {appointment.title}
                  </strong>
                  ?
                </span>
                <span className="mt-2 text-xs text-foreground-muted">
                  Hành động này không thể hoàn tác. Lịch hẹn sẽ bị ẩn (soft delete) và
                  không hiển thị trên hệ thống.
                </span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending || deleting}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={isPending || deleting}
          >
            <Trash2 size={14} />
            Xóa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
