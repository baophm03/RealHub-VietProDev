"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  Check,
  CheckCheck,
  CircleUser,
  ExternalLink,
  House,
  MessageCircle,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { Can } from "@casl/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePortalPath } from "@/lib/hooks/use-portal";
import {
  usePatchApiPropertyContactsId,
  useDeleteApiPropertyContactsId,
} from "@/lib/api/endpoints/property-contacts";

export interface PropertyContact {
  id: string;
  userName: string;
  userPhone: string;
  userContent?: string;
  status: "UNREAD" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    title: string;
    propertyCode: string;
  };
  recipient?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  } | null;
}

const statusConfig: Record<
  PropertyContact["status"],
  { label: string; variant: "red" | "blue" | "green" | "default" }
> = {
  UNREAD: { label: "Chưa đọc", variant: "red" },
  READ: { label: "Đã đọc", variant: "blue" },
  REPLIED: { label: "Đã phản hồi", variant: "green" },
  ARCHIVED: { label: "Đã lưu trữ", variant: "default" },
};

interface ConsultationDetailDialogProps {
  contact: PropertyContact | null;
  onOpenChange: (open: boolean) => void;
  onUpdated?: (contact: PropertyContact) => void;
  onDeleted?: (id: string) => void;
}

export function ConsultationDetailDialog({
  contact,
  onOpenChange,
  onUpdated,
  onDeleted,
}: ConsultationDetailDialogProps) {
  const router = useRouter();
  const portalPath = usePortalPath();
  const { mutateAsync: updateContact, isPending: isUpdating } = usePatchApiPropertyContactsId();
  const { mutateAsync: deleteContact, isPending: isDeleting } = useDeleteApiPropertyContactsId();

  const handleStatusChange = async (
    id: string,
    status: PropertyContact["status"],
  ) => {
    try {
      await updateContact({ id, data: { status } });
      toast.success(`Đã cập nhật: ${statusConfig[status].label}`);
      onUpdated?.({ ...contact!, status });
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Cập nhật trạng thái thất bại");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact({ id });
      toast.success("Đã lưu trữ yêu cầu");
      onDeleted?.(id);
      onOpenChange(false);
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Lưu trữ thất bại");
      console.error(err);
    }
  };

  return (
    <Dialog
      open={!!contact}
      onOpenChange={onOpenChange}
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết yêu cầu tư vấn</DialogTitle>
            <DialogDescription>
              Thông tin khách hàng và bất động sản liên quan
            </DialogDescription>
          </DialogHeader>

          {contact && (
            <div className="flex flex-col gap-5">
              {/* Status + date */}
              <div className="flex items-center justify-between">
                <Badge variant={statusConfig[contact.status]?.variant ?? "default"}>
                  {statusConfig[contact.status]?.label ?? contact.status}
                </Badge>
                <span className="text-xs tabular-nums text-foreground-muted">
                  {contact.createdAt
                    ? new Date(contact.createdAt).toLocaleString("vi-VN")
                    : ""}
                </span>
              </div>

              {/* Stacked layout: property | customer */}
              <div className="flex flex-col gap-4">
                {/* Property info */}
                <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-muted/40 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                    <House size={14} />
                    Bất động sản
                  </div>
                  {contact.property ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium leading-snug">
                          {contact.property.title}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Xem bất động sản"
                          onClick={() => {
                            router.push(portalPath(`/properties/${contact.property!.id}`));
                            onOpenChange(false);
                          }}
                        >
                          <ExternalLink size={14} />
                        </Button>
                      </div>
                      <span className="text-xs tabular-nums text-foreground-muted">
                        #{contact.property.propertyCode}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-foreground-muted">—</span>
                  )}
                </div>

                {/* Customer info */}
                <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface-muted/40 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                    <CircleUser size={14} />
                    Khách liên hệ
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">{contact.userName}</span>
                    <div className="flex items-center gap-2 text-sm text-foreground-muted">
                      <Phone size={14} />
                      <span className="tabular-nums">{contact.userPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content (full width) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                  <MessageCircle size={14} />
                  Nội dung yêu cầu
                </div>
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap rounded-lg border border-border bg-surface-muted/40 p-4">
                  {contact.userContent || "—"}
                </p>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-2 text-xs text-foreground-muted">
                <Calendar size={14} />
                <span>
                  Cập nhật lúc:{" "}
                  <span className="tabular-nums">
                    {contact.updatedAt
                      ? new Date(contact.updatedAt).toLocaleString("vi-VN")
                      : "—"}
                  </span>
                </span>
              </div>

              {/* Status actions */}
              <Can I="UPDATE_OWN" a="PROPERTY_CONTACT">
                <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
                  <span className="text-xs font-medium text-foreground-muted mr-auto">
                    Cập nhật trạng thái:
                  </span>
                  <Button
                    variant={contact.status === "UNREAD" ? "default" : "outline"}
                    size="sm"
                    disabled={isUpdating || contact.status === "UNREAD"}
                    onClick={() => handleStatusChange(contact.id, "UNREAD")}
                  >
                    Chưa đọc
                  </Button>
                  <Button
                    variant={contact.status === "READ" ? "default" : "outline"}
                    size="sm"
                    disabled={isUpdating || contact.status === "READ"}
                    onClick={() => handleStatusChange(contact.id, "READ")}
                    leftIcon={<Check size={14} />}
                  >
                    Đã đọc
                  </Button>
                  <Button
                    variant={contact.status === "REPLIED" ? "default" : "outline"}
                    size="sm"
                    disabled={isUpdating || contact.status === "REPLIED"}
                    onClick={() => handleStatusChange(contact.id, "REPLIED")}
                    leftIcon={<CheckCheck size={14} />}
                  >
                    Đã phản hồi
                  </Button>
                </div>
              </Can>
              <Can I="DELETE_OWN" a="PROPERTY_CONTACT">
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={isDeleting || contact.status === "ARCHIVED"}
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    Lưu trữ
                  </Button>
                </div>
              </Can>
            </div>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
