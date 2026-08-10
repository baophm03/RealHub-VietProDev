"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Calendar as CalendarIcon, List as ListIcon } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/lib/stores/user-store";
import { useGetApiAppointments } from "@/lib/api/endpoints/appointments";

interface Appointment {
  id: string;
  title: string;
  type: string;
  customerName: string;
  propertyName: string;
  scheduledAt: string;
  status: string;
}

const typeLabel: Record<string, string> = {
  MEETING: "Gap mat",
  CALL: "Goi dien",
  SITE_VISIT: "Xem nha",
  SIGNING: "Ky hop dong",
};

const typeVariant: Record<string, "blue" | "green" | "yellow" | "purple"> = {
  MEETING: "blue",
  CALL: "green",
  SITE_VISIT: "yellow",
  SIGNING: "purple",
};

export default function AppointmentsPage() {
  const router = useRouter();
  const hasPermission = useUserStore((s) => s.hasPermission);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [mounted, setMounted] = useState(false);

  const { data: appointmentsData, isLoading } = useGetApiAppointments({
    assignedUserId: "",
    status: undefined,
    leadId: "",
    propertyId: "",
    limit: "20",
    offset: "0",
  });
  const appointments = ((appointmentsData as unknown as { data: Appointment[] })?.data) || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Lịch hẹn"
        title="Lịch hẹn"
        description="Quản lý lịch hẹn xem nhà, gặp mặt, ký hợp đồng"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-md border border-border p-1">
              <button onClick={() => setView("list")} className={`rounded-sm p-1.5 ${view === "list" ? "bg-surface-muted" : "text-foreground-muted"}`} aria-label="Danh sach">
                <ListIcon size={16} />
              </button>
              <button onClick={() => setView("calendar")} className={`rounded-sm p-1.5 ${view === "calendar" ? "bg-surface-muted" : "text-foreground-muted"}`} aria-label="Lich">
                <CalendarIcon size={16} />
              </button>
            </div>
            {mounted && hasPermission("appointments:write") && (
              <Button onClick={() => router.push("/dashboard/appointments/new")}>
                <Plus size={16} />
                Thêm lịch hẹn
              </Button>
            )}
          </div>
        }
      />

      {isLoading ? (
        <div className="h-96 animate-pulse rounded-lg bg-surface-muted" />
      ) : view === "list" ? (
        <div className="flex flex-col gap-3">
          {appointments.map((apt) => {
            const dt = apt.scheduledAt ? new Date(apt.scheduledAt) : null;
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
                  <span className="text-xs text-foreground-muted line-clamp-1">{apt.customerName} - {apt.propertyName}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xs tabular-nums text-foreground-muted">{dt ? dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) : ""}</span>
                  <Badge variant={typeVariant[apt.type] ?? "default"} className="shrink-0">{typeLabel[apt.type] ?? apt.type}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex min-h-[300px] items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted/30 p-8 md:min-h-[400px]">
          <div className="flex flex-col items-center gap-2 text-foreground-muted">
            <CalendarIcon size={32} />
            <p className="text-sm">Lịch sẽ hiển thị tại đây</p>
          </div>
        </div>
      )}
    </div>
  );
}
