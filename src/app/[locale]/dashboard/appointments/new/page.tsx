"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { usePostApiAppointment } from "@/lib/api/endpoints/appointments";

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

export default function AppointmentFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: createAppointment } = usePostApiAppointment();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { type: "SITE_VISIT" },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    setError(null);
    try {
      await createAppointment({ data });
      router.push("/dashboard/appointments");
    } catch (err) {
      setError("Co loi xay ra khi tao lich hen. Vui long thu lai.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/dashboard/appointments")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
          <ArrowLeft size={20} />
        </button>
        <PageHeader eyebrow="Lich hen" title="Tao lich hen" />
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
          <Button type="button" variant="secondary" onClick={() => router.push("/dashboard/appointments")}>Huy</Button>
          <Button type="submit" disabled={loading}>{loading ? "Dang luu..." : "Luu lich hen"}</Button>
        </div>
      </form>
    </div>);
}
