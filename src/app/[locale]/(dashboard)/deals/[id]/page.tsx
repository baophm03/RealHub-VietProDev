"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "@phosphor-icons/react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetApiDealId } from "@/lib/api/endpoints/deals-reservations";

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
  createdAt?: string;
}

const txLabel: Record<string, string> = {
  SALE: "Ban",
  RENT: "Cho thue",
  TRANSFER: "Chuyen nhuong",
};

const statusVariant: Record<string, "blue" | "yellow" | "purple" | "default" | "green" | "red"> = {
  PENDING: "blue",
  NEGOTIATING: "yellow",
  DEPOSITED: "purple",
  CONTRACT_SIGNED: "default",
  COMPLETED: "green",
  CANCELLED: "red",
};

const statusLabel: Record<string, string> = {
  PENDING: "Cho xu ly",
  NEGOTIATING: "Dam phan",
  DEPOSITED: "Dat coc",
  CONTRACT_SIGNED: "Ky HD",
  COMPLETED: "Hoan thanh",
  CANCELLED: "Huy",
};

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: dealData, isLoading } = useGetApiDealId(id);
  const deal = (dealData as unknown as { data: Deal })?.data;

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

  if (!deal) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/deals")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
            <ArrowLeft size={20} />
          </button>
          <PageHeader eyebrow="Giao dich" title="Khong tim thay" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/deals")} className="rounded-md p-2 text-foreground-muted hover:bg-surface-muted" aria-label="Quay lai">
          <ArrowLeft size={20} />
        </button>
        <PageHeader
          eyebrow="Giao dich"
          title={deal.dealCode}
          actions={
            <Button variant="outline" onClick={() => router.push(`/deals/${id}/edit`)}>
              <Pencil size={16} />
              Chỉnh sửa
            </Button>
          }
        />
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="blue">{txLabel[deal.transactionType] ?? deal.transactionType}</Badge>
            {deal.currentWorkflowState && (
              <Badge variant={statusVariant[deal.currentWorkflowState] ?? "default"}>
                {statusLabel[deal.currentWorkflowState] ?? deal.currentWorkflowState}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Ma giao dich</span>
              <p className="text-sm font-medium">{deal.dealCode}</p>
            </div>
            {deal.expectedValue && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Gia tri du kien</span>
                <p className="text-sm tabular-nums">{deal.expectedValue}</p>
              </div>
            )}
            {deal.customerId && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Khach hang</span>
                <button
                  onClick={() => router.push(`/customers/${deal.customerId}`)}
                  className="block text-sm text-primary hover:underline"
                >
                  {deal.customerId}
                </button>
              </div>
            )}
            {deal.propertyId && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">BDS</span>
                <button
                  onClick={() => router.push(`/properties/${deal.propertyId}`)}
                  className="block text-sm text-primary hover:underline"
                >
                  {deal.propertyId}
                </button>
              </div>
            )}
            {deal.leadId && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Lead</span>
                <button
                  onClick={() => router.push(`/leads/${deal.leadId}`)}
                  className="block text-sm text-primary hover:underline"
                >
                  {deal.leadId}
                </button>
              </div>
            )}
            {deal.salesUserId && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Sales phu trach</span>
                <p className="text-sm">{deal.salesUserId}</p>
              </div>
            )}
            {deal.createdAt && (
              <div>
                <span className="text-xs font-medium uppercase tracking-wide text-foreground-muted">Ngày tạo</span>
                <p className="text-sm tabular-nums">{new Date(deal.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
