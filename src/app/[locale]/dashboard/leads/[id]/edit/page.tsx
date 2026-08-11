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
import { useGetApiLeadId, usePatchApiLead } from "@/lib/api/endpoints/leads";

interface Lead {
  id: string;
  customerId?: string;
  propertyId?: string;
  source: string;
  status: string;
  assignedSalesId?: string;
}

const leadSchema = z.object({
  customerId: z.string().optional(),
  propertyId: z.string().optional(),
  source: z.enum(["WEBSITE", "PROPERTY_DETAIL", "OWNER_PAGE", "SALES_LINK", "CTV_LINK", "AGENCY_MARKETING", "MANUAL_INPUT", "LEAD_POOL", "IMPORT"]),
  status: z.enum(["NEW", "CONTACTED", "INTERESTED", "NEGOTIATING", "CONVERTED", "LOST", "RECYCLED"]),
  assignedSalesId: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export default function LeadEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: leadData, isLoading } = useGetApiLeadId(id);
  const lead = (leadData as unknown as { data: Lead })?.data;

  const { mutate: updateLead } = usePatchApiLead();

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { source: "MANUAL_INPUT", status: "NEW" },
  });

  useEffect(() => {
    if (lead) {
      reset({
        customerId: lead.customerId || "",
        propertyId: lead.propertyId || "",
        source: (lead.source as LeadFormData["source"]) || "MANUAL_INPUT",
        status: (lead.status as LeadFormData["status"]) || "NEW",
        assignedSalesId: lead.assignedSalesId || "",
      });
    }
  }, [lead, reset]);

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true);
    setError(null);
    try {
      await updateLead({ id, data });
      router.push(`/dashboard/leads/${id}`);
    } catch (err) {
      setError("Co loi xay ra khi cap nhat lead. Vui long thu lai.");
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
        <button onClick={() => router.push("/dashboard/leads")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
          <ArrowLeft size={20} />
        </button>
        <PageHeader eyebrow="CRM" title="Chỉnh sửa lead" />
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormSection title="Thong tin lead">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Khach hang" htmlFor="customerId" error={errors.customerId?.message}>
              <Input id="customerId" placeholder="Chon khach hang" {...register("customerId")} />
            </FormField>
            <FormField label="BÄS quan tam">
              <Input placeholder="Chon BÄS (tuong tac)" {...register("propertyId")} />
            </FormField>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Nguon lead" required>
              <Select defaultValue="MANUAL_INPUT" onValueChange={(v) => setValue("source", v as LeadFormData["source"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEBSITE" label="Website">Website</SelectItem>
                  <SelectItem value="PROPERTY_DETAIL" label="Trang BÄS">Trang BÄS</SelectItem>
                  <SelectItem value="OWNER_PAGE" label="Trang chu">Trang chu</SelectItem>
                  <SelectItem value="SALES_LINK" label="Link sales">Link sales</SelectItem>
                  <SelectItem value="CTV_LINK" label="Link CTV">Link CTV</SelectItem>
                  <SelectItem value="AGENCY_MARKETING" label="Marketing">Marketing</SelectItem>
                  <SelectItem value="MANUAL_INPUT" label="Nhap tay">Nhap tay</SelectItem>
                  <SelectItem value="LEAD_POOL" label="Lead pool">Lead pool</SelectItem>
                  <SelectItem value="IMPORT" label="Nhap file">Nhap file</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
            <FormField label="Trang thai">
              <Select defaultValue="NEW" onValueChange={(v) => setValue("status", v as LeadFormData["status"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW" label="Moi">Moi</SelectItem>
                  <SelectItem value="CONTACTED" label="Da lien he">Da lien he</SelectItem>
                  <SelectItem value="INTERESTED" label="Quan tam">Quan tam</SelectItem>
                  <SelectItem value="NEGOTIATING" label="Dam phan">Dam phan</SelectItem>
                  <SelectItem value="CONVERTED" label="Chuyen doi">Chuyen doi</SelectItem>
                  <SelectItem value="LOST" label="Mat">Mat</SelectItem>
                  <SelectItem value="RECYCLED" label="Tai che">Tai che</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          </div>
          <FormField label="Sales phu trach" htmlFor="assignedSalesId">
            <Input id="assignedSalesId" placeholder="ID sales phu trach" {...register("assignedSalesId")} />
          </FormField>
        </FormSection>

        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => router.push(`/dashboard/leads/${id}`)}>Huy</Button>
          <Button type="submit" disabled={loading}>{loading ? "Dang luu..." : "Cap nhat lead"}</Button>
        </div>
      </form>
    </div>);
}
