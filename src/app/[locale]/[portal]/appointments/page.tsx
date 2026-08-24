"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  List as ListIcon,
  Plus,
  Trash2,
} from "lucide-react";
import { Can } from "@casl/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetApiAppointmentsAdmin } from "@/lib/api/endpoints/appointments";
import type { GetApiAppointmentsStatus } from "@/lib/api/models/getApiAppointmentsStatus";
import {
  DeleteAppointmentDialog,
  type AppointmentDeleteTarget,
} from "./_components/delete-appointment-dialog";

interface Appointment extends AppointmentDeleteTarget {
  type: string;
  status: string;
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
  const [view, setView] = useState<"list" | "calendar">("list");
  const [statusFilter, setStatusFilter] = useState<GetApiAppointmentsStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Appointment | null>(null);

  const { data: appointmentsData, isLoading, refetch } = useGetApiAppointmentsAdmin({
    status: statusFilter === "ALL" ? undefined : (statusFilter as GetApiAppointmentsStatus),
    limit: "50",
    offset: "0",
  });
  const allAppointments = ((appointmentsData as unknown as AppointmentsResponse)?.data) || [];

  const searchStr = search.trim().toLowerCase();
  const appointments = searchStr
    ? allAppointments.filter((a) =>
      a.title?.toLowerCase().includes(searchStr) ||
      a.customer?.fullName?.toLowerCase().includes(searchStr) ||
      a.property?.title?.toLowerCase().includes(searchStr) ||
      a.assignedUser?.fullName?.toLowerCase().includes(searchStr) ||
      a.locationText?.toLowerCase().includes(searchStr)
    )
    : allAppointments;

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
            <Can I="CREATE" a="APPOINTMENT">
              <Button onClick={() => router.push("/dashboard/appointments/new")}>
                <Plus size={16} />
                Thêm lịch hẹn
              </Button>
            </Can>
          </div>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="search"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground outline-none focus:border-ring sm:w-auto sm:min-w-[280px]"
        />
        <div className="flex items-center justify-end gap-2">
          <Select
            value={statusFilter}
            items={Object.fromEntries(statusFilters.map((f) => [f.value, f.label]))}
            onValueChange={(v) => setStatusFilter((v ?? "ALL") as GetApiAppointmentsStatus | "ALL")}
          >
            <SelectTrigger className="h-9 w-[200px]">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((f) => (
                <SelectItem key={f.value} value={f.value} label={f.label}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                  <Can I="DELETE" a="APPOINTMENT">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Xóa"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(apt);
                      }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </Can>
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
            <Can I="CREATE" a="APPOINTMENT">
              <Button onClick={() => router.push("/dashboard/appointments/new")}>
                <Plus size={16} />
                Thêm lịch hẹn
              </Button>
            </Can>
          }
        />
      )}

      {/* Delete confirmation dialog */}
      <DeleteAppointmentDialog
        appointment={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onRefetch={refetch}
      />
    </div>
  );
}
