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
import { useGetApiDealId, usePatchApiDeal } from "@/lib/api/endpoints/deals-reservations";
import { useGetApiUsers } from "@/lib/api/endpoints/users";
import type { UpdateDealDtoStatus } from "@/lib/api/models/updateDealDtoStatus";

interface Deal {
  id: string;
  dealCode: string;
  status: string;
  expectedValue?: string;
  finalValue?: string;
  salesUserId?: string | null;
  ownerUserId?: string | null;
  currentWorkflowState?: string | null;
}
interface User {
  id: string;
  fullName: string;
  email?: string;
}

const statusOptions = [
  { value: "SOFT_RESERVED", label: "Đặt cọc mềm" },
  { value: "NEGOTIATING", label: "Đàm phán" },
  { value: "SUCCESS", label: "Thành công" },
  { value: "FAILED", label: "Thất bại" },
  { value: "CANCELLED", label: "Hủy" },
  { value: "DISPUTED", label: "Tranh chấp" },
];

// UpdateDealDto allows: status, currentWorkflowState, salesUserId, ownerUserId,
// expectedValue, finalValue, metadata
const dealSchema = z.object({
  status: z.enum(["SOFT_RESERVED", "NEGOTIATING", "SUCCESS", "FAILED", "CANCELLED", "DISPUTED"]),
  salesUserId: z.string().optional(),
  expectedValue: z.string().optional(),
  finalValue: z.string().optional(),
  currentWorkflowState: z.string().optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

export default function DealEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("SOFT_RESERVED");
  const [selectedSalesId, setSelectedSalesId] = useState("");

  const { data: dealData, isLoading } = useGetApiDealId(id);
  const deal = (dealData as unknown as { data: Deal })?.data;

  const { mutateAsync: updateDeal } = usePatchApiDeal();

  const { data: usersData } = useGetApiUsers({ limit: "100", offset: "0" });
  const users = ((usersData as unknown as { data: User[] })?.data) || [];

  const salesItems = useMemo(() => {
    const map: Record<string, string> = { __none__: "— Không chọn —" };
    for (const u of users) {
      map[u.id] = `${u.fullName}${u.email ? ` · ${u.email}` : ""}`;
    }
    return map;
  }, [users]);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: { status: "SOFT_RESERVED" },
  });

  useEffect(() => {
    if (deal) {
      reset({
        status: (deal.status as DealFormData["status"]) || "SOFT_RESERVED",
        salesUserId: deal.salesUserId || "",
        expectedValue: deal.expectedValue || "",
        finalValue: deal.finalValue || "",
        currentWorkflowState: deal.currentWorkflowState || "",
      });
      setSelectedStatus(deal.status || "SOFT_RESERVED");
      setSelectedSalesId(deal.salesUserId || "");
    }
  }, [deal, reset]);

  const onSubmit = async (data: DealFormData) => {
    setLoading(true);
    try {
      await updateDeal({
        id,
        data: {
          status: data.status as UpdateDealDtoStatus,
          salesUserId: data.salesUserId || undefined,
          expectedValue: data.expectedValue || undefined,
          finalValue: data.finalValue || undefined,
          currentWorkflowState: data.currentWorkflowState || undefined,
        },
      });
      toast.success("Đã cập nhật giao dịch");
      router.push(`/dashboard/deals/${id}`);
    } catch (err) {
      toast.error("Có lỗi xảy ra khi cập nhật giao dịch, vui lòng thử lại");
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
          onClick={() => router.push(`/dashboard/deals/${id}`)}
          className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted"
          aria-label="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>
        <PageHeader eyebrow="Giao dịch" title={`Chỉnh sửa giao dịch ${deal?.dealCode ?? ""}`} />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormSection
          title="Thông tin giao dịch"
          description="Có thể cập nhật trạng thái, sales phụ trách, giá trị và workflow state."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Trạng thái" required>
              <Select
                value={selectedStatus}
                items={Object.fromEntries(statusOptions.map((o) => [o.value, o.label]))}
                onValueChange={(v) => {
                  if (v) {
                    setSelectedStatus(v);
                    setValue("status", v as DealFormData["status"]);
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
                  setValue("salesUserId", val || undefined);
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Giá trị dự kiến (VND)" htmlFor="expectedValue">
              <Input id="expectedValue" placeholder="5000000000" {...register("expectedValue")} />
            </FormField>
            <FormField label="Giá trị cuối (VND)" htmlFor="finalValue">
              <Input id="finalValue" placeholder="950000000" {...register("finalValue")} />
            </FormField>
          </div>
          <FormField label="Workflow state" htmlFor="currentWorkflowState">
            <Input
              id="currentWorkflowState"
              placeholder="VD: NEGOTIATION"
              {...register("currentWorkflowState")}
            />
          </FormField>
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push(`/dashboard/deals/${id}`)}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Đang lưu..." : "Cập nhật giao dịch"}
          </Button>
        </div>
      </form>
    </div>
  );
}
