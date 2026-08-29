"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Property } from "@/lib/api/types/properties";
import type { UpdatePropertyDtoVerificationStatus } from "@/lib/api/models";

type VerificationStatus = UpdatePropertyDtoVerificationStatus;

const statusVariant: Record<
  VerificationStatus,
  "default" | "yellow" | "green" | "red" | "blue"
> = {
  DRAFT: "default",
  PENDING: "yellow",
  VERIFIED: "green",
  REJECTED: "red",
};

const statusLabel: Record<VerificationStatus, string> = {
  DRAFT: "Nháp",
  PENDING: "Chờ duyệt",
  VERIFIED: "Đã duyệt",
  REJECTED: "Từ chối",
};

const statusDescription: Record<VerificationStatus, string> = {
  DRAFT: "Yêu cầu owner/sales chỉnh sửa lại trước khi gửi duyệt lần nữa.",
  PENDING: "Gửi yêu cầu duyệt, Operator/Agency Admin sẽ xem xét.",
  VERIFIED: "Xác minh thành công. Sản phẩm đủ điều kiện hiển thị public (kèm publicationStatus phù hợp).",
  REJECTED: "Từ chối duyệt. Cần owner/sales cập nhật lại thông tin.",
};

export interface VerificationActionTarget {
  property: Property;
  status: VerificationStatus;
}

interface VerificationActionDialogProps {
  target: VerificationActionTarget | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VerificationActionDialog({
  target,
  open,
  onOpenChange,
}: VerificationActionDialogProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutateAsync: patchProperty, isPending } = usePatchApiProperty();
  const [confirming, setConfirming] = useState(false);

  const handleConfirm = async () => {
    if (!target) return;
    const { property, status } = target;
    setConfirming(true);
    try {
      await patchProperty({
        id: property.id,
        data: { verificationStatus: status },
      });
      await queryClient.invalidateQueries({
        queryKey: getGetApiPropertiesQueryKey(),
      });
      router.refresh();
      toast.success(
        `Đã chuyển "${property.title}" sang "${statusLabel[status]}"`,
      );
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi cập nhật trạng thái kiểm duyệt");
    } finally {
      setConfirming(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Xác nhận chuyển trạng thái kiểm duyệt
          </DialogTitle>
          <DialogDescription>
            {target && (
              <span className="flex flex-col gap-1">
                <span>
                  BĐS:{" "}
                  <strong className="text-foreground">
                    {target.property.title}
                  </strong>
                </span>
                <span>
                  Trạng thái mới:{" "}
                  <Badge variant={statusVariant[target.status]}>
                    {statusLabel[target.status]}
                  </Badge>
                </span>
                <span className="mt-2 text-xs">
                  {statusDescription[target.status]}
                </span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending || confirming}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
            loading={isPending || confirming}
            variant={target?.status === "REJECTED" ? "destructive" : "default"}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
