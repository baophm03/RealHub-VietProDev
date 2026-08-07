"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetApiLeadId } from "@/lib/api/endpoints/leads";

interface Lead {
  id: string;
  customerId?: string;
  propertyId?: string;
  source: string;
  status: string;
  assignedSalesId?: string;
  phoneNormalized?: string;
  createdAt?: string;
}

const statusVariant: Record<string, "blue" | "yellow" | "purple" | "default" | "green" | "red"> = {
  NEW: "blue",
  CONTACTED: "yellow",
  INTERESTED: "purple",
  NEGOTIATING: "default",
  CONVERTED: "green",
  LOST: "red",
  RECYCLED: "default",
};

const statusLabel: Record<string, string> = {
  NEW: "Moi",
  CONTACTED: "Da lien he",
  INTERESTED: "Quan tam",
  NEGOTIATING: "Dam phan",
  CONVERTED: "Chuyen doi",
  LOST: "Mat",
  RECYCLED: "Tai che",
};

const sourceLabel: Record<string, string> = {
  WEBSITE: "Website",
  PROPERTY_DETAIL: "Trang BDS",
  OWNER_PAGE: "Trang chu",
  SALES_LINK: "Link sales",
  CTV_LINK: "Link CTV",
  AGENCY_MARKETING: "Marketing",
  MANUAL_INPUT: "Nhap tay",
  LEAD_POOL: "Lead pool",
  IMPORT: "Nhap file",
};

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: leadData, isLoading } = useGetApiLeadId(id);
  const lead = (leadData as unknown as { data: Lead })?.data;

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

  if (!lead) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/dashboard/leads")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="CRM" title="Khong tim thay" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/dashboard/leads")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
          <ArrowLeft size={20} />
        </button>
        <PageHeader
          eyebrow="CRM"
          title={`Lead #${lead.id.slice(0, 8)}`}
          actions={
            <Button variant="outline" onClick={() => router.push(`/dashboard/leads/${id}/edit`)}>
              <Pencil size={16} />
              Chỉnh sửa
            </Button>
          }
        />
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={statusVariant[lead.status] ?? "default"}>
              {statusLabel[lead.status] ?? lead.status}
            </Badge>
            <Badge variant="blue">{sourceLabel[lead.source] ?? lead.source}</Badge>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {lead.customerId && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Khach hang</span>
                <button
                  onClick={() => router.push(`/dashboard/customers/${lead.customerId}`)}
                  className="block text-sm text-primary hover:underline"
                >
                  {lead.customerId}
                </button>
              </div>
            )}
            {lead.propertyId && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">BDS</span>
                <button
                  onClick={() => router.push(`/dashboard/properties/${lead.propertyId}`)}
                  className="block text-sm text-primary hover:underline"
                >
                  {lead.propertyId}
                </button>
              </div>
            )}
            {lead.assignedSalesId && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Sales phu trach</span>
                <p className="text-sm">{lead.assignedSalesId}</p>
              </div>
            )}
            {lead.phoneNormalized && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Dien thoai</span>
                <p className="text-sm tabular-nums">{lead.phoneNormalized}</p>
              </div>
            )}
            {lead.createdAt && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Ngày tạo</span>
                <p className="text-sm tabular-nums">{new Date(lead.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
