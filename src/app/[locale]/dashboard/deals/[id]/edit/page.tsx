"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormSection, FormField } from "@/components/shared/form-section";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetApiDealId, usePatchApiDeal } from "@/lib/api/endpoints/deals-reservations";

interface Deal {
  id: string;
  dealCode: string;
  customerId?: string;
  propertyId: string;
  transactionType: string;
  expectedValue?: string;
  leadId?: string;
  salesUserId?: string;
  currentWorkflowState?: string;
}

const dealSchema = z.object({
  dealCode: z.string().min(1, "Vui long nhap ma giao dich"),
  customerId: z.string().optional(),
  propertyId: z.string().min(1, "Vui long chon BDS"),
  transactionType: z.enum(["SALE", "RENT", "TRANSFER"]),
  expectedValue: z.string().optional(),
  leadId: z.string().optional(),
  salesUserId: z.string().optional(),
});

type DealFormData = z.infer<typeof dealSchema>;

export default function DealEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: dealData, isLoading } = useGetApiDealId(id);
  const deal = (dealData as unknown as { data: Deal })?.data;

  const { mutate: updateDeal } = usePatchApiDeal();

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<DealFormData>({
    resolver: zodResolver(dealSchema),
    defaultValues: { transactionType: "SALE" },
  });

  useEffect(() => {
    if (deal) {
      reset({
        dealCode: deal.dealCode || "",
        customerId: deal.customerId || "",
        propertyId: deal.propertyId || "",
        transactionType: (deal.transactionType as DealFormData["transactionType"]) || "SALE",
        expectedValue: deal.expectedValue || "",
        leadId: deal.leadId || "",
        salesUserId: deal.salesUserId || "",
      });
    }
  }, [deal, reset]);

  const onSubmit = async (data: DealFormData) => {
    setLoading(true);
    setError(null);
    try {
      await updateDeal({ id, data });
      router.push(`/dashboard/deals/${id}`);
    } catch (err) {
      setError("Co loi xay ra khi cap nhat giao dich. Vui long thu lai.");
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
        <button onClick={() => router.push("/dashboard/deals")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
          <ArrowLeft size={20} />
        </button>
        <PageHeader eyebrow="Giao dich" title="Chỉnh sửa giao dich" />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormSection title="Thong tin giao dich">
          <FormField label="Ma giao dich" htmlFor="dealCode" required error={errors.dealCode?.message}>
            <Input id="dealCode" placeholder="DEAL-001" {...register("dealCode")} />
          </FormField>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Khach hang" htmlFor="customerId" error={errors.customerId?.message}>
              <Input id="customerId" placeholder="Chon khach hang" {...register("customerId")} />
            </FormField>
            <FormField label="BDS" htmlFor="propertyId" required error={errors.propertyId?.message}>
              <Input id="propertyId" placeholder="Chon BDS" {...register("propertyId")} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Loai giao dich" required>
              <Select defaultValue="SALE" onValueChange={(v) => v && setValue("transactionType", v as DealFormData["transactionType"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALE" label="Ban">Ban</SelectItem>
                  <SelectItem value="RENT" label="Cho thue">Cho thue</SelectItem>
                  <SelectItem value="TRANSFER" label="Chuyen nhuong">Chuyen nhuong</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Gia tri du kien (VND)" htmlFor="expectedValue">
              <Input id="expectedValue" placeholder="5000000000" {...register("expectedValue")} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Lead" htmlFor="leadId">
              <Input id="leadId" placeholder="ID lead" {...register("leadId")} />
            </FormField>
            <FormField label="Sales phu trach" htmlFor="salesUserId">
              <Input id="salesUserId" placeholder="ID sales" {...register("salesUserId")} />
            </FormField>
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push(`/dashboard/deals/${id}`)}>Huy</Button>
          <Button type="submit" disabled={loading}>{loading ? "Dang luu..." : "Cap nhat giao dich"}</Button>
        </div>
      </form>
    </div>);
}
