"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserX } from "lucide-react";
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
  usePatchApiCustomer,
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
  const { mutateAsync: patchCustomer, isPending } = usePatchApiCustomer();
  const [deactivating, setDeactivating] = useState(false);

  const handleConfirm = async () => {
    if (!customer) return;
    setDeactivating(true);
    try {
      await patchCustomer({ id: customer.id, data: { status: "INACTIVE" } as any });
      await queryClient.invalidateQueries({
        queryKey: getGetApiCustomersAdminQueryKey(),
      });
      toast.success(`Đã đánh dấu "${customer.fullName}" không hoạt động`);
      onOpenChange(false);
      onRefetch?.();
    } catch (err) {
      console.error(err);
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setDeactivating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đánh dấu không hoạt động</DialogTitle>
          <DialogDescription>
            {customer && (
              <span className="flex flex-col gap-1">
                <span>
                  Bạn có chắc muốn đánh dấu{" "}
                  <strong className="text-foreground">
                    {customer.fullName}
                  </strong>
                  {" "}không hoạt động?
                </span>
                <span className="mt-2 text-xs text-foreground-muted">
                  Khách hàng sẽ bị ẩn khỏi danh sách hoạt động. Bạn có thể khôi
                  phục lại bất cứ lúc nào bằng cách cập nhật trạng thái.
                </span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending || deactivating}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            loading={isPending || deactivating}
          >
            <UserX size={14} />
            Đánh dấu không hoạt động
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
