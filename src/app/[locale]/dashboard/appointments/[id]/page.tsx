"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Bell,
  Clock,
  House,
  MapPin,
  Pencil,
  SquareKanban,
  Trash2,
  User,
} from "lucide-react";
import { Can } from "@casl/react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useGetApiAppointmentId, usePatchApiAppointment, useDeleteApiAppointment } from "@/lib/api/endpoints/appointments";
import type { UpdateAppointmentDtoStatus } from "@/lib/api/models/updateAppointmentDtoStatus";

interface Appointment {
  id: string;
  title: string;
  type: string;
  status: string;
  customerId?: string;
  leadId?: string;
  propertyId?: string;
  assignedUserId?: string;
  description?: string;
  locationText?: string;
  scheduledAt: string;
  endTime?: string;
  reminderMinutes?: number;
  customer?: { id: string; fullName: string; phone?: string; email?: string };
  property?: { id: string; title: string; propertyCode: string; price?: string };
  lead?: { id: string; leadCode: string };
  assignedUser?: { id: string; fullName: string };
}

const typeLabel: Record<string, string> = {
  MEETING: "Gặp mặt",
  CALL: "Gọi điện",
  SITE_VISIT: "Xem nhà",
  SIGNING: "Ký hợp đồng",
};

const typeVariant: Record<string, "blue" | "green" | "yellow" | "purple"> = {
  MEETING: "blue",
  CALL: "green",
  SITE_VISIT: "yellow",
  SIGNING: "purple",
};

const statusLabel: Record<string, { label: string; variant: "green" | "blue" | "default" | "red" | "yellow" }> = {
  SCHEDULED: { label: "Đã lên lịch", variant: "blue" },
  CONFIRMED: { label: "Đã xác nhận", variant: "green" },
  COMPLETED: { label: "Hoàn thành", variant: "default" },
  CANCELLED: { label: "Đã hủy", variant: "red" },
  NO_SHOW: { label: "Không đến", variant: "yellow" },
};

