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

const appointmentSchema = z.object({
  title: z.string().min(5, "Tieu de phai co it nhat 5 ky tu"),
  type: z.enum(["MEETING", "CALL", "SITE_VISIT", "SIGNING"]),
  customerId: z.string().min(1, "Vui long chon khach hang"),
  propertyId: z.string().optional(),
  date: z.string().min(1, "Vui long chon ngay"),
  time: z.string().min(1, "Vui long chon gio"),
  location: z.string().optional(),
  note: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function AppointmentFormPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { type: "SITE_VISIT" },
  });

  const onSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    try {
      console.log(data);
      router.push("/appointments");
    } finally {
      setLoading(false);
    }
  };

  return (
          <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/appointments")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="Lich hen" title="Tao lich hen" />
        </div>

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
              <FormField label="Khach hang" htmlFor="customerId" required error={errors.customerId?.message}>
                <Input id="customerId" placeholder="Chon khach hang" {...register("customerId")} />
              </FormField>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Ngay" htmlFor="date" required error={errors.date?.message}>
                <Input id="date" type="date" {...register("date")} />
              </FormField>
              <FormField label="Gio" htmlFor="time" required error={errors.time?.message}>
                <Input id="time" type="time" {...register("time")} />
              </FormField>
            </div>
            <FormField label="Dia diem" htmlFor="location">
              <Input id="location" placeholder="Dia chi gap mat" {...register("location")} />
            </FormField>
            <FormField label="Ghi chu" htmlFor="note">
              <Textarea id="note" placeholder="Ghi chu ve lich hen..." {...register("note")} />
            </FormField>
          </FormSection>

          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => router.push("/appointments")}>Huy</Button>
            <Button type="submit" disabled={loading}>{loading ? "Dang luu..." : "Luu lich hen"}</Button>
          </div>
        </form>
      </div>  );
}
