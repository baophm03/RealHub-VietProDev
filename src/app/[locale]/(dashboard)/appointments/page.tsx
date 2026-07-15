"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Calendar as CalendarIcon, List as ListIcon } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/stores/auth-store";

interface Appointment {
  id: string;
  title: string;
  type: string;
  customerName: string;
  propertyName: string;
  date: string;
  time: string;
  status: string;
}

const mockAppointments: Appointment[] = [
  { id: "1", title: "Hen xem nha Vinhomes Central Park", type: "SITE_VISIT", customerName: "Nguyen Van An", propertyName: "Vinhomes Central Park", date: "2025-07-15", time: "09:00", status: "SCHEDULED" },
  { id: "2", title: "Goi dien tu van Masteri", type: "CALL", customerName: "Tran Thi Bich", propertyName: "Masteri Thao Dien", date: "2025-07-15", time: "14:00", status: "SCHEDULED" },
  { id: "3", title: "Gap mat ky hop dong", type: "MEETING", customerName: "Le Minh Chau", propertyName: "Sunwah Pearl", date: "2025-07-16", time: "10:30", status: "SCHEDULED" },
  { id: "4", title: "Ky hop dong The Metropole", type: "SIGNING", customerName: "Pham Quoc Huy", propertyName: "The Metropole", date: "2025-07-14", time: "15:00", status: "COMPLETED" },
];

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
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const [view, setView] = useState<"list" | "calendar">("list");

  return (
          <div className="flex flex-col gap-6">
        <PageHeader
          eyebrow="Lich hen"
          title="Lich hen"
          description="Quan ly lich hen xem nha, gap mat, ky hop dong"
          actions={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-md border border-border p-1">
                <button onClick={() => setView("list")} className={`rounded-sm p-1.5 ${view === "list" ? "bg-surface-muted" : "text-foreground-muted"}`} aria-label="Danh sach">
                  <ListIcon size={16} />
                </button>
                <button onClick={() => setView("calendar")} className={`rounded-sm p-1.5 ${view === "calendar" ? "bg-surface-muted" : "text-foreground-muted"}`} aria-label="Lich">
                  <CalendarIcon size={16} />
                </button>
              </div>
              {hasPermission("appointments:write") && (
                <Button onClick={() => router.push("/appointments/new")}>
                  <Plus size={16} />
                  Them lich hen
                </Button>
              )}
            </div>
          }
        />

        {view === "list" ? (
          <div className="flex flex-col gap-3">
            {mockAppointments.map((apt) => (
              <div
                key={apt.id}
                onClick={() => router.push(`/appointments/${apt.id}`)}
                className="flex cursor-pointer items-center gap-4 rounded-lg border border-border bg-surface p-4 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <div className="flex size-12 flex-col items-center justify-center rounded-lg bg-surface-muted">
                  <span className="text-xs font-medium text-foreground-muted">{apt.date.split("-")[2]}</span>
                  <span className="text-[10px] uppercase text-foreground-muted">Th {apt.date.split("-")[1]}</span>
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="text-sm font-medium">{apt.title}</span>
                  <span className="text-xs text-foreground-muted">{apt.customerName} Â· {apt.propertyName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs tabular-nums text-foreground-muted">{apt.time}</span>
                  <Badge variant={typeVariant[apt.type] ?? "default"}>{typeLabel[apt.type] ?? apt.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-surface-muted/30">
            <div className="flex flex-col items-center gap-2 text-foreground-muted">
              <CalendarIcon size={32} />
              <p className="text-sm">Lich se hien thi tai day</p>
            </div>
          </div>
        )}
      </div>  );
}
