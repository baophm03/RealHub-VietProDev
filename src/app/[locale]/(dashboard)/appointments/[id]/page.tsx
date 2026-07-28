"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetApiAppointmentId } from "@/lib/api/endpoints/appointments";

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

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: appointmentData, isLoading } = useGetApiAppointmentId(id);
  const appointment = (appointmentData as unknown as { data: Appointment })?.data;

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
          <button onClick={() => router.push("/appointments")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="Lich hen" title="Khong tim thay" />
        </div>
      </div>
    );
  }

  const dt = appointment.scheduledAt ? new Date(appointment.scheduledAt) : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/appointments")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
          <ArrowLeft size={20} />
        </button>
        <PageHeader
          eyebrow="Lich hen"
          title={appointment.title}
          actions={
            <Button variant="outline" onClick={() => router.push(`/appointments/${id}/edit`)}>
              <Pencil size={16} />
              Chỉnh sửa
            </Button>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant={typeVariant[appointment.type] ?? "default"}>
                {typeLabel[appointment.type] ?? appointment.type}
              </Badge>
              <Badge variant="default">{appointment.status}</Badge>
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Thoi gian</span>
                <p className="text-sm">
                  {dt ? dt.toLocaleString("vi-VN") : "-"}
                  {appointment.endTime ? ` - ${new Date(appointment.endTime).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}` : ""}
                </p>
              </div>
              {appointment.locationText && (
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Dia diem</span>
                  <p className="text-sm">{appointment.locationText}</p>
                </div>
              )}
              {appointment.description && (
                <div>
                  <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Mo ta</span>
                  <p className="text-sm whitespace-pre-wrap">{appointment.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold mb-4">Thong tin lien quan</h3>
            <div className="flex flex-col gap-3 text-sm">
              {appointment.customerId && (
                <div>
                  <span className="text-xs text-foreground-muted">Khach hang</span>
                  <button
                    onClick={() => router.push(`/customers/${appointment.customerId}`)}
                    className="block text-primary hover:underline"
                  >
                    {appointment.customerId}
                  </button>
                </div>
              )}
              {appointment.leadId && (
                <div>
                  <span className="text-xs text-foreground-muted">Lead</span>
                  <button
                    onClick={() => router.push(`/leads/${appointment.leadId}`)}
                    className="block text-primary hover:underline"
                  >
                    {appointment.leadId}
                  </button>
                </div>
              )}
              {appointment.propertyId && (
                <div>
                  <span className="text-xs text-foreground-muted">BDS</span>
                  <button
                    onClick={() => router.push(`/properties/properties/${appointment.propertyId}`)}
                    className="block text-primary hover:underline"
                  >
                    {appointment.propertyId}
                  </button>
                </div>
              )}
              {appointment.assignedUserId && (
                <div>
                  <span className="text-xs text-foreground-muted">Nguoi phu trach</span>
                  <p className="text-sm">{appointment.assignedUserId}</p>
                </div>
              )}
              {appointment.reminderMinutes != null && (
                <div>
                  <span className="text-xs text-foreground-muted">Nhac nho truoc</span>
                  <p className="text-sm">{appointment.reminderMinutes} phut</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
