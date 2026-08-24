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
  useDeleteApiProperty,
  getGetApiPropertiesQueryKey,
} from "@/lib/api/endpoints/properties";
import type { Property } from "@/lib/api/types/properties";

interface DeletePropertyDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export function DeletePropertyDialog({
  property,
  open,
  onOpenChange,
  onRefresh,
}: DeletePropertyDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: deleteProperty, isPending } = useDeleteApiProperty();
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    if (!property) return;
    setDeleting(true);
    try {
      await deleteProperty({ id: property.id });
      await queryClient.invalidateQueries({
        queryKey: getGetApiPropertiesQueryKey(),
      });
      toast.success(`Đã xóa "${property.title}"`);
      onOpenChange(false);
      onRefresh?.();
    } catch (err) {
      console.error(err);
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi xóa bất động sản");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa bất động sản</DialogTitle>
          <DialogDescription>
            {property && (
              <span className="flex flex-col gap-1">
                <span>
                  Bạn có chắc muốn xóa{" "}
                  <strong className="text-foreground">
                    {property.title}
                  </strong>
                  ?
                </span>
                <span className="mt-2 text-xs text-foreground-muted">
                  Lưu ý: Hành động này không thể hoàn tác.
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
