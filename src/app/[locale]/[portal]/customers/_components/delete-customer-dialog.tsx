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
  useDeleteApiCustomer,
  getGetApiCustomersAdminQueryKey,
} from "@/lib/api/endpoints/customers";

export interface CustomerDeleteTarget {
  id: string;
  fullName: string;
  phone?: string;
}

interface DeleteCustomerDialogProps {
  customer: CustomerDeleteTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefetch?: () => void;
}

export function DeleteCustomerDialog({
  customer,
  open,
  onOpenChange,
  onRefetch,
}: DeleteCustomerDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteCustomer, isPending } = useDeleteApiCustomer();
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!customer) return;
    setDeleting(true);
    try {
      await deleteCustomer({ id: customer.id });
      await queryClient.invalidateQueries({
        queryKey: getGetApiCustomersAdminQueryKey(),
      });
      toast.success(`Đã xóa "${customer.fullName}"`);
      onOpenChange(false);
      onRefetch?.();
    } catch (err) {
      console.error(err);
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi xóa khách hàng");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa khách hàng</DialogTitle>
          <DialogDescription>
            {customer && (
              <span className="flex flex-col gap-1">
                <span>
                  Bạn có chắc muốn xóa{" "}
                  <strong className="text-foreground">
                    {customer.fullName}
                  </strong>
                  ?
                </span>
                <span className="mt-2 text-xs text-foreground-muted">
                  Hành động này không thể hoàn tác. Khách hàng sẽ bị ẩn (soft delete) và
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
