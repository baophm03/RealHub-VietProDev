"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send } from "lucide-react";
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
  usePatchApiProperty,
  getGetApiPropertiesQueryKey,
} from "@/lib/api/endpoints/properties";
import type { Property } from "@/lib/api/types/properties";

interface SubmitVerificationDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh?: () => void;
}

export function SubmitVerificationDialog({
  property,
  open,
  onOpenChange,
  onRefresh,
}: SubmitVerificationDialogProps) {
  const queryClient = useQueryClient();
  const { mutateAsync: patchProperty, isPending } = usePatchApiProperty();
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!property) return;
    setSubmitting(true);
    try {
      await patchProperty({
        id: property.id,
        data: { verificationStatus: "PENDING" },
      });
      await queryClient.invalidateQueries({
        queryKey: getGetApiPropertiesQueryKey(),
      });
      toast.success(`Đã gửi duyệt "${property.title}"`);
      onOpenChange(false);
      onRefresh?.();
    } catch (err) {
      console.error(err);
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi gửi duyệt");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Gửi duyệt bất động sản</DialogTitle>
          <DialogDescription>
            {property && (
              <span className="flex flex-col gap-1">
                <span>
                  BĐS:{" "}
                  <strong className="text-foreground">
                    {property.title}
                  </strong>
                </span>
                <span className="mt-2 text-xs">
                  Sản phẩm sẽ được chuyển sang trạng thái &quot;Chờ duyệt&quot;.
                  Operator/Agency Admin sẽ xem xét và xác minh trước khi hiển thị
                  public.
                </span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending || submitting}
          >
            Hủy
          </Button>
          <Button onClick={handleConfirm} loading={isPending || submitting}>
            <Send size={14} />
            Gửi duyệt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
