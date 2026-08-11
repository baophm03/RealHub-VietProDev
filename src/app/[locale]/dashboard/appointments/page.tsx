"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Calendar as CalendarIcon, List as ListIcon, Trash, Clock } from "@phosphor-icons/react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogPortal,
  DialogOverlay,
} from "@/components/ui/dialog";
import { useUserStore } from "@/lib/stores/user-store";
import { useGetApiAppointments, useDeleteApiAppointment } from "@/lib/api/endpoints/appointments";
import type { GetApiAppointmentsStatus } from "@/lib/api/models/getApiAppointmentsStatus";

interface Appointment {
  id: string;
  title: string;
  type: string;
  status: string;
  scheduledAt: string;
  endTime?: string;
  locationText?: string;
  customer?: { id: string; fullName: string; phone?: string };
  property?: { id: string; title: string; propertyCode: string };
  lead?: { id: string; leadCode: string };
  assignedUser?: { id: string; fullName: string };
}

interface AppointmentsResponse {
  success: boolean;
  data: Appointment[];
  meta: { total: number; limit: number; offset: number; page: number; totalPages: number };
  timestamp: string;
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

const statusFilters: { value: GetApiAppointmentsStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "SCHEDULED", label: "Đã lên lịch" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "COMPLETED", label: "Hoàn thành" },
  { value: "CANCELLED", label: "Đã hủy" },
  { value: "NO_SHOW", label: "Không đến" },
];

export default function AppointmentsPage() {
  const router = useRouter();
  const hasPermission = useUserStore((s) => s.hasPermission);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [statusFilter, setStatusFilter] = useState<GetApiAppointmentsStatus | "ALL">("ALL");
  const [mounted, setMounted] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);

  const { data: appointmentsData, isLoading, refetch } = useGetApiAppointments({
    status: statusFilter === "ALL" ? undefined : (statusFilter as GetApiAppointmentsStatus),
    limit: "50",
    offset: "0",
  });
  const appointments = ((appointmentsData as unknown as AppointmentsResponse)?.data) || [];

  const { mutateAsync: deleteAppointment, isPending: isDeleting } = useDeleteApiAppointment();

  useEffect(() => {
    setMounted(true);
  }, []);

  const canWrite = mounted && hasPermission("appointments:write");
  const canDelete = mounted && hasPermission("appointments:delete");

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAppointment({ id: deleteTarget.id });
      toast.success(`Đã xóa lịch hẹn "${deleteTarget.title}"`);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error("Xóa lịch hẹn thất bại");
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Lịch hẹn"
        title="Lịch hẹn"
        description="Quản lý lịch hẹn xem nhà, gặp mặt, ký hợp đồng"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border border-border p-1">
              <button onClick={() => setView("list")} className={`rounded-sm p-1.5 ${view === "list" ? "bg-surface-muted" : "text-foreground-muted"}`} aria-label="Danh sách">
                <ListIcon size={16} />
              </button>
              <button onClick={() => setView("calendar")} className={`rounded-sm p-1.5 ${view === "calendar" ? "bg-surface-muted" : "text-foreground-muted"}`} aria-label="Lịch">
                <CalendarIcon size={16} />
              </button>
            </div>
            {canWrite && (
              <Button onClick={() => router.push("/dashboard/appointments/new")}>
                <Plus size={16} />
                Thêm lịch hẹn
              </Button>
            )}
          </div>
        }
      />

      <div className="flex items-center justify-end gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as GetApiAppointmentsStatus | "ALL")}
          className="h-9 rounded-md border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-ring"
        >
          {statusFilters.map((f) => (
            <option key={f.value} value={f.value}>{f.label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : view === "calendar" ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted/30 p-8 md:min-h-[400px]">
          <div className="flex flex-col items-center gap-2 text-foreground-muted">
            <CalendarIcon size={32} />
            <p className="text-sm">Chế độ lịch sẽ hiển thị tại đây</p>
          </div>
        </div>
      ) : appointments.length > 0 ? (
        <div className="flex flex-col gap-3">
          {appointments.map((apt) => {
            const dt = apt.scheduledAt ? new Date(apt.scheduledAt) : null;
            const statusCfg = statusLabel[apt.status] ?? { label: apt.status, variant: "default" as const };
            return (
              <div
                key={apt.id}
                onClick={() => router.push(`/dashboard/appointments/${apt.id}`)}
                className="flex cursor-pointer flex-col gap-3 rounded-lg border border-border bg-surface p-4 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:flex-row sm:items-center"
              >
                <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-surface-muted">
                  <span className="text-xs font-medium text-foreground-muted">{dt ? dt.getDate() : "--"}</span>
                  <span className="text-[10px] uppercase text-foreground-muted">Th {dt ? dt.getMonth() + 1 : "--"}</span>
                </div>
                <div className="flex flex-1 flex-col gap-1 sm:gap-0.5">
                  <span className="text-sm font-medium line-clamp-1">{apt.title}</span>
                  <span className="text-xs text-foreground-muted line-clamp-1">
                    {apt.customer?.fullName ?? "—"}
                    {apt.property ? ` · ${apt.property.title}` : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 text-xs tabular-nums text-foreground-muted">
                    <Clock size={12} />
                    {dt ? dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : ""}
                  </div>
                  <Badge variant={typeVariant[apt.type] ?? "default"} className="shrink-0">
                    {typeLabel[apt.type] ?? apt.type}
                  </Badge>
                  <Badge variant={statusCfg.variant} className="shrink-0">
                    {statusCfg.label}
                  </Badge>
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Xóa"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(apt);
                      }}
                    >
                      <Trash size={14} />
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarIcon size={24} />}
          title="Chưa có lịch hẹn"
          description="Tạo lịch hẹn đầu tiên để quản lý các buổi xem nhà, gặp mặt"
          action={
            canWrite && (
              <Button onClick={() => router.push("/dashboard/appointments/new")}>
                <Plus size={16} />
                Thêm lịch hẹn
              </Button>
            )
          }
        />
      )}

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Xóa lịch hẹn</DialogTitle>
              <DialogDescription>
                Hành động này sẽ ẩn lịch hẹn (soft delete). Bạn có chắc chắn?
              </DialogDescription>
            </DialogHeader>
            {deleteTarget && (
              <div className="rounded-lg border border-border bg-surface-muted/40 p-4 text-sm">
                <p className="font-medium">{deleteTarget.title}</p>
                {deleteTarget.scheduledAt && (
                  <p className="text-foreground-muted tabular-nums">
                    {new Date(deleteTarget.scheduledAt).toLocaleString("vi-VN")}
                  </p>
                )}
              </div>
            )}
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)}>Hủy</Button>
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
