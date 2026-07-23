"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormField } from "@/components/shared/form-section";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetApiAppointmentId, usePatchApiAppointment } from "@/lib/api/endpoints/appointments";

interface Appointment {
  id: string;
  title: string;
  type: string;
  customerId?: string;
  propertyId?: string;
  scheduledAt: string;
  locationText?: string;
  description?: string;
}

const appointmentSchema = z.object({
  title: z.string().min(5, "Tieu de phai co it nhat 5 ky tu"),
  type: z.enum(["MEETING", "CALL", "SITE_VISIT", "SIGNING"]),
  customerId: z.string().optional(),
  propertyId: z.string().optional(),
  scheduledAt: z.string().min(1, "Vui long chon thoi gian"),
  locationText: z.string().optional(),
  description: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function AppointmentEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: appointmentData, isLoading } = useGetApiAppointmentId(id);
  const appointment = (appointmentData as unknown as { data: Appointment })?.data;

  const { mutate: updateAppointment } = usePatchApiAppointment();

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { type: "SITE_VISIT" },
  });

  useEffect(() => {
    if (appointment) {
      reset({
        title: appointment.title || "",
        type: (appointment.type as AppointmentFormData["type"]) || "SITE_VISIT",
        customerId: appointment.customerId || "",
        propertyId: appointment.propertyId || "",
        scheduledAt: appointment.scheduledAt ? new Date(appointment.scheduledAt).toISOString().slice(0, 16) : "",
        locationText: appointment.locationText || "",
        description: appointment.description || "",
      });
    }
  }, [appointment, reset]);

  const onSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    setError(null);
    try {
      await updateAppointment({ id, data });
      router.push(`/appointments/${id}`);
    } catch (err) {
      setError("Co loi xay ra khi cap nhat lich hen. Vui long thu lai.");
      console.error(err);
    } finally {
      setLoading(false);
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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/appointments")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
          <ArrowLeft size={20} />
        </button>
        <PageHeader eyebrow="Lich hen" title="Chinh sua lich hen" />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormSection title="Thong tin lich hen">
          <FormField label="Tieu de" htmlFor="title" required error={errors.title?.message}>
            <Input id="title" placeholder="Hen xem nha Vinhomes Central Park" {...register("title")} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Loai lich hen" required>
              <Select defaultValue="SITE_VISIT" onValueChange={(v) => setValue("type", v as AppointmentFormData["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEETING">Gap mat</SelectItem>
                  <SelectItem value="CALL">Goi dien</SelectItem>
                  <SelectItem value="SITE_VISIT">Xem nha</SelectItem>
                  <SelectItem value="SIGNING">Ky hop dong</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Khach hang" htmlFor="customerId" error={errors.customerId?.message}>
              <Input id="customerId" placeholder="Chon khach hang" {...register("customerId")} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Thoi gian" htmlFor="scheduledAt" required error={errors.scheduledAt?.message}>
              <Input id="scheduledAt" type="datetime-local" {...register("scheduledAt")} />
            </FormField>
            <FormField label="BDS" htmlFor="propertyId">
              <Input id="propertyId" placeholder="Chon BDS" {...register("propertyId")} />
            </FormField>
          </div>
          <FormField label="Dia diem" htmlFor="locationText">
            <Input id="locationText" placeholder="Dia chi gap mat" {...register("locationText")} />
          </FormField>
          <FormField label="Mo ta" htmlFor="description">
            <Textarea id="description" placeholder="Mo ta ve lich hen..." {...register("description")} />
          </FormField>
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push(`/appointments/${id}`)}>Huy</Button>
          <Button type="submit" disabled={loading}>{loading ? "Dang luu..." : "Cap nhat lich hen"}</Button>
        </div>
      </form>
    </div>);
}
