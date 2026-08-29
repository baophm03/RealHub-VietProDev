"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { usePortalPath } from "@/lib/hooks/use-portal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormField } from "@/components/shared/form-section";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetApiAppointmentId, usePatchApiAppointment } from "@/lib/api/endpoints/appointments";
import { useGetApiCustomers } from "@/lib/api/endpoints/customers";
import { useGetApiPropertiesAdmin } from "@/lib/api/endpoints/properties";

interface Appointment {
  id: string;
  title: string;
  type: string;
  scheduledAt: string;
  endTime?: string;
  locationText?: string;
  description?: string;
  customer?: { id: string; fullName: string; phone?: string; email?: string } | null;
  property?: { id: string; title: string; propertyCode: string; price?: string } | null;
}

interface Customer {
  id: string;
  fullName: string;
  phone?: string;
}

interface Property {
  id: string;
  title: string;
  propertyCode: string;
}

const typeLabel: Record<string, string> = {
  MEETING: "Gặp mặt",
  CALL: "Gọi điện",
  SITE_VISIT: "Xem nhà",
  SIGNING: "Ký hợp đồng",
};

const appointmentSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự"),
  type: z.enum(["MEETING", "CALL", "SITE_VISIT", "SIGNING"]),
  customerId: z.string().optional(),
  propertyId: z.string().optional(),
  scheduledAt: z.string().min(1, "Vui lòng chọn thời gian"),
  endTime: z.string().optional(),
  locationText: z.string().optional(),
  description: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

function toLocalDatetimeInput(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function AppointmentEditPage() {
  const params = useParams();
  const router = useRouter();
  const portalPath = usePortalPath();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("SITE_VISIT");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedPropertyId, setSelectedPropertyId] = useState("");

  const { data: appointmentData, isLoading } = useGetApiAppointmentId(id);
  const appointment = (appointmentData as unknown as { data: Appointment })?.data;

  const { mutateAsync: updateAppointment } = usePatchApiAppointment();

  // Fetch customers for dropdown
  const { data: customersData } = useGetApiCustomers({
    limit: "100",
    offset: "0",
  });
  const customers = ((customersData as unknown as { data: Customer[] })?.data) || [];

  // Fetch properties for dropdown
  const { data: propertiesData } = useGetApiPropertiesAdmin({
    limit: "100",
    offset: "0",
  });
  const properties = ((propertiesData as unknown as { data: Property[] })?.data) || [];

  // Build items maps so <Select.Value> renders labels instead of raw ids
  const customerItems = useMemo(() => {
    const map: Record<string, string> = { __none__: "— Không chọn —" };
    for (const c of customers) {
      map[c.id] = `${c.fullName}${c.phone ? ` · ${c.phone}` : ""}`;
    }
    return map;
  }, [customers]);

  const propertyItems = useMemo(() => {
    const map: Record<string, string> = { __none__: "— Không chọn —" };
    for (const p of properties) {
      map[p.id] = `${p.title} (#${p.propertyCode})`;
    }
    return map;
  }, [properties]);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { type: "SITE_VISIT" },
  });

  useEffect(() => {
    if (appointment) {
      reset({
        title: appointment.title || "",
        type: (appointment.type as AppointmentFormData["type"]) || "SITE_VISIT",
        customerId: appointment.customer?.id || "",
        propertyId: appointment.property?.id || "",
        scheduledAt: toLocalDatetimeInput(appointment.scheduledAt),
        endTime: toLocalDatetimeInput(appointment.endTime),
        locationText: appointment.locationText || "",
        description: appointment.description || "",
      });
      setSelectedType(appointment.type || "SITE_VISIT");
      setSelectedCustomerId(appointment.customer?.id || "");
      setSelectedPropertyId(appointment.property?.id || "");
    }
  }, [appointment, reset]);

  const onSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    try {
      await updateAppointment({
        id,
        data: {
          title: data.title,
          type: data.type,
          customerId: data.customerId || undefined,
          propertyId: data.propertyId || undefined,
          scheduledAt: data.scheduledAt,
          endTime: data.endTime || undefined,
          locationText: data.locationText || undefined,
          description: data.description || undefined,
        },
      });
      toast.success("Đã cập nhật lịch hẹn");
      router.refresh();
      router.push(portalPath(`/appointments/${id}`));
    } catch (err) {
      toast.error((err as any)?.response?.data?.error?.message?.[0] || "Có lỗi xảy ra khi cập nhật, vui lòng thử lại");
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
        <button onClick={() => router.push(portalPath(`/appointments/${id}`))} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lại">
          <ArrowLeft size={20} />
        </button>
        <PageHeader eyebrow="Lịch hẹn" title="Chỉnh sửa lịch hẹn" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormSection title="Thông tin lịch hẹn">
          <FormField label="Tiêu đề" htmlFor="title" required error={errors.title?.message}>
            <Input id="title" placeholder="Hẹn xem nhà Vinhomes Central Park" {...register("title")} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Loại lịch hẹn" required>
              <Select
                value={selectedType}
                items={typeLabel}
                onValueChange={(v) => {
                  if (v) {
                    setSelectedType(v);
                    setValue("type", v as AppointmentFormData["type"]);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn loại lịch hẹn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEETING" label="Gặp mặt">Gặp mặt</SelectItem>
                  <SelectItem value="CALL" label="Gọi điện">Gọi điện</SelectItem>
                  <SelectItem value="SITE_VISIT" label="Xem nhà">Xem nhà</SelectItem>
                  <SelectItem value="SIGNING" label="Ký hợp đồng">Ký hợp đồng</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Khách hàng">
              <Select
                value={selectedCustomerId || "__none__"}
                items={customerItems}
                onValueChange={(v) => {
                  const val = (v ?? "") === "__none__" ? "" : (v ?? "");
                  setSelectedCustomerId(val);
                  setValue("customerId", val || undefined);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn khách hàng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" label="— Không chọn —">— Không chọn —</SelectItem>
                  {customers.map((c) => {
                    const label = `${c.fullName}${c.phone ? ` · ${c.phone}` : ""}`;
                    return (
                      <SelectItem key={c.id} value={c.id} label={label}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Thời gian" htmlFor="scheduledAt" required error={errors.scheduledAt?.message}>
              <Input id="scheduledAt" type="datetime-local" {...register("scheduledAt")} />
            </FormField>
            <FormField label="Thời gian kết thúc" htmlFor="endTime">
              <Input id="endTime" type="datetime-local" {...register("endTime")} />
            </FormField>
          </div>
          <FormField label="Bất động sản">
            <Select
              value={selectedPropertyId || "__none__"}
              items={propertyItems}
              onValueChange={(v) => {
                const val = (v ?? "") === "__none__" ? "" : (v ?? "");
                setSelectedPropertyId(val);
                setValue("propertyId", val || undefined);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn bất động sản" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__" label="— Không chọn —">— Không chọn —</SelectItem>
                {properties.map((p) => {
                  const label = `${p.title} (#${p.propertyCode})`;
                  return (
                    <SelectItem key={p.id} value={p.id} label={label}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Địa điểm" htmlFor="locationText">
            <Input id="locationText" placeholder="Địa chỉ gặp mặt" {...register("locationText")} />
          </FormField>
          <FormField label="Mô tả" htmlFor="description">
            <Textarea id="description" placeholder="Mô tả về lịch hẹn..." {...register("description")} />
          </FormField>
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push(portalPath(`/appointments/${id}`))}>Hủy</Button>
          <Button type="submit" disabled={loading}>{loading ? "Đang lưu..." : "Cập nhật lịch hẹn"}</Button>
        </div>
      </form>
    </div>
  );
}
