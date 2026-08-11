"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, FormField } from "@/components/shared/form-section";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useGetApiCommissionPlanId, usePatchApiCommissionPlanStatus } from "@/lib/api/endpoints/commission";

interface CommissionPlan {
  id: string;
  name: string;
  description?: string;
  status: string;
  priority?: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export default function CommissionPlanEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("DRAFT");

  const { data: planData, isLoading } = useGetApiCommissionPlanId(id);
  const plan = (planData as unknown as { data: CommissionPlan })?.data;

  const { mutate: updateStatus } = usePatchApiCommissionPlanStatus();

  useEffect(() => {
    if (plan) {
      setStatus(plan.status || "DRAFT");
    }
  }, [plan]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateStatus({ id, data: { status } });
      router.push(`/dashboard/commission/plans/${id}`);
    } catch (err) {
      setError("Co loi xay ra khi cap nhat trang thai. Vui long thu lai.");
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
        <button onClick={() => router.push(`/dashboard/commission/plans/${id}`)} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
          <ArrowLeft size={20} />
        </button>
        <PageHeader eyebrow="Hoa hong" title="Chỉnh sửa ke hoach" />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <FormSection title="Thong tin co ban">
          <FormField label="Ten ke hoach">
            <Input value={plan?.name || ""} disabled />
          </FormField>
          <FormField label="Mo ta">
            <Textarea value={plan?.description || ""} disabled />
          </FormField>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Ngay hieu luc">
              <Input value={plan?.effectiveFrom ? new Date(plan.effectiveFrom).toLocaleDateString("vi-VN") : ""} disabled />
            </FormField>
            <FormField label="Ngay ket thuc">
              <Input value={plan?.effectiveTo ? new Date(plan.effectiveTo).toLocaleDateString("vi-VN") : "-"} disabled />
            </FormField>
          </div>
        </FormSection>

        <FormSection title="Trang thai">
          <FormField label="Trang thai" required>
            <Select defaultValue={status} onValueChange={(v) => v && setStatus(v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT" label="Ban nhap">Ban nhap</SelectItem>
                <SelectItem value="PENDING_APPROVAL" label="Cho duyet">Cho duyet</SelectItem>
                <SelectItem value="ACTIVE" label="Hoat dong">Hoat dong</SelectItem>
                <SelectItem value="ARCHIVED" label="Luu tru">Luu tru</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push(`/dashboard/commission/plans/${id}`)}>Huy</Button>
          <Button type="submit" disabled={loading}>{loading ? "Dang luu..." : "Cap nhat trang thai"}</Button>
        </div>
      </form>
    </div>
  );
}
