"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSection, FormField } from "@/components/shared/form-section";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetApiLeadId, usePatchApiLead } from "@/lib/api/endpoints/leads";
import { useGetApiUsers } from "@/lib/api/endpoints/users";
import type { UpdateLeadDtoStatus } from "@/lib/api/models/updateLeadDtoStatus";

interface Lead {
  id: string;
  leadCode: string;
  status: string;
  assignedSalesId: string | null;
  phoneNormalized: string | null;
  assignedSales?: { id: string; fullName: string; email?: string } | null;
}
interface User {
  id: string;
  fullName: string;
  email?: string;
}

const statusOptions = [
  { value: "NEW", label: "Mới" },
  { value: "CONTACTED", label: "Đã liên hệ" },
  { value: "INTERESTED", label: "Quan tâm" },
  { value: "NEGOTIATING", label: "Đàm phán" },
  { value: "CONVERTED", label: "Chuyển đổi" },
  { value: "LOST", label: "Mất" },
  { value: "RECYCLED", label: "Tái chế" },
];

// UpdateLeadDto only allows: status, assignedSalesId, assignedTeamId,
// phoneNormalized, protectionUntil, duplicateStatus, metadata
const leadSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "INTERESTED", "NEGOTIATING", "CONVERTED", "LOST", "RECYCLED"]),
  assignedSalesId: z.string().optional(),
  phoneNormalized: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export default function LeadEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("NEW");
  const [selectedSalesId, setSelectedSalesId] = useState("");

  const { data: leadData, isLoading } = useGetApiLeadId(id);
  const lead = (leadData as unknown as { data: Lead })?.data;

  const { mutateAsync: updateLead } = usePatchApiLead();

  const { data: usersData } = useGetApiUsers({ limit: "100", offset: "0" });
  const users = ((usersData as unknown as { data: User[] })?.data) || [];

  const salesItems = useMemo(() => {
    const map: Record<string, string> = { __none__: "— Không chọn —" };
    for (const u of users) {
      map[u.id] = `${u.fullName}${u.email ? ` · ${u.email}` : ""}`;
    }
    return map;
  }, [users]);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { status: "NEW" },
  });

  useEffect(() => {
    if (lead) {
      reset({
        status: (lead.status as LeadFormData["status"]) || "NEW",
        assignedSalesId: lead.assignedSalesId || "",
        phoneNormalized: lead.phoneNormalized || "",
      });
      setSelectedStatus(lead.status || "NEW");
      setSelectedSalesId(lead.assignedSalesId || "");
    }
  }, [lead, reset]);

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true);
    try {
      await updateLead({
        id,
        data: {
          status: data.status as UpdateLeadDtoStatus,
          assignedSalesId: data.assignedSalesId || undefined,
          phoneNormalized: data.phoneNormalized || undefined,
        },
      });
      toast.success("Đã cập nhật khách hàng tiềm năng");
      router.push(`/dashboard/leads/${id}`);
    } catch (err) {
      toast.error("Có lỗi xảy ra khi cập nhật khách hàng tiềm năng, vui lòng thử lại");
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
        <button
          onClick={() => router.push(`/dashboard/leads/${id}`)}
          className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted"
          aria-label="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader eyebrow="CRM" title={`Chỉnh sửa khách hàng tiềm năng ${lead?.leadCode ?? ""}`} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormSection
          title="Thông tin khách hàng tiềm năng"
          description="Chỉ có thể cập nhật trạng thái, sales phụ trách và số điện thoại."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Trạng thái" required>
              <Select
                value={selectedStatus}
                items={Object.fromEntries(statusOptions.map((o) => [o.value, o.label]))}
                onValueChange={(v) => {
                  if (v) {
                    setSelectedStatus(v);
                    setValue("status", v as LeadFormData["status"]);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} label={o.label}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Sales phụ trách">
              <Select
                value={selectedSalesId || "__none__"}
                items={salesItems}
                onValueChange={(v) => {
                  const val = (v ?? "") === "__none__" ? "" : (v ?? "");
                  setSelectedSalesId(val);
                  setValue("assignedSalesId", val || undefined);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn sales" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__" label="— Không chọn —">— Không chọn —</SelectItem>
                  {users.map((u) => {
                    const label = `${u.fullName}${u.email ? ` · ${u.email}` : ""}`;
                    return (
                      <SelectItem key={u.id} value={u.id} label={label}>
                        {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <FormField label="Số điện thoại" htmlFor="phoneNormalized" error={errors.phoneNormalized?.message}>
            <Input
              id="phoneNormalized"
              placeholder="0901234567"
              {...register("phoneNormalized")}
            />
          </FormField>
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push(`/dashboard/leads/${id}`)}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Cập nhật khách hàng tiềm năng"}
          </Button>
        </div>
      </form>
    </div>
  );
}