const statusOptions = [
  { value: "SCHEDULED", label: "Đã lên lịch" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "NO_SHOW", label: "Không đến" },
];

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { data: appointmentData, isLoading, refetch } = useGetApiAppointmentId(id);
  const appointment = (appointmentData as unknown as { data: Appointment })?.data;

  const { mutateAsync: updateAppointment, isPending: isUpdating } = usePatchApiAppointment();
  const { mutateAsync: deleteAppointment, isPending: isDeleting } = useDeleteApiAppointment();

  const handleStatusChange = async (newStatus: string) => {
    if (!appointment) return;
    try {
      await updateAppointment({ id, data: { status: newStatus as UpdateAppointmentDtoStatus } });
      toast.success("Đã cập nhật trạng thái");
      refetch();
    } catch (err) {
      toast.error("Cập nhật trạng thái thất bại");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAppointment({ id });
      toast.success(`Đã xóa lịch hẹn "${appointment?.title}"`);
      router.push("/dashboard/appointments");
    } catch (err) {
      toast.error("Xóa lịch hẹn thất bại");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-md bg-surface-muted" />
          <div className="h-8 w-64 animate-pulse rounded-lg bg-surface-muted" />
        </div>
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard/appointments")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lại">
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="Lịch hẹn" title="Không tìm thấy" />
        </div>
      </div>
    );
  }

  const dt = appointment.scheduledAt ? new Date(appointment.scheduledAt) : null;
  const statusCfg = statusLabel[appointment.status] ?? { label: appointment.status, variant: "default" as const };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard/appointments")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lại">
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="Lịch hẹn" title={appointment.title} />
        </div>
        <div className="flex items-center gap-2">
          <Can I="UPDATE" a="APPOINTMENT">
            <Button variant="outline" onClick={() => router.push(`/dashboard/appointments/${id}/edit`)}>
              <Pencil size={16} />
              Chỉnh sửa
            </Button>
          </Can>
          <Can I="DELETE" a="APPOINTMENT">
            <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2 size={16} />
              Xóa
            </Button>
          </Can>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Main info */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={typeVariant[appointment.type] ?? "default"}>
                {typeLabel[appointment.type] ?? appointment.type}
              </Badge>
              <Badge variant={statusCfg.variant}>{statusCfg.label}</Badge>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-foreground-muted shrink-0" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Thời gian</span>
                  <span className="text-sm">
                    {dt ? dt.toLocaleString("vi-VN") : "—"}
                    {appointment.endTime ? ` — ${new Date(appointment.endTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` : ""}
                  </span>
                </div>
              </div>
              {appointment.locationText && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-foreground-muted shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Địa điểm</span>
                    <span className="text-sm">{appointment.locationText}</span>
                  </div>
                </div>
              )}
              {appointment.description && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Mô tả</span>
                  <p className="text-sm whitespace-pre-wrap rounded-lg border border-border bg-surface-muted/40 p-4">
                    {appointment.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Status update */}
          <Can I="UPDATE" a="APPOINTMENT">
            <div className="rounded-lg border border-border bg-surface p-6">
              <h3 className="text-sm font-semibold mb-4">Cập nhật trạng thái</h3>
              <div className="flex flex-wrap items-center gap-2">
                {statusOptions.map((opt) => {
                  const cfg = statusLabel[opt.value];
                  return (
                    <Button
                      key={opt.value}
                      variant={appointment.status === opt.value ? "default" : "outline"}
                      size="sm"
                      disabled={isUpdating || appointment.status === opt.value}
                      onClick={() => handleStatusChange(opt.value)}
                    >
                      {cfg?.label ?? opt.value}
                    </Button>
                  );
                })}
              </div>
            </div>
          </Can>
        </div>

        {/* Sidebar — related info */}
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold mb-4">Thông tin liên quan</h3>
            <div className="flex flex-col gap-4 text-sm">
              {appointment.customer && (
                <div className="flex items-start gap-2">
                  <User size={16} className="text-foreground-muted shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground-muted">Khách hàng</span>
                    <button
                      onClick={() => router.push(`/dashboard/customers/${appointment.customer!.id}`)}
                      className="text-left text-primary hover:underline"
                    >
                      {appointment.customer.fullName}
                    </button>
                    {appointment.customer.phone && (
                      <span className="text-xs text-foreground-muted tabular-nums">{appointment.customer.phone}</span>
                    )}
                  </div>
                </div>
              )}
              {appointment.property && (
                <div className="flex items-start gap-2">
                  <House size={16} className="text-foreground-muted shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground-muted">Bất động sản</span>
                    <button
                      onClick={() => router.push(`/dashboard/properties/${appointment.property!.id}`)}
                      className="text-left text-primary hover:underline"
                    >
                      {appointment.property.title}
                    </button>
                    <span className="text-xs text-foreground-muted">#{appointment.property.propertyCode}</span>
                  </div>
                </div>
              )}
              {appointment.lead && (
                <div className="flex items-start gap-2">
                  <SquareKanban size={16} className="text-foreground-muted shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground-muted">Lead</span>
                    <button
                      onClick={() => router.push(`/dashboard/leads/${appointment.lead!.id}`)}
                      className="text-left text-primary hover:underline"
                    >
                      {appointment.lead.leadCode}
                    </button>
                  </div>
                </div>
              )}
              {appointment.assignedUser && (
                <div className="flex items-start gap-2">
                  <User size={16} className="text-foreground-muted shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground-muted">Người phụ trách</span>
                    <span className="text-sm">{appointment.assignedUser.fullName}</span>
                  </div>
                </div>
              )}
              {appointment.reminderMinutes != null && (
                <div className="flex items-start gap-2">
                  <Bell size={16} className="text-foreground-muted shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-xs text-foreground-muted">Nhắc nhở trước</span>
                    <span className="text-sm tabular-nums">{appointment.reminderMinutes} phút</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Xóa lịch hẹn</DialogTitle>
              <DialogDescription>
                Hành động này sẽ ẩn lịch hẹn (soft delete). Bạn có chắc chắn?
              </DialogDescription>
            </DialogHeader>
            <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm">
              <p className="font-medium">{appointment.title}</p>
              {dt && <p className="text-foreground-muted tabular-nums">{dt.toLocaleString("vi-VN")}</p>}
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteOpen(false)}>Hủy</Button>
              <Button variant="destructive" disabled={isDeleting} onClick={handleDelete}>
                {isDeleting ? "Đang xóa..." : "Xóa"}
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
